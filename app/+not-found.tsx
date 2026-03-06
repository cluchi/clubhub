import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import i18n from "@/i18n";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: i18n.t("common.oops") }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">
          {i18n.t("common.screen_not_exist")}
        </ThemedText>

        <ThemedView style={styles.navigationContainer}>
          <ThemedText style={styles.navigationTitle}>
            {i18n.t("common.navigate_to")}
          </ThemedText>

          <Link href="/(auth)/LoginScreen" style={styles.navLink}>
            <ThemedText type="link">{i18n.t("common.login")}</ThemedText>
          </Link>

          <Link href="/(tabs)/home" style={styles.navLink}>
            <ThemedText type="link">{i18n.t("common.home")}</ThemedText>
          </Link>

          <Link href="/(tabs)/search" style={styles.navLink}>
            <ThemedText type="link">{i18n.t("common.search")}</ThemedText>
          </Link>

          <Link href="/(screens)/profile" style={styles.navLink}>
            <ThemedText type="link">{i18n.t("common.profile")}</ThemedText>
          </Link>
        </ThemedView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  navigationContainer: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },
  navigationTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    fontWeight: "500",
  },
  navLink: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 6,
    minWidth: 200,
    alignItems: "center",
  },
});
