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
        <Link href="/" style={styles.link}>
          <ThemedText type="link">
            {i18n.t("common.screen_go_to_home")}
          </ThemedText>
        </Link>
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
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
