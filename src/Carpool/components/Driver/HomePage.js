import { View, StyleSheet } from 'react-native'
import React from 'react';
import { Button } from 'react-native-paper';

const HomePage = ({navigation}) => {
    return (
        <View>
            <Button icon="seat-passenger" mode='contained' onPress={() => navigation.navigate('PassengerList')} style={styles.button} contentStyle={{padding: 25}}>
                View Passenger List
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 30,
        marginTop: 30,
        marginLeft: 10,
        marginRight: 10,
    }
});

export default HomePage;
