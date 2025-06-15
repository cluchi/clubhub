import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from "react-native";
import { Colors } from "@/constants/Colors";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "medium",
  isLoading = false,
  style,
  textStyle,
  ...rest
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return styles.primaryButton;
      case "secondary":
        return styles.secondaryButton;
      case "outline":
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "primary":
      case "secondary":
        return styles.primaryText;
      case "outline":
        return styles.outlineText;
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case "small":
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case "medium":
        return { paddingVertical: 12, paddingHorizontal: 24 };
      case "large":
        return { paddingVertical: 16, paddingHorizontal: 32 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24 };
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), getSizeStyle(), style]}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "outline" ? Colors.primary : Colors.neutral.white}
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary.blue,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  primaryText: {
    color: Colors.neutral.white,
    fontWeight: "600",
    fontSize: 16,
  },
  outlineText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});

export default Button;
