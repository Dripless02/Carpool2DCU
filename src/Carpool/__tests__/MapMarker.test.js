import React from "react";
import { render } from "@testing-library/react-native";

import MapMarker from "../components/Map/MapMarker";

describe("MapMarker", () => {
    it("renders correctly", () => {
        const { toJSON } = render(<MapMarker />);
        expect(toJSON()).toMatchSnapshot();
    });
});
