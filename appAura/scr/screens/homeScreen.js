import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
// IMPORTAÇÕES NOVAS/ATUALIZADAS
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient'; // <-- IMPORTAÇÃO NECESSÁRIA

const { width } = Dimensions.get("window");
// Largura do banner para FlatList
const BANNER_WIDTH = width - 40;
const MAIN_PINK = "#ff86b4"; // Rosa Principal Suave (Ajustado para o tom do card)
const LIGHT_PINK = "#FDEFF1"; // Rosa muito claro para fundo de topo
const VERY_LIGHT_PINK = "#fce3f7"; // Rosa usado no gradiente do card
const LIGHT_BG = "#fff"; // Fundo Principal Branco

// Largura do card para 2 colunas: (Largura da tela - padding*2 - margem única) / 2
const HORIZONTAL_PADDING = 20;
const PRODUCT_CARD_MARGIN = 20;
const PRODUCT_CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - PRODUCT_CARD_MARGIN) / 2;

// --- DADOS MOCK EXPANDIDOS ---
// ... (Dados de categories, promotionBanners, products permanecem iguais) ...
const categories = [
  { name: "Skin Care", icon: "eyedrop-outline" },
  { name: "Maquiagem", icon: "color-palette-outline" },
  { name: "Cabelo", icon: "cut-outline" },
  { name: "Perfume", icon: "water-outline" },
];

const promotionBanners = [
  {
    id: 1,
    title: "Oferta de Outono",
    subtitle: "Até 30% OFF em Maquiagem.",
    backgroundImage: "https://i.pinimg.com/736x/e0/65/66/e065664a9f17c9a6af8996c89222c9cf.jpg",
  },
  {
    id: 2,
    title: "Dia da Beleza",
    subtitle: "Frete Grátis acima de $150.",
    backgroundImage: "https://i.pinimg.com/1200x/59/1b/d5/591bd5d4fce1c74521b01f09e8ecd05c.jpg",
  },
  {
    id: 3,
    title: "Lançamento Exclusivo",
    subtitle: "Novas coleções de Outono/Inverno.",
    backgroundImage: "https://i.pinimg.com/1200x/81/45/8c/81458ce390f01b0f8a9e7e8f7ec5b90a.jpg",
  },
];

const products = [
  { id: 1, name: "Gloss Fran By Franciny", price: "R$65,90", newPrice: "R$59,67", image: require('../assets/prod.png'), rating: 4.8 },
  { id: 2, name: "Casual T-Shirt", price: "$113.00", newPrice: "$85.00", image: require('../assets/2.png'), rating: 4.5 },
  { id: 3, name: "High-Waist Jeans", price: "$199.00", newPrice: "$149.00", image: require('../assets/3.png'), rating: 4.9 },
  { id: 4, name: "Mineral Primer", price: "$44.90", newPrice: "$39.90", image: require('../assets/4.png'), rating: 4.2 },
  { id: 5, name: "Silk Scarf", price: "$55.00", newPrice: "$45.00", image: require('../assets/5.png'), rating: 4.6 },
  { id: 6, name: "Luxury Handbag", price: "$299.00", newPrice: "$250.00", image: require('../assets/6.png'), rating: 4.7 },
  { id: 7, name: "Lipstick Set", price: "$79.00", newPrice: "$65.00", image: require('../assets/7.png'), rating: 4.3 },
  { id: 8, name: "Sunscreen SPF50", price: "$35.00", newPrice: "$29.90", image: require('../assets/8.png'), rating: 4.1 },
];

// --- COMPONENTES AUXILIARES ---

