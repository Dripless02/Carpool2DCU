import React from "react";
import { render } from "@testing-library/react-native";

import DriverRating from "../components/Passenger/DriverRating";

describe("DriverRating", () => {
    it("renders correctly", () => {
        const { toJSON } = render(<DriverRating ride={{ acceptedDriverName: "test", depatureTime: "09:00", searchQuery: "test location" }}/>);
        expect(toJSON()).toMatchSnapshot();
    });
});
