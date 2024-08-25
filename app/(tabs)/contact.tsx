import React from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const email = 'sametkarakayali@mail.com';

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>İletişim</Text>
      <Text style={styles.text}>Bize ulaşmak için:</Text>
      <Text 
        style={styles.email}
        onPress={() => Linking.openURL(`mailto:${email}`)}
      >
        {email}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});