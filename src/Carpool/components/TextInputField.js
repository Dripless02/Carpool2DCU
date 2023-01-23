import React from 'react';
import { TextInput } from 'react-native-paper';

const TextInputField = ({ label="Label", type="default", onChangeText }) => {
    return (
        <TextInput
            mode="outlined"
            style={{marginBottom: 5}}
            label={label}
            keyboardType={type}
            onChangeText={onChangeText}
        />
    )
}

export default TextInputField;