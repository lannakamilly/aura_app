import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Adicionei MaterialCommunityIcons para variedade

// --- Paleta de Cores Profissional Aprimorada ---
const COLORS = {
  primary: '#ff86b4', // Rosa Choque/Principal (Mais vibrante)
  secondary: '#F5E6E8', // Fundo Suave
  textDark: '#2C2C2C', // Preto mais suave
  textLight: '#ffffff',
  background: '#f9f9f9', // Fundo mais limpo
  shadow: 'rgba(91, 79, 140, 0.4)', // Sombra mais forte
  accent: '#ec7ca7ff', // Rosa claro de realce
  darkOverlay: 'rgba(0, 0, 0, 0.4)',
  cardPink: 'rgba(255, 105, 180, 0.2)', // Rosa sutil para o gradiente do card
};

// --- Importação das Imagens Locais ---
// *** ATENÇÃO: Mantenha os caminhos corretos para seus assets ***
const images = {
  cabelo: require('../assets/cate_cabelo.png'), 
  pele: require('../assets/cate_skin.png'), 
  maquiagem: require('../assets/cate_make.png'),
  perfume: require('../assets/cate_perfume.png'),
};

const { width } = Dimensions.get('window');
const SPACING = 20;
// Dimensões do Card para o Carrossel (Mais estreito, mais alto: foco no visual)
const CARD_WIDTH = width * 0.70; // 70% da tela
const CARD_HEIGHT = CARD_WIDTH * 1.5; // Mais alto
const LIST_ITEM_SIZE = CARD_WIDTH + SPACING; 

// *** Altura da Tab Bar Fixa: 90px (Conforme sua solicitação anterior) ***
const TAB_BAR_HEIGHT = 90; 

// --- Dados das 4 Categorias ---
const categories = [
  {
    id: '1',
    name: 'Cuidados Capilares',
    description: 'Transforme seus fios', 
    screen: 'CategoriaCabelo',
    assetImage: images.cabelo,
  },
  {
    id: '2',
    name: 'Essenciais de Skincare',
    description: 'Pele radiante e saudável', 
    screen: 'CategoriaPele',
    assetImage: images.pele,
  },
  {
    id: '3',
    name: 'Coleção Maquiagem',
    description: 'Beleza e autoexpressão', 
    screen: 'CategoriaMaquiagem',
    assetImage: images.maquiagem,
  },
  {
    id: '4',
    name: 'Perfumaria Fina',
    description: 'Sua assinatura olfativa', 
    screen: 'CategoriaPerfume',
    assetImage: images.perfume,
  },
];

// --- COMPONENTE: Banner Promocional (Aparência aprimorada) ---
const PromotionalBanner = ({ imageUrl, title, subtitle, onPress }) => {
    return (
        <TouchableOpacity 
            style={styles.bannerContainer}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Image
                source={{ uri: imageUrl }} 
                style={styles.bannerImage}
            />
            <View style={styles.bannerOverlay} />

            <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>{title}</Text>
                <Text style={styles.bannerSubtitle}>{subtitle}</Text>
                <View style={styles.bannerCTA}>
                    <Text style={styles.bannerCTAText}>
                        Ver ofertas
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color={COLORS.textLight} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

// --- Componente Card de Categoria (Carrossel com efeito de profundidade) ---
const CategoryCard = React.memo(({ item, index, scrollX, onPress }) => {
  const inputRange = [
    (index - 1) * LIST_ITEM_SIZE,
    index * LIST_ITEM_SIZE,
    (index + 1) * LIST_ITEM_SIZE,
  ];

  // Efeito de escala mais sutil para um look mais suave
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.9, 1, 0.9],
    extrapolate: 'clamp',
  });

  // Efeito de opacidade para focar no item central
  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.7, 1, 0.7],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.carouselCard,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.cardTouchable}
        onPress={onPress}
        activeOpacity={0.95}
      >
        {/* Imagem de Fundo (Asset) */}
        <Image
          source={item.assetImage}
          style={styles.carouselCardImage}
        />
        
        {/* Gradiente sutil por cima da imagem, do claro para o escuro */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.85)']}
          style={styles.textOverlay}
          locations={[0.4, 0.8, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {/* Informações da Categoria */}
        <View style={styles.categoryInfoOverlay}>
          <Text style={styles.categorySubTitle}>
            {item.description}
          </Text>
          <Text style={styles.categoryNameOverlay}>{item.name}</Text>
          <View style={styles.callToActionContainer}>
            <Text style={styles.callToActionText}>
              Ver Coleção
            </Text>
            <MaterialCommunityIcons name="arrow-right-circle" size={20} color={COLORS.primary} /> 
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

// --- Tela Principal de Categorias ---
const CategoriesScreen = () => {
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current; 
  const headerAnim = useRef(new Animated.Value(0)).current;

  // URL DE EXEMPLO PARA O BANNER
  const BANNER_IMAGE_URL = 'https://i.pinimg.com/1200x/09/c2/7f/09c27f847d533295bae6274dcaffaf41.jpg'; 

  useEffect(() => {
    // Animação de entrada do Header
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const navigateToCategory = (screenName) => {
    navigation.navigate(screenName);
  };

  const handleBannerPress = () => {
    console.log('Banner Pressionado! Levar para Ofertas Especiais...');
  };

  const renderListHeader = () => (
    <View style={styles.listHeaderPadding}>
      <PromotionalBanner
        imageUrl={BANNER_IMAGE_URL}
        title="Oferta da Semana"
        subtitle="Até 40% OFF em toda a linha de Skincare."
        onPress={handleBannerPress}
      />
      {/* Título da seção principal - abaixo do banner */}
      <Text style={styles.sectionTitle}>
        <Ionicons name="sparkles-outline" size={24} color={COLORS.primary} /> Explore as Coleções
      </Text>
    </View>
  );

  const renderListFooter = () => (
      // *** COMPENSAÇÃO DA TAB BAR (CONFORME SOLICITADO) ***
      <View style={{ height: 20 + TAB_BAR_HEIGHT }} /> 
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header com Gradiente */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.accent]}
        style={styles.headerContainer}
        start={{ x: 0, y: 0.1 }}
        end={{ x: 1, y: 0.9 }}
      >
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerAnim,
              transform: [{
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0],
                }),
              }],
            }
          ]}
        >
          <Text style={styles.subHeading}>
           
          </Text>
          <Text style={styles.subHeadingBold}>
            Coleções Premium
          </Text>
          <Text style={styles.subtitle}>
            Encontre sua rotina perfeita.
          </Text>
        </Animated.View>
      </LinearGradient>
      
      {/* FlatList principal: Banner, Título da Seção e Carrossel */}
      <FlatList
        data={[{ key: 'main' }]} // Usamos um único item para englobar as views
        renderItem={() => (
          <View>
            {/* Carrossel Horizontal de Categorias */}
            <Animated.FlatList
              data={categories}
              renderItem={({ item, index }) => (
                <CategoryCard
                  item={item}
                  index={index}
                  scrollX={scrollX}
                  onPress={() => navigateToCategory(item.screen)}
                />
              )}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContainer}
              // Garante que o item pare exatamente no centro
              snapToInterval={LIST_ITEM_SIZE} 
              decelerationRate="fast"
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
            />
          </View>
        )}
        keyExtractor={item => item.key}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        contentContainerStyle={styles.mainScrollContent}
        showsVerticalScrollIndicator={false}
      />

    </View>
  );
};

