import React from "react";
import { render } from "@testing-library/react-native";

import TransitionCard from "../components/TransitionCard";

describe("TransitionCard", () => {
    it("renders correctly", () => {
        const { toJSON } = render(<TransitionCard />);
        expect(toJSON()).toMatchSnapshot();
    });
});
