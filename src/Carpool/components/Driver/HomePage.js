import { StyleSheet, ImageBackground, View, Platform } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, IconButton, List, Modal, Portal, Card, Snackbar, Text } from "react-native-paper";
import { BACKEND_URL, ORS_API_KEY } from "@env";
import MapView, { Geojson }from "react-native-maps";
import { CurrentUserContext } from "../Context";
import PassengerRating from "./PassengerRating";
import MapMarker from "../Map/MapMarker";

// Driver Homepage
const HomePage = ({ navigation, route }) => {
    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const [currentUser] = useContext(CurrentUserContext);
    const [acceptedPassengers, setAcceptedPassengers] = useState([]);
    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [routeGeoJSON, setRouteGeoJSON] = useState(null);
    const [bannerVisible, setBannerVisible] = useState(false);
    const [routeDistance, setRouteDistance] = useState(0);
    const [routeDuration, setRouteDuration] = useState(0);
    const isFirstRender = useRef(true);
    const mapRef = useRef(null);

    const coordinatesToSend = { "coordinates": [] };

    const onToggleSnackBar = () => setSnackBarVisible(!snackBarVisible);
    const onDismissSnackBar = () => setSnackBarVisible(false);

    const hideBanner = () => { setBannerVisible(false); finishRide(); };

    const fitMapToMarkers = () => mapRef.current.fitToSuppliedMarkers(["dcu", "driver", "passenger"], { edgePadding: { top: 65, right: 50, bottom: 100, left: 50 } });

    // Function to sort passengers by distance to DCU
    const sortPassengersOnDistanceToDcu = (passengers) => {
        passengers.sort((a, b) => {
            // Calculate distance from DCU to passenger
            const aDistance = Math.sqrt(Math.pow(a.location.latitude - 53.386343, 2) + Math.pow(a.location.longitude + 6.255083, 2));
            const bDistance = Math.sqrt(Math.pow(b.location.latitude - 53.386343, 2) + Math.pow(b.location.longitude + 6.255083, 2));
            return aDistance - bDistance;
        });
        return passengers.reverse();
    };

    // Get accepted passengers from backend
    const getAcceptedPassengers = () => {
        fetch(`${BACKEND_URL}/api/driver/getPassengers/${currentUser.driverID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", },
        })
            .then((response) => {
            // If response is ok, get the data
                response.json()
                    .then((data) => {
                        setAcceptedPassengers(sortPassengersOnDistanceToDcu(data));
                    });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // Add coords to array
    const addCoords = () => {

        coordinatesToSend.coordinates.push([currentUser.coords.longitude, currentUser.coords.latitude]);
        acceptedPassengers.forEach((passenger) => {
            coordinatesToSend.coordinates.push([passenger.location.longitude, passenger.location.latitude]);
        });
        coordinatesToSend.coordinates.push([-6.255083, 53.386343]);
    };

    // Get route from ORS
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
                        setRouteDistance((data.features[0].properties.summary.distance / 1000).toFixed(2));
                        setRouteDuration((data.features[0].properties.summary.duration / 60).toFixed());
                    })
                    .catch((error) => { console.log(error); });
            })
            .catch((error) => { console.log(error); });
    };

    // Delete passenger from driver
    const deletePassenger = (passengerID) => {
        //Fetch request to delete passenger from driver
        fetch(`${BACKEND_URL}/api/driver/deletePassenger/${currentUser.driverID}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ passengerID: passengerID }),
        })
            .then((response) => {
            // If response is ok, get the data
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
    };
    // Finish ride
    const finishRide = () => {
        //Fetch request to delete passenger from driver
        fetch(`${BACKEND_URL}/api/driver/finishRide/${currentUser.driverID}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", },
        })
            .then((response) => { response.json(); })
            .then((data) => { console.log(data); getAcceptedPassengers(); })
            .catch((error) => { console.log("Unable to finish ride", error); });
    };

    useEffect(() => {
        getAcceptedPassengers();
    }, []);

    // If route params is not null, show snackbar
    useEffect(() => {
        if (route.params?.message) {
            onToggleSnackBar();
            if (route.params.message === "PassengerAdded") {
                getAcceptedPassengers();
                route.params.message = null;
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

    }, [routeGeoJSON]);


    return (
        <View style={{ flex: 1, justifyContent: "center" }}>
            <ImageBackground source={require("../../assets/dcu.png")} style={styles.ImageBackground}/>
            <Card style={{marginVertical: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.4 }}>
                <Card.Content style={{ alignItems: "center" }}>
                    <Text style={{fontSize: 30, fontWeight: "bold",textAlign: "center", marginBottom: 15}}>Welcome {currentUser.name}!</Text>
                </Card.Content>
                <Card.Content>
                    <MapView
                        provider='google'
                        style={{ height: 300, borderRadius: 10, marginBottom: 10 }}
                        initialRegion={{
                            latitude: currentUser.coords.latitude,
                            longitude: currentUser.coords.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                        ref={mapRef}
                    >
                        <MapMarker long={currentUser.coords.longitude} lat={currentUser.coords.latitude} title="Drivers Location" desc="Driver's start location" colour="blue" id="driver" />
                        <MapMarker long={-6.255083} lat={53.386343} title="DCU" colour="green" id="dcu" />
                        {acceptedPassengers.map((passenger, index) => {
                            return (
                                <MapMarker key={index} long={passenger.location.longitude} lat={passenger.location.latitude} title={`${index + 1}: ${passenger.name}`} desc={"Passenger Count: " + passenger.noOfPassengers} colour="red" id="passenger" />
                            );
                        })}
                        {!routeGeoJSON ? null : <Geojson geojson={routeGeoJSON} strokeColor="#000" fillColor="blue" strokeWidth={2} />}
                    </MapView>
                    <Button icon="seat-passenger" mode='contained' onPress={() => navigation.navigate("PassengerList")} style={styles.button} contentStyle={{ padding: 25 }}>
                        View Passenger List
                    </Button>

                    {acceptedPassengers.length > 0 ?
                        <Button mode='contained-tonal' style={styles.button2} onPress={showModal} contentStyle={{ padding: 20 }}>
                        Current Ride
                        </Button> : null}

                </Card.Content>
            </Card>

            {snackBarVisible ? <Snackbar visible={snackBarVisible} onDismiss={onDismissSnackBar} duration={4000} onIconPress={() => { }} >
                {route.params.message !== "PassengerAdded" ? `Passenger '${route.params.passengerName}' added to your ride` : null}
            </Snackbar> : null}
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.container}>
                    <Text style={styles.containerH}>My Ride</Text>
                    {routeDistance ? <Text style={styles.info}>Estimated driving distance: {routeDistance} km</Text> : null}
                    {routeDuration && routeDuration !== "NaN" ? <Text style={styles.info}>Estimated time: {routeDuration} minutes</Text> : null}
                    {acceptedPassengers ? acceptedPassengers.map((passenger) => {
                        return (
                            <List.Item
                                key={passenger._id}
                                right={props => <IconButton onPress={() => { console.log(`user on ${Platform.OS} deleted ${passenger.name}'s ride`); deletePassenger(passenger._id); }}{...props} icon="delete" />}
                                title={passenger.name}
                                description={`Departure Time: ${passenger.departureTime}`}
                                left={props => <List.Icon {...props} icon="seat-passenger" />}
                            />

                        );
                    }) : null}
                    <Button
                        style={styles.button3}
                        buttonColor="#F10A4C"
                        mode='contained'
                        onPress={() => { setBannerVisible(true); setVisible(false); }}>Finish Ride</Button>
                </Modal>
            </Portal>

            <Portal>
                <Modal visible={bannerVisible}  contentContainerStyle={styles.review}>
                    <Text style={styles.reviewT}>Leave feedback for your passengers</Text>
                    {acceptedPassengers ? acceptedPassengers.map((passenger, index) => {
                        return (
                            <PassengerRating key={index} index={index} passenger={passenger} send={!bannerVisible} />
                        );
                    }): null}
                    <Button
                        style={styles.button3}
                        buttonColor="#F10A4C"
                        mode='contained'
                        onPress={() => {hideBanner();}}>
                        Finish Rating
                    </Button>
                </Modal>
            </Portal>

        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 35,
        marginTop: 25,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
    },
    container: {
        backgroundColor: "white",
        justifyContent: "center",
        paddingVertical: 30,
        paddingHorizontal: 30,
        borderRadius: 20,
        marginHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4, },
        shadowOpacity: 0.4,
    },
    button2: {
        borderRadius: 30,
        marginHorizontal: 20,
        shadowColor: "#000",shadowOffset: { width: 0, height: 4, }, shadowOpacity: 0.5,
    },
    containerH: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    button3: {
        borderRadius: 15,
        marginHorizontal: 70,
        marginTop: 30,
        paddingVertical: 2,
    },
    review: {
        fontSize: 20,
        backgroundColor: "white",
        paddingVertical: 50,
        borderRadius: 20,
        shadowColor: "#000",shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.3,
    },
    reviewT: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    ImageBackground: {
        flex: 1,
        resizeMode: "cover",
        width: "100%",
        height: "100%",
        position: "absolute",
    },
    info: {
        textAlign: "center",
        marginBottom: 10,
    },
});

export default HomePage;
