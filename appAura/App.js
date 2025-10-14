import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import SplashScreen from './scr/screens/SplashScreen';
import LoginScreen from './scr/screens/realizarLogin';
import homeScreen from './scr/screens/homeScreen';
import carrinhoCompras from './scr/screens/carrinhoCompras';
import categoria from './scr/screens/categoria';
import perfil from './scr/screens/perfil';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Categoria':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Carrinho':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'Perfil':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }
          return (
            <Ionicons name={iconName} size={28} color="#fff" />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={homeScreen} />
      <Tab.Screen name="Categoria" component={categoria} />
      <Tab.Screen name="Carrinho" component={carrinhoCompras} />
      <Tab.Screen name="Perfil" component={perfil} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {loading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
        <Stack.Screen name="Main" component={BottomTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = {
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    elevation: 5,
    backgroundColor: '#FF69B4',
    borderRadius: 15,
    height: 60,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    paddingHorizontal: 20,
  },
};
