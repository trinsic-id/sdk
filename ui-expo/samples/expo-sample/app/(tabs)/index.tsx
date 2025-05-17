import { Image, StyleSheet, Platform, Button } from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import * as Linking from "expo-linking";
import { launchSession, LaunchSessionResult } from "@trinsic/expo-ui";
const SESSION_CREATE_URL = "https://api.trinsic.id/api/mobiletest/create-session";

export default function HomeScreen() {
  const [result, setResult] = useState<LaunchSessionResult | null>();
  const handleButtonPress = async () => {
    const callbackPath = "/";
    const url = Linking.createURL(callbackPath);
    const fetchUrl = SESSION_CREATE_URL + "?redirectUrl=" +encodeURIComponent(url);
    console.log("Creating session at fake API endpoint: ", fetchUrl);
    const getSessionUrlResult = await fetch(fetchUrl);
    const launchUrl = await getSessionUrlResult.text();
    console.log("Launch URL: ", launchUrl);
    const result = await launchSession(launchUrl, callbackPath);
    setResult(result);
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Button title="Launch Session" onPress={handleButtonPress} />
        {!!result && (
          <>
            <ThemedText>Session ID: {result.sessionId}</ThemedText>
            <ThemedText>
              Results Access Key: {result.resultsAccessKey}
            </ThemedText>
            <ThemedText>
              Success: {result.success ? "true" : "false"}
            </ThemedText>
            <ThemedText>
              Cancelled: {result.canceled ? "true" : "false"}
            </ThemedText>
          </>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
