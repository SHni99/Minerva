import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { supabaseClient } from "config/supabase-client";
import LandingPage from "../landingPage";
import { AuthProvider } from "util/AuthContext";
import ToastContext from "util/ToastContext";

// Mock logged in user by default
jest.mock("config/supabase-client", () => ({
  __esModule: true,
  supabaseClient: {
    auth: {
      user: jest.fn(),
      signOut: jest.fn().mockResolvedValue(() => ({ error: null })),
    },
  },
}));

beforeEach(() => supabaseClient.auth.user.mockClear());

const mockUser = (val) => supabaseClient.auth.user.mockReturnValue(val);

const wrapPage = () => {
  const history = createMemoryHistory();

  render(
    <AuthProvider>
      <ToastContext.Provider
        value={{ showSimpleToast: jest.fn(), setToastOptions: jest.fn() }}
      >
        <Router location={history.location} navigator={history}>
          <LandingPage />
        </Router>
      </ToastContext.Provider>
    </AuthProvider>
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

    describe("My Profile Button", () => {
      const getProfileButton = () =>
        screen.getByRole("button", { name: /my profile/i });

      it("is absent when user is not logged in", () => {
        // Mocking non-logged-in user
        mockUser(null);
        wrapPage();
        expect(
          screen.queryByRole("button", { name: /my profile/i })
        ).not.toBeInTheDocument();
      });

      it("is visible when user is logged in", () => {
        // Mocking logged-in user
        mockUser({ id: "a9fbf7d6-e8fb-4985-956c-f4e9dfb5cd0e" });
        wrapPage();
        expect(getProfileButton()).toBeInTheDocument();
      });

      it("redirects users to the profile page", () => {
        // Mocking logged-in user
        mockUser({ id: "a9fbf7d6-e8fb-4985-956c-f4e9dfb5cd0e" });
        const history = wrapPage();
        fireEvent.click(getProfileButton());
        expect(history.location.pathname).toBe("/profile");
      });
    });

    describe("Logout Button", () => {
      const getLogoutButton = () =>
        screen.getByRole("button", { name: /Log out/i });

      it("is absent when user is not logged in", () => {
        // Mocking non-logged-in user
        mockUser(null);
        wrapPage();
        expect(
          screen.queryByRole("button", { name: /Log out/i })
        ).not.toBeInTheDocument();
      });

      it("is visible when user is logged in", () => {
        // Mocking logged-in user
        mockUser({ id: "a9fbf7d6-e8fb-4985-956c-f4e9dfb5cd0e" });
        wrapPage();
        expect(getLogoutButton()).toBeInTheDocument();
      });

      it("logs the user out", () => {
        // Mocking logged-in user
        mockUser({ id: "a9fbf7d6-e8fb-4985-956c-f4e9dfb5cd0e" });

        // Mocks signout method
        supabaseClient.auth.signOut = jest.fn().mockResolvedValue(() => ({}));

        const history = wrapPage();
        fireEvent.click(getLogoutButton());
        expect(history.location.pathname).toBe("/");
        expect(supabaseClient.auth.signOut).toHaveBeenCalled();
      });
    });
  });

  describe("Section Body", () => {
    describe("See How It Works Button", () => {
      const getButton = () =>
        screen.getByRole("button", { name: /see how it works/i });

      it("is visible", () => {
        wrapPage();
        expect(getButton()).toBeInTheDocument();
      });

      it("refers user to the Get Started section", () => {
        wrapPage();
        expect(getButton()).toHaveAttribute("href", "#GetStarted");
      });
    });

    describe("About Us Button", () => {
      const getButton = () => screen.getByRole("button", { name: /about us/i });

      it("is visible", () => {
        wrapPage();
        expect(getButton()).toBeInTheDocument();
      });

      it("redirects users to the About Us Page", () => {
        wrapPage();
        expect(getButton()).toHaveAttribute("href", "/aboutuspage");
      });
    });
  });
});

describe("Get Started Section", () => {
  describe("Sign Up Now Button", () => {
    const getButton = () =>
      screen.getByRole("button", { name: /sign up now/i });

    it("is visible", () => {
      wrapPage();
      expect(getButton()).toBeInTheDocument();
    });

    it("redirects users to the Register Page", () => {
      wrapPage();
      expect(getButton()).toHaveAttribute("href", "/registerpage");
    });
  });
});
