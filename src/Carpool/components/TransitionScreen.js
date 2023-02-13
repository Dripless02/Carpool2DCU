import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import TransitionCard from './TransitionCard';
import { CurrentUserContext } from "./Context";
import { BACKEND_URL } from "@env";

const TransitionScreen = ({ navigation }) => {
    const [currentUser, setCurrentUser] = React.useContext(CurrentUserContext);

    const getDriverID = () => {
        fetch(`${BACKEND_URL}/api/driver/getDriverID/${currentUser.userID}`)
            .then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        console.log("driverID =", data);
                        setCurrentUser({ ...currentUser, driverID: data });
                    })
                    .catch((error) => {
                        console.log("Error getting driverID", error);
                    });
                }
            })
            .catch((error) => {
                console.log("Error getting driverID", error);
            });
    }

    useEffect(() => {
        getDriverID();
    }, [currentUser.userID])

    return (
        <View style={styles.container}>
            <TransitionCard title="Driver" description="DriverHomePage" navigation={navigation} />
            <TransitionCard title="Passenger" description="PassengerHomePage" navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
    }
});

export default TransitionScreen;
