import { BACKEND_URL, GEOCODE_API_KEY } from "@env";
import React, { useContext, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, HelperText } from "react-native-paper";
import { LoginContext, CurrentUserContext } from "./Context";
import TextInputField from "./TextInputField";

const RegisterScreen = () => {
    const [, setLoggedIn] = useContext(LoginContext);
    const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [invalidAddress, setInvalidAddress] = useState(false);

    // Function to check if email is a valid DCU email
    const checkValidEmail = (email) => {
        if (email.match(/^([\w.%+-]+)@(mail.)*(dcu\.ie)/i)) {
            return true;
        } else if (email === "") {
            return false;
        } else {
            return false;
        }
    };

    // Function to check if password is at least 8 characters
    const checkValidPassword = (password) => {
        if (password.length >= 8) {
            return true;
        } else if (password === "") {
            return false;
        } else {
            return false;
        }
    };

    // Function to check if string is at least 3 characters and contains only letters, numbers, spaces, commas and full stops
    const checkValidString = (string) => {
        if (string.match(/^[\w ,.]{3,}$/i)) {
            return true;
        }
        return false;
    };

    // Function to register the user
    const register = async () => {
        const coords = { latitude: 0, longitude: 0 };
        // If the email, password, name and address are valid, send a POST request to the backend to register the user
        if (!checkValidEmail(email) || !checkValidPassword(password)|| !checkValidString(name) || !checkValidString(address)) {
            return;
        }

        // If the address does not contain "Ireland", append "Ireland" to the end of the address
        if (!address.toLowerCase().includes("ireland")) {
            setAddress(address + ", Ireland");
        }

        // Get the coordinates of the address
        const response = await fetch(`https://dev.virtualearth.net/REST/v1/Locations?query=${address}&key=${GEOCODE_API_KEY}`);
        const geoData = await response.json();

        // If the address is invalid, set invalidAddress flag to true
        if (geoData.resourceSets[0].estimatedTotal === 0) {
            setInvalidAddress(true);
            return;
        }

        // Store the coordinates of the address in the coords object
        coords.latitude = geoData.resourceSets[0].resources[0].point.coordinates[0];
        coords.longitude = geoData.resourceSets[0].resources[0].point.coordinates[1];

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
            // If the registration is successful, set the current user and set the loggedIn flag to true
                if (response.ok) {
                    console.log("Registration successful");
                    response.json().then(data => {
                        setCurrentUser({
                            ...currentUser,
                            userID: data.result._id,
                            name: data.result.name,
                            email: data.result.email,
                            address: data.result.address,
                            coords: data.result.coordinates
                        });
                    });
                    setLoggedIn(true);
                } else {
                    console.log("Registration failed");
                    response.json().then(data => console.log(data));
                }
            })
            .catch((error) => { console.error(error); });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={{width: "80%"}}>
                <TextInputField label="Name" onChangeText={text => setName(text)} />
                {name.length > 0 && !name.match(/^[\w ,.]{3,}$/i) ? <HelperText type="info">Name must be longer than 3 characters</HelperText> : null}

                <TextInputField label="Email" type="email-address" onChangeText={text => setEmail(text)} />
                {email.length > 0 && !email.match(/^([\w.%+-]+)@(mail.)*(dcu\.ie)/i) ? <HelperText type="info">Email is invalid</HelperText> : null}

                <TextInputField label="Password" secureText={true} onChangeText={text => setPassword(text)} />
                {password.length < 8 ? <HelperText type="info" >Password must be at least 8 characters</HelperText> : null}

                <TextInputField label="Address" onChangeText={text => setAddress(text)} />
                {address.length > 0 && !address.match(/^[\w ,.]{5,}$/i)? <HelperText type="info">Address is required</HelperText> : null}
                {invalidAddress ? <HelperText type="error">Address is invalid</HelperText> : null}

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
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container : {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E7DCEB",
    }
});

export default RegisterScreen;
