import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// Importação simulada para a tela de login
// NOTE: Na vida real, você passaria o objeto 'navigation' e chamaria navigation.navigate('LoginScreen')
// Como estamos em um ambiente de arquivo único, apenas simulamos a ação.
// import LoginScreen from './scr/screens/realizarLogin'; 

const { height, width } = Dimensions.get('window');
const MAIN_PINK = '#ff69b4'; // Rosa vibrante (similar ao das imagens anteriores)
const LIGHT_PINK = '#ffb3d9'; // Rosa mais claro para o degradê

// --- Componente: Botão de Ação ---
const CustomButton = ({ title, primary, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.buttonBase,
        primary ? styles.primaryButton : styles.secondaryButton,
      ]}
    >
      {primary ? (
        <LinearGradient
          colors={[MAIN_PINK, '#ff99c8']} // Degradê de rosa
          style={styles.gradientFill}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        >
          <Text style={styles.primaryButtonText}>{title}</Text>
        </LinearGradient>
      ) : (
        <Text style={styles.secondaryButtonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

// --- Tela Principal: Welcome Screen ---
const WelcomeScreen = ({ navigation }) => {
  // Função para simular a navegação.
  // Em um ambiente real, 'navigation' viria das props.
  const navigateToLogin = () => {
    console.log("Navegando para a tela de Login (src/screens/realizarLogin)...");
    // Se estivesse usando React Navigation:
    // navigation.navigate('LoginScreen');
  };

  const createAccount = () => {
    console.log("Ação: Criar Conta.");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={MAIN_PINK} />

      {/* 1. Seção Superior com Onda e Logo */}
      <View style={styles.topSection}>
        <LinearGradient
          colors={[MAIN_PINK, LIGHT_PINK]}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          {/* Onda (Wave effect) usando borda curvada */}
          <View style={styles.waveClip} />

          {/* Área do Logo */}
          <View style={styles.logoContainer}>
            {/* SUBSTITUA ESTE ÍCONE PELO SEU LOGO:
              Pode ser um componente <Image /> ou um <Svg />.
              Usamos um ícone simples como placeholder.
            */}
            <Ionicons name="sparkles" size={80} color="#fff" />
            <Text style={styles.appName}>BELEZA APP</Text>
          </View>
        </LinearGradient>
      </View>

      {/* 2. Seção Inferior com Texto e Botões */}
      <SafeAreaView style={styles.bottomSection}>
        <Text style={styles.welcomeText}>Bem-vinda(o)!</Text>

        <View style={styles.buttonWrapper}>
          <CustomButton
            title="Criar Conta"
            primary={true}
            onPress={createAccount}
          />
          <CustomButton
            title="Login"
            primary={false}
            onPress={navigateToLogin} // Simula navegação para a tela de login
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // =======================================================
  // 1. Estilos da Seção Superior (Rosa com Onda)
  // =======================================================
  topSection: {
    height: height * 0.5, // Ocupa metade da tela
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight,
  },
  // ONDA: Cria um elemento que usa borderBottomLeftRadius para simular a onda
  waveClip: {
    position: 'absolute',
    bottom: -40, // Move a borda para baixo para criar a curva
    height: 80,
    width: width * 1.5, // Largura extra para garantir a curva suave
    backgroundColor: '#fff', // Cor de fundo da parte de baixo
    borderTopLeftRadius: width * 0.7, // Ajusta o raio da curva
    transform: [{ rotate: '-10deg' }], // Inclina levemente para um visual dinâmico
    zIndex: 2,
    alignSelf: 'center',
  },
  logoContainer: {
    marginTop: -80, // Centraliza o logo na área superior
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1.5,
    marginTop: 5,
  },

  // =======================================================
  // 2. Estilos da Seção Inferior (Boas-vindas e Botões)
  // =======================================================
  bottomSection: {
    flex: 1,
    marginTop: height * 0.5, // Começa após a seção superior
    paddingTop: 50,
    alignItems: 'center',
    zIndex: 3,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 60,
  },
  buttonWrapper: {
    width: '80%',
    maxWidth: 400,
    paddingHorizontal: 20,
    gap: 15,
  },
  // --- Estilos dos Botões ---
  buttonBase: {
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Necessário para o LinearGradient
  },
  // Botão Primário (Criar Conta)
  primaryButton: {
    // A cor de fundo é o gradiente
    shadowColor: MAIN_PINK,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  gradientFill: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  // Botão Secundário (Login)
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: MAIN_PINK,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: MAIN_PINK,
  },
});

export default WelcomeScreen;
