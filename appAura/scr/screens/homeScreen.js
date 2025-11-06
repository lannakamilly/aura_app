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
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get("window");
const BANNER_WIDTH = width - 40;
const MAIN_PINK = "#ff86b4";
const LIGHT_PINK = "#FDEFF1"; // Cor de fundo mais suave para o gradiente
const VERY_LIGHT_PINK = "#fce3f7"; // Mantida, mas pouco usada
const LIGHT_BG = "#fff";

const HORIZONTAL_PADDING = 20;
const PRODUCT_CARD_MARGIN = 15; // Diminuído o margin
const PRODUCT_CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - PRODUCT_CARD_MARGIN) / 2;

// 1. IMPORTAÇÃO DA LOGO
const LOGO_IMAGE = require('../assets/auralogo.png');

const categories = [
  { name: "Skin Care", image: require('../assets/cate_skin.png') },
  { name: "Maquiagem", image: require('../assets/cate_make.png') },
  { name: "Cabelo", image: require('../assets/cate_cabelo.png') },
  { name: "Perfume", image: require('../assets/cate_perfume.png') },
];

const promotionBanners = [
  {
    id: 1,
    title: "Ofertaa de Outono",
    subtitle: "Até 30% OFF em Maquiagem.",
    backgroundImage: "https://i.pinimg.com/736x/41/b5/27/41b527efe61cae9e5ede5b254cc5acc9.jpg",
  },
  {
    id: 2,
    title: "Dia da Beleza",
    subtitle: "Frete Grátis acima de $150.",
    backgroundImage: "https://i.pinimg.com/1200x/74/b6/81/74b681aaf4b8510f902aa4ab9d308445.jpg",
  },
  {
    id: 3,
    title: "Lançamento Exclusivo",
    subtitle: "Novas coleções de Outono/Inverno.",
    backgroundImage: "https://i.pinimg.com/1200x/72/11/63/7211633244957d3b93a8f8679205c4af.jpg",
  },
];

const products = [
  { id: 1, name: "Gloss Fran By Franciny", newPrice: "R$59,67", image: require('../assets/prod.png'), rating: 4.8 },
  { id: 2, name: "Casual T-Shirt Longa", newPrice: "$85.00", image: require('../assets/2.png'), rating: 4.5 },
  { id: 3, name: "High-Waist Jeans", newPrice: "$149.00", image: require('../assets/3.png'), rating: 4.9 },
  { id: 4, name: "Mineral Primer", newPrice: "$39.90", image: require('../assets/4.png'), rating: 4.2 },
  { id: 5, name: "Silk Scarf", newPrice: "$45.00", image: require('../assets/5.png'), rating: 4.6 },
  { id: 6, name: "Luxury Handbag",newPrice: "$250.00", image: require('../assets/6.png'), rating: 4.7 },
  { id: 7, name: "Lipstick Set", newPrice: "$65.00", image: require('../assets/7.png'), rating: 4.3 },
  { id: 8, name: "Sunscreen SPF50", newPrice: "$29.90", image: require('../assets/8.png'), rating: 4.1 },
];

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

const ProductCard = ({ product }) => {
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
      <View style={styles.productImageBackground}>
        {/* ALTERAÇÃO: Usando LIGHT_PINK para um gradiente mais suave */}
        <LinearGradient
          colors={[LIGHT_PINK, '#fff']}
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

      {/* ALTERAÇÃO: Posicionamento mais sutil do botão de favorito */}
      <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
        <Ionicons
          // ALTERAÇÃO: Usa outline quando não está favoritado
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={22}
          color={MAIN_PINK}
        />
      </TouchableOpacity>

      <View style={styles.productDetails}>
        {/* NOVO: Container para Nome e Avaliação */}
        <View style={styles.nameRatingRow}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{product.rating ? product.rating.toFixed(1) : '4.5'}</Text>
          </View>
        </View>
        
        <View style={styles.priceContainer}>
          {/* Ocultado originalPrice se não houver 'price' no objeto product */}
          {product.price && (
             <Text style={styles.originalPrice}>
               {product.price}
             </Text>
          )}
          <Text style={styles.currentPrice}>{product.newPrice}</Text>
        </View>

      </View>
    </TouchableOpacity>
  );
};

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
        <Image
          source={item.image}
          style={styles.categoryImage}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.categoryName} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

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

  // Usando a instrução salva: o paddingBottom: 100 no scrollViewContent já está reservando o espaço para a tab navigation.

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollViewContent}
    >
      <View style={styles.topBackground} />

      {/* MODIFICADO: searchBarContainer agora usa justifyContent: 'center' */}
      <View style={styles.searchBarContainer}>
        <Image
          source={LOGO_IMAGE}
          style={styles.logoImage}
          resizeMode="contain"
        />
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
        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleFavoritesPress}
        >
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },
  // O 'paddingBottom: 100' está reservando espaço para a tab navigation, conforme sua instrução salva.
  scrollViewContent: {
    paddingBottom: 100,
  },

  topBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 175,
    backgroundColor: LIGHT_PINK,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  searchBarContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 50,
  },
  
  logoImage: {
    width: 140,
    height: 50,
    
    resizeMode: 'contain',
  },

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

  categoryList: {
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: 30,
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
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
    // NOVO: Limitando a 2 linhas para evitar quebra de layout
    numberOfLines: 2, 
    minHeight: 28, 
  },

  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: HORIZONTAL_PADDING,
  },

  // ESTILOS DO CARD DE PRODUTO OTIMIZADOS
  productCard: {
    width: PRODUCT_CARD_WIDTH,
    marginBottom: PRODUCT_CARD_MARGIN + 5, // Aumentado um pouco o espaço entre as linhas
    backgroundColor: '#fff',
    // NOVO: Aumentado o border radius
    borderRadius: 25, 
    shadowColor: '#000',
    // NOVO: Sombra mais suave e elevada
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 12, 
    elevation: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  productImageBackground: {
    width: '100%',
    height: 160,
    // NOVO: Permite que a imagem e o gradiente sigam o borderRadius do card
    borderTopLeftRadius: 25, 
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '80%',
    height: '80%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    // NOVO: Sombra sutil para o botão de favorito
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 4,
    zIndex: 10,
  },
  productDetails: {
    paddingHorizontal: 12,
    paddingBottom: 15,
    paddingTop: 10,
  },
  
  // NOVO: Linha para Nome e Avaliação (topo dos detalhes)
  nameRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
    // NOVO: Font weight um pouco mais leve, mas ainda forte
    fontWeight: '700', 
    color: '#333',
    // NOVO: Garante que o nome não empurre outros elementos
    flex: 1,
    marginRight: 10,
    minHeight: 40, // Espaço para 2 linhas (ex: ~20px por linha)
  },
  
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // NOVO: Removido margin bottom para destacar mais o preço
    marginBottom: 0, 
    marginTop: 5,
  },
  originalPrice: {
    fontSize: 14,
    color: '#a1a1aa',
    textDecorationLine: 'line-through',
    marginRight: 8,
    fontWeight: '500',
  },
  currentPrice: {
    fontSize: 19,
    fontWeight: '900', // Mais forte para o preço atual
    color: MAIN_PINK,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_PINK, // Fundo sutil para a classificação
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 13,
    color: '#333',
    marginLeft: 3,
    fontWeight: '600',
  },
});