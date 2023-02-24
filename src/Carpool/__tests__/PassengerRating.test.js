import React from "react";
import { render } from "@testing-library/react-native";

import PassengerRating from "../components/Driver/PassengerRating";

describe("PassengerRating", () => {
    it("renders correctly", () => {
        const { toJSON } = render(<PassengerRating passenger={{name: "test", rating: 0}} />);
        expect(toJSON()).toMatchSnapshot();
    });
});
