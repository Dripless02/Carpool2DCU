import React, { useContext, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { LoginContext } from "./Context";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useContext(LoginContext);

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
                        onPress={() => {setLoggedIn(true);}}
                    >
                        Login
                    </Button>
                    <Button
                        style= {{marginTop: 10, width: 200}}
                        mode="text"
                        textColor="#1d1a29"
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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E7DCEB',
    }
})

export default LoginScreen;