import React, { useContext, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { LoginContext } from "./Context";
import TextInputField from "./TextInputField";

const RegisterScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
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

    const register = () => {
        console.log("Register Button Pressed");
        const validEmail = checkValidEmail(email);
        const validPassword = checkValidPassword(password);
        if (validEmail && validPassword) {
            setLoggedIn(true);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{width: "80%"}}>
                <TextInputField label="Name" onChangeText={text => {setName(text); console.log(`name = ${name}`)}} />
                <TextInputField label="Email" type="email-address" onChangeText={text => {setEmail(text); console.log(`email = ${email}`)}} />
                <TextInputField label="Password" onChangeText={text => {setPassword(text); console.log(`password = ${password}`)}} />
                <TextInputField label="Address" onChangeText={text => {setAddress(text); console.log(`address = ${address}`)}} />
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