import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.view}>
                <TextInput
                    label={"Email"}
                    keyboardType="email-address"
                    onChangeText={text => setEmail(text)}
                    />
                <TextInput
                    label="Password"
                    secureTextEntry={true}
                    onChangeText={text => setPassword(text)}
                    />
                <Button
                    mode="contained"
                    onPress={() => console.log("Logged in")}
                    >
                    Login
                </Button>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container : {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    view : {
        width: "80%",
    },
})

export default LoginScreen;