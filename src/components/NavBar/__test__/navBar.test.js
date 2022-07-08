import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import AuthContext, { AuthProvider } from "util/AuthContext";
import NavBar from "../navBar";

const mockAuthData = {
  logged_in: true,
  permissions: 0,
  username: "test user",
  avatar_url: "https://c.tenor.com/IyweQyb3MhIAAAAi/the-rock-sus.gif",
  id: "a9fbf7d6-e8fb-4985-956c-f4e9dfb5cd0e",
};

const wrapNavBar = (authData) => {
  const history = createMemoryHistory();

  if (authData) {
    render(
      <AuthContext.Provider value={{ authData }}>
        <Router location={history.location} navigator={history}>
          <NavBar />
        </Router>
      </AuthContext.Provider>
    );
  } else {
    render(
      <AuthProvider>
        <Router location={history.location} navigator={history}>
          <NavBar />
        </Router>
      </AuthProvider>
    );
  }

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

describe("Log In and Sign Up buttons", () => {
  const queryLoginButton = () =>
    screen.queryByRole("link", {
      name: /log in/i,
    });

  const querySignUpButton = () =>
    screen.queryByRole("link", {
      name: /sign up/i,
    });

  test("Log In and Sign Up buttons absent when logged in", () => {
    wrapNavBar(mockAuthData);
    expect(queryLoginButton()).not.toBeInTheDocument();
    expect(querySignUpButton()).not.toBeInTheDocument();
  });

  test("Log In and Sign Up buttons present when not logged in", () => {
    wrapNavBar();
    expect(queryLoginButton()).toBeInTheDocument();
    expect(querySignUpButton()).toBeInTheDocument();
  });

  test("Log In button redirects to login page", () => {
    const history = wrapNavBar();
    fireEvent.click(queryLoginButton());
    expect(history.location.pathname).toBe("/loginpage");
  });

  test("Sign Up button redirects to register page", () => {
    const history = wrapNavBar();
    fireEvent.click(querySignUpButton());
    expect(history.location.pathname).toBe("/registerpage");
  });
});

describe("Profile Picture", () => {
  const queryProfilePic = () => screen.queryByTestId("profilePic");

  it("is absent when user is not logged in", () => {
    wrapNavBar();
    expect(queryProfilePic()).not.toBeInTheDocument();
  });

  it("is present when user is logged in", () => {
    wrapNavBar(mockAuthData);
    expect(queryProfilePic()).toBeInTheDocument();
  });

  it("displays using the provided avatar link in AuthData", () => {
    wrapNavBar(mockAuthData);
    expect(queryProfilePic()).toHaveStyle(
      `background-image: url(${mockAuthData.avatar_url})`
    );
  });

  it("displays the default avatar if AuthData has no avatar link", () => {
    wrapNavBar({ ...mockAuthData, avatar_url: null });
    expect(queryProfilePic()).toHaveStyle(
      `background-image: url(/images/img_avatarDefault.jpg)`
    );
  });

  it("redirects to the profile page on click", () => {
    const history = wrapNavBar(mockAuthData);
    fireEvent.click(queryProfilePic());
    expect(history.location.pathname).toBe("/profile");
  });
});

describe("Create Listing Button", () => {
  const queryCreateButton = () =>
    screen.queryByRole("button", { name: /create listing/i });

  it("is absent when user is not logged in", () => {
    wrapNavBar();
    expect(queryCreateButton()).not.toBeInTheDocument();
  });

  it("is present when user is logged in", () => {
    wrapNavBar(mockAuthData);
    expect(queryCreateButton()).toBeInTheDocument();
  });

  it("redirects to Create Listing Page on click", () => {
    wrapNavBar(mockAuthData);
    expect(queryCreateButton()).toHaveAttribute("href", "create-listing");
  });
});
