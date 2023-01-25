import React, { useRef, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import MapView, { Geojson, Marker, Polyline, UrlTile } from 'react-native-maps';
import { Button, Card, Searchbar } from 'react-native-paper';
import { ORS_API_KEY } from '@env';

const Passenger = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [coordinates, setCoordinates] = useState([
        {
            latitude: 53.38552870483014,
            longitude: -6.258832442688319,
        },
    ])
    const [geojson, setGeojson] = useState({})

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
            query = query + " Ireland";
        }
        fetch("https://nominatim.openstreetmap.org/search?q=" + query + "&format=geojson")
        .then(response => response.json())
        .then(data => {
            const long = data.features[0].geometry.coordinates[0];
            const lat = data.features[0].geometry.coordinates[1];
            setCoordinates([
                {
                    longitude: long,
                    latitude: lat,
                }
            ])
            animateMap(long, lat);
        })
        .catch(error => console.log(error));
    }


    // get width of device
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const latitudeDelta = 0.02;

    const test = () => {
        fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${coordinates[0].longitude},${coordinates[0].latitude}&end=-6.255083,53.386343`)
        .then(response => response.json())
        .then(data => {
            setGeojson(data);
        })
        .catch(error => console.log(error));
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
                        onEndEditing={() => searchAddress(searchQuery)}
                    />
                    <Card.Actions>
                        <Button onPress={test}>Find Route</Button>
                    </Card.Actions>
                    <MapView
                        style={styles.maps}
                        initialRegion={{
                            latitude: coordinates[0].latitude,
                            longitude: coordinates[0].longitude,
                            latitudeDelta: latitudeDelta,
                            longitudeDelta: latitudeDelta * (width / height),
                        }}
                        ref={mapRef}
                        >
                            <Marker coordinate={coordinates[0]} />
                            {!geojson.features ? null : <Geojson geojson={geojson} lineCap="round" strokeWidth={3} />}
                    </MapView>
                </Card.Content>
            </Card>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        margin: 15,
    },
    maps: {
        width: "100%",
        height: "80%",
    },
});

export default Passenger;
