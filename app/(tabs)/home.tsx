import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  // FlatList,
  // Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import ProfileSwitcher from "@/components/ProfileSwitcher";
// import QuickActions from "@/components/QuickActions";
// import ClubCard from "@/components/ClubCard";
// import CourseCard from "@/components/CourseCard";
import { useAuthStore } from "@/stores/authStore";
import { useClubStore } from "@/stores/clubStore";
import { children } from "@/mocks/users";
// import { clubs } from "@/mocks/clubs";
// import { courses } from "@/mocks/courses";
import { router } from "expo-router";
import { useProfileStore } from "@/stores/profileStore";

const HomeScreen = () => {
  const { user } = useAuthStore();
  const { fetchClubs, fetchCourses, featuredClubs } = useClubStore();
  const {
    fetchChildren,
    children: profileChildren,
    // selectedChildId,
  } = useProfileStore();

  const [selectedChildId, setSelectedChildId] = useState(
    profileChildren[0]?.id || ""
  );

  useEffect(() => {
    fetchClubs();
    fetchCourses();
    if (user?.id) {
      fetchChildren(user.id);
    } else {
      Alert.alert("Error", "No user found. Please sign in.");
      router.replace("/(auth)/LoginScreen");
    }
  }, [fetchChildren, fetchClubs, fetchCourses, user]);

  // const quickActions = [
  //   {
  //     id: "gym",
  //     name: "Gym",
  //     icon: "activity",
  //     color: Colors.primary,
  //     backgroundColor: "#E0F2F1",
  //   },
  //   {
  //     id: "music",
  //     name: "Music",
  //     icon: "music",
  //     color: Colors.secondary.blue,
  //     backgroundColor: "#E8EAF6",
  //   },
  //   {
  //     id: "dance",
  //     name: "Dance",
  //     icon: "zap",
  //     color: Colors.secondary.purple,
  //     backgroundColor: "#EDE9FE",
  //   },
  //   {
  //     id: "swimming",
  //     name: "Swimming",
  //     icon: "droplet",
  //     color: "#06B6D4",
  //     backgroundColor: "#E0F7FA",
  //   },
  // ];

  // const handleQuickActionPress = (actionId: string) => {
  //   // Navigate to search with filter
  //   navigation.navigate("Search", { category: actionId });
  // };

  // const handleClubPress = (clubId: string) => {
  //   navigation.navigate("ClubProfile", { clubId });
  // };

  // const handleCoursePress = (courseId: string) => {
  //   navigation.navigate("CourseDetail", { courseId });
  // };

  // const handleSubscribe = (courseId: string) => {
  //   navigation.navigate("Payment", { courseId });
  // };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const onAddChild = () => {
    router.push("/(screens)/AddProfileScreen");
  };

  const selectedChild = profileChildren.find(
    (child) => child.id === selectedChildId
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>ClubHub</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("/(screens)/notifications")}
          >
            <Feather name="bell" size={24} color={Colors.neutral.darkest} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("/(screens)/profile")}
          >
            <Feather name="menu" size={24} color={Colors.neutral.darkest} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
            {getGreeting()}, {selectedChild?.name || user?.name}!
          </Text>
          <Text style={styles.subGreeting}>
            Ready to discover something new today?
          </Text>
        </View>

        <ProfileSwitcher
          selectedChildId={selectedChildId}
          onSelectChild={setSelectedChildId}
          onAddChild={onAddChild}
        >
          {profileChildren}
        </ProfileSwitcher>

        {/* <QuickActions
          actions={quickActions}
          onActionPress={handleQuickActionPress}
        />

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Clubs</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={clubs.slice(0, 3)}
            renderItem={({ item }) => (
              <ClubCard club={item} onPress={() => handleClubPress(item.id)} />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={courses.slice(0, 4)}
            renderItem={({ item }) => (
              <CourseCard
                course={item}
                onPress={() => handleCoursePress(item.id)}
                onSubscribe={() => handleSubscribe(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.light,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.neutral.darkest,
  },
  notificationButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  greetingContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.neutral.darkest,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: Colors.neutral.dark,
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.neutral.darkest,
  },
  seeAllText: {
    color: Colors.primary,
    fontWeight: "500",
  },
  horizontalListContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
});

export default HomeScreen;
