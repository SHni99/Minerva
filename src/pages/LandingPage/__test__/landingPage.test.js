import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { supabaseClient } from "config/supabase-client";
import LandingPage from "../landingPage";

// Mock logged in user by default
jest.mock("config/supabase-client", () => ({
  __esModule: true,
  supabaseClient: {
    auth: {
      user: jest.fn(),
    },
  },
}));

beforeEach(() => supabaseClient.auth.user.mockClear());

const mockUser = (val) => supabaseClient.auth.user.mockReturnValue(val);

const wrapPage = () => {
  const history = createMemoryHistory();

  render(
    <Router location={history.location} navigator={history}>
      <LandingPage />
    </Router>
  );

  return history;
};

describe("Introduction Section", () => {
  describe("Navbar", () => {
    describe("Minerva Logo", () => {
      it("is visible", () => {
        wrapPage();
        expect(
          screen.getByRole("img", { name: /minerva logo/i })
        ).toBeInTheDocument();
      });
    });

    describe("View Listings Button", () => {
      const getListingsButton = () =>
        screen.getByRole("button", { name: /view listings/i });
      it("is visible", () => {
        wrapPage();
        expect(getListingsButton()).toBeInTheDocument();
      });

      it("redirects to the listings page", () => {
        wrapPage();
        expect(getListingsButton()).toHaveAttribute("href", "/listingspage");
      });
    });

    describe("Login Button", () => {
      const getLoginButton = () =>
        screen.getByRole("button", { name: /login/i });

      it("is absent when user is logged in", () => {
        // Mocking logged-in user
        mockUser({ id: "a9fbf7d6-e8fb-4985-956c-f4e9dfb5cd0e" });
        wrapPage();
        expect(
          screen.queryByRole("button", { name: /login/i })
        ).not.toBeInTheDocument();
      });

      it("is visible when user is not logged in", () => {
        // Mocking non-logged-in user
        mockUser(null);
        wrapPage();
        expect(getLoginButton()).toBeInTheDocument();
      });

      it("redirects users to the login page", () => {
        // Mocking non-logged-in user
        mockUser(null);
        const history = wrapPage();
        fireEvent.click(getLoginButton());
        expect(history.location.pathname).toBe("/loginpage");
      });
    });

    describe("Register Button", () => {
      const getRegisterButton = () =>
        screen.getByRole("button", { name: /register/i });

      it("is absent when user is logged in", () => {
        // Mocking logged-in user
        mockUser({ id: "a9fbf7d6-e8fb-4985-956c-f4e9dfb5cd0e" });
        wrapPage();
        expect(
          screen.queryByRole("button", { name: /register/i })
        ).not.toBeInTheDocument();
      });

      it("is visible when user is not logged in", () => {
        // Mocking non-logged-in user
        mockUser(null);
        wrapPage();
        expect(getRegisterButton()).toBeInTheDocument();
      });

      it("redirects users to the register page", () => {
        // Mocking non-logged-in user
        mockUser(null);
        const history = wrapPage();
        fireEvent.click(getRegisterButton());
        expect(history.location.pathname).toBe("/registerpage");
      });
    });
  });
});
