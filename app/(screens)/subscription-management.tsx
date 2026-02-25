import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useProfileStore } from "@/stores/profileStore";
import { Course } from "@/mocks/courses";
import { Subscription } from "@/mocks/subscriptions";
import { courses } from "@/mocks/courses";

interface SubscriptionItem {
  id: string;
  course: Course;
  status: "active" | "expiring" | "expired" | "on_hold";
  start_date: string;
  end_date: string;
  next_session: string;
  renewal_date: string;
  payment_method: string;
}

const SubscriptionManagementScreen = () => {
  const { selectedChildId, children } = useProfileStore();
  const { subscriptions, fetchSubscriptions, cancelSubscription, isLoading } =
    useSubscriptionStore();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  useEffect(() => {
    if (selectedChildId) {
      setSelectedChild(selectedChildId);
      fetchSubscriptions(selectedChildId);
    }
  }, [selectedChildId, fetchSubscriptions]);

  useEffect(() => {
    if (selectedChild) {
      fetchSubscriptions(selectedChild);
    }
  }, [selectedChild, fetchSubscriptions]);

  const handleChildSelect = (childId: string) => {
    setSelectedChild(childId);
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel this subscription? This action cannot be undone.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () => cancelSubscription(subscriptionId),
          style: "destructive",
        },
      ],
    );
  };

  const getCourseById = (courseId: string) => {
    return courses.find((course) => course.id === courseId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return Colors.status.success;
      case "expiring":
        return Colors.status.warning;
      case "expired":
        return Colors.status.error;
      default:
        return Colors.neutral.darkGray;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "expiring":
        return "Expiring Soon";
      case "expired":
        return "Expired";
      default:
        return status;
    }
  };

  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderSubscriptionItem = ({ item }: { item: Subscription }) => {
    const course = getCourseById(item.course_id);
    if (!course) return null;

    const subscriptionItem: SubscriptionItem = {
      ...item,
      course: course,
    };

    return (
      <Card style={styles.subscriptionCard}>
        <View style={styles.subscriptionHeader}>
          <View style={styles.courseInfo}>
            <Text style={styles.courseName}>{course.name}</Text>
            <Text style={styles.courseCategory}>{course.category}</Text>
          </View>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            />
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <View style={styles.subscriptionDetails}>
          <View style={styles.detailRow}>
            <Feather
              name="calendar"
              size={14}
              color={Colors.neutral.darkGray}
            />
            <Text style={styles.detailLabel}>Start Date:</Text>
            <Text style={styles.detailValue}>
              {formatDateString(item.start_date)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Feather
              name="calendar"
              size={14}
              color={Colors.neutral.darkGray}
            />
            <Text style={styles.detailLabel}>End Date:</Text>
            <Text style={styles.detailValue}>
              {formatDateString(item.end_date)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Feather name="clock" size={14} color={Colors.neutral.darkGray} />
            <Text style={styles.detailLabel}>Next Session:</Text>
            <Text style={styles.detailValue}>{item.next_session}</Text>
          </View>

          <View style={styles.detailRow}>
            <Feather
              name="credit-card"
              size={14}
              color={Colors.neutral.darkGray}
            />
            <Text style={styles.detailLabel}>Payment Method:</Text>
            <Text style={styles.detailValue}>{item.payment_method}</Text>
          </View>
        </View>

        <View style={styles.subscriptionActions}>
          <Button
            title="View Details"
            variant="outline"
            size="small"
            style={styles.actionButton}
          />
          {item.status === "active" && (
            <Button
              title="Cancel"
              variant="secondary"
              size="small"
              onPress={() => handleCancelSubscription(item.id)}
              style={styles.actionButton}
            />
          )}
          {item.status === "expired" && (
            <Button
              title="Renew"
              variant="primary"
              size="small"
              style={styles.actionButton}
            />
          )}
        </View>
      </Card>
    );
  };

  const selectedChildData = children.find(
    (child) => child.id === selectedChild,
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Subscription Management</Text>
        <Text style={styles.subtitle}>
          Manage subscriptions for your children
        </Text>
      </View>

      {children.length > 0 && (
        <View style={styles.profileSelector}>
          <Text style={styles.profileLabel}>Select Child:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.profileList}
          >
            {children.map((child) => (
              <TouchableOpacity
                key={child.id}
                style={[
                  styles.profileChip,
                  selectedChild === child.id && styles.selectedProfileChip,
                ]}
                onPress={() => handleChildSelect(child.id)}
              >
                <View
                  style={[
                    styles.profileAvatar,
                    { backgroundColor: child.color },
                  ]}
                >
                  <Text style={styles.profileAvatarText}>{child.avatar}</Text>
                </View>
                <Text
                  style={[
                    styles.profileName,
                    selectedChild === child.id && styles.selectedProfileName,
                  ]}
                >
                  {child.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {selectedChildData && (
        <View style={styles.selectedChildInfo}>
          <Text style={styles.selectedChildTitle}>
            Subscriptions for {selectedChildData.name}
          </Text>
        </View>
      )}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading subscriptions...</Text>
        </View>
      ) : subscriptions.length > 0 ? (
        <FlatList
          data={subscriptions}
          renderItem={renderSubscriptionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.subscriptionList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Feather name="package" size={48} color={Colors.neutral.medium} />
          <Text style={styles.emptyStateTitle}>No Subscriptions</Text>
          <Text style={styles.emptyStateText}>
            {selectedChildData
              ? `${selectedChildData.name} doesn't have any active subscriptions yet.`
              : "No child selected. Please select a child to view their subscriptions."}
          </Text>
          {selectedChildData && (
            <Button
              title="Browse Courses"
              onPress={() => {
                // Navigate to search or courses screen
                console.log("Navigate to courses");
              }}
              style={styles.browseButton}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.neutral.darkest,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.neutral.darkGray,
    marginTop: 4,
  },
  profileSelector: {
    marginBottom: 16,
  },
  profileLabel: {
    fontSize: 14,
    color: Colors.neutral.dark,
    marginBottom: 8,
  },
  profileList: {
    flexDirection: "row",
  },
  profileChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.light,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  selectedProfileChip: {
    backgroundColor: Colors.primary,
  },
  profileAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  profileAvatarText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.neutral.white,
  },
  profileName: {
    fontSize: 14,
    color: Colors.neutral.dark,
    fontWeight: "500",
  },
  selectedProfileName: {
    color: Colors.neutral.white,
  },
  selectedChildInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: Colors.neutral.lightest,
    borderRadius: 8,
  },
  selectedChildTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral.darkest,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: Colors.neutral.dark,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.neutral.darkest,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.neutral.darkGray,
    textAlign: "center",
    lineHeight: 20,
  },
  browseButton: {
    marginTop: 16,
  },
  subscriptionList: {
    paddingBottom: 16,
  },
  subscriptionCard: {
    marginBottom: 12,
  },
  subscriptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral.darkest,
  },
  courseCategory: {
    fontSize: 12,
    color: Colors.neutral.darkGray,
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  subscriptionDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.neutral.darkGray,
    marginLeft: 8,
    marginRight: 4,
    width: 100,
  },
  detailValue: {
    fontSize: 12,
    color: Colors.neutral.darkest,
    flex: 1,
  },
  subscriptionActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
  },
});

export default SubscriptionManagementScreen;
