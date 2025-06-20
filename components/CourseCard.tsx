import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Card from "@/components/ui/Card";
import Button from "./ui/Button";
import { Course } from "@/mocks/courses";

interface CourseCardProps {
  course: Course;
  onPress: () => void;
  onSubscribe: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onPress,
  onSubscribe,
}) => {
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
          <Text style={styles.name}>{course.name}</Text>
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

          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Monthly</Text>
              <Text style={styles.price}>${course.pricing.monthly}</Text>
            </View>
            <Button
              title="Subscribe"
              variant="primary"
              size="small"
              onPress={onSubscribe}
              style={styles.subscribeButton}
            />
          </View>
        </View>
      </Card>
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
});

export default CourseCard;
