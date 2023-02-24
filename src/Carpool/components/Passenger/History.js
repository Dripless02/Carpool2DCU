import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { CurrentUserContext } from "../Context";
import { BACKEND_URL } from "@env";
import { Text } from "react-native-paper";

const History = () => {
    const [currentUser] = useContext(CurrentUserContext);
    const [rides, setRides] = useState([]);

    const getRides = () => {
        fetch(`${BACKEND_URL}/api/passengers/get?userID=${currentUser.userID}`)
            .then((response) => response.json())
            .then((data) => {
                setRides(data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        getRides();
    }, []);

    return (
        <ScrollView>
            <View style={styles.container}>
                {rides
                    .filter(ride => ride.status === "Completed-ACK")
                    .map((ride, index) => {
                        return (
                            <View key={index} style={styles.rideContainer}>
                                <View style={{flexDirection: "row"}}>
                                    <Text style={styles.rideTitleText}>From:</Text>
                                    <Text style={styles.rideTitleText}>{ride.searchQuery}</Text>
                                </View>
                                <Text style={styles.rideText}>Driver Name: {ride.acceptedDriverName}</Text>
                                <Text style={styles.rideText}>Pick Up Time: {ride.departureTime}</Text>
                                <Text style={styles.rideText}>Number of Passengers: {ride.noOfPassengers}</Text>
                            </View>
                        );
                    })}
            </View>
        </ScrollView>
    );
};

export default History;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
    },
    rideContainer: {
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: .6,
        borderColor: "#000"
    },
    rideTitleText: {
        fontSize: 20,
        fontWeight: "bold",
        padding: 10,
        paddingRight: 0
    },
    rideText: {
        fontSize: 16,
        padding: 10
    }
});
