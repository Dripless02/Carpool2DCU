import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

const TransitionCard = ({ title, description, navigation }) => {
    return (
        <Card style={{marginVertical: 10}} onPress={() => {
                console.log(`user on ${Platform.OS} pressed ${title} card`);
                navigation.navigate(description);
            }}>
            <Card.Content style={{marginBottom: 15}}>
                <Text variant="displayLarge" style={{textAlign: "center"}} >{title}</Text>
            </Card.Content>
            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
        </Card>
    );
};

export default TransitionCard;