import { BACKEND_URL } from "@env";
import React, { useContext, useEffect, useState } from 'react'
import { View, SafeAreaView, StyleSheet, Alert } from 'react-native'
import { Button, SegmentedButtons, Text } from 'react-native-paper'
import TextInputField from "../TextInputField"
import { TimePickerModal } from 'react-native-paper-dates';
import { CurrentUserContext } from "../Context";
import InputSpinner from "react-native-input-spinner";

const AdvertiseForm = ({navigation, route}) => {
    const [currentUser] = useContext(CurrentUserContext);
    const [coords, setCoords] = useState(null);
    const [name, setName] = useState(currentUser.name);
    const [departureTime, setDepartureTime] = useState("12:15");
    const [gender, setGender] = useState("");
    const [noOfPassengers, setNoOfPassengers] = useState(1);
    const [timePickerVisible, setTimePickerVisible] = useState(false);

    const onTimePickerDismiss = () => setTimePickerVisible(false);

    const onTimePickerConfirm = ({ hours, minutes }) => {
        setTimePickerVisible(false);
        setDepartureTime(`${hours}:${Number(minutes) < 10 ? "0" + minutes : minutes}`);
    }

    const noOfPassengersChange = (text) => {
        // replace all text except numbers with empty string
        text = text.replace(/[^0-9]/g, "");
        setNoOfPassengers(text)
    }

    useEffect(() => {
        setCoords(route.params.coords);
    }, [])

    const addPassenger = () => {
        if (noOfPassengers === "" || noOfPassengers === 0) {
            Alert.alert(
                "Invalid Passenger Number",
                "Please enter a valid number of passengers",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            )
            return;
        }
        fetch(`${BACKEND_URL}/api/passengers/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({
                userID: currentUser.userID,
                name: name,
                departureTime: departureTime,
                gender: gender,
                noOfPassengers: Number(noOfPassengers),
                searchQuery: route.params.query,
                location: {
                    longitude: coords.longitude,
                    latitude: coords.latitude
                }
            }),
        })
        .then((response) => {
            if (response.status === 201) {
                console.log("Passenger added successfully");
                navigation.navigate("PassengerHomePage");
            } else {
                console.log("Passenger add failed");
            }
        })
        .catch((error) => { console.error(error); });
    }

    return (
        <SafeAreaView style={styles.container}>
            <TextInputField label="Name" onChangeText={text => setName(text)} value={name}/>
            <View style={{ paddingVertical: 10, alignItems: "center" }}>
                <Text variant="titleMedium" style={{ paddingBottom: 5 }}>Number of Passengers</Text>
                <InputSpinner
                    min={1}
                    max={4}
                    step={1}
                    value={noOfPassengers}
                    onChange={setNoOfPassengers}
                    skin="paper"
                    rounded={false}
                    style={{ marginBottom: 10 }}
                />
            </View>
            <View style={{ marginHorizontal: 20, marginVertical: 10, alignItems: "center"}}>
                <Text variant="displayLarge" >{departureTime}</Text>
                <Button mode="outlined" uppercase={false} onPress={() => setTimePickerVisible(true)} style={{width: 200}}>
                    Pick Time
                </Button>
                <TimePickerModal
                    visible={timePickerVisible}
                    onDismiss={onTimePickerDismiss}
                    onConfirm={onTimePickerConfirm}
                    hours={12}
                    minutes={15}
                    use24HourClock
                />
            </View>
            <View style={{ marginHorizontal: 20, marginVertical: 10, alignItems: "center"}}>
                <Text variant="titleMedium" style={{ paddingBottom: 5 }}>Gender</Text>
                <SegmentedButtons
                    value={gender}
                    onValueChange={setGender}
                    buttons={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                        { value: "Other", label: "Other" },
                    ]}
                    style={{marginBottom: 5}}
                />
            </View>

            <Button
                mode="contained"
                onPress={addPassenger}
                contentStyle={{ padding: 15 }}
                style={{ margin: 10 }}
            >
                Send
            </Button>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 15,
    },
})

export default AdvertiseForm
