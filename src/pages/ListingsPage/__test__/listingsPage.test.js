import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockWrapSBQuery } from "util/test_utils";
import ListingsPage from "../listingsPage";

// Mock the alert function as it doesn't exist in the jsdom during testing
window.alert = jest.fn().mockImplementation(console.log);

// Mock Database (change if required)
const mockDb = {
  // Profiles table
  profiles: [
    {
      id: "be728d66-09ca-4d07-8833-386f744972ed",
      avatar_url:
        "https://w7.pngwing.com/pngs/522/908/png-transparent-black-and-white-derp-meme-rage-comic-internet-meme-comics-trollface-raging-white-face-monochrome.png",
    },
  ],
  // Listings table
  listings: [
    {
      creator_id: "be728d66-09ca-4d07-8833-386f744972ed",
      description: "this is a test tutee listing from SupaBase!",
      listing_id: "9ddbce5a-2f3f-4240-b55a-85f2e8f28661",
      seeking_for: "tutee",
    },
    {
      description: "this is a test tutor listing from SupaBase!",
      listing_id: "790f7706-4351-4cdf-bac6-c9324b555d4b",
      seeking_for: "tutor",
      title: "test-tutor-listing",
    },
  ],
};

jest.mock("config/supabase-client", () => ({
  __esModule: true,
  supabase: {
    from: jest.fn((tbl) => Promise.resolve(mockWrapSBQuery(mockDb[tbl]))),
  },
}));

const setup = () => {
  return render(
    <MemoryRouter>
      <ListingsPage />
    </MemoryRouter>
  );
};

describe("Tutor/Tutee toggle", () => {
  const getToggle = () => screen.getByTestId("tutorTuteeToggle");

  it("has a default value of 'tutor'", () => {
    setup();
    expect(getToggle().textContent).toBe("tutor");
  });

  it("toggles between tutor/tutee on a single click", () => {
    setup();
    fireEvent.click(getToggle());
    expect(getToggle().textContent).toBe("tutee");
  });
});

describe("Listings", () => {
  const mockSupabase = jest.requireMock("config/supabase-client.js");

  it("should display ListingCards correctly", async () => {
    setup();
    // TBC
  });
});
