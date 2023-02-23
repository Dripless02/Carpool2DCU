import { BACKEND_URL } from "@env";
import React, { useContext, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button, HelperText } from "react-native-paper";
import { LoginContext, CurrentUserContext } from "./Context";
import TextInputField from "./TextInputField";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useContext(LoginContext);
    const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
    const [failedLogin, setFailedLogin] = useState(false);

    const checkValidEmail = (email) => {
        if (email.match(/^([\w.%+-]+)@(mail.)*(dcu\.ie)/i)) {
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

    const getUserDetails = (userID) => {
        fetch(`${BACKEND_URL}/api/getUserDetails/${userID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", },
        })
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    setCurrentUser({ ...currentUser, userID: userID, name: data.name, email: data.email, address: data.address, coords: data.coordinates});
                });
                console.log("User details retrieved");
            } else {
                console.log("User details retrieval failed");
            }
        })
        .catch((error) => { console.error(error); });
    };

    const login = () => {
        if (checkValidEmail(email) && checkValidPassword(password)) {
            fetch(`${BACKEND_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({ email: email, password: password, }),
            })
            .then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        getUserDetails(data.id);
                    });
                    console.log("Login successful");
                    setLoggedIn(true);
                } else {
                    setFailedLogin(true);
                    console.log("Login failed");
                }
            })
            .catch((error) => { console.error(error); });
        }
    };

    const devLogin = () => {
        fetch(`${BACKEND_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ email: "test@gmail.com", password: "password", }),
        })
        .then((response) => {
            if (response.ok) {
                console.log("ok");
                console.log(JSON.stringify(response));
                response.json().then((data) => {
                    getUserDetails(data.id);
                    console.log("User ID: " + data.id);
                });
                console.log("Login successful");
                setLoggedIn(true);
            } else {

                console.log("Login failed");
            }
        })
        .catch((error) => { console.error(error); });
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{width: "80%"}}>
                <TextInputField label="Email" type="email-address" onChangeText={text => setEmail(text)} autoCapitalize="none" />
                {email.length > 0 && !email.match(/^([\w.%+-]+)@(mail.)*(dcu\.ie)/i) ? <HelperText type="info">Email is invalid</HelperText> : null}

                <TextInputField label="Password" secureText={true} onChangeText={text => setPassword(text)} autoCapitalize="none" />
                {password.length < 8 ? <HelperText type="info" >Password must be at least 8 characters</HelperText> : null}

                <View style={{alignItems: "center"}}>
                    {failedLogin ? <HelperText type="error">Incorrect Email or Password</HelperText> : null}
                    <Button
                        style={styles.button}
                        mode="contained"
                        onPress={() => {login();}}
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
                    <Button
                        style={styles.button}
                        mode="text"
                        textColor="#1d1a29"
                        onPress={() => {
                            devLogin();
                        }}
                    >
                        Login as Test
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
    },
    button : {
        marginTop: 10,
        width: 200,
    }
})

export default LoginScreen;
