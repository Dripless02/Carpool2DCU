import { BACKEND_URL } from "@env";
import React, { useContext, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, HelperText } from "react-native-paper";
import { LoginContext, CurrentUserContext } from "./Context";
import TextInputField from "./TextInputField";

function LoginScreen({ navigation }) {
    const [, setLoggedIn] = useContext(LoginContext);
    const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [failedLogin, setFailedLogin] = useState(false);

    // Function to check if email is a valid DCU email
    const checkValidEmail = email => {
        if (email.match(/^([\w.%+-]+)@(mail.)*(dcu\.ie)/i)) {
            return true;
        }
        if (email === "") {
            return false;
        }
        return false;
    };

    // Function to check if password is at least 8 characters
    const checkValidPassword = password => {
        if (password.length >= 8) {
            return true;
        }
        if (password === "") {
            return false;
        }
        return false;
    };

    // Function to get the user's details from the database
    const getUserDetails = userID => {
        // Get the user's details from the database
        fetch(`${BACKEND_URL}/api/getUserDetails/${userID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then(response => {
                // If the user's details were retrieved successfully, set the current user's details to the retrieved details
                if (response.ok) {
                    response.json().then(data => {
                        setCurrentUser({
                            ...currentUser,
                            userID,
                            name: data.name,
                            email: data.email,
                            address: data.address,
                            coords: data.coordinates,
                        });
                    });
                } else {
                    console.log("User details retrieval failed");
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    // Function to log the user in
    const login = () => {
        // If the email and password are valid, send a POST request to the backend to log the user in
        if (checkValidEmail(email) && checkValidPassword(password)) {
            fetch(`${BACKEND_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })
                .then(response => {
                    // If the login was successful, get the user's details from the database and set the user as logged in
                    if (response.ok) {
                        response.json().then(data => {
                            getUserDetails(data.id);
                        });
                        console.log("Login successful");
                        setLoggedIn(true);
                    } else {
                        // If the login was unsuccessful, set the failed login flag to true to display an error message
                        setFailedLogin(true);
                        console.log("Login failed");
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={{ width: "80%" }}>

                <TextInputField
                    label="Email"
                    type="email-address"
                    onChangeText={text => setEmail(text)}
                    autoCapitalize="none"
                />
                {email.length > 0 && !email.match(/^([\w.%+-]+)@(mail.)*(dcu\.ie)/i) ? (
                    <HelperText type="info">Email is invalid</HelperText>
                ) : null}

                <TextInputField
                    label="Password"
                    secureText
                    onChangeText={text => setPassword(text)}
                    autoCapitalize="none"
                />
                {password.length > 1 && password.length < 8 ? (
                    <HelperText type="info">Password must be at least 8 characters</HelperText>
                ) : null}

                <View style={{ alignItems: "center" }}>
                    {failedLogin ? (
                        <HelperText type="error">Incorrect Email or Password</HelperText>
                    ) : null}
                    <Button
                        style={styles.button}
                        mode="contained"
                        onPress={() => {
                            login();
                        }}
                    >
                        Login
                    </Button>
                    <Button
                        style={styles.button}
                        mode="text"
                        textColor="#1d1a29"
                        onPress={() => navigation.navigate("Register")}
                    >
                        Register
                    </Button>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E7DCEB",
    },
    button: {
        marginTop: 10,
        width: 200,
    },
});

export default LoginScreen;
