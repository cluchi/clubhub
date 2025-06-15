import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Feather.glyphMap;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  isPassword?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  isPassword = false,
  ...rest
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(isPassword);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        {leftIcon && (
          <Feather
            name={leftIcon}
            size={20}
            color={Colors.neutral.darkGray}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon || isPassword ? styles.inputWithRightIcon : null,
            inputStyle,
          ]}
          placeholderTextColor={Colors.neutral.gray}
          secureTextEntry={secureTextEntry}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={toggleSecureEntry}
            style={styles.rightIcon}
          >
            <Feather
              name={secureTextEntry ? "eye" : "eye-off"}
              size={20}
              color={Colors.neutral.darkGray}
            />
          </TouchableOpacity>
        )}
        {rightIcon && !isPassword && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Feather
              name={rightIcon}
              size={20}
              color={Colors.neutral.darkGray}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.neutral.dark,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.neutral.medium,
    borderRadius: 8,
    backgroundColor: Colors.neutral.white,
  },
  inputError: {
    borderColor: "red",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.neutral.darkest,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 40,
  },
  leftIcon: {
    marginLeft: 12,
  },
  rightIcon: {
    position: "absolute",
    right: 12,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
