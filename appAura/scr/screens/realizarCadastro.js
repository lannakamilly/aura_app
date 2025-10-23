import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, KeyboardAvoidingView, Platform, Image, Dimensions, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window'); 
// Definindo cores consistentes
const PRIMARY_COLOR_LIGHT = "#FFADD6"; 
const PRIMARY_COLOR_DARK = "#ff86b5"; 
const LIGHT_BG = "#FDF6F8"; 
const GRAY_TEXT = "#707070";
const DARK_TEXT = "#333333";

export default function RegisterScreen({ navigation }) {
  // Estados para Cadastro
  const [registerNome, setRegisterNome] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerSenha, setRegisterSenha] = useState('');
  const [registerConfirmarSenha, setRegisterConfirmarSenha] = useState('');

  // Lógica de Cadastro
  const handleRegister = () => {
    console.log("Tentativa de Cadastro:", { registerNome, registerEmail, registerSenha, registerConfirmarSenha });
    
    if (registerSenha !== registerConfirmarSenha) {
        // Em um app real, você mostraria uma mensagem de erro ao usuário (e não um alert)
        console.error("Senhas não conferem!");
        return; 
    }

    // Lógica real de autenticação viria aqui.
    // Se o cadastro for bem-sucedido:
    // navigation.navigate('Login', { email: registerEmail });
    
    // Por enquanto, apenas voltamos para a tela de Login
    navigation.goBack(); 

    // Opcional: Limpar campos após o registro
    setRegisterNome('');
    setRegisterEmail('');
    setRegisterSenha('');
    setRegisterConfirmarSenha('');
  };

  // Componente do Formulário de Cadastro
  const RegisterForm = () => (
    <View style={styles.loginCard}>
      <Text style={styles.title}>Cadastre-se</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu nome"
          value={registerNome}
          onChangeText={setRegisterNome}
          placeholderTextColor="#B0B0B0"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seu.email@exemplo.com"
          value={registerEmail}
          onChangeText={setRegisterEmail}
          placeholderTextColor="#B0B0B0"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Crie uma senha"
          secureTextEntry
          value={registerSenha}
          onChangeText={setRegisterSenha}
          placeholderTextColor="#B0B0B0"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Repita a senha"
          secureTextEntry
          value={registerConfirmarSenha}
          onChangeText={setRegisterConfirmarSenha}
          placeholderTextColor="#B0B0B0"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Imagem de fundo sutil - manter ou remover conforme preferência */}
        <Image
          source={{ uri: "https://placehold.co/800x1200/FDF6F8/FEA7B5?text=FUNDO" }} 
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        <LinearGradient
          colors={[PRIMARY_COLOR_LIGHT, PRIMARY_COLOR_DARK]}
          style={styles.topHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Seu Logo aqui */}
          <Image
            source={require('../assets/logopng.png')} // Substitua pelo caminho do seu logo
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>
            Criar Sua Conta
          </Text>
        </LinearGradient>

        {/* Renderiza o Formulário de Cadastro */}
        <RegisterForm />
        
        {/* Container para voltar ao Login */}
        <View style={styles.switchContainer}>
          <Text style={styles.registerText}>
            Já tem uma conta?
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}> 
            <Text style={styles.signUpText}>
              Faça Login
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Espaçamento extra para evitar que o conteúdo fique atrás do teclado */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG },
  scrollContent: { flexGrow: 1, paddingBottom: 20 }, // Permite a rolagem
  backgroundImage: { ...StyleSheet.absoluteFillObject, opacity: 0.1, top: height * 0.25 },
  
  // Header
  topHeader: {
    height: height * 0.4, 
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  logo: {
    width: 120, 
    height: 120,
    marginBottom: 10,
  },
  headerTitle: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: '#fff', 
    textShadowColor: 'rgba(0,0,0,0.15)', 
    textShadowOffset: {width: 1, height: 1}, 
    textShadowRadius: 2 
  },
  
  // Card de Formulário (Login/Cadastro)
  loginCard: {
    width: '90%', 
    backgroundColor: '#fff', 
    borderRadius: 30,
    paddingHorizontal: 30, 
    paddingVertical: 40, 
    alignSelf: 'center',
    marginTop: -80, 
    shadowColor: PRIMARY_COLOR_DARK, 
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3, 
    shadowRadius: 25, 
    elevation: 25,
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: '800', color: DARK_TEXT, marginBottom: 35, textAlign: 'center' },
  inputContainer: { marginBottom: 25 },
  label: { fontSize: 14, color: DARK_TEXT, fontWeight: '700', marginBottom: 8 },
  input: {
    width: '100%', 
    height: 55, 
    backgroundColor: LIGHT_BG, 
    borderRadius: 15,
    paddingHorizontal: 15, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: '#E0E0E0',
  },
  // O botão de "Esqueceu a senha" foi removido daqui, pois não se aplica ao cadastro.
  
  // Botão Principal
  button: {
    width: '100%', 
    height: 55, 
    backgroundColor: PRIMARY_COLOR_DARK, 
    borderRadius: 15,
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 10,
    shadowColor: PRIMARY_COLOR_DARK, 
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  
  // Container de Alternância (Bottom)
  switchContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 10,
    marginBottom: 20, 
  },
  registerText: { color: GRAY_TEXT, fontSize: 16 },
  signUpText: { color: PRIMARY_COLOR_DARK, fontSize: 16, fontWeight: '700', marginLeft: 5 },
});
