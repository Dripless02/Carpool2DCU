import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';


const Passenger = () => {

    const [coordinates] = useState([
        {
            latitude: 53.38552870483014,
            longitude: -6.258832442688319,
        },
        {
            latitude: 53.34985446577282,
            longitude: -6.2602212965815776,
        },
    ])

    // get width of device
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    console.log("width: " + width);
    const latitudeDelta = 0.02;

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
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: latitudeDelta * (width / height),

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