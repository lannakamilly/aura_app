import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // Para ícones de coração, estrela e navegação

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 220; // Altura da seção Hero
const PRODUCT_CARD_MARGIN = 16;
// Largura do card para 2 colunas: (Largura da tela - padding*2 - margem única) / 2
const PRODUCT_CARD_WIDTH = (width - 48 - PRODUCT_CARD_MARGIN) / 2; 
const HORIZONTAL_PADDING = 24; // Padding horizontal da lista

// --- Dados Mock de Produtos ---
const products = [
  {
    id: 'p1',
    name: 'Óleo Nutritivo Ox Nutre 120ml',
    originalPrice: 'R$159,90',
    price: 'R$129,90',
    rating: 4.8,
    imageUrl: 'https://res.cloudinary.com/beleza-na-web/image/upload/w_1500,f_auto,fl_progressive,q_auto:eco,w_800/v1/imagens/product/MP8791/ccda83b0-71e1-4179-87fd-1c2fa65dd69b-kit-anti-frizz-completo-5-produtos.png',
    isFavorite: true,
  },
  {
    id: 'p2',
    name: 'Sérum L’Oréal Paris Reparação Total',
    originalPrice: 'R$45,00',
    price: 'R$36,96',
    rating: 4.5,
    imageUrl: 'https://res.cloudinary.com/beleza-na-web/image/upload/w_1500,f_auto,fl_progressive,q_auto:eco,w_1800,c_limit/e_trim/v1/imagens/product/KT001996/97821b67-49fa-46c2-9f23-271d27624134-kit-beleza-na-web-pele-e-cabelo-4-produtos.png',
    isFavorite: false,
  },
  {
    id: 'p3',
    name: 'Máscara de Hidratação Elseve 300g',
    originalPrice: 'R$99,90',
    price: 'R$79,90',
    rating: 4.9,
    imageUrl: 'https://www.loreal-paris.com.br/-/media/project/loreal/brand-sites/oap/americas/br/products/hair/hair-care/elseve/hidra-hialuronico/novosassets/creme-de-tratamento/imagem-creme-de-tratamento-300g-packshot.png',
    isFavorite: true,
  },
  {
    id: 'p4',
    name: 'Leave-in Rapunzel Milk Pro',
    originalPrice: 'R$30,00',
    price: 'R$22,20',
    rating: 4.2,
    imageUrl: 'https://res.cloudinary.com/beleza-na-web/image/upload/w_1500,f_auto,fl_progressive,q_auto:eco,w_800/v1/imagens/product/KT005072/aef72423-ff19-4887-9599-d8c9cebe0ba9-kit-beleza-na-web-rosto-corpo-e-cabelo-2-produtos.png',
    isFavorite: false,
  },
  // Mais produtos para simular a rolagem
  {
    id: 'p5',
    name: 'Shampoo Detox Fresh de Menta',
    originalPrice: 'R$55,00',
    price: 'R$45,00',
    rating: 4.6,
    imageUrl: 'https://res.cloudinary.com/beleza-na-web/image/upload/w_1500,f_auto,fl_progressive,q_auto:best/v1/imagens/product/20057140/56ed4434-c20d-49a0-985b-8ad84ad8f39c-vichy-dercos-energy-shampoo-estimulante-400g.png',
    isFavorite: false,
  },
  {
    id: 'p6',
    name: 'Condicionador Brilho Intenso',
    originalPrice: 'R$65,00',
    price: 'R$59,99',
    rating: 4.7,
    imageUrl: 'https://res.cloudinary.com/beleza-na-web/image/upload/w_1500,f_auto,fl_progressive,q_auto:eco,w_1800,c_limit/e_trim/v1/imagens/product/KT001995/d6208853-ab54-426b-a9fd-fd0f9f88681c-kit-beleza-na-web-pele-e-cabelo-6-produtos.png',
    isFavorite: true,
  },
];

// --- Componente Card de Produto (Estilo Replicado) ---
const ProductCard = ({ item }) => {
  const [isFavorite, setIsFavorite] = useState(item.isFavorite);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const filledStars = Math.floor(item.rating);
  const hasHalfStar = item.rating % 1 !== 0;

  return (
    <View style={styles.productCard}>
      {/* 1. Área da Imagem com Gradiente Rosa Suave */}
      <View style={styles.productImageBackground}>
        <LinearGradient
          colors={['#fce3f7', '#fff']} // Gradiente do rosa claro para branco
          style={styles.gradientOverlay}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </LinearGradient>
      </View>

      {/* 2. Botão de Favorito (Top Right) */}
      <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={22}
          color={isFavorite ? '#ff69b4' : '#ff69b4'} // Cor do coração sempre rosa
        />
      </TouchableOpacity>

      {/* 3. Detalhes do Produto (Fundo Branco) */}
      <View style={styles.productDetails}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>

        <View style={styles.priceContainer}>
          {/* Preço Original Riscado */}
          {item.originalPrice && (
            <Text style={styles.originalPrice}>{item.originalPrice}</Text>
          )}
          {/* Preço Promocional em Destaque */}
          <Text style={styles.currentPrice}>{item.price}</Text>
        </View>

        {/* Avaliação por Estrelas */}
        <View style={styles.ratingContainer}>
          {/* Estrela Amarela sólida */}
          <Ionicons name="star" size={16} color="#FFD700" /> 
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>
    </View>
  );
};

