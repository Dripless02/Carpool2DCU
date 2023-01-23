import { BACKEND_URL } from "@env";
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, RefreshControl, ScrollView, StyleSheet} from 'react-native';
import { ActivityIndicator, List } from 'react-native-paper';


const PassengerList = () => {
    // console.log(BACKEND_URL);
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

    const getPassengers = async () => {
        try {
            let response = await fetch(`${BACKEND_URL}/api/getAll`);
            let json = await response.json();
            setPassengers(json);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

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
                            onPress={() => console.log(`user on ${Platform.OS} pressed ${passenger.name}'s card`)}
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