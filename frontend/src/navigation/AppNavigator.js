import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import PreviewScreen from '../screens/PreviewScreen';
import ResultScreen from '../screens/ResultScreen';
import CasesScreen from '../screens/CasesScreen';
import SplashScreen from '../screens/SplashScreen';


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen}  headerShown={false} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Preview" component={PreviewScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Cases" component={CasesScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;