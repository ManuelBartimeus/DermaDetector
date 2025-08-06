import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/Header';
import Button from '../components/Button';

const HomeScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // 📸 Launch Camera with permission
  const handleCameraPress = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Camera permission is required!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage({ uri: result.assets[0].uri });
    }
  };

  // 🖼️ Launch Image Library with permission
  const handleImageUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Gallery access is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage({ uri: result.assets[0].uri });
    }
  };

  const handleNext = () => {
    if (selectedImage) {
      navigation.navigate('Preview', { imageUri: selectedImage.uri });
    } else {
      navigation.navigate('Preview');
    }
  };

  // Clear image if coming from Cancel on PreviewScreen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (navigation?.getState()?.routes?.find(r => r.name === 'Home')?.params?.clearImage) {
        setSelectedImage(null);
        navigation.setParams({ clearImage: undefined }); // reset param
      }
    });
    return unsubscribe;
  }, [navigation]);

  // Handler for Cancel button in Header
  const handleCancel = () => {
    if (selectedImage) {
      setSelectedImage(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="MyDermaAI" onCancel={handleCancel} />
      
      <View style={styles.content}>
        <Text style={styles.title}>Skin Disease Detection</Text>
        <Text style={styles.subtitle}>Take or upload a photo of your skin concern</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={handleCameraPress}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>📷</Text>
            </View>
            <Text style={styles.iconText}>Camera</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton} onPress={handleImageUpload}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>📁</Text>
            </View>
            <Text style={styles.iconText}>Upload Image</Text>
          </TouchableOpacity>
        </View>
        
        {selectedImage && (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          </View>
        )}
      </View>

      {/* Next button at the bottom */}
      {selectedImage && (
        <View style={styles.bottomButtonContainer}>
        <Button
          title="Next"
          onPress={handleNext}
          style={styles.nextButton}
          disabled={!selectedImage}
        />
      </View>
      )}

      {/* Bottom Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Cases')}>
          <Text style={styles.tabText}>My Cases</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
  },
  iconText: {
    fontSize: 16,
    color: '#333',
  },
  previewContainer: {
    width: '100%',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  bottomButtonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#fff',
  },
  nextButton: {
    width: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#cce4ff',
    borderTopWidth: 1,
    borderColor: '#b0c4de',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#003366',
  },
});

export default HomeScreen;