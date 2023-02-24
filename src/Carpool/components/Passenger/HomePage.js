import React, { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { Button, Card, Avatar, Modal, Portal, Text } from "react-native-paper";
import { BACKEND_URL } from "@env";
import { CurrentUserContext } from "../Context";
import DriverRating from "./DriverRating";

const HomePage = ({ navigation }) => {
    const [currentUser] = useContext(CurrentUserContext);

    const [currentRides, setCurrentRides] = useState([]);
    const [acceptedRides, setAcceptedRides] = useState([]);
    const [completedRides, setCompletedRides] = useState([]);
    const [acceptedModalVisible, setAcceptedModalVisible] = useState(false);
    const [completedModalVisible, setCompletedModalVisible] = useState(false);

    // Ref to check if this is the first render
    const isFirstRender = useRef(true);

    const showAcceptedModal = () => setAcceptedModalVisible(true);
    const hideAcceptedModal = () => { acknowledgeRides(acceptedRides); setAcceptedModalVisible(false); };

    const showCompletedModal = () => setCompletedModalVisible(true);
    const hideCompletedModal = () => { acknowledgeRides(completedRides); setCompletedModalVisible(false); };

    // Function to get the user's current rides from the database and store them in the currentRides state
    const getRides = () => {
        fetch(`${BACKEND_URL}/api/passengers/get?userID=${currentUser.userID}`)
            .then((response) => response.json())
            .then((data) => {
                setCurrentRides(data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // Function to check the status of the current rides and store them in the acceptedRides and completedRides states
    const checkStatus = () => {
        let accRides = [], compRides = [];
        for (let i = 0; i < currentRides.length; i++) {
            if (currentRides[i].status === "Accepted-NotACK") {
                accRides.push(currentRides[i]);
            } else if (currentRides[i].status === "Completed-NotACK") {
                compRides.push(currentRides[i]);
            }
        }
        setAcceptedRides(accRides);
        setCompletedRides(compRides);
    };

    // Function to acknowledge the rides in the acceptedRides and completedRides states
    const acknowledgeRides = (rides) => {
        rides.forEach((ride) => {
            fetch(`${BACKEND_URL}/api/passengers/acknowledge?passengerID=${ride._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    };

    // Get the user's current rides when the page loads
    useEffect(() => {
        getRides();
    }, []);

    // Check the status of the current rides when the currentRides state changes
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        checkStatus();
    }, [currentRides]);

    // Show the accepted and completed modals when the acceptedRides and completedRides states change respectively
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (acceptedRides.length > 0) showAcceptedModal();
        if (completedRides.length > 0) showCompletedModal();
    }, [acceptedRides, completedRides]);

    return (
        <View style={{ flex: 1, justifyContent: "center" }}>
            <ImageBackground source={require("../../assets/dcu.png")} style={styles.ImageBackground} />
            <Card style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 4, }, shadowOpacity: 0.5 }}>
                <Card.Content style={{ alignItems: "center", marginBottom: 10 }}>
                    <Avatar.Icon icon="account" size={100} />
                    <Text style={{ fontSize: 30, fontWeight: "bold", textAlign: "center", marginBottom: 5 }}>
                        Welcome {currentUser.name}!
                    </Text>
                </Card.Content>
                <Card.Cover style={{ marginHorizontal: 10 }} source={require("../../assets/passenger.png")} />
                <Card.Content>
                    <Button
                        icon="map"
                        mode="contained"
                        onPress={() => navigation.navigate("PassengerMap")}
                        style={styles.button}
                        contentStyle={{ padding: 25 }}>
                        Click here to start your journey
                    </Button>
                    <Button
                        icon="history"
                        mode="contained-tonal"
                        onPress={() => navigation.navigate("PassengerHistory")}
                        style={styles.button}
                        contentStyle={{ padding: 25 }}
                    >
                        Click here to view your ride history
                    </Button>
                </Card.Content>
            </Card>

            <Portal>
                <Modal visible={acceptedModalVisible} onDismiss={hideAcceptedModal} contentContainerStyle={styles.contentContainerStyle} >
                    <Text style={{
                        fontSize: 23,
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: 5
                    }}>
                        Your Ride has been accepted by a driver
                    </Text>
                    {acceptedRides.map((ride, index) => {
                        return (<Text style={{ fontSize: 20, textAlign: "center", marginBottom: 5 }} key={index} >{ride.acceptedDriverName} has accepted your ride for {ride.departureTime} to {ride.searchQuery}</Text>);
                    })}
                </Modal>
                <Modal visible={completedModalVisible} onDismiss={hideCompletedModal} contentContainerStyle={styles.contentContainerStyle} >
                    <Text
                        style={{
                            textAlign: "center",
                            paddingBottom: 10
                        }}
                        variant="titleLarge"
                    >
                        Your Ride has been completed
                    </Text>
                    {completedRides.map((ride, index) => {
                        console.log("ride", ride);
                        return (<DriverRating key={index} ride={ride} send={!completedModalVisible} />);
                    })}
                    <Button
                        style={styles.button2}
                        buttonColor="#F10A4C"
                        mode='contained'
                        onPress={hideCompletedModal}
                    >
                        Finish Rating
                    </Button>
                </Modal>
            </Portal>
        </View>
    );
};

export default HomePage;

const styles = StyleSheet.create({
    button: {
        borderRadius: 30,
        marginTop: 30,
        marginLeft: 10,
        marginRight: 10,
    },
    button2: {
        borderRadius: 15,
        marginHorizontal: 30,
        paddingVertical: 2,
        marginTop: 20,
    },
    contentContainerStyle: {
        backgroundColor: "white",
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 10,
    },
    ImageBackground: {
        flex: 1,
        resizeMode: "cover",
        width: "100%",
        height: "100%",
        position: "absolute",
    }
});
