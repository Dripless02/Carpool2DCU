import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, SafeAreaView, StyleSheet } from 'react-native';
import MapView, { Geojson, Marker } from 'react-native-maps';
import { Card, Searchbar, SegmentedButtons } from 'react-native-paper';
import { ORS_API_KEY, GEOCODE_API_KEY } from '@env';

const Passenger = ({ navigation }) => {
    const [buttonDisabled, setButtonDisabled] = useState(true)
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
    })
    const [geojson, setGeojson] = useState({})
    const [buttonValue, setButtonValue] = useState("");

    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const latitudeDelta = 0.02;

    const mapRef = useRef(null);
    const animateMap = (long, lat) => {
        mapRef.current.animateToRegion({
            latitude: lat,
            longitude: long,
            latitudeDelta: latitudeDelta,
            longitudeDelta: latitudeDelta * (width / height),
        }, 3000);
    }

    const onChangeSearch = query => setSearchQuery(query);

    const searchAddress = query => {
        setGeojson({});
        setCoordinates({ ...coordinates, query: { longitude: 0, latitude: 0 } })
        if (query === "") {
            Alert.alert(
                "No query entered",
                "Please enter an address to search for",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            )
            animateMap(coordinates.dcu.longitude, coordinates.dcu.latitude);
            setButtonDisabled(true);
            return;
        }
        if (!query.toLowerCase().includes("ireland") || !query.toLowerCase().includes("ie")) {
            query = query + ", Ireland";
        }
        fetch(`http://dev.virtualearth.net/REST/v1/Locations?query=${query}&maxResults=1&key=${GEOCODE_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.resourceSets[0].estimatedTotal === 0 || data.resourceSets[0].resources[0].entityType === "CountryRegion") {
                Alert.alert(
                    "No results found",
                    `No results found with the serach query: ${query.replace(", Ireland", "") }`,
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                    { cancelable: false }
                )
                animateMap(coordinates.dcu.longitude, coordinates.dcu.latitude);
                setButtonDisabled(true);
                return;
            }
            const lat = data.resourceSets[0].resources[0].point.coordinates[0];
            const long = data.resourceSets[0].resources[0].point.coordinates[1];
            setCoordinates({ ...coordinates, query: { longitude: long, latitude: lat } })
            animateMap(long, lat);
            setButtonDisabled(false);
        })
        .catch(error => console.log(error));
    }

    const fitMapToMarkers = () => mapRef.current.fitToSuppliedMarkers(["dcu", "query"], { edgePadding: { top: 65, right: 50, bottom: 100, left: 50 } });

    const getRoute = () => {
        // if the user has already searched for directions to a location and the new location is the same as the previous location, then don't fetch the route again
        if (geojson.metadata && geojson.metadata.query.coordinates[0][0] === coordinates.query.longitude && geojson.metadata.query.coordinates[0][1] === coordinates.query.latitude) {
            fitMapToMarkers();
            return;
        }

        fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${coordinates.query.longitude},${coordinates.query.latitude}&end=-6.255083,53.386343`)
        .then(response => response.json())
        .then(data => setGeojson(data))
        .catch(error => console.log(error));
    }

    useEffect(() => {
        getRoute();
    }, [coordinates])

    useEffect(() => {
        if (coordinates.query.latitude === 0 && coordinates.query.longitude === 0) {
            return;
        }
        fitMapToMarkers();
    }, [geojson])

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
                            <Marker coordinate={coordinates.dcu} identifier="dcu" />
                            {coordinates.query.latitude === 0 && coordinates.query.longitude === 0 ? null : <Marker coordinate={coordinates.query} identifier="query" pinColor="blue"/>}
                            {!geojson.features ? null : <Geojson geojson={geojson} lineCap="round" strokeWidth={3} />}
                    </MapView>
                    <SegmentedButtons
                        value={buttonValue}
                        onValueChange={setButtonValue}
                        buttons={[
                            { label: "Preview Route", value: "preview", onPress: getRoute, style: { backgroundColor: "#9375ee" }, disabled: buttonDisabled },
                            { label: "Next", value: "next", onPress: () => navigation.navigate("PassengerAdvertise", coordinates.query), style: { backgroundColor: "#01ffdf" }, disabled: buttonDisabled }
                        ]}
                        style={styles.button}
                    />
                </Card.Content>
            </Card>
        </SafeAreaView>
    );
}

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
    }
});

export default Passenger;
