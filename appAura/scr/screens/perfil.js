import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Alert, ActivityIndicator, Dimensions, ScrollView, Image 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../screens/supabase'; // Importe conforme seu caminho
import { Feather, Ionicons } from '@expo/vector-icons'; // Importação de ícones

const { width } = Dimensions.get('window'); 
const PRIMARY_COLOR_LIGHT = "#FFADD6"; 
const PRIMARY_COLOR_DARK = "#fdcadeff"; 
const LIGHT_BG = "#FDF6F8"; 
const DARK_TEXT = "#333333";
const GRAY_TEXT = "#707070";
const RED_ALERT = "#FF4D4D";

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); 
  const [currentEmail, setCurrentEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  async function loadProfileData() {
    setLoading(true);
    try {
      const storedId = await AsyncStorage.getItem('user_session_id');
      const storedEmail = await AsyncStorage.getItem('user_session_email');

      if (!storedId) {
        Alert.alert('Sessão Expirada', 'Por favor, faça o login novamente.');
        navigation.navigate('Login');
        return;
      }
      
      setUserId(storedId);
      setCurrentEmail(storedEmail || 'email não encontrado');

      // Buscar nome na tabela 'usuarios' usando o ID
      const { data, error } = await supabase
        .from('usuarios')
        .select('nome')
        .eq('id', storedId)
        .single();
      
      if (error) throw error;

      if (data) {
        setUserName(data.nome);
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      Alert.alert('Erro', 'Não foi possível carregar as informações do perfil.');
    } finally {
      setLoading(false);
    }
  }

  // --- Funções de Atualização ---

  async function handleUpdateName() {
    if (!userName || !userId) return;
    setIsUpdatingName(true);

    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ nome: userName })
        .eq('id', userId); 

      if (error) throw error;
      
      Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro ao atualizar', error.message);
    } finally {
      setIsUpdatingName(false);
    }
  }

  async function handleUpdatePassword() {
    if (newPassword.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não conferem.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      // Atualiza o campo 'senha' na sua tabela 'usuarios'
      const { error } = await supabase
        .from('usuarios')
        .update({ senha: newPassword }) 
        .eq('id', userId);
      
      if (error) throw error;

      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Erro ao alterar senha', error.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  async function handleLogout() {
    await AsyncStorage.removeItem('user_session_id');
    await AsyncStorage.removeItem('user_session_email');
    await AsyncStorage.removeItem('user_session_name');

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  // --- Funções de Navegação Adicionadas ---
  const navigateToNotifications = () => {
    navigation.navigate('Notificacoes'); 
  };

  if (loading && !userId) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR_DARK} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* HEADER PRINCIPAL COM BOTÃO DE NOTIFICAÇÕES */}
      <View style={styles.mainHeader}>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <TouchableOpacity 
            style={styles.notificationButton} 
            onPress={navigateToNotifications}
            disabled={loading}
        >
            <Ionicons name="notifications-outline" size={24} color={PRIMARY_COLOR_DARK} />
        </TouchableOpacity>
      </View>

      {/* CARTÃO DE INFORMAÇÕES DO USUÁRIO */}
      <View style={styles.userInfoCard}>
        <Feather name="user" size={70} color={PRIMARY_COLOR_DARK} style={styles.avatar} />
        <Text style={styles.userName}>{userName || 'Carregando Nome...'}</Text>
        <Text style={styles.userEmail}>{currentEmail}</Text>
      </View>

      {/* --- SEÇÃO DE ATUALIZAÇÃO DE NOME --- */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Atualizar Dados Pessoais</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Novo Nome</Text>
          <TextInput
            style={styles.input}
            onChangeText={setUserName}
            value={userName}
            placeholder="Digite o novo nome"
            editable={!isUpdatingName}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.actionButton, isUpdatingName && styles.disabledButton]} 
          onPress={handleUpdateName} 
          disabled={isUpdatingName || !userName}
        >
          <Text style={styles.actionButtonText}>
            {isUpdatingName ? 'Salvando...' : 'Salvar Novo Nome'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- SEÇÃO DE ALTERAÇÃO DE SENHA --- */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Segurança (Alterar Senha)</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nova Senha</Text>
          <TextInput
            style={styles.input}
            onChangeText={setNewPassword}
            value={newPassword}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry={true}
            editable={!isUpdatingPassword}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar Nova Senha</Text>
          <TextInput
            style={styles.input}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            placeholder="Repita a nova senha"
            secureTextEntry={true}
            editable={!isUpdatingPassword}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.actionButton, isUpdatingPassword && styles.disabledButton]} 
          onPress={handleUpdatePassword} 
          disabled={isUpdatingPassword || newPassword.length < 6 || newPassword !== confirmPassword}
        >
          <Text style={styles.actionButtonText}>
            {isUpdatingPassword ? 'Atualizando...' : 'Atualizar Senha'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* --- BOTÃO DE SAIR --- */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={loading}>
        <Feather name="log-out" size={20} color="#fff" style={{ marginRight: 10 }} />
        <Text style={styles.logoutButtonText}>Sair do Aplicativo</Text>
      </TouchableOpacity>
      
    </ScrollView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: LIGHT_BG, 
  },
  contentContainer: {
    padding: 20,
    // Ajuste MANDATÓRIO para a Tab Navigation
    paddingBottom: 100, 
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: DARK_TEXT,
  },
  notificationButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  
  // Cartão de Informações do Usuário (Top)
  userInfoCard: {
    backgroundColor: PRIMARY_COLOR_LIGHT + '40', // Um rosa bem suave de fundo
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR_DARK + '20',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    textAlign: 'center',
    lineHeight: 100,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: PRIMARY_COLOR_DARK,
    overflow: 'hidden', // Para garantir que o ícone fique contido
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: DARK_TEXT,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: GRAY_TEXT,
  },

  // Cartões de Seção (Atualizações)
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: PRIMARY_COLOR_DARK,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY_COLOR_DARK,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 14, color: DARK_TEXT, fontWeight: '600', marginBottom: 5 },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: LIGHT_BG,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  
  // Botões de Ação dentro das Seções
  actionButton: {
    marginTop: 5,
    backgroundColor: PRIMARY_COLOR_DARK,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  disabledButton: {
    backgroundColor: GRAY_TEXT,
  },

  // Botão de Logout
  logoutButton: {
    marginTop: 20,
    backgroundColor: RED_ALERT,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: RED_ALERT,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});