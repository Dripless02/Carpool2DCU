import React, { useContext, useEffect, useRef, useState } from "react"
import { View, StyleSheet } from "react-native"
import { Button, Card, Avatar, Modal, Portal, Provider, Text } from "react-native-paper"
import { BACKEND_URL } from "@env"
import { CurrentUserContext } from "../Context";
import DriverRating from "./DriverRating";

const HomePage = ({ navigation }) => {
    const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
    const [acceptedModalVisible, setAcceptedModalVisible] = useState(false);
    const [completedModalVisible, setCompletedModalVisible] = useState(false);
    const [currentRides, setCurrentRides] = useState([]);
    const [acceptedRides, setAcceptedRides] = useState([]);
    const [completedRides, setCompletedRides] = useState([]);
    const isFirstRender = useRef(true);

    const showAcceptedModal = () => setAcceptedModalVisible(true);
    const hideAcceptedModal = () => {acknowledgeRides(acceptedRides); setAcceptedModalVisible(false)};
    const showCompletedModal = () => setCompletedModalVisible(true);
    const hideCompletedModal = () => {acknowledgeRides(completedRides); setCompletedModalVisible(false)};

    const containerStyle = { backgroundColor: 'white', padding: 20 };

    const getRides = () => {
        fetch(`${BACKEND_URL}/api/passengers/get?userID=${currentUser.userID}`)
            .then((response) => response.json())
            .then((data) => {
                setCurrentRides(data)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const checkStatus = () => {
        let accRides = [], compRides = [];
        for (let i = 0; i < currentRides.length; i++) {
            if (currentRides[i].status === "Accepted-NotACK") {
                accRides.push(currentRides[i])
            } else if (currentRides[i].status === "Completed-NotACK") {
                compRides.push(currentRides[i])
            }
        }
        setAcceptedRides(accRides);
        setCompletedRides(compRides);
    }

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
                    console.log(data)
                })
                .catch((error) => {
                    console.error(error)
                })
        })
    }

    useEffect(() => {
        getRides()
    }, [])

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        checkStatus()
    }, [currentRides])

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (acceptedRides.length > 0) showAcceptedModal()
        if (completedRides.length > 0) showCompletedModal()
    }, [acceptedRides, completedRides])

    return (
        <Provider>
            <View>
                <Card>
                    <Card.Content style={{ alignItems: "center" }}>
                        <Avatar.Icon icon="account" size={100} />
                    </Card.Content>
                    <Card.Cover source={{ uri: 'https://picsum.photos/1000' }} />
                </Card>
                <Button
                    icon="map"
                    mode="contained"
                    onPress={() => navigation.navigate("PassengerMap")}
                    style={styles.button}
                    contentStyle={{ padding: 25 }}
                >
                    Click here to start your journey
                </Button>

                <Portal>
                    <Modal visible={acceptedModalVisible} onDismiss={hideAcceptedModal} contentContainerStyle={containerStyle}>
                        <Text>Your Ride has been accepted by a driver</Text>
                        {acceptedRides.map((ride, index) => {
                            return (<Text key={index} >{ride.acceptedDriverName} has accepted your ride for {ride.departureTime} to {ride.searchQuery}</Text>)
                        })}
                    </Modal>
                    <Modal visible={completedModalVisible} onDismiss={hideCompletedModal} contentContainerStyle={containerStyle}>
                        <Text style={{ textAlign: "center" }} variant="titleLarge">Your Ride has been completed</Text>
                        {completedRides.map((ride, index) => {
                            console.log("ride", ride)
                            return (<DriverRating key={index} ride={ride} send={!completedModalVisible}/>)
                        })}
                        <Button
                            style={styles.button2}
                            buttonColor="#F10A4C"
                            mode='contained'
                            onPress={hideCompletedModal}> Finish Rating
                        </Button>
                    </Modal>
                </Portal>
            </View>
        </Provider>
    )
}

export default HomePage

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
})
