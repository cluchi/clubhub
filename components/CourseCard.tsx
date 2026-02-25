import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Card from "@/components/ui/Card";
import Button from "./ui/Button";
import SubscriptionModal from "./SubscriptionModal";
import { Course } from "@/mocks/courses";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useProfileStore } from "@/stores/profileStore";
import { Child } from "@/mocks/users";

interface CourseCardProps {
  course: Course;
  onPress: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  const { selectedChildId, children } = useProfileStore();
  const { getSubscriptionForCourse } = useSubscriptionStore();

  // Get subscription status for the selected child
  const subscription = selectedChildId
    ? getSubscriptionForCourse(course.id, selectedChildId)
    : null;

  // Get selected child data
  const selectedChild = selectedChildId
    ? children.find((child) => child.id === selectedChildId) || null
    : null;

  // State for subscription modal
  const [isSubscriptionModalVisible, setIsSubscriptionModalVisible] =
    useState(false);
  // Placeholder image for demo purposes
  const placeholderImage = "https://via.placeholder.com/150";

  // Get the first schedule entry for display
  const firstSchedule = course.schedule[0];
  const scheduleText = firstSchedule
    ? `${firstSchedule.days.join(", ")} at ${firstSchedule.time}`
    : "Schedule not available";

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: placeholderImage }} style={styles.image} />
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>{course.name} (Course)</Text>
          <Text style={styles.clubName}>{course.clubId}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detail}>
              <Feather name="user" size={14} color={Colors.neutral.darkGray} />
              <Text style={styles.detailText}>{course.instructor.name}</Text>
            </View>

            <View style={styles.detail}>
              <Feather
                name="calendar"
                size={14}
                color={Colors.neutral.darkGray}
              />
              <Text style={styles.detailText}>{scheduleText}</Text>
            </View>

            <View style={styles.detail}>
              <Feather name="users" size={14} color={Colors.neutral.darkGray} />
              <Text style={styles.detailText}>
                {course.spotsAvailable}/{course.totalSpots} spots available
              </Text>
            </View>
          </View>

          {subscription && (
            <View style={styles.subscriptionStatus}>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor:
                      subscription.status === "active"
                        ? Colors.status.success
                        : subscription.status === "expiring"
                          ? Colors.status.warning
                          : Colors.status.error,
                  },
                ]}
              />
              <Text style={styles.statusText}>
                {subscription.status === "active"
                  ? "Subscribed"
                  : subscription.status === "expiring"
                    ? "Expiring Soon"
                    : "Expired"}
              </Text>
            </View>
          )}

          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Monthly</Text>
              <Text style={styles.price}>${course.pricing.monthly}</Text>
            </View>
            <Button
              title={subscription ? "Manage" : "Subscribe"}
              variant={subscription ? "outline" : "primary"}
              size="small"
              onPress={() => setIsSubscriptionModalVisible(true)}
              style={styles.subscribeButton}
            />
          </View>
        </View>
      </Card>

      <SubscriptionModal
        visible={isSubscriptionModalVisible}
        onClose={() => setIsSubscriptionModalVisible(false)}
        course={course}
        selectedChild={selectedChild}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: "hidden",
    width: 240,
    marginRight: 16,
  },
  imageContainer: {
    height: 120,
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral.darkest,
    marginBottom: 2,
  },
  clubName: {
    fontSize: 14,
    color: Colors.neutral.darkGray,
    marginBottom: 8,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 6,
    fontSize: 12,
    color: Colors.neutral.dark,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {},
  priceLabel: {
    fontSize: 12,
    color: Colors.neutral.darkGray,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },
  subscribeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  subscriptionStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: Colors.neutral.lightest,
    borderRadius: 16,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.neutral.dark,
  },
});

export default CourseCard;
