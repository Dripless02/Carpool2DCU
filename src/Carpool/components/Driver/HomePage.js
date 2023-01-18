import { View, StyleSheet} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Button, List, Text } from 'react-native-paper';

const HomePage = ({navigation}) => {
  return (
    <View>

        <Button  icon ="seat-passenger" mode='contained'  onPress={() => navigation.navigate('PassengerList')}
        style = {styles.container}>
           View Passenger List
        </Button>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 30,
        padding: 25,
        marginTop: 50,
        marginLeft: 10,
        marginRight: 10,
    }
});
export default HomePage;

