import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ListingsPage from "../listingsPage";

const setup = () => {
    render(
        <MemoryRouter>
            <ListingsPage />
        </MemoryRouter>
    );
};

describe("Tutor/Tutee toggle", () => {
    const getToggle = () => screen.getByTestId("tutorTuteeToggle");

    it("has a default value of 'tutor'", () => {
        setup();
        expect(getToggle().textContent).toBe("tutor");
    });

    it("toggles between tutor/tutee on a single click", () => {
        setup();
        fireEvent.click(getToggle());
        expect(getToggle().textContent).toBe("tutee");
    });
});
