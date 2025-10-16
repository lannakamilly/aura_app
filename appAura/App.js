import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, TouchableOpacity } from 'react-native'; 
import { Text } from 'react-native'; // Adicionado para estilizar o rótulo

import SplashScreen from './scr/screens/SplashScreen';
import LoginScreen from './scr/screens/realizarLogin'; 
import homeScreen from './scr/screens/homeScreen';
import carrinhoCompras from './scr/screens/carrinhoCompras';
import categoria from './scr/screens/categoria';
import perfil from './scr/screens/perfil';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Definindo cores para consistência
const PRIMARY_PINK = '#ff86b5'; // Rosa Vibrante
const ICON_INACTIVE_COLOR = '#666'; // Cinza um pouco mais claro que antes, mas ainda contrastante
const ICON_ACTIVE_COLOR = '#fff'; // Branco
const TAB_BACKGROUND = '#fff'; // Fundo branco

function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true, // Mostrar rótulos de tela
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        
        // Estilo do ícone principal e do indicador circular
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
            default:
              iconName = 'help-circle-outline';
          }
          
          // Estilizando o ícone: Círculo flutuante quando focado
          return (
            <View style={focused ? styles.iconContainerActive : styles.iconContainerInactive}>
              <Ionicons 
                name={iconName} 
                size={24} // Tamanho padrão, mais limpo
                color={focused ? ICON_ACTIVE_COLOR : ICON_INACTIVE_COLOR} 
              />
            </View>
          );
        },
        
        // Cor do rótulo
        tabBarActiveTintColor: PRIMARY_PINK,
        tabBarInactiveTintColor: ICON_INACTIVE_COLOR,
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
    // Definindo o tempo de splash screen
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

const styles = StyleSheet.create({
  // Estilo principal da barra de navegação (Tab Bar)
  tabBar: {
    position: 'absolute',
    bottom: 25, 
    left: 20,
    right: 20,
    elevation: 4, 
    backgroundColor: TAB_BACKGROUND, 
    borderRadius: 25, 
    height: 75, // Aumentei um pouco a altura para melhor espaçamento interno
    shadowColor: '#000',
    shadowOpacity: 0.1, // Sombra mais sutil e difusa
    shadowOffset: { width: 0, height: 8 }, 
    shadowRadius: 10,
    borderTopWidth: 0, 
    paddingBottom: 5, 
    paddingTop: 10,
  },
  
  // Estilo do Rótulo (Texto)
  tabBarLabel: {
    fontSize: 12, // Tamanho ligeiramente maior para melhor leitura
    fontWeight: '700', 
    marginBottom: 5, 
  },

  // ÍCONE ATIVO: O círculo flutuante
  iconContainerActive: {
    // Usa 'top' para mover o círculo para cima, simulando o corte
    position: 'absolute', 
    top: -20, // Movido ligeiramente para cima para um corte mais definido
    justifyContent: 'center',
    alignItems: 'center',
    width: 45, // Diâmetro ligeiramente maior para ser mais proeminente
    height: 45, 
    borderRadius: 30, // Mais arredondado
    backgroundColor: PRIMARY_PINK, 
    
    // Sombra mais suave e limpa para o indicador
    shadowColor: PRIMARY_PINK,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  
  // ÍCONE INATIVO: Apenas o ícone na cor cinza, sem fundo
  iconContainerInactive: {
    padding: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    width: 55, // Largura igual ao ativo para alinhamento
    height: 30, 
  }
});
