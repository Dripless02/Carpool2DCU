import React from "react";
import { TextInput } from "react-native-paper";

const TextInputField = ({ label = "Label", type = "default", onChangeText, secureText, autoCapitalize = "sentences", value }) => {
    return (
        <TextInput
            mode="outlined"
            style={{ marginBottom: 5 }}
            label={label}
            keyboardType={type}
            onChangeText={onChangeText}
            secureTextEntry={secureText}
            autoCapitalize={autoCapitalize}
            value={value}
            testID={label}
        />
    );
};

export default TextInputField;
