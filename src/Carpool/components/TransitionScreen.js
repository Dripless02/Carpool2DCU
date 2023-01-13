import React from 'react';
import { StyleSheet, View } from 'react-native';
import TransitionCard from './TransitionCard';

const TransitionScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <TransitionCard title="Driver" navigation={navigation}/>
            <TransitionCard title="Passenger" navigation={navigation}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
    }
});

export default TransitionScreen;