import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Card from "@/components/ui/Card";
import { Club } from "@/mocks/clubs";

interface ClubCardProps {
  club: Club;
  onPress: () => void;
}

const ClubCard: React.FC<ClubCardProps> = ({ club, onPress }) => {
  // Placeholder image for demo purposes
  const placeholderImage = "https://via.placeholder.com/150";

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: club.images[0] || placeholderImage }}
            style={styles.image}
            defaultSource={{ uri: placeholderImage }}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>{club.name}</Text>
          <View style={styles.ratingContainer}>
            <Feather name="star" size={16} color="#F59E0B" />
            <Text style={styles.rating}>
              {club.rating} ({club.reviewCount} reviews)
            </Text>
          </View>
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={14} color={Colors.neutral.darkGray} />
            <Text style={styles.location}>
              {club.location}, {club.distance} km away
            </Text>
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
    fontSize: 18,
    fontWeight: "600",
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
});

export default ClubCard;
