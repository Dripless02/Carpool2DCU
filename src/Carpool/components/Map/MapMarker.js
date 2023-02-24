import React from "react";
import { Marker } from "react-native-maps";

const MapMarker = ({ long, lat, title, desc, colour, id }) => {
    return (
        <Marker
            coordinate={{ latitude: lat, longitude: long }}
            title={title}
            description={desc}
            pinColor={colour}
            identifier={id}
        />
    );
};

export default MapMarker;
