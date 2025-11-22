import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, KeyboardAvoidingView, Platform, Image, Dimensions,
  Alert // Importar o Alert para mensagens de erro/sucesso
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; // 👈 NOVO IMPORT
import { supabase } from '../screens/supabase'; // Ajuste o caminho conforme o seu projeto

const { height } = Dimensions.get('window'); 
const PRIMARY_COLOR_LIGHT = "#FFADD6"; 
const PRIMARY_COLOR_DARK = "#fdcadeff"; 
const LIGHT_BG = "#FDF6F8"; 
const GRAY_TEXT = "#707070";
const DARK_TEXT = "#333333";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carregamento

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    
    setLoading(true);

    try {
      // ⚠️ Observação: Seu código faz a autenticação manual e INSEGURA. 
      // Em produção, use supabase.auth.signInWithPassword() (RECOMENDADO).
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nome, email') // Puxamos ID, NOME e EMAIL (dados essenciais)
        .eq('email', email)
        .eq('senha', senha)
        .single(); 

      if (error || !data) {
        Alert.alert("Erro", "E-mail ou senha incorretos! Tente novamente.");
        setLoading(false);
        return;
      } 
      
      // ✅ LOGIN BEM SUCEDIDO: Salvar a sessão no AsyncStorage
      await AsyncStorage.setItem('user_session_id', data.id.toString());
      await AsyncStorage.setItem('user_session_email', data.email);
      // Opcional: Salvar o nome para carregamento rápido (cache)
      await AsyncStorage.setItem('user_session_name', data.nome);

      Alert.alert("Sucesso", `Bem-vindo(a) de volta, ${data.nome.split(' ')[0]}!`);
      // Navega para a tela principal (Main)
      navigation.replace('Main'); 

    } catch (err) {
      console.error("Erro ao conectar ou armazenar sessão:", err);
      Alert.alert("Erro", "Ocorreu um problema de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Imagem de fundo sutil */}
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
          source={require('../assets/aura.png')} // Substitua pelo caminho do seu logo
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Bem-vindo(a)</Text>
      </LinearGradient>

      <View style={styles.loginCard}>
        <Text style={styles.title}>Faça o Login</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seu.email@exemplo.com"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#B0B0B0"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading} // Desabilita edição enquanto carrega
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
            editable={!loading} // Desabilita edição enquanto carrega
          />
        </View>

        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin} 
          disabled={loading} // Desabilita o botão se estiver carregando
        >
          {loading ? (
            <Text style={styles.buttonText}>Entrando...</Text>
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Não tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} disabled={loading}> 
          <Text style={styles.signUpText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG },
  backgroundImage: { ...StyleSheet.absoluteFillObject, opacity: 0.1, top: height * 0.25 },
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
    width: 170, 
    height: 170,
    marginBottom: 50,
  },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#fff', textShadowColor: 'rgba(0,0,0,0.15)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
  
  loginCard: {
    width: '90%', backgroundColor: '#fff', borderRadius: 30,
    paddingHorizontal: 30, paddingVertical: 40, alignSelf: 'center',
    marginTop: -80, 
    shadowColor: PRIMARY_COLOR_DARK, 
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3, shadowRadius: 25, elevation: 25,
  },
  title: { fontSize: 28, fontWeight: '800', color: DARK_TEXT, marginBottom: 35, textAlign: 'center' },
  inputContainer: { marginBottom: 25 },
  label: { fontSize: 14, color: DARK_TEXT, fontWeight: '700', marginBottom: 8 },
  input: {
    width: '100%', height: 55, backgroundColor: LIGHT_BG, borderRadius: 15,
    paddingHorizontal: 15, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0',
  },
  forgotPasswordButton: { alignSelf: 'flex-end', marginBottom: 35 },
  forgotPasswordText: { color: PRIMARY_COLOR_DARK, fontSize: 14, fontWeight: '600' },
  button: {
    width: '100%', height: 55, backgroundColor: PRIMARY_COLOR_DARK, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center', elevation: 10,
    shadowColor: PRIMARY_COLOR_DARK, 
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { color: GRAY_TEXT, fontSize: 16 },
  signUpText: { color: PRIMARY_COLOR_DARK, fontSize: 16, fontWeight: '700', marginLeft: 5 },
});