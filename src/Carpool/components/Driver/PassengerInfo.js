import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import { CurrentUserContext } from "../Context";
import { BACKEND_URL, ORS_API_KEY } from "@env";

const PassengerInfo = ({ route, navigation }) => {
    const [currentUser] = useContext(CurrentUserContext);
    const [routeDistance, setRouteDistance] = useState(0);
    const [routeDuration, setRouteDuration] = useState(0);

    const passenger = route.params.passenger;

    const acceptPassenger = () => {
        fetch(`${BACKEND_URL}/api/driver/addPassenger/${currentUser.driverID}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ passenger: passenger }),
        })
            .then((response) => {
                if (response.ok) {
                    response.json().then(() => {
                        navigation.navigate('DriverHomePage', { message: "PassengerAdded", passengerName: passenger.name });
                    });
                    console.log("Passenger added to driver");
                } else {
                    navigation.navigate('DriverHomePage', { message: "PassengerNotAdded", passengerName: passenger.name });
                    console.log("Error adding passenger to driver");
                }
            })
            .catch((error) => {
                console.log(error, "Error adding passenger to driver");
            });
    };

    const getRoute = () => {
        console.log(`Getting route from ${currentUser.coords.longitude}, ${currentUser.coords.latitude} to ${passenger.location.longitude}, ${passenger.location.latitude}`)
        if (passenger.location.latitude === currentUser.coords.latitude && passenger.location.longitude === currentUser.coords.longitude) {
            console.log("Same location");
            setRouteDistance("0");
            setRouteDuration("0");
            return;
        }

        fetch(`https://api.openrouteservice.org/v2/directions/driving-car/geojson?api_key=${ORS_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"coordinates": [[currentUser.coords.longitude, currentUser.coords.latitude], [passenger.location.longitude, passenger.location.latitude]], "units": "km"}),
        })
        .then((response) => {
            response.json()
            .then((data) => {
                setRouteDistance(data.features[0].properties.summary.distance);
                setRouteDuration((data.features[0].properties.summary.duration / 60).toFixed());
            })
            .catch((error) => { console.log(1, error); getRoute(); })
        })
        .catch((error) => { console.log(2, error); getRoute(); })
    }

    useEffect(() => {
        getRoute();
    }, [])


    let description = ``;
    if (passenger.noOfPassengers === 1) { description += `There is one passenger on this ride`; }
    else { description += `There are ${passenger.noOfPassengers} passengers on this ride.`; }
    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Text style={styles.title}>{passenger.name}</Text>
                <Card.Content>
                    <MapView
                        provider='google'
                        style={{ height: 350, borderRadius: 20, marginBottom: 10 }}
                        initialRegion={{
                            latitude: passenger.location.latitude,
                            longitude: passenger.location.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: passenger.location.latitude,
                                longitude: passenger.location.longitude,
                            }}
                            title="Pickup Location"
                            description="User's pickup location"
                        />
                    </MapView>
                </Card.Content>
                <Card.Content>
                    <Text style={styles.info}>{passenger.name} would like to be picked up at {passenger.departureTime}</Text>
                    <Text style={styles.info}>{description}</Text>
                    {passenger.searchQuery ? <Text style={styles.info}>Their search query: {passenger.searchQuery}</Text> : null}
                    {console.log(JSON.stringify(passenger))}
                    {routeDistance ? <Text style={styles.info}>Estimated driving distance: {routeDistance} km</Text> : null}
                    {routeDuration && routeDuration !== 'NaN' ? <Text style={styles.info}>Estimated time: {routeDuration} minutes</Text> : null}
                </Card.Content>
                <Button style={styles.button} mode="contained" onPress={() => {
                    console.log(`Driver accepted ${passenger.name}'s ride`)
                    acceptPassenger();
                }} contentStyle={{ padding: 10 }}>
                    Click here to accept this ride
                </Button>
            </Card>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    card: {
        paddingTop: 10,
        borderRadius: 30,
        margin: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4, },
        shadowOpacity: 0.4,
    },
    info: {
        paddingTop: 10,
        fontSize: 20,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    button: {
        borderRadius: 30,
        marginTop: 20,
        marginLeft: 50,
        marginRight: 50,
        marginBottom: 20,
    }
});


export default PassengerInfo;
