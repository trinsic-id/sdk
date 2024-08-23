import { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { launchSession } from '@trinsic/react-native-ui';

export default function App() {
  const [result, setResult] = useState<string | null>();

  useEffect(() => {
    launchSession('https://test.com', 'example://callback').then((r) =>
      setResult(
        r.resultsAccessKey +
          (r.sessionId === null ? 'session is null' : 'session is not null')
      )
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
