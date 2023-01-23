import React from 'react';
import { TextInput } from 'react-native-paper';

const TextInputField = ({ label="Label", type="default", onChangeText, secureText }) => {
    return (
        <TextInput
            mode="outlined"
            style={{marginBottom: 5}}
            label={label}
            keyboardType={type}
            onChangeText={onChangeText}
            secureTextEntry={secureText}
        />
    )
}

export default TextInputField;