// --- Estilos Aprimorados ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: SPACING,
    paddingBottom: 40,
    // Estilos de sombra para o Header
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  header: {
    alignItems: 'flex-start',
  },
  subHeading: {
    fontSize: 20,
    fontWeight: '300',
    color: COLORS.textLight,
    lineHeight: 22,
  },
  subHeadingBold: {
    fontSize: 38, // Aumentei o tamanho
    fontWeight: '900', // Mais peso
    color: COLORS.textLight,
    lineHeight: 40,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
    marginTop: 5,
  },
  mainScrollContent: {
    paddingBottom: 0, // Padding do footer componente cuida da barra de navegação
  },
  listHeaderPadding: {
    // Garante que o banner e o título da seção tenham padding
    paddingTop: 0, 
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: SPACING,
  },
  
  // --- Estilos do Banner ---
  bannerContainer: {
    height: 180, 
    width: width - (SPACING * 2),
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: SPACING,
    marginTop: 20,
    marginBottom: 10, 
    elevation: 8, // Mais destaque para o banner
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.darkOverlay,
    opacity: 0.6,
  },
  bannerTextContainer: {
    position: 'absolute',
    bottom: 25, // Subiu um pouco
    left: 20,
    right: 20,
    zIndex: 10,
  },
  bannerTitle: {
    fontSize: 28, // Maior e mais impactante
    fontWeight: '900',
    color: COLORS.textLight,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '400',
    marginTop: 5,
    marginBottom: 15, // Mais espaço antes do CTA
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bannerCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 10, // Aumentei o padding
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-start',
    elevation: 3,
  },
  bannerCTAText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textLight,
    marginRight: 8,
  },

  // --- Estilos do Carrossel (Aprimorados) ---
  carouselContainer: {
    // Garante que o primeiro item comece centralizado no eixo X
    paddingHorizontal: width / 2 - CARD_WIDTH / 2, 
    paddingVertical: SPACING, 
  },
  carouselCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: COLORS.textLight,
    borderRadius: 18, // Borda mais arredondada
    marginHorizontal: SPACING / 2,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 18 }, // Sombra mais projetada
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20, // Efeito flutuante
  },
  cardTouchable: {
    flex: 1,
  },
  carouselCardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  textOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  categoryInfoOverlay: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    zIndex: 5,
  },
  categorySubTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  categoryNameOverlay: {
    fontSize: 28, // Aumentei o tamanho do nome
    fontWeight: '900',
    color: COLORS.textLight,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  callToActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: COLORS.textLight, // CTA em cor clara para contraste
    alignSelf: 'flex-start',
    elevation: 2,
  },
  callToActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark, // Texto escuro no fundo claro
    marginRight: 5,
  }
});

export default CategoriesScreen;