import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Alert, ActivityIndicator, Dimensions, ScrollView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../screens/supabase'; // Importe conforme seu caminho
import { Feather, Ionicons } from '@expo/vector-icons'; // Importação de ícones

const { width } = Dimensions.get('window'); 
// Paleta de Cores Refinada:
const PRIMARY_COLOR_LIGHT = "#FDEFF1"; // Rosa Claro
const PRIMARY_COLOR_DARK = "#ff86b4"; // Rosa Escuro (Mais Profissional)
const LIGHT_BG = "#F9FAFB"; // Fundo mais neutro e claro
const DARK_TEXT = "#1F2937"; // Texto mais escuro e sólido
const GRAY_TEXT = "#6B7280"; // Cinza para textos secundários
const RED_ALERT = "#EF4444"; // Vermelho de alerta (logout)

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

  // Função para obter a primeira letra do nome
  const getAvatarInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

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
    // Reutilizando o ajuste de preenchimento para a tab navigation
    <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false} // Adiciona um toque profissional
    > 
      
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
        {/* AVATAR COM INICIAIS */}
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>
                {getAvatarInitials(userName)}
            </Text>
        </View>
        <Text style={styles.userName}>{userName || 'Carregando Nome...'}</Text>
        <Text style={styles.userEmail}>{currentEmail}</Text>
      </View>

      {/* --- SEÇÃO DE ATUALIZAÇÃO DE NOME --- */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}><Feather name="edit-3" size={16} color={PRIMARY_COLOR_DARK} /> Atualizar Dados Pessoais</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome</Text>
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
        <Text style={styles.sectionTitle}><Feather name="lock" size={16} color={PRIMARY_COLOR_DARK} /> Segurança (Alterar Senha)</Text>

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
    // Ajuste MANDATÓRIO para a Tab Navigation (mantido)
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
    fontSize: 30, // Aumentado
    fontWeight: '800', // Levemente ajustado
    color: DARK_TEXT,
  },
  notificationButton: {
    padding: 8, // Ajustado
    borderRadius: 20, 
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4, // Aumentado
  },
  
  // Cartão de Informações do Usuário (Top)
  userInfoCard: {
    backgroundColor: '#fff', // Fundo branco mais limpo
    borderRadius: 20,
    padding: 30, // Aumentado
    alignItems: 'center',
    marginBottom: 30,
    // Sombra mais profunda e moderna
    shadowColor: PRIMARY_COLOR_DARK,
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10, 
  },
  avatar: { // Novo estilo para o avatar de inicial
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: PRIMARY_COLOR_LIGHT, // Fundo mais vibrante
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: PRIMARY_COLOR_DARK,
  },
  avatarText: { // Novo estilo para a inicial
    fontSize: 48,
    fontWeight: '900',
    color: PRIMARY_COLOR_DARK,
  },
  userName: {
    fontSize: 26, // Aumentado
    fontWeight: '900', // Mais ousado
    color: DARK_TEXT,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 15, // Levemente ajustado
    color: GRAY_TEXT,
  },

  // Cartões de Seção (Atualizações)
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    // Sombra sutil para um visual mais leve
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderLeftWidth: 5, // Destaque na lateral
    borderLeftColor: PRIMARY_COLOR_DARK,
  },
  sectionTitle: {
    fontSize: 17, // Ajustado
    fontWeight: '700',
    color: DARK_TEXT, // Corrigido para texto escuro, mantendo o ícone colorido
    marginBottom: 15,
    paddingBottom: 5,
  },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 13, color: GRAY_TEXT, fontWeight: '600', marginBottom: 5 }, // Ajustado para ser menor e mais discreto
  input: {
    width: '100%',
    height: 48, // Ajustado
    backgroundColor: LIGHT_BG, // Fundo do input mais claro
    borderRadius: 8, // Ligeiramente menor
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB', // Cor de borda mais suave
    color: DARK_TEXT,
  },
  
  // Botões de Ação dentro das Seções
  actionButton: {
    marginTop: 5,
    backgroundColor: PRIMARY_COLOR_DARK,
    paddingVertical: 14, // Aumentado
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: PRIMARY_COLOR_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  actionButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '800' // Mais ousado
  },
  disabledButton: {
    backgroundColor: GRAY_TEXT,
    shadowOpacity: 0,
    elevation: 0,
  },

  // Botão de Logout
  logoutButton: {
    marginTop: 30, // Mais espaçamento
    backgroundColor: RED_ALERT,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    // Sombra para destacar o alerta
    shadowColor: RED_ALERT,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});