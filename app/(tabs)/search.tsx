import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import ClubCard from "@/components/ClubCard";
import Card from "@/components/ui/Card";
import { useClubStore } from "@/stores/clubStore";

const SearchScreen = () => {
  const {
    clubs,
    filteredClubs,
    recentSearches,
    fetchClubs,
    searchClubs,
    setFilters,
    clearFilters,
  } = useClubStore();

  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(params?.category || "");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'

  useEffect(() => {
    fetchClubs();

    // Apply category filter from route params if provided
    if (params?.category) {
      setFilters({ category: params.category });
    }
  }, []);

  type Category = {
    id: string;
    name: string;
    icon?: keyof typeof Feather.glyphMap;
    color?: string;
  };
  const categories: Category[] = [
    { id: "", name: "All", icon: "grid", color: Colors.primary },
    { id: "Music", name: "Music", icon: "music", color: Colors.primary },
    { id: "Dance", name: "Dance", icon: "zap", color: Colors.primary },
    {
      id: "Swimming",
      name: "Swimming",
      icon: "droplet",
      color: Colors.primary,
    },
    { id: "Language", name: "Language", icon: "book", color: Colors.primary },
    { id: "Art", name: "Art", icon: "image", color: Colors.primary },
    {
      id: "Other",
      name: "Other",
      icon: "more-horizontal",
      color: Colors.primary,
    },
  ];

  const handleSearch = () => {
    searchClubs(searchQuery);
  };

  const handleCategoryPress = (categoryId: string) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
      clearFilters();
    } else {
      setActiveCategory(categoryId);
      setFilters({ category: categoryId });
    }
  };

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query);
    searchClubs(query);
  };

  const handleClubPress = (clubId: string) => {
    console.log(`Navigating to club with ID: ${clubId}`);
    router.push({
      pathname: "/(screens)/[clubId]",
      params: { clubId },
    });
  };

  const renderCategoryChip = (category: Category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryChip,
        activeCategory === category.id && { backgroundColor: Colors.primary },
      ]}
      onPress={() => handleCategoryPress(category.id)}
    >
      {category.icon && (
        <Feather
          name={category.icon}
          size={16}
          color={
            activeCategory === category.id
              ? Colors.neutral.white
              : category.color || Colors.neutral.dark
          }
        />
      )}
      <Text
        style={[
          styles.categoryText,
          activeCategory === category.id && { color: Colors.neutral.white },
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>ClubHub</Text>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => router.replace("/(screens)/notifications")}
        >
          <Feather name="bell" size={24} color={Colors.neutral.darkest} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Feather
            name="search"
            size={20}
            color={Colors.neutral.darkGray}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clubs, activities..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      <View style={styles.categoriesHeader}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(renderCategoryChip)}
        </ScrollView>
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          Showing {filteredClubs.length} clubs nearby
        </Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              viewMode === "list" && styles.activeViewToggleButton,
            ]}
            onPress={() => setViewMode("list")}
          >
            <Feather
              name="list"
              size={18}
              color={
                viewMode === "list" ? Colors.primary : Colors.neutral.darkGray
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              viewMode === "map" && styles.activeViewToggleButton,
            ]}
            onPress={() => setViewMode("map")}
          >
            <Feather
              name="map"
              size={18}
              color={
                viewMode === "map" ? Colors.primary : Colors.neutral.darkGray
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      {searchQuery === "" && recentSearches.length > 0 && (
        <View style={styles.recentSearchesContainer}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          {recentSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentSearchItem}
              onPress={() => handleRecentSearchPress(search)}
            >
              <Feather name="clock" size={16} color={Colors.neutral.darkGray} />
              <Text style={styles.recentSearchText}>{search}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {searchQuery === "" && activeCategory === "" && (
        <View style={styles.popularCategoriesContainer}>
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <View style={styles.categoriesGrid}>
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => handleCategoryPress("Dance")}
            >
              <View
                style={[styles.categoryIcon, { backgroundColor: "#E0F2F1" }]}
              >
                <Feather name="zap" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.categoryCardTitle}>Dance</Text>
              <Text style={styles.categoryCardCount}>142 clubs(todo)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => handleCategoryPress("Swimming")}
            >
              <View
                style={[styles.categoryIcon, { backgroundColor: "#E8EAF6" }]}
              >
                <Feather
                  name="droplet"
                  size={24}
                  color={Colors.secondary.blue}
                />
              </View>
              <Text style={styles.categoryCardTitle}>Swimming</Text>
              <Text style={styles.categoryCardCount}>68 clubs(todo)</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {filteredClubs.length > 0 ? (
        <FlatList
          data={filteredClubs}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.clubItem}
              onPress={() => handleClubPress(item.id)}
            >
              <Card style={styles.clubCard}>
                <View style={styles.clubCardContent}>
                  <View style={styles.clubImagePlaceholder} />
                  <View style={styles.clubInfo}>
                    <Text style={styles.clubName}>{item.name}</Text>
                    <View style={styles.clubRating}>
                      <Feather name="star" size={14} color="#F59E0B" />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                    <View style={styles.clubLocation}>
                      <Feather
                        name="map-pin"
                        size={14}
                        color={Colors.neutral.darkGray}
                      />
                      <Text style={styles.locationText}>
                        {item.location}, {item.distance} km away
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.clubsList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Feather name="search" size={48} color={Colors.neutral.medium} />
          <Text style={styles.emptyStateTitle}>No results found</Text>
          <Text style={styles.emptyStateText}>
            Try adjusting your search or filters to find what you are looking
            for.
          </Text>
        </View>
      )}
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
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.neutral.darkest,
  },
  notificationButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.lightest,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.neutral.darkest,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.light,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    color: Colors.neutral.dark,
  },
  categoriesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsText: {
    fontSize: 16,
    color: Colors.neutral.dark,
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: Colors.neutral.light,
    borderRadius: 8,
    overflow: "hidden",
  },
  viewToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activeViewToggleButton: {
    backgroundColor: Colors.neutral.lightest,
  },
  recentSearchesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.neutral.darkest,
    marginBottom: 12,
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.light,
  },
  recentSearchText: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.neutral.dark,
  },
  popularCategoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "48%",
    backgroundColor: Colors.neutral.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.neutral.light,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  categoryCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.neutral.darkest,
    marginBottom: 4,
  },
  categoryCardCount: {
    fontSize: 14,
    color: Colors.neutral.darkGray,
  },
  clubsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  clubItem: {
    marginBottom: 12,
  },
  clubCard: {
    padding: 0,
  },
  clubCardContent: {
    flexDirection: "row",
    padding: 12,
  },
  clubImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.neutral.light,
    marginRight: 12,
  },
  clubInfo: {
    flex: 1,
    justifyContent: "center",
  },
  clubName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral.darkest,
    marginBottom: 4,
  },
  clubRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: Colors.neutral.dark,
  },
  clubLocation: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 4,
    fontSize: 12,
    color: Colors.neutral.darkGray,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  },
});

export default SearchScreen;
