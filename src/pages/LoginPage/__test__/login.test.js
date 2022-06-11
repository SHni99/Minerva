import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import LoginPage from "../login";

const wrapLoginPage= () => {
    const history = createMemoryHistory();

    render(
        <Router location={history.location} navigator={history}>
            <LoginPage />
        </Router>
    );

    return history;
};

describe("Minerva logo", () => {
    it("redirects to landing page on click", () => {
        const history = wrapLoginPage();
        fireEvent.click(screen.getByRole("img", { name: /minerva/i }));
        expect(history.location.pathname).toBe("/");
    });
});

describe("Sign up", () => {
    it("redirects to register page on click", () => {
        const history = wrapLoginPage();
        fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));
        expect(history.location.pathname).toBe("/registerpage");
    });
});