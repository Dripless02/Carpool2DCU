import React, { useRef, useState } from 'react';
import { Alert, Dimensions, SafeAreaView, StyleSheet } from 'react-native';
import MapView, { Geojson, Marker } from 'react-native-maps';
import { Button, Card, Searchbar } from 'react-native-paper';
import { ORS_API_KEY } from '@env';

const Passenger = () => {
    const dcuCoords = { latitude: 53.3858512588805, longitude: -6.255816917481834 };
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const [searchQuery, setSearchQuery] = useState("");
    const [coordinates, setCoordinates] = useState({ latitude: dcuCoords.latitude, longitude: dcuCoords.longitude, })
    const [geojson, setGeojson] = useState({})

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
        if (!query.toLowerCase().includes("Ireland") || !query.toLowerCase().includes("IE")) {
            query = query + ", Ireland";
        }
        fetch("https://nominatim.openstreetmap.org/search?q=" + query + "&format=geojson")
        .then(response => response.json())
        .then(data => {
            if (data.features.length === 0) {
                Alert.alert(
                    "No results found",
                    `No results found with the serach query: ${query.replace(", Ireland", "") }`,
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                    { cancelable: false }
                )
                return;
            }
            const long = data.features[0].geometry.coordinates[0];
            const lat = data.features[0].geometry.coordinates[1];
            setCoordinates({ longitude: long, latitude: lat})
            animateMap(long, lat);
            setButtonDisabled(false);
        })
        .catch(error => console.log(error));
    }

    const fitMapToMarkers = () =>  mapRef.current.fitToSuppliedMarkers(["dcu", "query"], { edgePadding: { top: 65, right: 50, bottom: 100, left: 50 } });

    const getRoute = () => {
        // if the user has already searched for directions to a location and the new location is the same as the previous location, then don't fetch the route again
        if (geojson.metadata && geojson.metadata.query.coordinates[0][0] === coordinates.longitude && geojson.metadata.query.coordinates[0][1] === coordinates.latitude) {
            fitMapToMarkers();
            return;
        }

        fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${coordinates.longitude},${coordinates.latitude}&end=-6.255083,53.386343`)
        .then(response => response.json())
        .then(data => {
            setGeojson(data);
        })
        .catch(error => console.log(error));

        fitMapToMarkers();
    }

    return (
        <SafeAreaView style={styles.container}>
            <Card mode="elevated" >
                <Card.Content>
                    <Searchbar
                        placeholder='Enter Address'
                        style={{ margin: 10 }}
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        onSubmitEditing={() => searchAddress(searchQuery)}
                        elevation={5}
                    />
                    <MapView
                        provider='google'
                        style={styles.maps}
                        initialRegion={{
                            latitude: coordinates.latitude,
                            longitude: coordinates.longitude,
                            latitudeDelta: latitudeDelta,
                            longitudeDelta: latitudeDelta * (width / height),
                        }}
                        ref={mapRef}
                        >
                            <Marker coordinate={dcuCoords} identifier="dcu" />
                            {coordinates.latitude === dcuCoords.latitude && coordinates.longitude === dcuCoords.longitude ? null : <Marker coordinate={coordinates} identifier="query"/>}
                            {!geojson.features ? null : <Geojson geojson={geojson} lineCap="round" strokeWidth={3} />}
                    </MapView>
                    <Button mode='contained' onPress={getRoute} disabled={buttonDisabled} style={styles.button} >Preview Route</Button>
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
