/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

import {launchSession, LaunchSessionResult} from '@trinsic/react-native-ui';
const SESSION_CREATE_URL =
  'https://api.trinsic-development.com/connect/launch-test?redirectSchemeTest=true&noRedirect=true';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [result, setResult] = useState<LaunchSessionResult | null>();
  const [error, setError] = useState<string | null>();
  const handleButtonPress = async () => {
    const getSessionUrlResult = await fetch(SESSION_CREATE_URL);
    const launchUrl = await getSessionUrlResult.text();
    const result = await launchSession(
      launchUrl,
      'id.trinsic.react-native-sample://callback',
    );
    setResult(result);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button title="Launch Session" onPress={handleButtonPress} />
          {!!error && <Text>{error}</Text>}
          {!!result && (
            <>
              <Text>Session ID: {result.sessionId}</Text>
              <Text>Results Access Key: {result.resultsAccessKey}</Text>
              <Text>Success: {result.success ? 'true' : 'false'}</Text>
              <Text>Cancelled: {result.canceled ? 'true' : 'false'}</Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
