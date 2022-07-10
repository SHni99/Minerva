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
});
