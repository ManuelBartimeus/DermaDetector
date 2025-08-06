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
import { detectSkinDisease } from '../services/roboflowService';
import { validateImageUri, getErrorMessage } from '../utils/helpers';

const PreviewScreen = ({ route, navigation }) => {
  const imageUri = route?.params?.imageUri;
  const [loading, setLoading] = useState(false);

  const sendImageForDetection = async (imageUri) => {
    try {
      // Use the actual Roboflow API for skin disease detection
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
      console.error('Detection error:', error);
      const errorMessage = getErrorMessage(error);
      Alert.alert('Detection Error', errorMessage, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Keep the Header with back button */}
      <Header title="Image Preview" navigation={navigation} />

      <View style={styles.content}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
        ) : (
          <Text>No image selected.</Text>
        )}
      </View>

      <View style={styles.bottomButtonContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#005a9c" />
            <Text style={styles.loadingText}>Analyzing image...</Text>
            <Text style={styles.loadingSubtext}>This may take a few seconds</Text>
          </View>
        ) : (
          imageUri && (
            <Button
              title="Start Detection"
              onPress={handleStartDetection}
              style={styles.nextButton}
            />
          )
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    color: '#d00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  previewImage: {
    width: 300,
    height: 300,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  bottomButtonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  nextButton: {
    width: 180,
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
});

export default PreviewScreen;
