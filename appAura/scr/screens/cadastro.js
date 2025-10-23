import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, KeyboardAvoidingView, Platform, Image, Dimensions 
} from 'react-native';

const { height } = Dimensions.get('window'); 
const PRIMARY_COLOR = "#FEA7B5"; 
const LIGHT_BG = "#FDF6F8"; 
const GRAY_TEXT = "#707070";
const DARK_TEXT = "#333333";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    navigation.navigate('Main'); // Vai pra tela principal
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Image
        source={{ uri: "https://placehold.co/800x1200/FDF6F8/FEA7B5?text=FUNDO" }} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View style={styles.topHeader}>
        <View style={styles.decorationCircle1} />
        <View style={styles.decorationCircle2} />
        <Text style={styles.headerTitle}>Bem-vindo(a)</Text>
      </View>

      <View style={styles.loginCard}>
        <Text style={styles.title}>Faça Login</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seu.email@exemplo.com"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#B0B0B0"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            placeholderTextColor="#B0B0B0"
          />
        </View>

        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Não tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signUpText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG },
  backgroundImage: { ...StyleSheet.absoluteFillObject, opacity: 0.2 },
  topHeader: {
    height: height * 0.35,
    backgroundColor: PRIMARY_COLOR,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#fff' },
  decorationCircle1: {
    position: 'absolute', width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', top: -50, left: -50,
  },
  decorationCircle2: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', bottom: 20, right: 40,
  },
  loginCard: {
    width: '90%', backgroundColor: '#fff', borderRadius: 30,
    paddingHorizontal: 30, paddingVertical: 40, alignSelf: 'center',
    marginTop: -80, shadowColor: PRIMARY_COLOR, shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3, shadowRadius: 25, elevation: 25,
  },
  title: { fontSize: 28, fontWeight: '800', color: DARK_TEXT, marginBottom: 35 },
  inputContainer: { marginBottom: 25 },
  label: { fontSize: 14, color: DARK_TEXT, fontWeight: '700', marginBottom: 8 },
  input: {
    width: '100%', height: 55, backgroundColor: '#fff', borderRadius: 15,
    paddingHorizontal: 15, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0',
  },
  forgotPasswordButton: { alignSelf: 'flex-end', marginBottom: 35 },
  forgotPasswordText: { color: PRIMARY_COLOR, fontSize: 14, fontWeight: '600' },
  button: {
    width: '100%', height: 55, backgroundColor: PRIMARY_COLOR, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center', elevation: 10,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { color: GRAY_TEXT, fontSize: 16 },
  signUpText: { color: PRIMARY_COLOR, fontSize: 16, fontWeight: '700', marginLeft: 5 },
});
