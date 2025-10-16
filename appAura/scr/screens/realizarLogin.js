import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    // Aqui você pode validar email/senha
    navigation.replace('Main'); // Vai para a navegação principal
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Logo no topo como header, para um design mais amplo e profissional */}
      <Image
        source={require("../assets/logopng.png")}  // Logo atualizada
        style={styles.logo}
        resizeMode="contain"
      />
      
      {/* Título centralizado para iniciar o formulário */}
      <Text style={styles.title}>Bem-vindo(a)</Text>
      
      {/* Inputs com design espaçoso */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#d65b8b"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        placeholderTextColor="#d65b8b"
      />
      
      {/* Botão proeminente e diferente, full-width para destaque */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      
      {/* Texto de cadastro no final, alinhado para um toque inovador */}
      <Text style={styles.registerText}>Não tem conta ainda? Cadastre-se</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',  // Centraliza verticalmente para um layout amplo
    alignItems: 'center',      // Centraliza horizontalmente
    backgroundColor: '#fff',   // Fundo branco para um design clean e profissional
    padding: 40,               // Mais padding para um ar espaçoso e moderno
  },
  logo: {
    width: 200,                // Tamanho maior para destaque no topo
    height: 200,
    marginBottom: 50,          // Espaçamento maior para separar do conteúdo principal
    borderRadius: 15,          // Borda arredondada sutil para um look diferente e premium
  },
  title: {
    fontSize: 36,              // Fonte maior e mais impactante para um design profissional
    fontWeight: 'bold',
    color: '#d65b8b',          // Cor principal para destaque
    textAlign: 'center',
    marginBottom: 40,          // Espaçamento generoso para fluxo visual
    width: '80%',              // Largura ajustada para não ocupar toda a tela, criando simetria
  },
  input: {
    width: '80%',              // Largura menor que full para um design mais focado e diferente
    height: 65,                // Altura maior para um ar premium
    borderWidth: 2,
    borderColor: '#d65b8b',    // Cor principal para bordas elegantes
    borderRadius: 20,          // Bordas mais arredondadas para inovação
    paddingHorizontal: 25,
    marginBottom: 25,          // Mais espaço entre inputs
    fontSize: 18,
    backgroundColor: '#f9f9f9',// Fundo leve para contraste, mantendo plano
  },
  button: {
    width: '80%',              // Mesma largura dos inputs para consistência e design coeso
    height: 65,
    backgroundColor: '#d65b8b',// Cor principal para o botão
    borderRadius: 20,          // Bordas arredondadas para um toque moderno
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,          // Espaçamento para separar do texto de cadastro
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,              // Fonte maior para destaque
    fontWeight: 'bold',
  },
  registerText: {
    color: '#d65b8b',
    fontSize: 18,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 20,             // Espaçamento para posicionar no final da tela
  },
});