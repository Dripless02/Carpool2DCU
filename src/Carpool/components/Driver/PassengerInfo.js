
import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { StyleSheet, View} from 'react-native'
import { BACKEND_URL } from "@env";

const PassengerInfo = ({route}) => {
    const passenger = route.params.passenger;

    let description = ``;
    if (passenger.noOfPassengers === undefined || passenger.noOfPassengers === 1) {passenger.noOfPassengers = 1; description += `there is one person on this ride`;}
    else {description += `There are ${passenger.noOfPassengers} people on this ride.`;}
    return (
        <View style={styles.card}>
            <Card style= {styles.card}>
                <Card.Content style = {{alignItems: "center"}}>
                    <Avatar.Icon icon="account" size={100}/>
                </Card.Content>
                    <Text style={styles.title}>{passenger.name}</Text>
                <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                <Card.Content>
                    <Text style={styles.info}>{passenger.name} will be leaving at {passenger.departureTime}</Text>
                    <Text style={styles.info}>{description}</Text>

                </Card.Content>
                    <Button style={styles.button} mode="contained" onPress={() => console.log(`Driver accepted ${passenger.name}'s ride`)} contentStyle={{padding: 10}}>Click here to accept this ride</Button>
                </Card>
        </View>
    )
}


const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 10,
    },
    card: {
        paddingTop: 20,
        borderRadius: 30,
        padding: 5,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4, },
        shadowOpacity: 0.4,
    },
    info: {
        paddingTop: 10,
        fontSize: 20,
        textAlign: 'center',
        fontStyle: 'italic',
        },
    button: {
        borderRadius: 30,
        marginTop: 20,
        marginLeft: 50,
        marginRight: 50,
        marginBottom: 20,
    }
});


export default PassengerInfo
