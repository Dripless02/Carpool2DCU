import React from 'react';
import { TextInput } from 'react-native-paper';

const TextInputField = ({ label="Label", type="default", onChangeText, secureText, autoCapitalize="sentences" }) => {
    return (
        <TextInput
            mode="outlined"
            style={{marginBottom: 5}}
            label={label}
            keyboardType={type}
            onChangeText={onChangeText}
            secureTextEntry={secureText}
            autoCapitalize={autoCapitalize}
        />
    )
}

export default TextInputField;
