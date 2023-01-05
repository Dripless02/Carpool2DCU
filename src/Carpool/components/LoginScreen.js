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
                    mode="outlined"
                    style={styles.inliner}
                    label={"Email"}
                    keyboardType="email-address"
                    onChangeText={text => setEmail(text)}
                    />
                <TextInput
                    mode="outlined"  
                    style={styles.inliner}
                    label="Password"
                    secureTextEntry={true}
                    onChangeText={text => setPassword(text)}
                    />
                <Button
                    style= {{marginTop: 10}}
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

    inliner : {
        marginBottom: 5,
    },
})

export default LoginScreen;