import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { MemoryRouter, Router } from "react-router-dom";
import LoginPage from "../login";

const wrapLoginPage = () => {
  const history = createMemoryHistory();

  render(
    <Router location={history.location} navigator={history}>
      <LoginPage />
    </Router>
  );

  return history;
};

describe("Minerva logo", () => {
  it("redirects to landing page on click", async () => {
    const history = wrapLoginPage();
    fireEvent.click(screen.getByRole("img", { name: /minerva/i }));
    expect(history.location.pathname).toBe("/");
  });
});

describe("Sign up", () => {
  it("redirects to register page on click", () => {
    const history = wrapLoginPage();
    fireEvent.click(screen.getByRole("button", { name: /here/i }));
    expect(history.location.pathname).toBe("/registerpage");
  });
});

describe("Forgot password", () => {
  it("redirects to ForgotPassword page on click", () => {
    const history = wrapLoginPage();
    fireEvent.click(screen.getByRole("heading", { name: /Forgot password?/i }));
    expect(history.location.pathname).toBe("/passwordpage");
  });
});

describe("Form components", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
  });

  const typeIntoForm = ({ email, password }) => {
    const emailInputElement = screen.getByTestId("findemail");
    const passwordInputElement = screen.getByTestId("findpassword");

    if (email) {
      userEvent.type(emailInputElement, email);
    }
    if (password) {
      userEvent.type(passwordInputElement, password);
    }

    return {
      emailInputElement,
      passwordInputElement,
    };
  };

  test("inputs should be initially empty", () => {
    const emailInputElement = screen.getByTestId("findemail");
    expect(emailInputElement.value).toBe("");
    const passwordInputElement = screen.getByTestId("findpassword");
    expect(passwordInputElement.value).toBe("");
  });

  test("should be able to type an email", () => {
    const { emailInputElement } = typeIntoForm({ email: "david@gmail.com" });
    expect(emailInputElement.value).toBe("david@gmail.com");
  });

  test("should be able to type a password", () => {
    const { passwordInputElement } = typeIntoForm({ password: "password!" });
    expect(passwordInputElement.value).toBe("password!");
  });

  test("should show password error message on invalid password", () => {
    const submitBtnElement = screen.getByRole("button", { name: /Log in/i });
    const passwordInputElement = screen.getByTestId("findpassword");
    const passwordErrorElement = screen.queryByText(
      /Please enter a password more than 8 characters/i
    );
    expect(passwordErrorElement).not.toBeInTheDocument();
    userEvent.type(passwordInputElement, "123");
    userEvent.click(submitBtnElement);
    const passwordErrorElementAgain = screen.queryByText(
      /Please enter a password more than 8 characters/i
    );
    expect(passwordErrorElementAgain).toBeInTheDocument();
  });

  test("should show password error message on password that does not contain special case", () => {
    const submitBtnElement = screen.getByRole("button", { name: /Log in/i });
    const passwordInputElement = screen.getByTestId("findpassword");
    const passwordErrorElement = screen.queryByText(
      /Please enter a password containing at least one SPECIAL CASE/i
    );
    expect(passwordErrorElement).not.toBeInTheDocument();
    userEvent.type(passwordInputElement, "1Exaam23456");
    userEvent.click(submitBtnElement);
    const passwordErrorElementAgain = screen.queryByText(
      /Please enter a password containing at least one SPECIAL CASE/i
    );
    expect(passwordErrorElementAgain).toBeInTheDocument();
  });
});
