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

const { width } = Dimensions.get('window');
// Definição da largura do banner para FlatList
const BANNER_WIDTH = width - 40; 
const MAIN_PINK = "#FEA7B5"; // Rosa Principal Suave
const LIGHT_PINK = "#FDEFF1"; // Rosa muito claro para fundo de topo
const LIGHT_BG = "#fff"; // Fundo Principal Branco

// --- DADOS MOCK (Simulando o conteúdo do App de Moda Feminina) ---

// Dados para os filtros (All, Popular, Recent, Recommend)
const tabs = ["All", "Popular", "Recent", "Recommend"];

// Dados para o CARROSSEL DE PROMOÇÕES
const promotionBanners = [
  {
    id: 1,
    title: "Big Sale",
    subtitle: "Get the trendy fashion at a discount of up to 50%",
    // Imagem com fundo rosa, como no design original
    backgroundImage: "https://placehold.co/400x150/FEA7B5/fff?text=MEGA+PROMO%C3%87%C3%83O", 
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Discover the new summer collection!",
    backgroundImage: "https://placehold.co/400x150/FFC9D2/000?text=NOVIDADES", 
  },
  {
    id: 3,
    title: "Free Shipping",
    subtitle: "On orders over $99.",
    backgroundImage: "https://placehold.co/400x150/D1B1C2/fff?text=FRETE+GRATIS", 
  },
];

// Dados dos Produtos (agora mais simples, como no card "Mineral Primer")
const products = [
  {
    id: 2,
    name: "Casual V-neck",
    price: "$129.00",
    imageUrl: "https://placehold.co/200x200/F0F0F0/000?text=Camiseta+V",
  },
  {
    id: 3,
    name: "Casual T-Shirt",
    price: "$113.00",
    imageUrl: "https://placehold.co/200x200/F0F0F0/000?text=Camiseta",
  },
  {
    id: 4,
    name: "High-Waist Jeans",
    price: "$199.00",
    imageUrl: "https://placehold.co/200x200/F0F0F0/000?text=Jeans",
  },
  {
    id: 5,
    name: "Mineral Primer",
    price: "$44.90",
    imageUrl: "https://placehold.co/200x200/F0F0F0/000?text=Primer", // Imagem do produto de maquiagem
  },
];

// --- COMPONENTES AUXILIARES ---

// 1. Banner de Carrossel (com imagem de fundo)
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
    </View>
  </TouchableOpacity>
);

// 2. Card de Produto na Lista Principal (Visual simplificado)
const ProductCard = ({ product }) => (
  <TouchableOpacity style={styles.productCard}>
    {/* Ícone de favorito/coração no canto superior direito */}
    <View style={styles.favoriteIconContainer}>
        <Ionicons name="heart-outline" size={20} color="#999" />
    </View>

    {/* Imagem do Produto */}
    <Image
      source={{ uri: product.imageUrl }}
      style={styles.productImage}
    />
    
    <View style={styles.productInfo}>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>{product.price}</Text>
    </View>
  </TouchableOpacity>
);

// --- COMPONENTE PRINCIPAL (HomeScreen) ---
export default function HomeScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Fundo Rosa Suave no topo (para dar profundidade) */}
      <View style={styles.topBackground} />

      {/* 1. Barra de Pesquisa e Filtro (Topo) */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 2. Carrossel de Promoções */}
      <View style={styles.carouselContainer}>
        <FlatList
          horizontal
          data={promotionBanners}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          pagingEnabled // Para deslizar um banner por vez
          snapToInterval={BANNER_WIDTH + 15} // Largura do banner + margin
          decelerationRate="fast"
          renderItem={({ item }) => <PromotionBanner item={item} />}
          contentContainerStyle={styles.carouselList}
        />
      </View>

      {/* 3. Abas de Filtro (All, Popular, Recent, Recommend) */}
      <View style={styles.tabsContainer}>
        <FlatList
          horizontal
          data={tabs}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === item && styles.activeTabButton,
              ]}
              onPress={() => setSelectedTab(item)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === item && styles.activeTabText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.tabsList}
        />
      </View>

      {/* 4. Lista de Produtos (Cards em grade) */}
      <View style={styles.productsGrid}>
        {products.map((item) => (
            <ProductCard key={item.id} product={item} />
        ))}
      </View>

      {/* Espaço para o final da rolagem */}
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

// --- ESTILOS DO CARROSSEL DE PROMOÇÃO ---
const bannerStyles = StyleSheet.create({
  bannerContainer: {
    width: BANNER_WIDTH,
    height: 150,
    marginRight: 15,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    // Garante que a imagem preencha o fundo
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    justifyContent: 'center',
    // Adiciona um gradiente sutil se necessário, mas aqui usaremos só o texto
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
});


// --- ESTILOS GERAIS E CARTÕES DE PRODUTO ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },
  
  // Fundo Rosa Suave no Topo
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120, // Altura que cobre a barra de pesquisa
    backgroundColor: LIGHT_PINK, 
    // Curvas suaves no fundo
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30,
  },

  // Barra de Pesquisa (Topo)
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    zIndex: 5, // Garante que fique acima do fundo rosa
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

  // Carrossel de Promoções
  carouselContainer: {
    marginBottom: 30,
    // Move o padding horizontal para o contentContainerStyle da FlatList
  },
  carouselList: {
    paddingHorizontal: 20, // Adiciona padding horizontal aqui
  },

  // Abas de Filtro
  tabsContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  tabsList: {
    // Alinhamento dos itens na lista horizontal
  },
  tabButton: {
    marginRight: 12,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 25,
    backgroundColor: "#fff", 
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeTabButton: {
    backgroundColor: MAIN_PINK, 
    borderColor: MAIN_PINK,
    shadowColor: MAIN_PINK,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  tabText: {
    color: "#000",
    fontWeight: "600", 
    fontSize: 14,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "700",
  },

  // Lista de Produtos (Grade 2x2)
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  productCard: {
    width: '47%', 
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 }, 
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative', // Necessário para posicionar o ícone
  },

  // Ícone de favorito no card
  favoriteIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 3,
    zIndex: 10,
  },

  // Elementos internos do Card
  productImage: {
    width: '100%',
    height: 180, // Altura ajustada para o formato de produto
    resizeMode: 'contain', // Ajusta a imagem inteira no espaço
    backgroundColor: '#F7F7F7', // Fundo mais claro para o produto
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  productInfo: {
    padding: 12,
    alignItems: 'center', // Centraliza o texto
  },
  productName: {
    fontSize: 16,
    fontWeight: "700", 
    color: "#000",
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#999", // Preço mais sutil abaixo do nome
    marginTop: 4,
    textDecorationLine: 'line-through', // Adiciona um tachado simulando preço antigo
  },
});
