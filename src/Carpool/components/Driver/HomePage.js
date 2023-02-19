import { StyleSheet } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, IconButton, List, Modal, Portal, Card, Provider, Snackbar, Text, Avatar } from 'react-native-paper';
import { BACKEND_URL, ORS_API_KEY } from "@env";
import MapView, {Geojson, Marker}from 'react-native-maps';
import { CurrentUserContext } from "../Context";
import { Rating } from 'react-native-ratings';

const HomePage = ({ navigation, route }) => {
    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const [currentUser] = useContext(CurrentUserContext);
    const [acceptedPassengers, setAcceptedPassengers] = useState([]);
    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [routeGeoJSON, setRouteGeoJSON] = useState(null);
    const isFirstRender = useRef(true);
    const mapRef = useRef(null);

    const coordinatesToSend = { "coordinates": [] }

    const onToggleSnackBar = () => setSnackBarVisible(!snackBarVisible);
    const onDismissSnackBar = () => setSnackBarVisible(false);

    const fitMapToMarkers = () => mapRef.current.fitToSuppliedMarkers(["dcu", "driver", "passenger"], { edgePadding: { top: 65, right: 50, bottom: 100, left: 50 } });

    const sortPassengersOnDistanceToDcu = (passengers) => {
        passengers.sort((a, b) => {
            const aDistance = Math.sqrt(Math.pow(a.location.latitude - 53.386343, 2) + Math.pow(a.location.longitude + 6.255083, 2));
            const bDistance = Math.sqrt(Math.pow(b.location.latitude - 53.386343, 2) + Math.pow(b.location.longitude + 6.255083, 2));
            return aDistance - bDistance;
        });
        return passengers.reverse();
    }

    const getAcceptedPassengers = () => {
        fetch(`${BACKEND_URL}/api/driver/getPassengers/${currentUser.driverID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", },
        })
        .then((response) => {
            response.json()
                .then((data) => {
                    setAcceptedPassengers(sortPassengersOnDistanceToDcu(data));
                })
        })
        .catch((error) => {
            console.error(error);
        });
    }

    const addCoords = () => {
        coordinatesToSend.coordinates.push([currentUser.coords.longitude, currentUser.coords.latitude]);
        acceptedPassengers.forEach((passenger) => {
            coordinatesToSend.coordinates.push([passenger.location.longitude, passenger.location.latitude]);
        });
        coordinatesToSend.coordinates.push([-6.255083, 53.386343])
    }

    const getRoute = (coords) => {
        fetch(`https://api.openrouteservice.org/v2/directions/driving-car/geojson?api_key=${ORS_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(coords),
        })
        .then((response) => {
            response.json()
            .then((data) => {
                setRouteGeoJSON(data);
            })
            .catch((error) => { console.log(error) })
        })
        .catch((error) => { console.log(error) })
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
                    getAcceptedPassengers();
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
        getAcceptedPassengers();
    }, []);

    useEffect(() => {
        if (route.params?.message) {
            onToggleSnackBar();
            if (route.params.message === "PassengerAdded") {
                getAcceptedPassengers();
            } else if (route.params.message === "PassengerNotAdded") {
                route.params.message = null;
            }
        }
    }, [route.params]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        addCoords();
        getRoute(coordinatesToSend);
    }, [acceptedPassengers]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        fitMapToMarkers();

    }, [routeGeoJSON])

    const [bannervisible, setbannerVisible] = useState(false);

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
                        ref={mapRef}
                    >
                        <Marker
                            coordinate={{
                                latitude: currentUser.coords.latitude,
                                longitude: currentUser.coords.longitude,
                            }}
                            title="Drivers Location"
                            description="Driver's start location"
                            pinColor="blue"
                            identifier="driver"
                        />
                        <Marker
                            coordinate={{
                                latitude: 53.386343,
                                longitude: -6.255083,
                            }}
                            title="DCU"
                            pinColor="green"
                            identifier="dcu"
                        />
                        {acceptedPassengers.map((passenger, index) => {
                            return (
                                <Marker
                                    key={index}
                                    coordinate={{
                                        latitude: passenger.location.latitude,
                                        longitude: passenger.location.longitude,
                                    }}
                                    title={`${index + 1}: ${passenger.name}`}
                                    description={"Passenger Count: " + passenger.noOfPassengers}
                                    pinColor="red"
                                    identifier="passenger"
                                />
                            )
                        })}
                        {!routeGeoJSON ? null : <Geojson geojson={routeGeoJSON} strokeColor="#000" fillColor="blue" strokeWidth={2} />}
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
                    {acceptedPassengers ? acceptedPassengers.map((passenger) => {
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
                     <Button
                        style={styles.button3}
                        buttonColor="#F10A4C"
                        mode='contained'
                        onPress={()=> {setbannerVisible(true);setVisible(false)}}> Finish Ride</Button>
                </Modal>
            </Portal>

            <Portal>
                <Modal visible={bannervisible} onDismiss={() => setbannerVisible(false)} contentContainerStyle={styles.review}>
                    <Text style={styles.reviewT}>Leave feedback for your passenger</Text>
                <Rating
                type='star'
                ratingCount={5}
                imageSize={70}
                ratingColor="3F51B5"
                showRating
                onFinishRating={(rating) => {console.log("Rating is: " + rating)}}
                />
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
    },
    button3: {
        borderRadius: 15,
        marginHorizontal: 30,
        paddingVertical: 2,
    },
    review: {
        fontSize: 20,
        backgroundColor: 'white',
        paddingVertical: 50,

    },
    reviewT: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },

});

export default HomePage;
