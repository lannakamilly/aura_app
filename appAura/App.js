import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import SplashScreen from './scr/screens/SplashScreen';
import PaginaInicial from './scr/screens/paginainicial';
import HomeScreen from './scr/screens/homeScreen';
import CarrinhoCompras from './scr/screens/carrinhoCompras';
import RealizarCadastro from './scr/screens/realizarCadastro';
import RealizarLogin from './scr/screens/realizarLogin';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Inicial') iconName = 'search';
          else if (route.name === 'Carrinho') iconName = 'cart';
          else if (route.name === 'Login') iconName = 'person';
          else if (route.name === 'Cadastro') iconName = 'person-add';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicial" component={PaginaInicial} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Carrinho" component={CarrinhoCompras} />
      <Tab.Screen name="Login" component={RealizarLogin} />
      <Tab.Screen name="Cadastro" component={RealizarCadastro} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  // Mantém SplashScreen por 2 segundos
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {loading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : (
          <Stack.Screen name="Main" component={BottomTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
