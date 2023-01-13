import React from 'react';
import { Platform, StyleSheet, View,} from 'react-native';
import { List } from 'react-native-paper';


const Driver = () => {
    return (
        <View style={styles.container}>
            <List.Item onPress={() => console.log(`user on ${Platform.OS} pressed Adam's card`)}
                title="Adam"
                description="3 people, leaving at 8:00am"
                descriptionNumberOfLines={2}
                left={props => <List.Icon {...props} icon="seat-passenger" /> }
            />
            <List.Item  onPress={() => console.log(`user on ${Platform.OS} pressed Scott's card`)}
                title="Scott"
                description="1 person, leaving at 10:00am"
                descriptionNumberOfLines={2}
                left={props => <List.Icon {...props} icon="seat-passenger" />}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 25,
    }
});

export default Driver;
