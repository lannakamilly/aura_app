import React, { useEffect, useRef } from 'react';
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
import { Ionicons } from '@expo/vector-icons';

// --- Paleta de Cores Profissional ---
const COLORS = {
  primary: '#ff86b4',
  secondary: '#F5E6E8',
  textDark: '#333333',
  textLight: '#ffffff',
  background: '#fcfcfc',
  shadow: 'rgba(91, 79, 140, 0.3)',
  accent: '#FFA5C0',
  // Novo tom para o banner, se necessário
  darkOverlay: 'rgba(0, 0, 0, 0.4)',
};

// --- Importação das Imagens Locais ---
const images = {
    cabelo: require('../assets/cate_cabelo.png'),
  pele: require('../assets/cate_skin.png'),
  maquiagem: require('../assets/cate_make.png'),
  perfume: require('../assets/cate_perfume.png'),
};

const { width } = Dimensions.get('window');
const CARD_PADDING = 20;
const CARD_MARGIN = 10;
const CARD_WIDTH = (width - CARD_PADDING * 2 - CARD_MARGIN * 2) / 2;
// *** Altura da Tab Bar Fixa: 90px (Conforme sua solicitação anterior) ***
const TAB_BAR_HEIGHT = 90;

// --- Dados das 4 Categorias ---
const categories = [
  {
    id: '1',
    name: 'Cuidados Capilares',
   
    screen: 'CategoriaCabelo',
    assetImage: images.cabelo,
  },
  {
    id: '2',
    name: 'Essenciais de Skincare',
   
    screen: 'CategoriaPele',
    assetImage: images.pele,
  },
  {
    id: '3',
    name: 'Coleção Maquiagem',
    
    screen: 'CategoriaMaquiagem',
    assetImage: images.maquiagem,
  },
  {
    id: '4',
    name: 'Perfumaria Fina',
    
    screen: 'CategoriaPerfume',
    assetImage: images.perfume,
  },
];

