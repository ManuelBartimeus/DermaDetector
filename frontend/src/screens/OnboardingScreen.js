import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, FlatList, Dimensions } from 'react-native';
import Button from '../components/Button';

const images = [
  require('../../assets/images/onboarding.png'),
  require('../../assets/images/onboarding2.png'),
  require('../../assets/images/onboarding3.png'),
];

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  // Auto-scroll carousel every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % images.length;
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 2000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  // Prevent error if user swipes manually
  const handleMomentumScrollEnd = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>MyDerma Care</Text>
        <Text style={styles.subtitle}>Skin Disease Detection</Text>

        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <Image source={item} style={styles.image} resizeMode="contain" />
            )}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            snapToInterval={width}
            decelerationRate="fast"
          />
        </View>

        <Text style={styles.description}>
          This app uses AI to help detect skin conditions. It is not a replacement for medical advice or treatment.
          Please consult a qualified healthcare professional or dermatologist for accurate evaluation.
        </Text>

        <Button
          title="I understand. Get Started"
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
  carouselContainer: {
    width: '110%',
    height: 300,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.9,
    height: 260,
    alignSelf: 'center',
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