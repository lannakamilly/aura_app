// Arquivo: ../screens/supabase.js (Corrigido para React Native)

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store'; // 👈 NOVO: Importa o Secure Store

// 1. Crie uma classe wrapper para o SecureStore
class SupabaseSecureStore {
  async getItem(key) {
    return SecureStore.getItemAsync(key);
  }
  async setItem(key, value) {
    return SecureStore.setItemAsync(key, value);
  }
  async removeItem(key) {
    return SecureStore.deleteItemAsync(key);
  }
}

// ** ATENÇÃO: Substitua estes valores pelos seus dados **
const supabaseUrl = 'https://igrsfvnpwrkavrxzypuu.supabase.co'; // SEU URL AQUI
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlncnNmdm5wd3JrYXZyeHp5cHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDkwMjksImV4cCI6MjA3ODAyNTAyOX0.fLR73uOPIj5VwfNd_iO-IWsGYQiulUFpNxRDxYEJMrk'; // SUA CHAVE ANON AQUI

// 2. Cria e exporta o cliente Supabase, passando o objeto de configuração `auth`
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 👈 CHAVE DA CORREÇÃO: Usa a classe de armazenamento segura
    storage: new SupabaseSecureStore(), 
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});