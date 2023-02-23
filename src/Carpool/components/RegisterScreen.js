import { BACKEND_URL, GEOCODE_API_KEY } from "@env";
import React, { useContext, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button, HelperText } from "react-native-paper";
import { LoginContext, CurrentUserContext } from "./Context";
import TextInputField from "./TextInputField";

const RegisterScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [loggedIn, setLoggedIn] = useContext(LoginContext);
    const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
    const [invalidAddress, setInvalidAddress] = useState(false);

    const checkValidEmail = (email) => {
        if (email.match(/^([\w.%+-]+)(@mail\.dcu\.ie)/i)) {
            return true;
        } else if (email === "") {
            return false;
        } else {
            return false;
        }
    };

    const checkValidPassword = (password) => {
        if (password.length >= 8) {
            return true;
        } else if (password === "") {
            return false;
        } else {
            return false;
        }
    };

    const checkValidString = (string) => {
        if (string.match(/^[\w ,.]{3,}$/i)) {
            return true;
        }
        return false;
    };

    const register = async () => {
        const coords = { latitude: 0, longitude: 0 }
        if (!checkValidEmail(email) || !checkValidPassword(password)|| !checkValidString(name) || !checkValidString(address)) {
            return;
        }

        if (!address.toLowerCase().includes("ireland")) {
            setAddress(address + ", Ireland")
        }

        const response = await fetch(`https://dev.virtualearth.net/REST/v1/Locations?query=${address}&key=${GEOCODE_API_KEY}`);
        const geoData = await response.json();

        if (geoData.resourceSets[0].estimatedTotal === 0) {
            setInvalidAddress(true);
            return;
        }

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
                    })
                })
                setLoggedIn(true);
            } else {
                console.log("Registration failed");
                response.json().then(data => console.log(data));
            }
        })
        .catch((error) => { console.error(error); });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{width: "80%"}}>
                <TextInputField label="Name" onChangeText={text => setName(text)} />
                {name.length > 0 && !name.match(/^[a-zA-Z0-9 ,.]{3,}$/) ? <HelperText type="info">Name must be longer than 3 characters</HelperText> : null}

                <TextInputField label="Email" type="email-address" onChangeText={text => setEmail(text)} />
                {email.length > 0 && !email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? <HelperText type="info">Email is invalid</HelperText> : null}

                <TextInputField label="Password" secureText={true} onChangeText={text => setPassword(text)} />
                {password.length < 8 ? <HelperText type="info" >Password must be at least 8 characters</HelperText> : null}

                <TextInputField label="Address" onChangeText={text => setAddress(text)} />
                {address.length > 0 && !address.match(/^[a-zA-Z0-9 ,.]{3,}$/)? <HelperText type="info">Address is required</HelperText> : null}
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
