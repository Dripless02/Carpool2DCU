import { BACKEND_URL, GEOCODE_API_KEY } from "@env";
import React, { useContext, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { LoginContext, CurrentUserContext } from "./Context";
import TextInputField from "./TextInputField";

const RegisterScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [loggedIn, setLoggedIn] = useContext(LoginContext);
    const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

    const checkValidEmail = (email) => {
        if (email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            console.log("email is valid");
            return true;
        } else if (email === "") {
            console.log("email is empty");
            return false;
        } else {
            console.log("email is invalid");
            return false;
        }
    };

    const checkValidPassword = (password) => {
        if (password.length >= 8) {
            console.log("password is valid");
            return true;
        } else if (password === "") {
            console.log("password is empty");
            return false;
        } else {
            console.log("password is too short");
            return false;
        }
    };

    const createDriver = (userID) => {
        fetch(`${BACKEND_URL}/api/driver/add/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ userID: userID }),
        })
    }

    const register = async () => {
        console.log("Register Button Pressed");
        const coords = { latitude: 0, longitude: 0 }
        const validEmail = checkValidEmail(email);
        const validPassword = checkValidPassword(password);

        if (!address.toLowerCase().includes("ireland")) {
            setAddress(address + ", Ireland")
        }

        const response = await fetch(`https://dev.virtualearth.net/REST/v1/Locations?query=${address}&key=${GEOCODE_API_KEY}`);
        const geoData = await response.json();

        if (geoData.resourceSets[0].estimatedTotal === 0) {
            console.log("Address is invalid");
            return;
        }

        coords.latitude = geoData.resourceSets[0].resources[0].point.coordinates[0];
        coords.longitude = geoData.resourceSets[0].resources[0].point.coordinates[1];

        if (validEmail && validPassword && name !== "" && address !== "") {
            fetch(`${BACKEND_URL}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    address: address,
                    coordinates: coords
                }),
            })
            .then((response) => {
                if (response.ok) {
                    console.log("Registration successful");
                    response.json().then(data => {
                            setCurrentUser({
                            ...currentUser,
                            userID: data.result._id,
                            name: data.result.name,
                            email: data.result.email,
                            address: data.result.address,
                            coordinates: data.result.coordinates
                        })
                        createDriver(data.result._id);
                    });
                    setLoggedIn(true);
                } else {
                    console.log("Registration failed");
                    response.json().then(data => console.log(data));
                }
            })
            .catch((error) => { console.error(error); })
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{width: "80%"}}>
                <TextInputField label="Name" onChangeText={text => setName(text)} />
                <TextInputField label="Email" type="email-address" onChangeText={text => setEmail(text)} />
                <TextInputField label="Password" secureText={true} onChangeText={text => setPassword(text)} />
                <TextInputField label="Address" onChangeText={text => setAddress(text)} />
                <View style={{alignItems: "center"}}>
                    <Button
                        style= {{marginTop: 20, width: 200}}
                        mode="contained"
                        onPress={() => register()}
                    >
                        Register
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E7DCEB',
    }
})

export default RegisterScreen;
