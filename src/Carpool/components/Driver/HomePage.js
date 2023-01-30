import { View, StyleSheet } from 'react-native'
import React from 'react';
import { Button, List, Modal, Portal, Provider, Text } from 'react-native-paper';

const HomePage = ({navigation, route}) => {
    const[visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    let passenger = null;
    if (route.params) passenger = route.params.passenger;
    return (

            <Provider>
                <Button icon="seat-passenger" mode='contained' onPress={() => navigation.navigate('PassengerList')} style={styles.button} contentStyle={{padding: 25}}>
                View Passenger List
            </Button>
                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.container}>
                    {passenger ? <Text> {passenger.name}</Text> : null}
                </Modal>
            </Portal>
            <Button mode= 'outlined'style={styles.button2} onPress={showModal}>
                My Ride
            </Button>
            </Provider>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 30,
        marginTop: 30,
        marginLeft: 10,
        marginRight: 10,

    },
    container: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 170,
        borderRadius: 30,
        marginLeft: 70,},
    button2: {
        borderRadius: 30,
        alignItems: 'left',
        marginLeft: 300,
        marginTop: 300,}

});

export default HomePage;
