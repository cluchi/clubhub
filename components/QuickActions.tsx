import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface QuickAction {
  id: string;
  name: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  backgroundColor: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  onActionPress: (actionId: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  onActionPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.actionsContainer}
      >
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionItem}
            onPress={() => onActionPress(action.id)}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: action.backgroundColor },
              ]}
            >
              <Feather name={action.icon} size={24} color={action.color} />
            </View>
            <Text style={styles.actionName}>{action.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.neutral.darkest,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  actionsContainer: {
    paddingHorizontal: 16,
  },
  actionItem: {
    alignItems: "center",
    marginRight: 24,
    width: 64,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  actionName: {
    fontSize: 14,
    color: Colors.neutral.dark,
    textAlign: "center",
  },
});

export default QuickActions;
