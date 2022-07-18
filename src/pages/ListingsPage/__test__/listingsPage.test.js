import "@testing-library/jest-dom/extend-expect";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { supabaseClient } from "config/supabase-client";
import AuthContext from "util/AuthContext";
import ListingsPage from "../listingsPage";
import mockListings, { CONSTANTS } from "./mockDb";

// Mock the alert function as jsdom does not implement this
global.alert = jest.fn();

const wrapPage = (authData = { logged_in: false }) => {
  const history = createMemoryHistory();
  // Mock the subscribe method to prevent memory leakage during testing
  supabaseClient.from = jest.fn(() => ({
    on: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
    })),
  }));
  supabaseClient.removeSubscription = jest.fn();

  const { unmount } = render(
    <AuthContext.Provider value={{ authData }}>
      <Router location={history.location} navigator={history}>
        <ListingsPage />
      </Router>
    </AuthContext.Provider>
  );

  return { history, unmount };
};

const mockRpc = () => {
  supabaseClient.rpc = jest.fn(() => ({
    data: mockListings,
    order: jest.fn(function (col, { ascending }) {
      const res = { ...this };
      res.data = this.data.sort(
        (row1, row2) => (row1[col] - row2[col]) * (ascending ? 1 : -1)
      );
      return res;
    }),
    eq: jest.fn(function (col, val) {
      const res = { ...this };
      res.data = this.data.filter((row) => row[col] === val);
      return res;
    }),
  }));
};

const getReactSelect = (ariaLabel) => screen.getByLabelText(ariaLabel);

beforeEach(jest.clearAllMocks);

describe("Tutor/Tutee toggle", () => {
  const getToggle = () => screen.getByTestId("tutorTuteeToggle");

  it("should be present in the document", () => {
    wrapPage();
    expect(getToggle()).toBeInTheDocument();
  });

  it("defaults to tutor if no preference has been cached", () => {
    wrapPage();
    expect(getToggle()).toHaveTextContent("tutor");
  });

  it("displays tutor/tutee based on cached user preferences", () => {
    Storage.prototype.getItem = jest.fn().mockReturnValue("tutee");
    wrapPage();
    expect(Storage.prototype.getItem).toHaveBeenCalled();
    expect(getToggle()).toHaveTextContent("tutee");
  });

  it("toggles correctly on click", () => {
    wrapPage();
    expect(getToggle()).toHaveTextContent("tutor");
    fireEvent.click(getToggle());
    expect(getToggle()).toHaveTextContent("tutee");
  });

  it("updates cached preferences on toggle", async () => {
    Storage.prototype.setItem = jest.fn();
    const { unmount } = wrapPage();
    expect(getToggle()).toHaveTextContent("tutor");
    fireEvent.click(getToggle());

    // Wait for debounce to fire off
    await waitFor(() => {
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        "lookingFor",
        "tutee"
      );
    });

    unmount();
  });

  it("uses a debounce function when updating user preferences", async () => {
    Storage.prototype.setItem = jest.fn();
    const { unmount } = wrapPage();
    expect(getToggle()).toHaveTextContent("tutor");

    // Spam 50 clicks on the toggle button
    Array(50)
      .fill(null)
      .forEach(() => fireEvent.click(getToggle()));
    expect(Storage.prototype.setItem).toHaveBeenCalledTimes(0);

    // Wait for debounce to fire off
    await waitFor(() => {
      expect(Storage.prototype.setItem).toHaveBeenCalled();
    });

    expect(Storage.prototype.setItem).toHaveBeenCalledTimes(1);
    expect(Storage.prototype.setItem).toHaveBeenCalledWith(
      "lookingFor",
      "tutee"
    );

    unmount();
  });
});

describe("Search Bar", () => {
  const getInput = () => screen.getByRole("textbox");
  const getButton = () => screen.getByText(/search/i);
  const queryCards = () => screen.queryAllByRole("figure");
  const getToggle = () => screen.getByTestId("tutorTuteeToggle");
  const setupListings = async () => {
    mockRpc();
    wrapPage();
    // Ensure we are looking for tutors
    expect(getToggle()).toHaveTextContent("tutor");

    await waitFor(() => {
      expect(queryCards()).toHaveLength(CONSTANTS.NUM_TUTORS);
    });
  };

  it("filters listings correctly", async () => {
    await setupListings();
    fireEvent.change(getInput(), { target: { value: "math" } });
    fireEvent.click(getButton());

    await waitFor(() => {
      expect(queryCards()).toHaveLength(CONSTANTS.NUM_TUTORS_MATH);
    });
  });

  it("activates on 'enter' keypress", async () => {
    await setupListings();
    fireEvent.change(getInput(), { target: { value: "math" } });
    fireEvent.keyDown(getInput(), { key: "Enter", code: "Enter", keyCode: 13 });

    await waitFor(() => {
      expect(queryCards()).toHaveLength(CONSTANTS.NUM_TUTORS_MATH);
    });
  });

  it("clears search immediately when the X button is clicked", async () => {
    await setupListings();
    fireEvent.change(getInput(), { target: { value: "math" } });
    fireEvent.keyDown(getInput(), { key: "Enter", code: "Enter", keyCode: 13 });

    await waitFor(() => {
      expect(queryCards()).toHaveLength(CONSTANTS.NUM_TUTORS_MATH);
    });

    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    await waitFor(() => {
      expect(queryCards()).toHaveLength(CONSTANTS.NUM_TUTORS);
    });
  });
});

describe("Sort menu", () => {
  it("renders with no issues", () => {
    wrapPage();
    expect(getReactSelect("sort-menu")).toBeInTheDocument();
  });

  it("defaults to sorting from newest to oldest listings", () => {
    wrapPage();
    Storage.prototype.getItem = jest.fn();
    expect(screen.getByText("Newest to Oldest")).toBeInTheDocument();
  });

  it("saves latest selected sort preference", () => {
    wrapPage();
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
    fireEvent.keyDown(getReactSelect("sort-menu"), { key: "ArrowDown" });

    expect(Storage.prototype.setItem).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Oldest to Newest"));
    expect(Storage.prototype.setItem).toHaveBeenCalledTimes(1);
    expect(Storage.prototype.setItem).toHaveBeenCalledWith(
      "sortBy",
      "created_at asc"
    );
  });
});

describe("Filters", () => {
  const queryCards = () => screen.queryAllByRole("figure");
  const getToggle = () => screen.getByTestId("tutorTuteeToggle");
  const changeOption = (filterType, optionLabel) => {
    fireEvent.keyDown(getReactSelect(`${filterType}-filter`), {
      key: "ArrowDown",
    });
    fireEvent.click(
      within(getReactSelect(`${filterType}-menulist`)).getByText(optionLabel)
    );
  };

  describe("Level Filter", () => {
    it("renders successfully", () => {
      wrapPage();
      expect(getReactSelect("level-filter")).toBeInTheDocument();
    });
    it("filters secondary school listings correctly", async () => {
      mockRpc();
      wrapPage();
      expect(getToggle()).toHaveTextContent("tutor");
      await waitFor(() =>
        expect(queryCards()).toHaveLength(CONSTANTS.NUM_TUTORS)
      );

      changeOption("level", "Secondary");
      expect(queryCards()).toHaveLength(1);
    });
  });
});
