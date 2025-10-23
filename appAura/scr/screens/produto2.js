import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Configurações de Design
const PRIMARY_PINK = '#ff86b5'; // Rosa Vibrante
const LIGHT_PINK = '#ffeaf3'; // Rosa Claro para fundo
const CARD_BACKGROUND = '#fff'; // Branco
const INACTIVE_GRAY = '#aaa'; // Cinza para textos secundários

// Obter a altura da tela para layout responsivo
const { height } = Dimensions.get('window');

// Componente da Tela de Produto
export default function Produto({ navigation }) {

  // Função fictícia para simular a ação de adicionar ao carrinho
  const handleAddToCart = () => {
    alert('Produto adicionado ao carrinho!'); 
    // Substituir por lógica real de carrinho
  };

  // Função para voltar para a tela anterior
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header e Botão Voltar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={28} color="#444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
             {/* Ícone de favorito/coração */}
            <Ionicons name="heart-outline" size={26} color="#444" /> 
          </TouchableOpacity>
        </View>

        {/* Área da Imagem (simulando a imagem que você irá colocar na pasta) */}
        <View style={styles.imagePlaceholderContainer}>
          {/* IMPORTANTE: Troque o 'require' abaixo pelo caminho real da sua imagem.
            Exemplo: 
            <Image 
              source={require('../assets/sua_imagem_aqui.png')} 
              style={styles.productImage}
            />
          */}
           <Image
  source={require('../assets/2.png')}
  style={styles.productImage}
  resizeMode="contain"
/>

        </View>

        {/* Card de Detalhes do Produto */}
        <View style={styles.detailsCard}>
          <Text style={styles.productTitle}>Nome do Produto 1</Text>
          
          {/* Seção de Preço */}
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>R$ 99,90</Text>
          </View>
          
          {/* Descrição do Produto */}
          <Text style={styles.descriptionHeader}>Descrição:</Text>
          <Text style={styles.productDescription}>
            Esta é uma descrição detalhada e atraente do Produto 1. 
            Ele possui características incríveis, benefícios exclusivos e é exatamente o que você precisa. 
            Aqui você pode adicionar informações sobre material, tamanho, e outras especificações técnicas 
            para convencer o cliente.
          </Text>
          
          {/* Seção de Opções (Cor, Tamanho, etc. - Adicione conforme necessário) */}
          <View style={styles.optionsContainer}>
            <Text style={styles.optionLabel}>Cor:</Text>
            <View style={styles.colorSwatch}></View>
          </View>

        </View>

        {/* Espaço extra para compensar a Tab Bar (se necessário) */}
        <View style={{ height: 100 }}></View> 

      </ScrollView>

      {/* FOOTER - Botão Adicionar ao Carrinho */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Ionicons name="cart-outline" size={24} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.buttonText}>Adicionar ao Carrinho</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_PINK,
  },
  scrollContent: {
    paddingBottom: 20,
    minHeight: height, // Garante que o ScrollView ocupe pelo menos a altura da tela
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, // Garante que fique acima da imagem
  },
  backButton: {
    backgroundColor: CARD_BACKGROUND,
    borderRadius: 50,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  favoriteButton: {
    backgroundColor: CARD_BACKGROUND,
    borderRadius: 50,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  imagePlaceholderContainer: {
    width: '100%',
    height: 400, // Altura fixa para a área da imagem
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LIGHT_PINK,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  productImage: {
    width: '90%',
    height: '90%',
    borderRadius: 15,
  },
  detailsCard: {
    backgroundColor: CARD_BACKGROUND,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    marginTop: -30, // Sobrepõe um pouco a área da imagem
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -5 },
    shadowRadius: 10,
  },
  productTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  productPrice: {
    fontSize: 32,
    fontWeight: '900',
    color: PRIMARY_PINK,
  },
  descriptionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 30,
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
    fontWeight: '600',
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: PRIMARY_PINK, // Cor de exemplo
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40, // Espaço para a Tab Bar (considerando o `bottom: 25` e `height: 75` dela no App.js)
    backgroundColor: CARD_BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: PRIMARY_PINK,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: PRIMARY_PINK,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
