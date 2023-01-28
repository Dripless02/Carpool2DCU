import React from "react"
import { View, StyleSheet } from "react-native"
import { Button } from "react-native-paper"

const HomePage = ({navigation}) => {
    return (
        <View>
            <Button
                icon="map"
                mode="contained"
                onPress={() => navigation.navigate("PassengerMap")}
                style={styles.button}
                contentStyle={{ padding: 25 }}
            >
                Map
            </Button>
        </View>
    )
}

export default HomePage

const styles = StyleSheet.create({
    button: {
        borderRadius: 30,
        marginTop: 30,
        marginLeft: 10,
        marginRight: 10,
    },
})
