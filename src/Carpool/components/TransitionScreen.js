import React, { useContext, useEffect } from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import TransitionCard from "./TransitionCard";
import { CurrentUserContext } from "./Context";
import { BACKEND_URL } from "@env";

const TransitionScreen = ({ navigation }) => {
    const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

    // Function to get the user's driverID from the database
    const getDriverID = () => {
        fetch(`${BACKEND_URL}/api/driver/getDriverID/${currentUser.userID}`)
            .then(response => {
                // If the user's driverID was retrieved successfully, set the current user's driverID to the retrieved ID
                if (response.ok) {
                    response
                        .json()
                        .then(data => {
                            console.log("driverID =", data);
                            setCurrentUser({ ...currentUser, driverID: data });
                        })
                        .catch(error => {
                            console.log("Error getting driverID", error);
                        });
                }
            })
            .catch(error => {
                console.log("Error getting driverID", error);
            });
    };

    // Get the user's driverID when currentUser.userID changes
    useEffect(() => {
        getDriverID();
    }, [currentUser.userID]);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../assets/dcu.png")}
                resizeMode="cover"
                style={styles.ImageBackground}
            />
            <View style={styles.cards}>
                <TransitionCard
                    title="Driver"
                    description="DriverHomePage"
                    navigation={navigation}
                />
                <TransitionCard
                    title="Passenger"
                    description="PassengerHomePage"
                    navigation={navigation}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    ImageBackground: {
        flex: 1,
        resizeMode: "cover",
        width: "100%",
        height: "100%",
        position: "absolute",
    },
    cards: {
        margin: 20,
        marginTop: 50,
        flex: 1,
        flexDirection: "column",
    },
});

export default TransitionScreen;
