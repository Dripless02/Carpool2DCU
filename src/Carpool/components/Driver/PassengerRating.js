import React, { useState } from "react";
import { Rating } from "react-native-ratings";
import { Text } from "react-native-paper";
import { BACKEND_URL } from "@env";

// Passenger rating component
const PassengerRating = ({ passenger, index, send }) => {
    // State to store the rating
    const [rating, setRating] = useState(3);

    if (send === true) {
        //api call to send rating to backend
        console.log(`Rating for ${passenger.name} is ${rating}!`);
        fetch(`${BACKEND_URL}/api/passengers/rate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                passengerID: passenger._id,
                rating: rating
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            }
            )
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <>
            <Text style={{ marginVertical: 5, textAlign: "center" }} variant="titleLarge">Rate {passenger.name}!</Text>
            <Rating
                key={index}
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

export default PassengerRating;
