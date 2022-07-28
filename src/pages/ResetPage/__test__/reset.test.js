import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { MemoryRouter, Router } from "react-router-dom";
import ResetPage from "../resetPage";

const wrapResetPage = () => {
    const history = createMemoryHistory();

    render(
        <Router location={history.location} navigator={history}>
            <ResetPage />
        </Router>
    );

    return history;
};

describe("Minerva logo", () => {
    it("redirects to landing page on click", async () => {
        const history = wrapResetPage();
        fireEvent.click(screen.getByRole("img", { name: /minerva/i }));
        expect(history.location.pathname).toBe("/");
    });
});

describe("Reset Password", () => {
    it("redirects to login page on click", () => {
        const history = wrapResetPage();
        fireEvent.click(screen.getByRole("button", { name: /Reset password/i }));
        expect(history.location.pathname).toBe("/");
    });
});

describe("Close", () => {
    it("redirects to login page on click", () => {
        const history = wrapResetPage();
        fireEvent.click(screen.getByRole("button", { name: /close/i }));
        expect(history.location.pathname).toBe("/loginpage");
    });
});

describe("Form components", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <ResetPage />
            </MemoryRouter>
        );
    });

    const typeIntoForm = ({ password, confirmpassword }) => {

        const passwordInputElement = screen.getByTestId("findpassword");
        const confirmpasswordInputElement = screen.getByTestId("findconfirmpassword");

        if (password) {
            userEvent.type(passwordInputElement, password);
        } if (confirmpassword) {
            userEvent.type(confirmpasswordInputElement, confirmpassword);
        }

        return {
            passwordInputElement,
            confirmpasswordInputElement
        };
    };

    test("inputs should be initially empty", () => {

        const passwordInputElement = screen.getByTestId("findpassword");
        expect(passwordInputElement.value).toBe("");

        const confirmpasswordInputElement = screen.getByTestId("findconfirmpassword");
        expect(confirmpasswordInputElement.value).toBe("");
    });

    test("should be able to type a password", () => {
        const { passwordInputElement } = typeIntoForm({ password: "password!" });
        expect(passwordInputElement.value).toBe("password!");
    });

    test("should show password error message on invalid password", () => {
        const submitBtnElement = screen.getByRole("button", { name: /reset/i });
        const passwordInputElement = screen.getByTestId("findpassword");
        const confirmpasswordInputElement = screen.getByTestId("findconfirmpassword");
        const passwordErrorElement = screen.queryByText(
            /Please enter a password more than 8 characters/i
        );
        expect(passwordErrorElement).not.toBeInTheDocument();
        userEvent.type(passwordInputElement, "123");
        userEvent.type(confirmpasswordInputElement, "123");
        userEvent.click(submitBtnElement);
        const passwordErrorElementAgain = screen.queryByText(
            /Please enter a password more than 8 characters/i
        );
        expect(passwordErrorElementAgain).toBeInTheDocument();
    });

    test("should show password error message on password that does not contain special case", () => {
        const submitBtnElement = screen.getByRole("button", { name: /reset/i });
        const passwordInputElement = screen.getByTestId("findpassword");
        const confirmpasswordInputElement = screen.getByTestId("findconfirmpassword");
        const passwordErrorElement = screen.queryByText(
            /Please enter a password containing at least one SPECIAL CASE/i
        );
        expect(passwordErrorElement).not.toBeInTheDocument();
        userEvent.type(passwordInputElement, "1Exaam23456");
        userEvent.type(confirmpasswordInputElement, "1Exaam23456");
        userEvent.click(submitBtnElement);
        const passwordErrorElementAgain = screen.queryByText(
            /Please enter a password containing at least one SPECIAL CASE/i
        );
        expect(passwordErrorElementAgain).toBeInTheDocument();
    });

    test("should show password error message on password that does not contain lower case", () => {
        const submitBtnElement = screen.getByRole("button", { name: /reset/i });
        const passwordInputElement = screen.getByTestId("findpassword");
        const confirmpasswordInputElement = screen.getByTestId("findconfirmpassword");
        const passwordErrorElement = screen.queryByText(
            /Please enter a password containing at least one LOWERCASE character/i
        );
        expect(passwordErrorElement).not.toBeInTheDocument();
        userEvent.type(passwordInputElement, "1EXAM@23456");
        userEvent.type(confirmpasswordInputElement, "1EXAM@23456");
        userEvent.click(submitBtnElement);
        const passwordErrorElementAgain = screen.queryByText(
            /Please enter a password containing at least one LOWERCASE character/i
        );
        expect(passwordErrorElementAgain).toBeInTheDocument();
    });

    test("should show password error message on password that does not contain upper case", () => {
        const submitBtnElement = screen.getByRole("button", { name: /reset/i });
        const passwordInputElement = screen.getByTestId("findpassword");
        const confirmpasswordInputElement = screen.getByTestId("findconfirmpassword");
        const passwordErrorElement = screen.queryByText(
            /Please enter a password containing at least one UPPERCASE character/i
        );
        expect(passwordErrorElement).not.toBeInTheDocument();
        userEvent.type(passwordInputElement, "1exaam@23456");
        userEvent.type(confirmpasswordInputElement, "1exaam@23456");
        userEvent.click(submitBtnElement);
        const passwordErrorElementAgain = screen.queryByText(
            /Please enter a password containing at least one UPPERCASE character/i
        );
        expect(passwordErrorElementAgain).toBeInTheDocument();
    });

    test("should show password error message on password that does not contain number", () => {
        const submitBtnElement = screen.getByRole("button", { name: /reset/i });
        const passwordInputElement = screen.getByTestId("findpassword");
        const confirmpasswordInputElement = screen.getByTestId("findconfirmpassword");
        const passwordErrorElement = screen.queryByText(
            /Please enter a password containing at least one NUMBER/i
        );
        expect(passwordErrorElement).not.toBeInTheDocument();
        userEvent.type(passwordInputElement, "Exaam@mmm");
        userEvent.type(confirmpasswordInputElement, "Exaam@mmm");
        userEvent.click(submitBtnElement);
        const passwordErrorElementAgain = screen.queryByText(
            /Please enter a password containing at least one NUMBER/i
        );
        expect(passwordErrorElementAgain).toBeInTheDocument();
    });

    test("should verify password matches", () => {
        const submitBtnElement = screen.getByRole("button", { name: /reset/i });
        const passwordInputElement = screen.getByTestId("findpassword");
        const confirmpasswordInputElement = screen.getByTestId("findconfirmpassword");
        const passwordErrorElement = screen.queryByText(
            /Please enter the SAME passwords!/i
        );
        expect(passwordErrorElement).not.toBeInTheDocument()
        userEvent.type(passwordInputElement, "Exaam@123");
        userEvent.type(confirmpasswordInputElement, "Exaam@1234");
        userEvent.click(submitBtnElement);
        const passwordErrorElementAgain = screen.queryByText(
            /Please enter the SAME passwords!/i
        );
        expect(passwordErrorElementAgain).toBeInTheDocument();
    });
});
