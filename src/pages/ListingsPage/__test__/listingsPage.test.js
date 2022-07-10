import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import AuthContext from "util/AuthContext";
import ListingsPage from "../listingsPage";

const wrapPage = (authData = { logged_in: false }) => {
  const history = createMemoryHistory();

  render(
    <AuthContext.Provider value={{ authData }}>
      <Router location={history.location} navigator={history}>
        <ListingsPage />
      </Router>
    </AuthContext.Provider>
  );

  return history;
};

describe("Tutor/Tutee toggle", () => {
  const getToggle = () => screen.getByTestId("tutorTuteeToggle");

  it("should be present in the document", () => {
    wrapPage();
    expect(getToggle()).toBeInTheDocument();
  });

  // Planned: displays tutor/tutee based on user preferences (AuthContext)

  // Planned: toggles correctly

  // Planned: toggling causes update in Supabase profiles table, preferences column (mock Supabase)

  // Planned: updating of Supabase profile preferences uses a debounce effect (timing around 0.25s)
});
