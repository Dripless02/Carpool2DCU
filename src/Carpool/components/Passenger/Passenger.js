import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';


const Passenger = () => {

    const [coordinates] = useState([
        {
            latitude: 48.8587741,
            longitude: 2.2069771,
        },
        {
            latitude: 48.8323785,
            longitude: 2.3361663,
        },
    ])

    return (

        // <View style={styles.container}>
        // </View>

        <View style={styles.container}>
            {/* <Card mode="outlined" >
                <Card.Title title="Card Title" subtitle="Card Subtitle"/>
                <Card.Content> */}

            <MapView
                // style={{ height: 625 }}
                style={styles.maps}
                initialRegion={{
                    // latitude: 48.864716,
                    // longitude: 2.349014,
                    latitude: coordinates[0].latitude,
                    longitude: coordinates[0].longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                >
                    <UrlTile
                        urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maximumZ={19}
                    />
                    <Marker coordinate={coordinates[0]} />
                    <Marker coordinate={coordinates[1]} />
                    <Polyline
                        coordinates={coordinates}
                        strokeColor="#000"
                        strokeColors={["#7F0000"]}
                        strokeWidth={6}
                    />
            </MapView>
                {/* </Card.Content>
            </Card> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        // margin: 15,
    },
    maps: {
        width: "100%",
        height: "100%",
    },
});

export default Passenger;