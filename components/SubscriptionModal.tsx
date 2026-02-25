import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { Course } from "@/mocks/courses";
import { Child } from "@/mocks/users";
import { useSubscriptionStore } from "@/stores/subscriptionStore";

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  course: Course;
  selectedChild: Child | null;
}

type SubscriptionType = "drop_in" | "monthly" | "quarterly";

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  visible,
  onClose,
  course,
  selectedChild,
}) => {
  const [selectedType, setSelectedType] = useState<SubscriptionType | null>(
    null,
  );
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { subscribeToCourse, error } = useSubscriptionStore();

  const subscriptionOptions = [
    {
      type: "drop_in" as SubscriptionType,
      label: "Drop-in",
      price: course.pricing.dropIn,
      description: "Pay per session - flexible scheduling",
      savings: null,
    },
    {
      type: "monthly" as SubscriptionType,
      label: "Monthly",
      price: course.pricing.monthly,
      description: "Unlimited sessions for 1 month",
      savings: null,
    },
    {
      type: "quarterly" as SubscriptionType,
      label: "Quarterly",
      price: course.pricing.quarterly,
      description: "Unlimited sessions for 3 months",
      savings: `$${course.pricing.monthly * 3 - course.pricing.quarterly} saved`,
    },
  ];

  const handleSubscribe = async () => {
    if (!selectedChild) {
      Alert.alert(
        "No Profile Selected",
        "Please select a child profile first.",
      );
      return;
    }

    if (!selectedType) {
      Alert.alert("No Plan Selected", "Please select a subscription plan.");
      return;
    }

    setIsSubscribing(true);

    try {
      await subscribeToCourse(
        selectedChild.id,
        course.id,
        selectedType,
        "Visa ending in 4532", // TODO: Implement payment method selection
      );

      Alert.alert(
        "Subscription Created",
        `Successfully subscribed ${selectedChild.name} to ${course.name}.`,
        [{ text: "OK", onPress: onClose }],
      );
    } catch (error) {
      Alert.alert(
        "Subscription Failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsSubscribing(false);
    }
  };

  const getSubscriptionDetails = (type: SubscriptionType) => {
    switch (type) {
      case "drop_in":
        return {
          duration: "6 months validity",
          sessions: "Unlimited sessions",
          billing: "Pay per session",
        };
      case "monthly":
        return {
          duration: "1 month",
          sessions: "Unlimited sessions",
          billing: "Billed monthly",
        };
      case "quarterly":
        return {
          duration: "3 months",
          sessions: "Unlimited sessions",
          billing: "Billed quarterly",
        };
    }
  };

  if (!selectedChild) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Select a Profile</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Feather name="x" size={24} color={Colors.neutral.dark} />
              </TouchableOpacity>
            </View>

            <View style={styles.emptyState}>
              <Feather name="user" size={48} color={Colors.neutral.medium} />
              <Text style={styles.emptyStateTitle}>No Profile Selected</Text>
              <Text style={styles.emptyStateText}>
                Please select a child profile to subscribe to this course.
              </Text>
            </View>

            <Button title="Close" onPress={onClose} variant="secondary" />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Subscribe to {course.name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={Colors.neutral.dark} />
            </TouchableOpacity>
          </View>

          <View style={styles.childInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{selectedChild.avatar}</Text>
            </View>
            <View>
              <Text style={styles.childName}>{selectedChild.name}</Text>
              <Text style={styles.childDetails}>
                {selectedChild.age} years old
              </Text>
            </View>
          </View>

          <Text style={styles.subtitle}>Select Subscription Plan</Text>

          <ScrollView
            style={styles.optionsContainer}
            showsVerticalScrollIndicator={false}
          >
            {subscriptionOptions.map((option) => {
              const isSelected = selectedType === option.type;
              const details = getSubscriptionDetails(option.type);

              return (
                <TouchableOpacity
                  key={option.type}
                  style={[
                    styles.optionCard,
                    isSelected && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedType(option.type)}
                >
                  <View style={styles.optionHeader}>
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected && styles.selectedOptionLabel,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {option.savings && (
                      <Text style={styles.savingsText}>{option.savings}</Text>
                    )}
                  </View>

                  <Text style={styles.optionPrice}>
                    ${option.price}
                    {option.type !== "drop_in" && "/month"}
                  </Text>

                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>

                  <View style={styles.optionDetails}>
                    <View style={styles.detailRow}>
                      <Feather
                        name="calendar"
                        size={14}
                        color={Colors.neutral.darkGray}
                      />
                      <Text style={styles.detailText}>{details.duration}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Feather
                        name="users"
                        size={14}
                        color={Colors.neutral.darkGray}
                      />
                      <Text style={styles.detailText}>{details.sessions}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Feather
                        name="credit-card"
                        size={14}
                        color={Colors.neutral.darkGray}
                      />
                      <Text style={styles.detailText}>{details.billing}</Text>
                    </View>
                  </View>

                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Feather
                        name="check-circle"
                        size={20}
                        color={Colors.primary}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.actions}>
            <Button
              title="Subscribe"
              onPress={handleSubscribe}
              disabled={!selectedType || isSubscribing}
              isLoading={isSubscribing}
              style={styles.subscribeButton}
            />
            <Button
              title="Cancel"
              onPress={onClose}
              variant="secondary"
              style={styles.cancelButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 12,
    width: "100%",
    maxHeight: "80%",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.neutral.darkest,
  },
  closeButton: {
    padding: 4,
  },
  childInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.lightest,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.neutral.white,
  },
  childName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral.darkest,
  },
  childDetails: {
    fontSize: 12,
    color: Colors.neutral.darkGray,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.neutral.dark,
    marginBottom: 12,
  },
  optionsContainer: {
    maxHeight: 300,
    marginBottom: 16,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: Colors.neutral.light,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    position: "relative",
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: "#F0F9FF",
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral.darkest,
  },
  selectedOptionLabel: {
    color: Colors.primary,
  },
  savingsText: {
    fontSize: 12,
    color: Colors.secondary.green,
    fontWeight: "600",
  },
  optionPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.neutral.dark,
    marginBottom: 8,
  },
  optionDetails: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.light,
    paddingTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 12,
    color: Colors.neutral.darkGray,
  },
  selectedIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  errorText: {
    color: Colors.secondary.red,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  subscribeButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral.darkest,
    marginTop: 12,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.neutral.darkGray,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default SubscriptionModal;