// --- NOVO COMPONENTE: Banner Promocional (URL) ---
const PromotionalBanner = ({ imageUrl, title, subtitle, onPress }) => {
    return (
        <TouchableOpacity 
            style={styles.bannerContainer}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Image
                source={{ uri: imageUrl }} // Usando URL de imagem
                style={styles.bannerImage}
            />
            {/* Overlay Escuro para Legibilidade do Texto */}
            <View style={styles.bannerOverlay} />

            <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>{title}</Text>
                <Text style={styles.bannerSubtitle}>{subtitle}</Text>
                <View style={styles.bannerCTA}>
                    <Text style={styles.bannerCTAText}>
                        Compre Agora
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color={COLORS.textLight} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

// --- Componente Card de Categoria (Mantido) ---
const CategoryCard = ({ item, onPress, index }) => {
    // ... (código do CategoryCard inalterado) ...
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const translateYAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 800,
                delay: index * 120 + 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
                toValue: 0,
                duration: 800,
                delay: index * 120 + 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.97, duration: 150, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start(() => onPress());
    };

    return (
        <Animated.View
            style={[
                styles.categoryCard,
                {
                    width: CARD_WIDTH,
                    transform: [
                        { scale: scaleAnim },
                        { translateY: translateYAnim }
                    ]
                }
            ]}
        >
            <TouchableOpacity
                style={styles.cardTouchable}
                onPress={handlePress}
                activeOpacity={0.9}
            >
                <Image
                    source={item.assetImage}
                    style={styles.cardImage}
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.4)', COLORS.primary]}
                    style={styles.textOverlay}
                    start={{ x: 0, y: 0.4 }}
                    end={{ x: 0, y: 1 }}
                />

                <View style={styles.categoryInfoOverlay}>
                    <Text style={styles.categoryNameOverlay}>{item.name}</Text>
                    <Text style={styles.categoryDescriptionOverlay}>{item.description}</Text>
                    <View style={styles.callToActionContainer}>
                        <Text style={styles.callToActionText}>
                            Ver Coleção
                        </Text>
                        <Ionicons name="arrow-forward-circle" size={18} color={COLORS.textLight} />
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// --- Tela Principal de Categorias ---
const CategoriesScreen = () => {
  const navigation = useNavigation();
  const headerAnim = useRef(new Animated.Value(0)).current;

  // URL DE EXEMPLO PARA O BANNER (Substitua por sua imagem!)
  const BANNER_IMAGE_URL = 'https://i.pinimg.com/1200x/09/c2/7f/09c27f847d533295bae6274dcaffaf41.jpg'; 

  useEffect(() => {
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
      // Lógica de navegação ou ação do banner
      console.log('Banner Pressionado! Levar para Ofertas Especiais...');
      // navigation.navigate('OfertasEspeciais');
  };

  // Renderiza o Banner e o Título antes do Grid
  const renderListHeader = () => (
      <View>
          <PromotionalBanner
              imageUrl={BANNER_IMAGE_URL}
              title="Oferta da Semana"
              subtitle="Até 40% OFF em toda a linha de Skincare."
              onPress={handleBannerPress}
          />
          <Text style={styles.sectionTitle}>
              Explorar Categorias
          </Text>
      </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header com Gradiente */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.accent]}
        style={styles.headerContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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
            Descubra Nossas
          </Text>
          <Text style={styles.subHeadingBold}>
            Coleções Premium
          </Text>
          <Text style={styles.subtitle}>
            A beleza começa aqui. Encontre produtos exclusivos para sua rotina.
          </Text>
        </Animated.View>
      </LinearGradient>

      {/* Grid de Categorias com o Banner no topo */}
      <FlatList
        data={categories}
        renderItem={({ item, index }) => (
          <CategoryCard
            item={item}
            index={index}
            onPress={() => navigateToCategory(item.screen)}
          />
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        ListHeaderComponent={renderListHeader} // Adiciona o banner e o título aqui
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// --- Estilos (Adição dos estilos do Banner e ajuste no grid) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'flex-start',
  },
  subHeading: {
    fontSize: 30,
    fontWeight: '300',
    color: COLORS.textLight,
    lineHeight: 32,
  },
  subHeadingBold: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.textLight,
    lineHeight: 38,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'left',
    fontWeight: '400',
    marginTop: 5,
  },
  sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: COLORS.textDark,
      marginTop: 20,
      marginBottom: 10,
      paddingHorizontal: CARD_PADDING,
  },
  gridContainer: {
    // Retirado o paddingTop de 20 para o banner ficar mais junto
    paddingBottom: 20 + TAB_BAR_HEIGHT, // AJUSTE DA TAB BAR MANTIDO!
  },
  // --- Estilos do Banner ---
  bannerContainer: {
      height: 200, // Altura padrão do banner
      width: width - (CARD_PADDING * 2),
      borderRadius: 12,
      overflow: 'hidden',
      marginHorizontal: CARD_PADDING, // Centraliza
      marginTop: 20,
      marginBottom: 10, // Espaço entre o banner e o título
      elevation: 5,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
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
      bottom: 20,
      left: 20,
      right: 20,
      zIndex: 10,
  },
  bannerTitle: {
      fontSize: 24,
      fontWeight: '800',
      color: COLORS.textLight,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
  },
  bannerSubtitle: {
      fontSize: 14,
      color: COLORS.textLight,
      fontWeight: '400',
      marginTop: 5,
      marginBottom: 10,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
  },
  bannerCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerCTAText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textLight,
    marginRight: 5,
  },
  // --- Estilos de Card (Mantidos) ---
  categoryCard: {
    backgroundColor: COLORS.textLight,
    borderRadius: 12,
    margin: CARD_MARGIN,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
    height: 240,
  },
  cardTouchable: {
    flex: 1,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  categoryInfoOverlay: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    zIndex: 5,
  },
  categoryNameOverlay: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textLight,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  categoryDescriptionOverlay: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 16,
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 10,
  },
  callToActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  callToActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
    marginRight: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  }
});

export default CategoriesScreen;