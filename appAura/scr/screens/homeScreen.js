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

const { width } = Dimensions.get("window");
// Largura do banner para FlatList
const BANNER_WIDTH = width - 40;
const MAIN_PINK = "#ff86b5"; // Rosa Principal Suave
const LIGHT_PINK = "#FDEFF1"; // Rosa muito claro para fundo de topo
const LIGHT_BG = "#fff"; // Fundo Principal Branco

// --- DADOS MOCK EXPANDIDOS ---

// 1. Dados para Categorias (simulando os ícones da imagem)
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
    backgroundImage: "https://i.pinimg.com/736x/27/57/4b/27574b1187890275156a2e01523e8281.jpg",
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
    backgroundImage: "https://i.pinimg.com/736x/e5/5d/9d/e55d9d3f273309ffaa41d269524ab979.jpg",
  },
];

// 3. Dados dos Produtos (EXPANDIDO para 8 itens)
const products = [
  { id: 1, name: "Casual V-neck", price: "$129.00", newPrice: "$99.90", imageUrl: "https://cdn.awsli.com.br/2500x2500/591/591914/produto/299116739/-08---cido-l-tico-reduzido-y8by7yd7ud.png" },
  { id: 2, name: "Casual T-Shirt", price: "$113.00", newPrice: "$85.00", imageUrl: "https://acdn-us.mitiendanube.com/stores/004/599/657/products/frutas-4a762a9858af81d12117272424982864-640-0.png" },
  { id: 3, name: "High-Waist Jeans", price: "$199.00", newPrice: "$149.00", imageUrl: "https://acdn-us.mitiendanube.com/stores/004/599/657/products/leite-de-amendoas-ac405a9541ac122f4117276692711299-1024-1024.png" },
  { id: 4, name: "Mineral Primer", price: "$44.90", newPrice: "$39.90", imageUrl: "https://cdn.awsli.com.br/2500x2500/591/591914/produto/299107588/-06---cido-glic-lico-qiils1zk14.png" },
  // Mais produtos para encher a grade
  { id: 5, name: "Silk Scarf", price: "$55.00", newPrice: "$45.00", imageUrl: "https://microless.com/cdn/products/120f90dbfcf6a38b9fd2a8d25c54da05-hi.jpg" },
  { id: 6, name: "Luxury Handbag", price: "$299.00", newPrice: "$250.00", imageUrl: "https://static.vecteezy.com/system/resources/previews/051/786/986/non_2x/luxury-perfume-bottle-free-png.png" },
  { id: 7, name: "Lipstick Set", price: "$79.00", newPrice: "$65.00", imageUrl: "https://acdn-us.mitiendanube.com/stores/004/297/279/products/egeo-dolce-colors-59a082e68c02f6ce5c17097570501167-1024-1024.png" },
  { id: 8, name: "Sunscreen SPF50", price: "$35.00", newPrice: "$29.90", imageUrl: "https://boticaalternativa.com.br/wp-content/uploads/2023/02/kit-altermax-skincare-768x768.png" },
];

// --- COMPONENTES AUXILIARES ---

// 1. Banner de Carrossel (melhorado)
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

// 2. Card de Produto na Lista Principal (Visual aprimorado)
const ProductCard = ({ product }) => (
  <TouchableOpacity style={styles.productCard}>
    {/* Ícone de favorito/coração no canto superior direito */}
    <View style={styles.favoriteIconContainer}>
      <Ionicons name="heart-outline" size={20} color={MAIN_PINK} />
    </View>

    {/* Imagem do Produto */}
    <Image
      source={{ uri: product.imageUrl }}
      style={styles.productImage}
    />

    <View style={styles.productInfo}>
      <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
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

// 3. Card de Categoria
const CategoryCard = ({ item }) => (
  <TouchableOpacity style={styles.categoryCard}>
    <View style={styles.categoryIconCircle}>
      <Ionicons name={item.icon} size={28} color={MAIN_PINK} />
    </View>
    <Text style={styles.categoryName} numberOfLines={1}>{item.name}</Text>
  </TouchableOpacity>
);


// --- COMPONENTE PRINCIPAL (HomeScreen) ---
export default function HomeScreen() {
  const [searchText, setSearchText] = useState("");
  // Adiciona estado para o index do banner
  const [activeIndex, setActiveIndex] = useState(0);

  // Função para atualizar o índice do carrossel
  const onScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== activeIndex) {
        setActiveIndex(roundIndex);
    }
  };

  return (
    // Adiciona paddingBottom para a Tab Bar flutuante (25 bottom + 75 height = 100)
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>

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
        <View style={styles.cartButton}>
            <Ionicons name="cart-outline" size={24} color="#000" />
        </View>
      </View>

      <View style={styles.searchFilterRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            placeholder="Pesquisar produtos..."
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
          onScroll={onScroll} // Adiciona função de scroll
        />
        {/* Indicadores do Carrossel */}
        <View style={styles.indicatorContainer}>
            {promotionBanners.map((_, index) => (
                <View 
                    key={index} 
                    style={[
                        styles.indicator,
                        index === activeIndex ? styles.activeIndicator : styles.inactiveIndicator
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
    height: 180, // Aumentei a altura para ser mais proeminente
    marginRight: 15,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: MAIN_PINK, // Fundo caso a imagem não carregue
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
    justifyContent: "space-between", // Espaçamento entre título e botão
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Overlay escuro sutil
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
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignSelf: 'flex-start', // Alinha o botão à esquerda
  },
  orderButtonText: {
    color: MAIN_PINK,
    fontWeight: '700',
    fontSize: 14,
  }
});


// --- ESTILOS GERAIS E CARTÕES DE PRODUTO/CATEGORIA ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },
  scrollViewContent: {
    paddingBottom: 100, // IMPORTANTE: Espaço para o Tab Bar (75 height + 25 bottom)
  },

  // Fundo Rosa Suave no Topo
  topBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 160, // Aumentei para cobrir mais
    backgroundColor: LIGHT_PINK,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  // Topo (Localização e Carrinho)
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  locationText: {
    marginLeft: 5,
    marginRight: 5,
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  cartButton: {
    padding: 5,
  },
  
  // Linha de Pesquisa e Filtro
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800', // Negrito forte
    color: '#000',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
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
    flexDirection: 'row',
    justifyContent: 'center',
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
    width: 20, // Indicador ativo mais longo
  },
  inactiveIndicator: {
    backgroundColor: '#ccc',
  },

  // Lista de Categorias
  categoryList: {
    paddingHorizontal: 20,
    marginBottom: 30,
    justifyContent: 'space-between', // Distribui o espaço entre os cards
  },
  categoryCard: {
    alignItems: 'center',
    width: width / 5, // Garante que caibam 4 ou 5 na tela
    marginRight: 15,
  },
  categoryIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: LIGHT_PINK,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    textAlign: 'center',
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: "relative",
  },
  favoriteIconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 5,
    zIndex: 10,
    // Adiciona uma sombra sutil ao ícone
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
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
    alignItems: 'flex-start', // Alinha informações à esquerda
  },
  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productOldPrice: {
    fontSize: 13,
    fontWeight: "500",
    color: "#999",
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  productNewPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: MAIN_PINK, // Destaca o preço novo
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#555',
    fontWeight: '600',
  }
});