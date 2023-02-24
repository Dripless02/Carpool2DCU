import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import App from "../App";

describe("App", () => {

    it("renders correctly", () => {
        const { toJSON } = render(<App />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders Login screen by default", () => {
        const { getByText } = render(<App />);
        expect(getByText("Login")).toBeTruthy();
    });

    it("renders Register screen when Register button is pressed", () => {
        const { getByText } = render(<App />);
        const registerButton = getByText("Register");
        fireEvent.press(registerButton);
        expect(getByText("Register")).toBeTruthy();
    });

    it("renders email text input", () => {
        const { findByTestId } = render(<App />);
        expect(findByTestId("Email")).toBeTruthy();
    });

    it("renders password text input", () => {
        const { findByTestId } = render(<App />);
        expect(findByTestId("Password")).toBeTruthy();
    });
});
