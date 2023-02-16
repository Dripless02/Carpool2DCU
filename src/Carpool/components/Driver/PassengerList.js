import { BACKEND_URL } from "@env";
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, RefreshControl, ScrollView, StyleSheet} from 'react-native';
import { ActivityIndicator, List } from 'react-native-paper';
import { CurrentUserContext } from "../Context";


const PassengerList = ({navigation}) => {
    const [currentUser] = React.useContext(CurrentUserContext);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [passengers, setPassengers] = useState([]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            getPassengers();
            setRefreshing(false);
        }, 1000);
    }, [])

    const getPassengers = () => {
        fetch(`${BACKEND_URL}/api/passengers/getAll`)
        .then((response) => response.json())
        .then((json) => { setPassengers(sortPassengersOnDistanceToDriver(json)); setIsLoading(false); })
        .catch((error) => { console.error(error); });
    };

    const sortPassengersOnDistanceToDriver = (passengers) => {
        passengers.sort((a, b) => {
            const aDistance = Math.sqrt(Math.pow(a.location.latitude - currentUser.coords.latitude, 2) + Math.pow(a.location.longitude - currentUser.coords.longitude, 2));
            const bDistance = Math.sqrt(Math.pow(b.location.latitude - currentUser.coords.latitude, 2) + Math.pow(b.location.longitude - currentUser.coords.longitude, 2));
            return aDistance - bDistance;
        });
        return passengers;
    }

    useEffect(() => {
        getPassengers();
    }, [] );

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {isLoading ? <ActivityIndicator animating={true} color="#f452" size="large" /> : (
                passengers.map((passenger, index) => {
                    let description = ``;
                    if (passenger.noOfPassengers === undefined || passenger.noOfPassengers === 1) {passenger.noOfPassengers = 1; description += `${passenger.noOfPassengers} passenger`;}
                    else description += `${passenger.noOfPassengers} passengers`;

                    description += `, leaving at ${passenger.departureTime}`;
                    return (
                        <List.Item
                            key={index}
                            onPress={() => {navigation.navigate('PassengerInfo', {passenger});
                            console.log(`user on ${Platform.OS} pressed ${passenger.name}'s card`);
                            }}
                            title={passenger.name}
                            description={description}
                            descriptionNumberOfLines={2}
                            left={props => <List.Icon {...props} icon="seat-passenger" />}
                            style={{marginBottom: 10, borderRadius: 10, borderWidth: .6, borderColor: '#000'}}
                        />
                    );
                })
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
    }
});

export default PassengerList;
