import React from "react"
import { View, StyleSheet } from "react-native"
import { Button, Card, Avatar } from "react-native-paper"

const HomePage = ({navigation}) => {
    return (
        <View>
            <Card>
                <Card.Content style={{ alignItems: "center" }}>
                        <Avatar.Icon icon="account" size={100} />
                </Card.Content>
                <Card.Cover source={{ uri:'https://picsum.photos/1000' }} />
            </Card>
            <Button
                icon="map"
                mode="contained"
                onPress={() => navigation.navigate("PassengerMap")}
                style={styles.button}
                contentStyle={{ padding: 25 }}
            >
                Click here to start your journey
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
