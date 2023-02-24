import { BACKEND_URL } from "@env";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Platform, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Dialog, List, Portal, SegmentedButtons, Text } from "react-native-paper";
import InputSpinner from "react-native-input-spinner";
import { CurrentUserContext } from "../Context";

// PassengerList component
const PassengerList = ({ navigation }) => {
    const [currentUser] = useContext(CurrentUserContext);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [passengers, setPassengers] = useState([]);
    const [sortDialogVisible, setSortDialogVisible] = useState(false);
    const [filterDialogVisible, setFilterDialogVisible] = useState(false);
    const [genderButtonValue, setGenderButtonValue] = useState("All");
    const [maxPassengersButtonValue, setMaxPassengersButtonValue] = useState(4);
    const [distanceButtonValue, setDistanceButtonValue] = useState(100);

    const showSortDialog = () => setSortDialogVisible(true);
    const hideSortDialog = () => setSortDialogVisible(false);

    const showFilterDialog = () => setFilterDialogVisible(true);
    const hideFilterDialog = () => setFilterDialogVisible(false);
    // useEffect hook
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            getPassengers();
            setRefreshing(false);
        }, 1000);
    }, []);
    // getPassengers function
    const getPassengers = () => {
        fetch(`${BACKEND_URL}/api/passengers/getAll?userID=${currentUser.userID}`)
            .then((response) => response.json())
            .then((json) => { setPassengers(sortPassengersOnDistanceToDriver(json)); setIsLoading(false); })
            .catch((error) => { console.error(error); setIsLoading(false); });
    };
    // sortPassengersOnDistanceToDriver function
    const sortPassengersOnDistanceToDriver = (passengers) => {
        passengers.map((passenger) => {
            // calculate the distance between the passenger and the driver
            passenger.distanceToDriver = getDistance(passenger.location.latitude, passenger.location.longitude, currentUser.coords.latitude, currentUser.coords.longitude);
        });
        // sort the passengers by distance to driver
        passengers.sort((a, b) => a.distanceToDriver - b.distanceToDriver);

        return passengers;
    };
    // resetFilters function
    const resetFilters = () => {
        setGenderButtonValue("All");
        setMaxPassengersButtonValue(4);
        setDistanceButtonValue(100);
        hideFilterDialog();
    };
    // filterPassengers function
    const getDistance = (lat1, lon1, lat2, lon2) => {
        // use the haversine formula to calculate the distance between two coordinates https://stackoverflow.com/q/18883601
        const R = 6371;
        const deg2rad = (deg) => deg * (Math.PI / 180);
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };
    // useEffect hook
    useEffect(() => {
        getPassengers();
    }, []);

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {isLoading ? null :
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <SegmentedButtons
                        buttons={[
                            { value: "sort", label: "Sort", icon: "sort", style: { backgroundColor: "#E8DEF8" } },
                            { value: "filter", label: "Filter", icon: "filter", style: { backgroundColor: "#E8DEF8" } }]}
                        onValueChange={(value) => {
                            if (value === "sort") showSortDialog();
                            else showFilterDialog();
                        }}
                        style={{ marginBottom: 25 }}
                    />
                </View>
            }

            {isLoading ? <ActivityIndicator animating={true} color="#f452" size="large" /> : (
                passengers.filter((passenger) => {
                    if (genderButtonValue === "All") return true;
                    return passenger.gender == genderButtonValue;
                }).filter((passenger) => {
                    return passenger.noOfPassengers <= maxPassengersButtonValue;
                }).filter((passenger) => {
                    return passenger.distanceToDriver <= distanceButtonValue;
                }).map((passenger, index) => {
                    let description = "";
                    if (passenger.noOfPassengers === undefined || passenger.noOfPassengers === 1) { passenger.noOfPassengers = 1; description += `${passenger.noOfPassengers} passenger`; }
                    else description += `${passenger.noOfPassengers} passengers`;

                    description += `, pick up at ${passenger.departureTime}`;
                    return (
                        <List.Item
                            key={index}
                            onPress={() => {
                                navigation.navigate("PassengerInfo", { passenger });
                                console.log(`user on ${Platform.OS} pressed ${passenger.name}'s card`);
                            }}
                            title={passenger.name}
                            description={description}
                            descriptionNumberOfLines={2}
                            left={props => <List.Icon {...props} icon="seat-passenger" />}
                            style={{ marginBottom: 10, borderRadius: 10, borderWidth: .6, borderColor: "#000" }}
                        />
                    );
                })
            )}
            <Portal>
                <Dialog visible={sortDialogVisible} onDismiss={hideSortDialog}>
                    <Dialog.Title>Sort by</Dialog.Title>
                    <Dialog.Content>
                        <List.Item
                            title="Distance from you"
                            onPress={() => { setPassengers(sortPassengersOnDistanceToDriver(passengers)); hideSortDialog(); }}
                            left={props => <List.Icon {...props} icon="map-marker-distance" />}
                        />
                        <List.Item
                            title="Name"
                            onPress={() => { setPassengers(passengers.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))); hideSortDialog(); }}
                            left={props => <List.Icon {...props} icon="account" />}
                        />
                        <List.Item
                            title="Departure time"
                            onPress={() => { setPassengers(passengers.sort((a, b) => a.departureTime.localeCompare(b.departureTime))); hideSortDialog(); }}
                            left={props => <List.Icon {...props} icon="clock" />}
                        />
                        <Dialog.Actions>
                            <Button onPress={hideSortDialog}>Cancel</Button>
                        </Dialog.Actions>
                    </Dialog.Content>
                </Dialog>


                <Dialog visible={filterDialogVisible} onDismiss={hideFilterDialog}>
                    <Dialog.Title>Filter by</Dialog.Title>
                    <Dialog.Content>
                        <View style={{ paddingVertical: 10, alignItems: "center" }}>
                            <Text variant="titleMedium" style={{ paddingBottom: 5 }}>Gender</Text>
                            <SegmentedButtons
                                value={genderButtonValue}
                                onValueChange={setGenderButtonValue}
                                buttons={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }]}
                            />
                        </View>
                        <View style={{ paddingVertical: 10, alignItems: "center" }}>
                            <Text variant="titleMedium" style={{ paddingBottom: 5 }}>Max number of passengers</Text>
                            <InputSpinner
                                min={1}
                                max={4}
                                step={1}
                                value={maxPassengersButtonValue}
                                onChange={setMaxPassengersButtonValue}
                                skin="paper"
                                rounded={false}
                            />
                        </View>
                        <View style={{ paddingVertical: 10, alignItems: "center" }}>
                            <Text variant="titleMedium" style={{ paddingBottom: 5 }}>Radius (km)</Text>
                            <InputSpinner
                                min={0}
                                max={500}
                                step={50}
                                value={distanceButtonValue}
                                onChange={setDistanceButtonValue}
                                skin="paper"
                                rounded={false}
                            />
                        </View>
                        <Dialog.Actions>
                            <Button onPress={resetFilters}>Remove Filters</Button>
                            <Button onPress={hideFilterDialog}>Close</Button>
                        </Dialog.Actions>
                    </Dialog.Content>
                </Dialog>
            </Portal>
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
