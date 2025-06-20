import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "@/constants/Colors";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: number;
}

const Card: React.FC<CardProps> = ({ children, style, elevation = 1 }) => {
  return <View style={[styles.card, { elevation }, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: Colors.neutral.darkest,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default Card;
