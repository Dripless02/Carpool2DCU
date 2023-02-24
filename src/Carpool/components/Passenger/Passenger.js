import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, SafeAreaView, StyleSheet } from "react-native";
import MapView, { Geojson } from "react-native-maps";
import { Button, Card, Searchbar } from "react-native-paper";
import { ORS_API_KEY, GEOCODE_API_KEY } from "@env";
import MapMarker from "../Map/MapMarker";

const Passenger = ({ navigation }) => {
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [coordinates, setCoordinates] = useState({
        dcu: {
            latitude: 53.38552870483014,
            longitude: -6.258832442688319,
        },
        query: {
            latitude: 0,
            longitude: 0,
        }
    });
    const [geojson, setGeojson] = useState({});

    // Ref to the map
    const mapRef = useRef(null);

    // Get the width and height of the screen
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height;

    const latitudeDelta = 0.02;

    // Function to animate the map to the given coordinates
    const animateMap = (long, lat) => {
        mapRef.current.animateToRegion({
            latitude: lat,
            longitude: long,
            latitudeDelta: latitudeDelta,
            longitudeDelta: latitudeDelta * (width / height),
        }, 3000);
    };

    const onChangeSearch = query => setSearchQuery(query);

    // Function to search for an address and animate the map to the coordinates of the searched address
    const searchAddress = query => {
        // Reset the geojson object and the coordinates of the searched location
        setGeojson({});
        setCoordinates({ ...coordinates, query: { longitude: 0, latitude: 0 } });

        // If the query is empty, alert the user that they need to enter an address to search for
        if (query === "") {
            Alert.alert(
                "No query entered",
                "Please enter an address to search for",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            );
            animateMap(coordinates.dcu.longitude, coordinates.dcu.latitude);
            setButtonDisabled(true);
            return;
        }

        // If the query does not contain Ireland or IE, add Ireland to the end of the query
        if (!query.toLowerCase().includes("ireland") || !query.toLowerCase().includes("ie")) {
            query = query + ", Ireland";
        }

        // Fetch the coordinates of the searched address
        fetch(`http://dev.virtualearth.net/REST/v1/Locations?query=${query}&maxResults=1&key=${GEOCODE_API_KEY}`)
            .then(response => response.json())
            .then(data => {
            // If no results are found or the result is a country, alert the user that no results were found
                if (data.resourceSets[0].estimatedTotal === 0 || data.resourceSets[0].resources[0].entityType === "CountryRegion") {
                    Alert.alert(
                        "No results found",
                        `No results found with the serach query: ${query.replace(", Ireland", "") }`,
                        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                        { cancelable: false }
                    );
                    animateMap(coordinates.dcu.longitude, coordinates.dcu.latitude);
                    setButtonDisabled(true);
                    return;
                }
                // Set the coordinates of the searched location and animate the map to the searched location
                const lat = data.resourceSets[0].resources[0].point.coordinates[0];
                const long = data.resourceSets[0].resources[0].point.coordinates[1];
                setCoordinates({ ...coordinates, query: { longitude: long, latitude: lat } });
                animateMap(long, lat);
                setButtonDisabled(false);
            })
            .catch(error => console.log(error));
    };

    const fitMapToMarkers = () => mapRef.current.fitToSuppliedMarkers(["dcu", "query"], { edgePadding: { top: 65, right: 50, bottom: 100, left: 50 } });

    // Function to get the route from the user's location to the searched location
    const getRoute = () => {
        // If the user has already searched for directions to a location and the new location is the same as the previous location, then don't fetch the route again
        if (geojson.metadata && geojson.metadata.query.coordinates[0][0] === coordinates.query.longitude && geojson.metadata.query.coordinates[0][1] === coordinates.query.latitude) {
            fitMapToMarkers();
            return;
        }

        // Fetch the route from the user's location to the searched location and set the geojson object to the response
        fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${coordinates.query.longitude},${coordinates.query.latitude}&end=-6.255083,53.386343`)
            .then(response => response.json())
            .then(data => setGeojson(data))
            .catch(error => console.log(error));
    };

    // Get the route when the coordinates of the searched location change
    useEffect(() => {
        getRoute();
    }, [coordinates]);

    // Fit the map to the markers when the geojson object changes
    useEffect(() => {
        if (coordinates.query.latitude === 0 && coordinates.query.longitude === 0) {
            return;
        }
        fitMapToMarkers();
    }, [geojson]);

    return (
        <SafeAreaView style={styles.container}>
            <Card mode="elevated" >
                <Card.Content>
                    <Searchbar
                        placeholder='Enter Pickup Address'
                        style={{ margin: 10 }}
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        onSubmitEditing={() => searchAddress(searchQuery)}
                        elevation={5}
                    />
                    <MapView
                        provider="google"
                        style={styles.maps}
                        initialRegion={{
                            latitude: coordinates.dcu.latitude,
                            longitude: coordinates.dcu.longitude,
                            latitudeDelta: latitudeDelta,
                            longitudeDelta: latitudeDelta * (width / height),
                        }}
                        ref={mapRef}
                    >
                        <MapMarker long={coordinates.dcu.longitude} lat={coordinates.dcu.latitude} id="dcu" />
                        {coordinates.query.latitude === 0 && coordinates.query.longitude === 0 ? null : <MapMarker long={coordinates.query.longitude} lat={coordinates.query.latitude} id="query" colour="blue"/>}
                        {!geojson.features ? null : <Geojson geojson={geojson} lineCap="round" strokeWidth={3} />}
                    </MapView>
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => navigation.navigate("PassengerAdvertise", {coords: coordinates.query, query: searchQuery})}
                        disabled={buttonDisabled}
                        contentStyle={styles.buttonContent}
                        labelStyle={styles.buttonLabel}
                    >
                        Next
                    </Button>
                </Card.Content>
            </Card>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 15,
    },
    maps: {
        marginVertical: 20,
        width: "100%",
        height: "85%",
    },
    button: {
        position: "absolute",
        alignSelf: "center",
        bottom: 50
    },
    buttonContent: {
        width: "100%",
        paddingTop: 10,
        paddingBottom: 5
    },
    buttonLabel: {
        fontSize: 20,
        paddingBottom: 0
    }
});

export default Passenger;
