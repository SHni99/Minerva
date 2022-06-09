import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import NavBar from "../navBar";

const wrapNavBar = () => {
  const history = createMemoryHistory();

  render(
    <Router location={history.location} navigator={history}>
      <NavBar />
    </Router>
  );

  return history;
};

describe("Minerva Logo", () => {
  it("redirects to landing page on click", () => {
    const history = wrapNavBar();
    fireEvent.click(screen.getByRole("link", { name: /minerva logo/i }));
    expect(history.location.pathname).toBe("/");
  });
});

describe("NavBar Links", () => {
  test("Home button redirects to the Home/Landing page ('/')", () => {
    const history = wrapNavBar();
    fireEvent.click(screen.getByTestId("navBar-home"));
    expect(history.location.pathname).toBe("/");
  });

  test("Listings button redirects to the Listings Page", () => {
    const history = wrapNavBar();
    fireEvent.click(screen.getByRole("link", { name: /listings/i }));
    expect(history.location.pathname).toBe("/listingspage");
  });

  test("About button redirects to the About Us Page", () => {
    const history = wrapNavBar();
    fireEvent.click(screen.getByTestId("navBar-about"));
    expect(history.location.pathname).toBe("/aboutuspage");
  });
});
