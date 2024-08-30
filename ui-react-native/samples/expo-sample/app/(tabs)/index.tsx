import { Image, Text, StyleSheet, Platform, Button } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { launchSession, LaunchSessionResult } from "@trinsic/react-native-ui";
import { useState } from "react";
const SESSION_CREATE_URL =
  "https://api.trinsic-development.com/connect/launch-test?authToken=CiVodHRwczovL3RyaW5zaWMuaWQvc2VjdXJpdHkvdjEvb2Jlcm9uEkkKK3Vybjp0cmluc2ljOndhbGxldHM6eldWcFpVdWJVV1ZaTHJZcXBUM1pTa3ciGnVybjp0cmluc2ljOmVjb3N5c3RlbXM6aWR2GjCV/9d67y0X9vdWRbL62YswBC8drOGXO/KQqBlZGRa0OUZ307fltCgpmOKWrP2UyqwiAA%3D%3D&idvProviderSelection=trinsicfake&noRedirect=true";
export default function HomeScreen() {
  const [result, setResult] = useState<LaunchSessionResult | null>();
  const [error, setError] = useState<string | null>();

  const handleButtonPress = async () => {
    const getSessionUrlResult = await fetch(SESSION_CREATE_URL);
    const launchUrl = await getSessionUrlResult.text();
    const callbackUrl =
      "trinsic-ui-example-redirect-scheme-react-native://callback";
    const result = await launchSession(launchUrl, callbackUrl);
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
      <Button title="Launch Session" onPress={handleButtonPress} />
      {!!error && <Text>{error}</Text>}
      {!!result && (
        <>
          <Text>Session ID: {result.sessionId}</Text>
          <Text>Results Access Key: {result.resultsAccessKey}</Text>
          <Text>Success: {result.success ? "true" : "false"}</Text>
          <Text>Cancelled: {result.canceled ? "true" : "false"}</Text>
        </>
      )}
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
