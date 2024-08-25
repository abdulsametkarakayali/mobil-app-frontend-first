import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Share, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Clipboard from 'expo-clipboard';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export default function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMessage();
    if (Platform.OS !== 'web') {
      setupNotifications();
    }
  }, []);

  const fetchMessage = async () => {
    try {
      const response = await fetch("https://mobil-app-first-backend.vercel.app/message");  // Android emulator için
      // const response = await fetch("http://localhost:8080/message");  // iOS simulator veya web için
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error fetching message:', error);
      setMessage('Failed to fetch daily message');
    }
  };

  const setupNotifications = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      await schedulePushNotification();
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  };

  const shareMessage = async () => {
    try {
      await Share.share({
        message: message,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share message');
    }
  };

  const copyMessage = async () => {
    await Clipboard.setStringAsync(message);
    Alert.alert('Success', 'Message copied to clipboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.messageText}>{message}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={shareMessage}>
          <Text style={styles.buttonText}>Paylaş</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={copyMessage}>
          <Text style={styles.buttonText}>Kopyala</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

async function schedulePushNotification() {
  if (Platform.OS !== 'web') {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Günün Mesajı",
        body: "Bugünün mesajını görmek için uygulamayı açın!",
      },
      trigger: {
         hour: 9,
        minute: 0,
        repeats: true
      },
    });
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  messageText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', 
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});