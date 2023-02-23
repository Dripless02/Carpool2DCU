import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Card, Text } from "react-native-paper";

const TransitionCard = ({ title, description, navigation }) => {
    const [image, setImage] = useState(null);

    // Function to select the correct image for the card based on the title
    const imageSelector = () => {
        if (title === "Driver") {
            setImage(require("../assets/driver.png"));
        }
        else if (title === "Passenger") {
            setImage(require("../assets/passenger.png"));
        }
    };

    // Call the imageSelector function when the title changes
    useEffect(() => {
        imageSelector();
    }, [title]);

    return (
        <Card
            style={{
                marginVertical: 10,
                shadowColor: "#000",
                shadowOffset: { width: 1, height: 5 },
                shadowOpacity: 0.5
            }}
            onPress={() => {
                console.log(`user on ${Platform.OS} pressed ${title} card`);
                navigation.navigate(description);
            }}>
            <Card.Content style={{ marginBottom: 15 }}>
                <Text variant="displayLarge" style={{ textAlign: "center" }} >{title}</Text>
            </Card.Content>
            <Card.Cover source={image} />
        </Card>
    );
};

export default TransitionCard;
