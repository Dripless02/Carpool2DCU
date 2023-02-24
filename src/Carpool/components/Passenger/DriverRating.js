import React, { useState } from "react";
import { Text } from "react-native-paper";
import { Rating } from "react-native-ratings";
import { BACKEND_URL } from "@env";

const DriverRating = ({ ride, send }) => {
    // State to store the rating
    const [rating, setRating] = useState(3);

    // Function to send the rating to the backend
    if (send === true) {
        console.log(`Rating for ${ride.name} is ${rating}!`);
        fetch(`${BACKEND_URL}/api/driver/rate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                driverID: ride.acceptedDriverID,
                rating: rating
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <>
            <Text style={{ marginVertical: 5, textAlign: "center" }} variant="titleMedium">{ride.acceptedDriverName}</Text>
            <Text style={{ textAlign: "center" }}>{ride.acceptedDriverName} has completed your ride for {ride.departureTime} to {ride.searchQuery}</Text>
            <Rating
                type='star'
                ratingCount={5}
                imageSize={70}
                ratingColor="3F51B5"
                showRating
                startingValue={3}
                onFinishRating={rating => { setRating(rating); }}
            />
        </>
    );
};

export default DriverRating;
