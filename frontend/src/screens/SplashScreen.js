import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Derma Care.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default SplashScreen;