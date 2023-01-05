import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <SafeAreaView style={styles.container}>
            <View style={{width: "80%"}}>
                <TextInput
                    mode="outlined"
                    style={{marginBottom: 5}}
                    label={"Email"}
                    keyboardType="email-address"
                    onChangeText={text => setEmail(text)}
                />
                <TextInput
                    mode="outlined"
                    style={{marginBottom: 5}}
                    label="Password"
                    secureTextEntry={true}
                    onChangeText={text => setPassword(text)}
                />
                <View style={{alignItems: "center"}}>
                    <Button
                        style= {{marginTop: 10, width: 200}}
                        mode="contained"
                        onPress={() => console.log("Login Button Pressed")}
                    >
                        Login
                    </Button>
                    <Button
                        style= {{marginTop: 10, width: 200}}
                        mode="contained-tonal"
                        onPress={() => console.log("Register Button Pressed")}
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
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    }
})

export default LoginScreen;