// --- Tela Principal de Produtos da Categoria ---
const CategoryProductsScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  // URL de fundo para o Hero/Banner
  const BACKGROUND_URL = 'https://images.unsplash.com/photo-1596759714856-f40c745778b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80';
  const CATEGORY_NAME = 'Cabelo';

  // Configuração da animação do cabeçalho
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, BANNER_HEIGHT - 60, BANNER_HEIGHT - 30],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Ajuste da StatusBar para fundo claro */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* --- 1. Hero Section (Banner Aprimorado) --- */}
      <View style={styles.heroSection}>
        {/* Imagem de fundo sutil para dar textura, com baixa opacidade */}
        <Image
          source={{ uri: BACKGROUND_URL }}
          style={styles.heroBackgroundImage}
          blurRadius={5}
        />
        {/* Overlay com Gradiente Radial (imita a luz da imagem de ref.) */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 240, 245, 0.9)']}
          style={styles.heroGradientOverlay}
        />
        
        {/* Barra de Navegação/Ações no Topo */}
        <View style={styles.heroHeader}>
          {/* <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={24} color="#333" />
          </TouchableOpacity> */}
        </View>

        {/* Título da Categoria */}
        <View style={styles.heroTitleContainer}>
          <Text style={styles.heroSubtitle}>Sua rotina de beleza</Text>
          <Text style={styles.heroTitle}>{CATEGORY_NAME}</Text>
        </View>
      </View>
      
      {/* --- 2. Header Fixo Animado (Sticky Header) --- */}
      {/* Aparece quando o Hero Section rola para fora da tela */}
      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <Text style={styles.stickyHeaderText}>{CATEGORY_NAME}</Text>
      </Animated.View>

      {/* --- 3. Lista de Produtos (FlatList) --- */}
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard item={item} />}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        // Listener de Scroll
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        // Adiciona altura vazia para o Hero Section
        ListHeaderComponent={<View style={{ height: BANNER_HEIGHT - 20 }} />}
        // Ajuste para não esconder conteúdo atrás de uma Tab Bar fictícia
        style={{ marginBottom: 0 }}
      />
    </View>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Fundo geral cinza claro
    paddingTop: StatusBar.currentHeight, // Garante que o Hero Section não fique sob a StatusBar
  },
  
  // =======================================================
  // --- 1. Estilos do Hero Section (Banner Aprimorado) ---
  // =======================================================
  heroSection: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: BANNER_HEIGHT,
    zIndex: 1,
  },
  heroBackgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1, // Sutil
  },
  heroGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  iconButton: {
    padding: 8,
  },
  heroTitleContainer: {
    position: 'absolute',
    bottom: 30,
    left: HORIZONTAL_PADDING,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#333',
    lineHeight: 40,
    textTransform: 'uppercase',
  },

  // =======================================================
  // --- 2. Header Fixo/Animado (Sticky Header) ---
  // =======================================================
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60, // Altura padrão para o cabeçalho fixo
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  stickyHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    paddingTop: StatusBar.currentHeight / 2,
  },
  
  // =======================================================
  // --- 3. Estilos da Lista de Produtos e Cards ---
  // =======================================================
  listContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 40,
    backgroundColor: 'transparent',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: PRODUCT_CARD_MARGIN, // Garante espaçamento entre linhas
  },

  // --- Estilos do Card de Produto (Replicado da Imagem) ---
  productCard: {
    width: PRODUCT_CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 20, // Borda super arredondada (igual à ref)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05, // Sombra suave e longa
    shadowRadius: 10,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  productImageBackground: {
    width: '100%',
    height: 180, // Altura da imagem para um card vertical
    // Não tem border radius no topo, pois a imagem/gradiente cobre
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '80%', // Imagem menor, mais clean
    height: '80%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: '800', // Bem negrito
    color: '#333',
    marginBottom: 10,
    minHeight: 45, // Garante espaço para 2 linhas de título
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 15,
    color: '#a1a1aa', // Cinza médio
    textDecorationLine: 'line-through',
    marginRight: 10,
    fontWeight: '500',
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ff69b4', // Rosa em destaque (igual à ref)
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 5,
    fontWeight: '600',
  },
});

export default CategoryProductsScreen;
