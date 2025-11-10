import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, KeyboardAvoidingView, Platform, Image, Dimensions, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../screens/supabase';

const { height } = Dimensions.get('window'); 

const PRIMARY_COLOR_LIGHT = "#FFADD6"; 
const PRIMARY_COLOR_DARK = "#fdcadeff";
const LIGHT_BG = "#FDF6F8"; 
const GRAY_TEXT = "#707070";
const DARK_TEXT = "#333333";

export default function RegisterScreen({ navigation }) {
  const [registerNome, setRegisterNome] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerSenha, setRegisterSenha] = useState('');
  const [registerConfirmarSenha, setRegisterConfirmarSenha] = useState('');

  const handleRegister = async () => {
    if (registerSenha !== registerConfirmarSenha) {
      alert("As senhas não conferem!");
      return;
    }

    try {
      // Verifica se o e-mail já existe antes de cadastrar
      const { data: existingUser } = await supabase
        .from('usuarios')
        .select('email')
        .eq('email', registerEmail)
        .single();

      if (existingUser) {
        alert("Este e-mail já está cadastrado. Tente fazer login.");
        return;
      }

      // Faz o cadastro
      const { data, error } = await supabase
        .from('usuarios')
        .insert([
          { nome: registerNome, email: registerEmail, senha: registerSenha }
        ]);

      if (error) {
        console.error(error);
        alert("Erro ao cadastrar: " + error.message);
      } else {
        alert("Cadastro realizado com sucesso!");
        navigation.navigate('Login');
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      alert("Ocorreu um erro. Tente novamente.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
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
          <Image
            source={require('../assets/aura.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </LinearGradient>

        {/* FORMULÁRIO */}
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

        {/* VOLTAR AO LOGIN */}
        <View style={styles.switchContainer}>
          <Text style={styles.registerText}>Já tem uma conta?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.signUpText}>Faça Login</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  backgroundImage: { ...StyleSheet.absoluteFillObject, opacity: 0.1, top: height * 0.25 },
  
  topHeader: {
    height: height * 0.35,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    elevation: 8,
  },
  logo: { width: 160, height: 160, marginBottom: 40 },
  loginCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 40,
    alignSelf: 'center',
    marginTop: -60,
    shadowColor: PRIMARY_COLOR_DARK,
    shadowOpacity: 0.3,
    elevation: 15,
  },
  title: { fontSize: 28, fontWeight: '800', color: DARK_TEXT, marginBottom: 35, textAlign: 'center' },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, color: DARK_TEXT, fontWeight: '700', marginBottom: 8 },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: LIGHT_BG,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: PRIMARY_COLOR_DARK,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  switchContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { color: GRAY_TEXT, fontSize: 16 },
  signUpText: { color: PRIMARY_COLOR_DARK, fontSize: 16, fontWeight: '700', marginLeft: 5 },
});
