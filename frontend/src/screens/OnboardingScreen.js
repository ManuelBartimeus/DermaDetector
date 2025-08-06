import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import Button from '../components/Button';

const OnboardingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>MyDermaAI</Text>
        <Text style={styles.subtitle}>Skin Disease Detection</Text>

        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/onboarding.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.description}>
          Detect skin conditions quickly and accurately using our advanced AI technology
        </Text>

        <Button
          title="Get Started"
          onPress={() => navigation.navigate('Home')}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    marginBottom: 40,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    width: '80%',
  },
});

export default OnboardingScreen;