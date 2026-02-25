import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CourseCard from "@/components/CourseCard";
import { useClubStore } from "@/stores/clubStore";
import { useLocalSearchParams, router } from "expo-router";
import { Course } from "@/mocks/courses";

const ClubProfileScreen = () => {
  const { clubId } = useLocalSearchParams();
  console.log("ClubProfileScreen clubId:", clubId);
  const { fetchClubById, isLoading, selectedClub, courses, fetchCourses } =
    useClubStore();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (clubId) {
      fetchClubById(clubId as string);
      fetchCourses();
    } // TODO handle type safety
  }, [clubId, fetchClubById, fetchCourses]);

  // Get courses for this club
  const clubCourses = courses.filter(
    (course: Course) => course.clubId === clubId,
  );

  // Placeholder image for demo purposes
  const placeholderImage = "https://via.placeholder.com/400x200";

  const handleCoursePress = (courseId: string) => {
    // navigation.navigate("CourseDetail", { courseId });
    // console.log(`Navigating to club with ID: ${clubId}`);
    // router.push({
    //   pathname: "/(screens)/[courseId]",
    //   params: { courseId },
    // });
  };

  const handleContactPress = () => {
    // In a real app, this would open contact options
    console.log("Contact club");
  };

  const handleSharePress = () => {
    // In a real app, this would open share options
    console.log("Share club");
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }
  if (!selectedClub) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Club not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Header component for FlatList
  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color={Colors.neutral.white} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} onPress={handleSharePress}>
          <Feather name="share-2" size={24} color={Colors.neutral.white} />
        </TouchableOpacity>

        <Image source={{ uri: placeholderImage }} style={styles.coverImage} />

        <View style={styles.clubImageContainer}>
          <Image source={{ uri: placeholderImage }} style={styles.clubImage} />
        </View>

        <View style={styles.clubHeaderInfo}>
          <Text style={styles.clubName}>{selectedClub.name}</Text>
          <View style={styles.ratingContainer}>
            <Feather name="star" size={16} color="#F59E0B" />
            <Text style={styles.rating}>
              {selectedClub.rating} ({selectedClub.reviewCount} reviews)
            </Text>
          </View>
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={14} color={Colors.neutral.darkGray} />
            <Text style={styles.location}>
              {selectedClub.location}, {selectedClub.distance} km away
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "overview" && styles.activeTab]}
          onPress={() => setActiveTab("overview")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "overview" && styles.activeTabText,
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "courses" && styles.activeTab]}
          onPress={() => setActiveTab("courses")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "courses" && styles.activeTabText,
            ]}
          >
            Courses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "reviews" && styles.activeTab]}
          onPress={() => setActiveTab("reviews")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "reviews" && styles.activeTabText,
            ]}
          >
            Reviews
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "contact" && styles.activeTab]}
          onPress={() => setActiveTab("contact")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "contact" && styles.activeTabText,
            ]}
          >
            Contact
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // Content for different tabs
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>About {selectedClub.name}</Text>
            <Text style={styles.description}>{selectedClub.description}</Text>

            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {selectedClub.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <View style={styles.amenityIcon}>
                    <Feather name="check" size={16} color={Colors.primary} />
                  </View>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Operating Hours</Text>
            {/* TODO {Object.entries(selectedClub.operatingHours).map(
              ([day, hours], index) => (
                <View key={index} style={styles.hoursItem}>
                  <Text style={styles.dayText}>{day}</Text>
                  <Text style={styles.hoursText}>
                    {hours.open} - {hours.close}
                  </Text>
                </View>
              )
            )} */}
          </View>
        );

      case "courses":
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Available Courses</Text>
            {clubCourses.length > 0 ? (
              <FlatList
                data={clubCourses}
                renderItem={({ item: course }) => (
                  <CourseCard
                    course={course}
                    onPress={() => handleCoursePress(course.id)}
                  />
                )}
                keyExtractor={(course) => course.id}
                contentContainerStyle={styles.coursesList}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyCourses}>
                <Feather
                  name="package"
                  size={48}
                  color={Colors.neutral.medium}
                />
                <Text style={styles.emptyCoursesTitle}>
                  No Courses Available
                </Text>
                <Text style={styles.emptyCoursesText}>
                  This club does not have any courses available yet.
                </Text>
              </View>
            )}
          </View>
        );

      case "reviews":
        return (
          <View style={styles.contentContainer}>
            <View style={styles.reviewsSummary}>
              <Text style={styles.reviewsRating}>{selectedClub.rating}</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Feather
                    key={star}
                    name="star"
                    size={20}
                    color={
                      star <= Math.floor(selectedClub.rating)
                        ? "#F59E0B"
                        : Colors.neutral.medium
                    }
                    style={styles.starIcon}
                  />
                ))}
              </View>
              <Text style={styles.reviewsCount}>
                Based on {selectedClub.reviewCount} reviews
              </Text>
            </View>

            <Text style={styles.noReviewsText}>
              Reviews will be displayed here.
            </Text>
          </View>
        );

      case "contact":
        return (
          <View style={styles.contentContainer}>
            <Card style={styles.contactCard}>
              <View style={styles.contactItem}>
                <Feather
                  name="phone"
                  size={20}
                  color={Colors.primary}
                  style={styles.contactIcon}
                />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Phone</Text>
                  <Text style={styles.contactValue}>
                    {selectedClub.contact.phone}
                  </Text>
                </View>
              </View>

              <View style={styles.contactItem}>
                <Feather
                  name="mail"
                  size={20}
                  color={Colors.primary}
                  style={styles.contactIcon}
                />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>
                    {selectedClub.contact.email}
                  </Text>
                </View>
              </View>

              <View style={styles.contactItem}>
                <Feather
                  name="map-pin"
                  size={20}
                  color={Colors.primary}
                  style={styles.contactIcon}
                />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Address</Text>
                  <Text style={styles.contactValue}>
                    {selectedClub.contact.address}
                  </Text>
                </View>
              </View>
            </Card>

            <Button
              title="Contact Club"
              onPress={handleContactPress}
              style={styles.contactButton}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderContent}
        data={[]}
        renderItem={() => null}
        keyExtractor={() => "empty"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: Colors.neutral.darkest,
    marginBottom: 16,
  },
  errorButton: {
    width: 200,
  },
  header: {
    position: "relative",
    height: 200,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  shareButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  clubImageContainer: {
    position: "absolute",
    bottom: -40,
    left: 16,
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.neutral.white,
    borderWidth: 2,
    borderColor: Colors.neutral.white,
    overflow: "hidden",
  },
  clubImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  clubHeaderInfo: {
    position: "absolute",
    bottom: -60,
    left: 108,
    right: 16,
  },
  clubName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.neutral.darkest,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: Colors.neutral.dark,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    marginLeft: 4,
    fontSize: 12,
    color: Colors.neutral.darkGray,
  },
  tabsContainer: {
    flexDirection: "row",
    marginTop: 80,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.light,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.neutral.darkGray,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.neutral.darkest,
    marginTop: 16,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.neutral.dark,
    marginBottom: 16,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 12,
  },
  amenityIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E0F2F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  amenityText: {
    fontSize: 14,
    color: Colors.neutral.dark,
  },
  hoursItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.light,
  },
  dayText: {
    fontSize: 14,
    color: Colors.neutral.dark,
  },
  hoursText: {
    fontSize: 14,
    color: Colors.neutral.darkest,
    fontWeight: "500",
  },
  courseCard: {
    flexDirection: "row",
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral.light,
    borderRadius: 8,
    marginBottom: 12,
  },
  courseImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.neutral.light,
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral.darkest,
    marginBottom: 4,
  },
  instructorName: {
    fontSize: 14,
    color: Colors.neutral.dark,
    marginBottom: 8,
  },
  courseDetails: {
    flexDirection: "row",
    marginBottom: 8,
  },
  courseDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 12,
    color: Colors.neutral.darkGray,
  },
  courseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coursePrice: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },
  courseAvailability: {
    fontSize: 12,
    color: Colors.neutral.darkGray,
  },
  reviewsSummary: {
    alignItems: "center",
    marginVertical: 16,
  },
  reviewsRating: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.neutral.darkest,
  },
  starsContainer: {
    flexDirection: "row",
    marginVertical: 8,
  },
  starIcon: {
    marginHorizontal: 2,
  },
  reviewsCount: {
    fontSize: 14,
    color: Colors.neutral.darkGray,
  },
  noReviewsText: {
    fontSize: 14,
    color: Colors.neutral.darkGray,
    textAlign: "center",
    marginTop: 24,
  },
  contactCard: {
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  contactIcon: {
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: Colors.neutral.darkGray,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: Colors.neutral.darkest,
  },
  contactButton: {
    marginTop: 8,
  },
  coursesList: {
    paddingBottom: 16,
  },
  emptyCourses: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyCoursesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.neutral.darkest,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCoursesText: {
    fontSize: 14,
    color: Colors.neutral.darkGray,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default ClubProfileScreen;
