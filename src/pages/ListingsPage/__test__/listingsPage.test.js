import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { supabaseClient } from "config/supabase-client";
import AuthContext from "util/AuthContext";
import ListingsPage from "../listingsPage";

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
