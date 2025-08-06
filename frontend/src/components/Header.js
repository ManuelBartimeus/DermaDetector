import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const Header = ({
  title,
  showBackButton = true,
  showCancelButton = true,
  onCancel,
  showDoneButton = false,
  onDone,
}) => {
  const navigation = useNavigation();
  const route = useRoute();

  // Determine if we are on the ResultScreen
  const isResultScreen = route.name === 'Result';

  // Determine if we are on Splash or Onboarding (no cancel/done)
  const isSplashOrOnboarding =
    route.name === 'Splash' || route.name === 'Onboarding';

  return (
    <View style={styles.header}>
      <View style={styles.leftRow}>
        {showBackButton && !isSplashOrOnboarding && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.headerTitle}>{title}</Text>
      {/* Show "Done" only on ResultScreen, "Cancel" on others except Splash/Onboarding */}
      {isResultScreen && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onDone ? onDone : () => navigation.navigate('Cases')}
        >
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      )}
      {!isResultScreen && !isSplashOrOnboarding && showCancelButton && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel ? onCancel : () => navigation.navigate('Home', { clearImage: true })}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 22,
    color: '#4A90E2',
  },
  cancelButton: {
    padding: 8,
    marginLeft: 12,
  },
  cancelText: {
    color: '#d00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  doneText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Header;