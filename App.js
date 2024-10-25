import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { auth } from './components/config/FirebaseService'; // Ensure path is correct
import { onAuthStateChanged } from 'firebase/auth';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe(); // Remember to unsubscribe on component unmount
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator screenProps={{ isAuthenticated }} />
    </NavigationContainer>
  );
};

export default App;
