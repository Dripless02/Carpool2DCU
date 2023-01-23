import { BACKEND_URL } from "@env";
import React, { useContext, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { LoginContext } from "./Context";
import TextInputField from "./TextInputField";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useContext(LoginContext);

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

    const login = () => {
        console.log("Login Button Pressed");

        const validEmail = checkValidEmail(email);
        const validPassword = checkValidPassword(password);

        if (validEmail && validPassword) {
            fetch(`${BACKEND_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({ email: email, password: password, }),
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Login successful");
                    setLoggedIn(true);
                } else {
                    console.log("Login failed");
                }
            })
            .catch((error) => { console.error(error); });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{width: "80%"}}>
                <TextInputField label="Email" type="email-address" onChangeText={text => setEmail(text)} />
                <TextInputField label="Password" secureText={true} onChangeText={text => setPassword(text)} />
                <View style={{alignItems: "center"}}>
                    <Button
                        style= {{marginTop: 10, width: 200}}
                        mode="contained"
                        onPress={() => {login();}}
                    >
                        Login
                    </Button>
                    <Button
                        style= {{marginTop: 10, width: 200}}
                        mode="text"
                        textColor="#1d1a29"
                        onPress={() => navigation.navigate("Register")}
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

export default LoginScreen;