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
// IMPORTANTE: Adicionei 'useNavigation' para permitir a navegação dentro do componente
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; 

const { width } = Dimensions.get("window");
// Largura do banner para FlatList
const BANNER_WIDTH = width - 40;
const MAIN_PINK = "#ff86b5"; // Rosa Principal Suave
const LIGHT_PINK = "#FDEFF1"; // Rosa muito claro para fundo de topo
const LIGHT_BG = "#fff"; // Fundo Principal Branco

// --- DADOS MOCK EXPANDIDOS ---

// 1. Dados para Categorias
const categories = [
  { name: "Skin Care", icon: "eyedrop-outline" },
  { name: "Maquiagem", icon: "color-palette-outline" },
  { name: "Cabelo", icon: "cut-outline" },
  { name: "Perfume", icon: "water-outline" },
];

// 2. Dados para o CARROSSEL DE PROMOÇÕES
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

// 3. Dados dos Produtos
const products = [
  { id: 1, name: "Casual V-neck", price: "$129.00", newPrice: "$99.90", image: require('../assets/prod.png') },
  { id: 2, name: "Casual T-Shirt", price: "$113.00", newPrice: "$85.00", image: require('../assets/2.png') },
  { id: 3, name: "High-Waist Jeans", price: "$199.00", newPrice: "$149.00", image: require('../assets/3.png') },
  { id: 4, name: "Mineral Primer", price: "$44.90", newPrice: "$39.90", image: require('../assets/4.png') },
  { id: 5, name: "Silk Scarf", price: "$55.00", newPrice: "$45.00", image: require('../assets/5.png') },
  { id: 6, name: "Luxury Handbag", price: "$299.00", newPrice: "$250.00", image: require('../assets/6.png') },
  { id: 7, name: "Lipstick Set", price: "$79.00", newPrice: "$65.00", image: require('../assets/7.png') },
  { id: 8, name: "Sunscreen SPF50", price: "$35.00", newPrice: "$29.90", image: require('../assets/8.png') },
];

// --- COMPONENTES AUXILIARES ---

// 1. Banner de Carrossel
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

// 2. Card de Produto na Lista Principal (COM LÓGICA DE NAVEGAÇÃO)
const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation(); // Hook de navegação

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  // Função para lidar com o clique no card
  const handleCardPress = () => {
    // Determina o nome da tela de destino dinamicamente:
    // Se id é 1, vai para 'Produto'. Se id é 2, vai para 'Produto2', etc.
    const screenName = product.id === 1 ? 'Produto' : `Produto${product.id}`;
    
    // Navega para a tela de produto correta
    navigation.navigate(screenName);
  };

  return (
    <TouchableOpacity style={styles.productCard} onPress={handleCardPress}>
      {/* Ícone de favorito/coração clicável */}
      <TouchableOpacity
        style={styles.favoriteIconContainer}
        onPress={toggleFavorite}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={20}
          color={isFavorite ? "red" : MAIN_PINK}
        />
      </TouchableOpacity>

      {/* Imagem do Produto */}
      <Image
        source={product.image}
        style={styles.productImage}
      />

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.productOldPrice}>{product.price}</Text>
          <Text style={styles.productNewPrice}>{product.newPrice}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFC72C" />
          <Text style={styles.ratingText}>4.5</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// 3. Card de Categoria
const CategoryCard = ({ item }) => (
  <TouchableOpacity style={styles.categoryCard}>
    <View style={styles.categoryIconCircle}>
      <Ionicons name={item.icon} size={28} color={MAIN_PINK} />
    </View>
    <Text style={styles.categoryName} numberOfLines={1}>
      {item.name}
    </Text>
  </TouchableOpacity>
);

// --- COMPONENTE PRINCIPAL (HomeScreen) ---
export default function HomeScreen() { 
  const navigation = useNavigation(); // <-- 1. Inicializa o hook de navegação
  const [searchText, setSearchText] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // FUNÇÃO DE NAVEGAÇÃO PARA FAVORITOS (MUDANÇA ESSENCIAL)
  const handleFavoritesPress = () => { // <-- 2. Cria a função de navegação
      // Navega para a tela 'FavoritosScreen', conforme o seu App.js
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
      // Mantém o espaço para a navegação por abas
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
        {/* Botão de Filtro Rosa com Ícone de Coração (AGORA COM onPRESS) */}
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={handleFavoritesPress} // <-- 3. Adiciona o evento de navegação
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
          <ProductCard key={item.id} product={item} />
        ))}
      </View>
    </ScrollView>
  );
}

// --- ESTILOS DO CARROSSEL DE PROMOÇÃO ---
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

// --- ESTILOS GERAIS E CARTÕES DE PRODUTO/CATEGORIA ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },
  // IMPORTANTE: Espaço para o Tab Bar (75 height + 25 bottom)
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

  // Topo (Localização e Carrinho - Carrinho Removido)
  searchBarContainer: {
    flexDirection: "row",
    justifyContent: "flex-start", // Ajustado para não ter espaço para o carrinho
    alignItems: "center",
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
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

  // Cabeçalho de Seção (Ofertas, Categoria, Recomendados)
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
  },
  productCard: {
    width: "47%",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: "relative",
  },
  // Estilo aprimorado para o botão de curtir
  favoriteIconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Mais opaco para destaque
    borderRadius: 15,
    padding: 5,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3, // Sombra mais evidente
    shadowRadius: 2,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 160,
    resizeMode: "contain",
    backgroundColor: "#F7F7F7",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  productInfo: {
    padding: 12,
    alignItems: "flex-start",
  },
  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  productOldPrice: {
    fontSize: 13,
    fontWeight: "500",
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  productNewPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: MAIN_PINK,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#555",
    fontWeight: "600",
  },
});
