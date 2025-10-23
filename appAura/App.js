import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Text } from 'react-native';

// Importações dos Componentes de Tela EXISTENTES
import SplashScreen from './scr/screens/SplashScreen';
import LoginScreen from './scr/screens/realizarLogin';
import homeScreen from './scr/screens/homeScreen';
import carrinhoCompras from './scr/screens/carrinhoCompras';
import categoria from './scr/screens/categoria';
import perfil from './scr/screens/perfil';
import Pagamento from './scr/screens/metodopagamento';

// NOVAS TELAS DE PRODUTO ADICIONADAS AQUI
import Produto from './scr/screens/produto';
import Produto2 from './scr/screens/produto2';
import Produto3 from './scr/screens/produto3';
import Produto4 from './scr/screens/produto4';
import Produto5 from './scr/screens/produto5';
import Produto6 from './scr/screens/produto6';
import Produto7 from './scr/screens/produto7';
import Produto8 from './scr/screens/produto8';

// TELAS ADICIONAIS SOLICITADAS (Favoritos, Notificações e Subcategorias)
import FavoritosScreen from './scr/screens/FavoritosScreen';
import NotificacoesScreen from './scr/screens/NotificacoesScreen';
import CategoriaCabeloScreen from './scr/screens/CategoriaCabeloScreen';
import CategoriaPeleScreen from './scr/screens/CategoriaPeleScreen';
import CategoriaMaquiagemScreen from './scr/screens/CategoriaMaquiagemScreen';
import CategoriaPerfumeScreen from './scr/screens/CategoriaPerfumeScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Definindo cores para consistência
const PRIMARY_PINK = '#ff86b5'; // Rosa Vibrante
const ICON_INACTIVE_COLOR = '#666'; // Cinza para ícones inativos
const ICON_ACTIVE_COLOR = '#fff'; // Branco para ícones ativos
const TAB_BACKGROUND = '#fff'; // Fundo branco

function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,

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
                size={24}
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
        
        {/* Rotas Principais */}
        <Stack.Screen name="Main" component={BottomTabs} />
        <Stack.Screen name="Pagamento" component={Pagamento} />

        {/* =================================================== */}
        {/* ROTAS NOVAS SOLICITADAS */}
        {/* Favoritos e Notificações */}
        <Stack.Screen 
          name="Favoritos" 
          component={FavoritosScreen} 
          options={{ headerShown: true, title: 'Favoritos' }}
        />
        <Stack.Screen 
          name="Notificacoes" 
          component={NotificacoesScreen} 
          options={{ headerShown: true, title: 'Notificações' }}
        />

        {/* Categorias Específicas */}
        <Stack.Screen 
          name="CategoriaCabelo" 
          component={CategoriaCabeloScreen} 
          options={{ headerShown: true, title: 'Cabelo' }}
        />
        <Stack.Screen 
          name="CategoriaPele" 
          component={CategoriaPeleScreen} 
          options={{ headerShown: true, title: 'Pele' }}
        />
        <Stack.Screen 
          name="CategoriaMaquiagem" 
          component={CategoriaMaquiagemScreen} 
          options={{ headerShown: true, title: 'Maquiagem' }}
        />
        <Stack.Screen 
          name="CategoriaPerfume" 
          component={CategoriaPerfumeScreen} 
          options={{ headerShown: true, title: 'Perfume' }}
        />
        {/* =================================================== */}

        {/* ROTAS DE DETALHE DO PRODUTO (Produto 1 a 8) */}
        <Stack.Screen name="Produto" component={Produto} /> 
        <Stack.Screen name="Produto2" component={Produto2} /> 
        <Stack.Screen name="Produto3" component={Produto3} /> 
        <Stack.Screen name="Produto4" component={Produto4} /> 
        <Stack.Screen name="Produto5" component={Produto5} /> 
        <Stack.Screen name="Produto6" component={Produto6} /> 
        <Stack.Screen name="Produto7" component={Produto7} /> 
        <Stack.Screen name="Produto8" component={Produto8} /> 
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
    height: 75,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    borderTopWidth: 0,
    paddingBottom: 5,
    paddingTop: 10,
  },

  // Estilo do Rótulo (Texto)
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 5,
  },

  // ÍCONE ATIVO: O círculo flutuante
  iconContainerActive: {
    position: 'absolute',
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: PRIMARY_PINK,
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
    width: 55,
    height: 30,
  },
});
