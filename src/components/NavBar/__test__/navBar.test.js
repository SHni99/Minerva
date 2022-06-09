import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import NavBar from "../navBar";

describe("Minerva Logo", () => {
  it("redirects to landing page on click", () => {
    const history = createMemoryHistory();

    render(
      <Router location={history.location} navigator={history}>
        <NavBar />
      </Router>
    );

    fireEvent.click(screen.getByRole("link", { name: /minerva logo/i }));

    expect(history.location.pathname).toBe("/");
  });
});
