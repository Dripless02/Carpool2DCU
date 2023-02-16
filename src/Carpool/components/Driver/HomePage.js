import { StyleSheet } from 'react-native'
import React, { useContext, useEffect } from 'react';
import { Button, IconButton, List, Modal, Portal, Card, Provider, Snackbar, Text, Avatar } from 'react-native-paper';
import { BACKEND_URL } from "@env";
import MapView, {Marker}from 'react-native-maps';
import { CurrentUserContext } from "../Context";

const HomePage = ({ navigation, route }) => {
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const [currentUser] = useContext(CurrentUserContext);
    const [passengers, setPassengers] = React.useState([]);
    const [snackBarVisible, setSnackBarVisible] = React.useState(false);

    const onToggleSnackBar = () => setSnackBarVisible(!snackBarVisible);
    const onDismissSnackBar = () => setSnackBarVisible(false);

    const getPassengers = () => {
        fetch(`${BACKEND_URL}/api/driver/getPassengers/${currentUser.driverID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", },
        })
        .then((response) => {
            response.json()
                .then((data) => {
                    setPassengers(data);
                })
        })
        .catch((error) => {
            console.error(error);
        });
    }

    const deletePassenger = (passengerID) => {
        fetch(`${BACKEND_URL}/api/driver/deletePassenger/${currentUser.driverID}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ passengerID: passengerID }),
        })
        .then((response) => {
            if (response.ok) {
                response.json().then(() => {
                    getPassengers();
                });
                console.log("Passenger deleted from driver");
            } else {
                console.log("Error deleting passenger from driver");
            }
        })
        .catch((error) => {
            console.log(error, "Error deleting passenger from driver");
        });
    }



    useEffect(() => {
        if (route.params?.message) {
            onToggleSnackBar();
            if (route.params.message === "PassengerAdded") {
                getPassengers();
            } else if (route.params.message === "PassengerNotAdded") {
                route.params.message = null;
            }
        }
    }, [route.params]);

    useEffect(() => {
        getPassengers();
    }, []);

    return (
        <Provider>
            <Card>
                <Card.Content style={{ alignItems: "center" }}>
                        <Avatar.Icon icon="account" size={100} />
                        <Text style={{fontSize: 40}}>{currentUser.name}</Text>
                    </Card.Content>
                <Card.Content>
                <MapView
                        provider='google'
                        style={{ height: 250, borderRadius: 10, marginBottom: 10 }}
                        initialRegion={{
                            latitude: currentUser.coords.latitude,
                            longitude: currentUser.coords.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                    >
                        <Marker
                            coordinate={{
                                latitude: currentUser.coords.latitude,
                                longitude: currentUser.coords.longitude,
                            }}
                            title="Drivers Location"
                            description="Driver's start location"
                        />
                    </MapView>
                </Card.Content>

                <Button icon="seat-passenger" mode='contained' onPress={() => navigation.navigate('PassengerList')} style={styles.button} contentStyle={{ padding: 25 }}>
                View Passenger List
            </Button>
            </Card>

            {snackBarVisible ? <Snackbar visible={snackBarVisible} onDismiss={onDismissSnackBar} duration={4000} onIconPress={() => { }} >
                {route.params.message === "PassengerAdded" ? `Passenger '${route.params.passengerName}' added to your ride` : `Passenger '${route.params.passengerName}' already added to your ride`}
            </Snackbar> : null}
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.container}>
                    <Text style={styles.containerH}>My Ride</Text>
                    {passengers ? passengers.map((passenger) => {
                        return (
                            <List.Item
                                key={passenger._id}
                                right={props => <IconButton onPress={() => { console.log(`user on ${Platform.OS} deleted ${passenger.name}'s ride`); deletePassenger(passenger._id) }}{...props} icon="delete" />}
                                title={passenger.name}
                                description={`Departure Time: ${passenger.departureTime}`}
                                left={props => <List.Icon {...props} icon="seat-passenger" />}
                            />
                        )
                    }) : null}
                </Modal>
            </Portal>
            <Button mode='outlined' style={styles.button2} onPress={showModal}>
                My Ride
            </Button>
        </Provider>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 35,
        marginTop: 30,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,


    },
    container: {
        backgroundColor: 'white',
        justifyContent: 'center',
        paddingVertical: 30,
        paddingHorizontal: 30,
        borderRadius: 20,
        marginLeft: 70,
    },
    button2: {
        borderRadius: 30,
        marginLeft: 300,
        marginTop: 20,

    },
    containerH: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    }


});

export default HomePage;
