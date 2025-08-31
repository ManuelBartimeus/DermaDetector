import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Header from '../components/Header';
import Button from '../components/Button';
import { detectSkinDisease } from '../services/skinDetectionService';
import { validateImageUri, getErrorMessage } from '../utils/helpers';

const PreviewScreen = ({ route, navigation }) => {
  const imageUri = route?.params?.imageUri;
  const [loading, setLoading] = useState(false);

  const sendImageForDetection = async (imageUri) => {
    try {
      const result = await detectSkinDisease(imageUri);
      return result;
    } catch (error) {
      console.error('Detection error:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigation.navigate('Home', { clearImage: true });
  };

  const handleStartDetection = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'No image selected for detection.');
      return;
    }

    if (!validateImageUri(imageUri)) {
      Alert.alert('Error', 'Invalid image format. Please select a valid image.');
      return;
    }

    setLoading(true);
    try {
      const resultData = await sendImageForDetection(imageUri);

      if (resultData.success) {
        navigation.navigate('Result', {
          resultData,
          imageUri,
        });
      } else {
        Alert.alert('Detection Failed', 'Unable to analyze the image. Please try again.');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      Alert.alert('Detection Error', errorMessage, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Image Preview" navigation={navigation} showCancelButton={true} />
      <View style={styles.content}>
        {imageUri ? (
          <>
            <Text style={styles.imageLabel}>Your Selected Skin Image</Text>
            <View style={styles.previewWrapper}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
            </View>
            <Text style={styles.description}>
              Ensure the image is clear and well-lit. AI analysis will attempt to identify visible skin conditions.
            </Text>
          </>
        ) : (
          <Text>No image selected.</Text>
        )}
      </View>

      <View style={styles.bottomArea}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#005a9c" />
            <Text style={styles.loadingText}>Analyzing image...</Text>
            <Text style={styles.loadingSubtext}>This may take a few seconds</Text>
          </View>
        ) : (
          imageUri && (
            <>
              <Button
                title="Start Detection"
                onPress={handleStartDetection}
                style={styles.detectButton}
              />
              <TouchableOpacity onPress={handleCancel} style={styles.retakeButton}>
                <Text style={styles.retakeText}>Retake Image</Text>
              </TouchableOpacity>
            </>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  previewWrapper: {
    borderWidth: 2,
    borderColor: '#005a9c',
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 12,
    backgroundColor: '#f0f8ff',
  },
  previewImage: {
    width: 280,
    height: 280,
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#005a9c',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginTop: 14,
    paddingHorizontal: 8,
  },
  bottomArea: {
    paddingBottom: 40,
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  detectButton: {
    width: 200,
    marginTop: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#005a9c',
  },
  loadingSubtext: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  retakeButton: {
    marginTop: 12,
  },
  retakeText: {
    color: '#cc0000',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default PreviewScreen;