// 1. Banner de Carrossel (Inalterado)
const PromotionBanner = ({ item }) => (
  <TouchableOpacity style={bannerStyles.bannerContainer}>
    <Image
      source={{ uri: item.backgroundImage }}
      style={bannerStyles.backgroundImage}
      resizeMode="cover"
    />
    <View style={bannerStyles.overlay}>
      <Text style={bannerStyles.title}>{item.title}</Text>
      <Text style={bannerStyles.subtitle}>{item.subtitle}</Text>
      <TouchableOpacity style={bannerStyles.orderButton}>
        <Text style={bannerStyles.orderButtonText}>Ver mais</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

// 2. Card de Produto (AGORA COM ESTILO REPLICADO)
const ProductCard = ({ product }) => {
  // Use 'false' como estado inicial se não houver dados de favorito
  const [isFavorite, setIsFavorite] = useState(false); 
  const navigation = useNavigation();

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const handleCardPress = () => {
    const screenName = product.id === 1 ? 'Produto' : `Produto${product.id}`;
    navigation.navigate(screenName);
  };

  return (
    <TouchableOpacity style={styles.productCard} onPress={handleCardPress}>
      {/* 1. Área da Imagem com Gradiente Rosa Suave */}
      <View style={styles.productImageBackground}>
        <LinearGradient
          colors={[VERY_LIGHT_PINK, '#fff']} // Gradiente do rosa claro para branco
          style={styles.gradientOverlay}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <Image
            source={product.image}
            style={styles.productImage}
            resizeMode="contain"
          />
        </LinearGradient>
      </View>

      {/* 2. Botão de Favorito (Top Right) - Replicado o visual da imagem */}
      <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
        <Ionicons
          name={isFavorite ? 'heart' : 'heart'} // Coração sempre preenchido na ref
          size={22}
          color={MAIN_PINK} 
        />
      </TouchableOpacity>

      {/* 3. Detalhes do Produto (Fundo Branco) */}
      <View style={styles.productDetails}>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>

        <View style={styles.priceContainer}>
          {/* Preço Original Riscado */}
          <Text style={styles.originalPrice}>
            {product.price}
          </Text>
          {/* Preço Promocional em Destaque */}
          <Text style={styles.currentPrice}>{product.newPrice}</Text>
        </View>

        {/* Avaliação por Estrelas */}
        <View style={styles.ratingContainer}>
          {/* Estrela Amarela sólida (como na referência) */}
          <Ionicons name="star" size={16} color="#FFD700" /> 
          <Text style={styles.ratingText}>{product.rating ? product.rating.toFixed(1) : '4.5'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// 3. Card de Categoria (com navegação) - Inalterado
const CategoryCard = ({ item }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    const screenMap = {
      "Skin Care": "CategoriaPele",
      "Maquiagem": "CategoriaMaquiagem",
      "Cabelo": "CategoriaCabelo",
      "Perfume": "CategoriaPerfume",
    };

    const screenName = screenMap[item.name] || "CategoriaPeleScreen";
    navigation.navigate(screenName);
  };

  return (
    <TouchableOpacity style={styles.categoryCard} onPress={handlePress}>
      <View style={styles.categoryIconCircle}>
        <Ionicons name={item.icon} size={28} color={MAIN_PINK} />
      </View>
      <Text style={styles.categoryName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

// --- COMPONENTE PRINCIPAL (HomeScreen) ---
export default function HomeScreen() { 
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const handleFavoritesPress = () => {
      navigation.navigate('Favoritos'); 
  };

  const onScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== activeIndex) {
      setActiveIndex(roundIndex);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      // Mantém o espaço para a navegação por abas (Lembrete: 2025-10-21)
      contentContainerStyle={styles.scrollViewContent}
    >
      {/* Fundo Rosa Suave no topo */}
      <View style={styles.topBackground} />

      {/* 1. Barra de Pesquisa e Filtro (Topo) */}
      <View style={styles.searchBarContainer}>
        {/* Simulação de "Localização" como na imagem de referência */}
        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={18} color="#000" />
          <Text style={styles.locationText}>São Paulo, BR </Text>
          <Ionicons name="chevron-down-outline" size={14} color="#000" />
        </View>
      </View>

      <View style={styles.searchFilterRow}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Pesquisar produtos..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        {/* Botão de Filtro Rosa com Ícone de Coração */}
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={handleFavoritesPress} 
        >
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 2. Carrossel de Promoções */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ofertas Especiais</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Ver Todas</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.carouselContainer}>
        <FlatList
          horizontal
          data={promotionBanners}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={BANNER_WIDTH + 15}
          decelerationRate="fast"
          renderItem={({ item }) => <PromotionBanner item={item} />}
          contentContainerStyle={styles.carouselList}
          onScroll={onScroll}
        />
        {/* Indicadores do Carrossel */}
        <View style={styles.indicatorContainer}>
          {promotionBanners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === activeIndex
                  ? styles.activeIndicator
                  : styles.inactiveIndicator,
              ]}
            />
          ))}
        </View>
      </View>

      {/* 3. Categorias */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categorias</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Ver Todas</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.name}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <CategoryCard item={item} />}
        contentContainerStyle={styles.categoryList}
      />

      {/* 4. Lista de Produtos (Recomendados) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recomendado Para Você</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Ver Todos</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.productsGrid}>
        {products.map((item) => (
          // Garante que o ProductCard use a largura correta para duas colunas
          <ProductCard key={item.id} product={item} />
        ))}
      </View>
    </ScrollView>
  );
}

// --- ESTILOS DO CARROSSEL DE PROMOÇÃO (Inalterados) ---
const bannerStyles = StyleSheet.create({
  bannerContainer: {
    width: BANNER_WIDTH,
    height: 180,
    marginRight: 15,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: MAIN_PINK,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  orderButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignSelf: "flex-start",
  },
  orderButtonText: {
    color: MAIN_PINK,
    fontWeight: "700",
    fontSize: 14,
  },
});

// --- ESTILOS GERAIS E CARTÕES DE PRODUTO/CATEGORIA (ATUALIZADOS) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },
  // IMPORTANTE: Espaço para o Tab Bar (Lembrete: 2025-10-21)
  scrollViewContent: {
    paddingBottom: 100,
  },

  // Fundo Rosa Suave no Topo
  topBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: LIGHT_PINK,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  // Topo (Localização)
  searchBarContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 50,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  locationText: {
    marginLeft: 5,
    marginRight: 5,
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },

  // Linha de Pesquisa e Filtro
  searchFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 20,
    marginTop: 10,
    zIndex: 5,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
    color: "#B0B0B0",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  // Botão de filtro com coração
  filterButton: {
    marginLeft: 15,
    backgroundColor: MAIN_PINK,
    padding: 12,
    borderRadius: 18,
    shadowColor: MAIN_PINK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  // Cabeçalho de Seção
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: MAIN_PINK,
  },

  // Carrossel de Promoções
  carouselContainer: {
    marginBottom: 30,
  },
  carouselList: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: MAIN_PINK,
    width: 20,
  },
  inactiveIndicator: {
    backgroundColor: "#ccc",
  },

  // Lista de Categorias
  categoryList: {
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: 30,
    justifyContent: "space-between",
  },
  categoryCard: {
    alignItems: "center",
    width: width / 5,
    marginRight: 15,
  },
  categoryIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: LIGHT_PINK,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
  },

  // Lista de Produtos (Grade 2x2)
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  
  // =======================================================
  // --- ESTILOS DO CARD DE PRODUTO (REPLICADOS) ---
  // =======================================================
  productCard: {
    width: PRODUCT_CARD_WIDTH, // Largura calculada
    marginBottom: PRODUCT_CARD_MARGIN,
    backgroundColor: '#fff',
    borderRadius: 20, // Borda super arredondada (igual à ref)
    // Sombra suave
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05, 
    shadowRadius: 10,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden', // Importante para o card manter o gradiente dentro
  },
  productImageBackground: {
    width: '100%',
    height: 160, // Altura da imagem para o HomeScreen
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '80%', 
    height: '80%',
    // Sem border radius aqui, pois o gradiente que faz o topo do card
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
    // Sombra do botão
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  productDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  productName: {
    fontSize: 18, // Aumentado para o estilo da ref
    fontWeight: '800', 
    color: '#333',
    marginBottom: 10,
    minHeight: 45,
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
    color: MAIN_PINK, // Usa o MAIN_PINK ajustado (#ff86b4)
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 15, // Aumentado para o estilo da ref
    color: '#333',
    marginLeft: 5,
    fontWeight: '600',
  },
});