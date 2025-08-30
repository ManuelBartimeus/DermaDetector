import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { CasesProvider } from './src/context/CasesContext';

const App = () => {
  return (
    <CasesProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </CasesProvider>
  );
};

export default App;