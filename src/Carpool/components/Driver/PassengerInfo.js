import React from 'react';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { StyleSheet, View} from 'react-native'
import MapView, { Marker } from 'react-native-maps';

const PassengerInfo = ({route, navigation}) => {
    const passenger = route.params.passenger;
    console.log(passenger)

    let description = ``;
    if (passenger.noOfPassengers === undefined || passenger.noOfPassengers === 1) {passenger.noOfPassengers = 1; description += `there is one person on this ride`;}
    else {description += `There are ${passenger.noOfPassengers} people on this ride.`;}
    return (
        <View style={styles.card}>
            <Card style= {styles.card}>
                <Card.Content style={{alignItems: "center"}}>
                    <Avatar.Icon icon="account" size={100}/>
                </Card.Content>
                    <Text style={styles.title}>{passenger.name}</Text>
                <Card.Content>
                    <MapView
                        provider='google'
                        style={{height: 200, borderRadius: 20, marginBottom: 10}}
                        initialRegion={{
                            latitude: passenger.location.latitude,
                            longitude: passenger.location.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: passenger.location.latitude,
                                longitude: passenger.location.longitude,
                            }}
                            title="Pickup Location"
                            description="DCU"
                        />
                    </MapView>
                </Card.Content>
                <Card.Content>
                    <Text style={styles.info}>{passenger.name} will be leaving at {passenger.departureTime}</Text>
                    <Text style={styles.info}>{description}</Text>
                </Card.Content>
                    <Button style={styles.button} mode="contained" onPress={() =>{navigation.navigate('DriverHomePage', {passenger});
                        console.log(`Driver accepted ${passenger.name}'s ride`)}}contentStyle={{padding: 10}}>Click here to accept this ride</Button>
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


export default PassengerInfo;
