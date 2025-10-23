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
  Image, // Componente Image adicionado
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_PADDING = 20; // Padding horizontal da FlatList
const CARD_MARGIN = 10; // Margem entre os cards
const CARD_WIDTH = (width - CARD_PADDING * 2 - CARD_MARGIN * 2) / 2; // Largura do card para 2 colunas

// --- Dados das 4 Categorias ---
const categories = [
  {
    id: '1',
    name: 'Cabelo',
    description: 'Shampoos, condicionadores e finalizadores',
    icon: '💇‍♀️',
    type: 'Cabelo',
    screen: 'CategoriaCabelo',
    // Imagem de alta qualidade com tema de cabelo
    imageUrl: 'https://i.pinimg.com/1200x/1d/36/d4/1d36d4b0f0d80d784799f4f2e15b0aa3.jpg', 
  },
  {
    id: '2',
    name: 'Pele',
    description: 'Cuidados faciais, séruns e hidratação',
    icon: '💧',
    type: 'Pele',
    screen: 'CategoriaPele',
    // Imagem de alta qualidade com tema de pele/skincare
    imageUrl: 'https://i.pinimg.com/1200x/86/31/4c/86314ce6fb8b31aaba7bafac68cba6ba.jpg', 
  },
  {
    id: '3',
    name: 'Maquiagem',
    description: 'Bases, batons, paletas e pincéis',
    icon: '💄',
    type: 'Maquiagem',
    screen: 'CategoriaMaquiagem',
    // Imagem de alta qualidade com tema de maquiagem
    imageUrl: 'https://i.pinimg.com/1200x/27/20/56/2720561f5aa6a9d7c502cac7101c9a00.jpg', 
  },
  {
    id: '4',
    name: 'Perfume',
    description: 'Fragrâncias femininas e masculinas exclusivas',
    icon: '🌸',
    type: 'Perfume',
    screen: 'CategoriaPerfume',
    // Imagem de alta qualidade com tema de perfume
    imageUrl: 'https://i.pinimg.com/736x/8e/64/e3/8e64e32536cbdd6581ed297ad2d909fe.jpg', 
  },
];

// --- Componente Card de Categoria ---
const CategoryCard = ({ item, onPress, index }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;

  // Animação de entrada dos cards
  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 150 + 200, // Atraso após o header
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 600,
        delay: index * 150 + 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    // Animação de clique (feedback visual)
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
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
        activeOpacity={0.9} // Opacidade ativa ajustada para cards de imagem
      >
        {/* Imagem de Fundo (Área Visual) */}
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.cardImage} 
        />
        
        {/* Overlay de Gradiente Escuro na parte inferior para garantir legibilidade do texto */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)']}
          style={styles.textOverlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {/* Informações da Categoria sobrepostas (Nome e Descrição) */}
        <View style={styles.categoryInfoOverlay}>
          <Text style={styles.categoryNameOverlay}>{item.name}</Text>
          <Text style={styles.categoryDescriptionOverlay}>{item.description}</Text>
        </View>

        {/* Ícone da categoria em um círculo destacado (Mantido como "status" visual) */}
        <View style={styles.categoryIconContainer}>
          <Text style={styles.categoryIcon}>{item.icon}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// --- Tela Principal de Categorias ---
const CategoriesScreen = () => {
  const navigation = useNavigation();
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const navigateToCategory = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#fcfcfc']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header/Título */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [{
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            }],
          }
        ]}
      >
        <Text style={styles.mainTitle}>
          Navegue pelas
        </Text>
        {/* Removido o negrito (**) conforme solicitação */}
        <Text style={styles.subHeading}>
          Nossas Categorias
        </Text>
        <Text style={styles.subtitle}>
          Descubra a linha completa de produtos para sua rotina de beleza e bem-estar.
        </Text>
      </Animated.View>

      {/* Grid de Categorias */}
      <FlatList
        data={categories}
        renderItem={({ item, index }) => (
          <CategoryCard
            item={item}
            index={index}
            onPress={() => navigateToCategory(item.screen)} // Implementa a navegação
          />
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        // Adiciona um padding extra para não cobrir a Tab Bar
        style={{ marginBottom: 90 }} 
      />
    </LinearGradient>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 30,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  mainTitle: {
    fontSize: 38,
    fontWeight: '800',
    color: "#ff86b5", // Cor ajustada para um visual mais neutro/profissional
    lineHeight: 40,
    marginBottom: 2,
  },
  subHeading: {
    fontSize: 38,
    fontWeight: '800',
    color: "#ff86b5", // Cor ajustada para um visual mais neutro/profissional
    lineHeight: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'left',
    fontWeight: '400',
  },
  gridContainer: {
    paddingHorizontal: CARD_PADDING,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  // Estilo do Card com Imagem (novo visual)
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: CARD_MARGIN,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1, // Sombra sutil para efeito elevado
    shadowRadius: 15,
    elevation: 10,
    overflow: 'hidden',
    height: 250, 
  },
  cardTouchable: {
    flex: 1,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    // O borderRadius será aplicado no container pai (categoryCard)
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%', // Gradiente cobrindo a parte inferior
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  categoryInfoOverlay: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    zIndex: 5, // Garante que o texto fique acima do gradiente
  },
  categoryNameOverlay: {
    fontSize: 20,
    fontWeight: '800', 
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.6)', // Sombra para o texto
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  categoryDescriptionOverlay: {
    fontSize: 13,
    color: '#fff',
    lineHeight: 18,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Estilos do Ícone de Status
  categoryIconContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  categoryIcon: {
    fontSize: 20,
  },
});

export default CategoriesScreen;
