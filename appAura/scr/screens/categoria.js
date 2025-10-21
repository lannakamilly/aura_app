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
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { 
  Rect, 
  Path, 
  Circle, 
  Ellipse, 
  Defs, 
  LinearGradient as SvgLinearGradient, 
  RadialGradient as SvgRadialGradient,
  Stop 
} from 'react-native-svg';

const { width } = Dimensions.get('window');

// --- Dados das Categorias ---
const categories = [
  { 
    id: '1', 
    name: 'Cabelo', 
    description: 'Shampoos, condicionadores e tratamentos',
    bgColor: ['#FDF0F0', '#fce4e4'],
    image: require('../assets/cabelo-categoria.jpg'),
    icon: '💇‍♀️',
    type: 'cabelo'
  },
  { 
    id: '2', 
    name: 'Pele', 
    description: 'Cuidados faciais e corporais',
    bgColor: ['#F0FDF5', '#e4fce7'],
    image: require('../assets/pele-categoria.jpg'),
    icon: '🧴',
    type: 'pele'
  },
  { 
    id: '3', 
    name: 'Maquiagem', 
    description: 'Bases, batons e pincéis',
    bgColor: ['#F0F8FD', '#e4f4fc'],
    image: require('../assets/maquiag-categoria.jpg'),
    icon: '💄',
    type: 'maquiagem'
  },
];

const CabeloSVG = () => (
  <Svg width="100%" height="100%" viewBox="0 0 200 160">
    <Defs>
      <SvgLinearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#8B4513" stopOpacity="1" />
        <Stop offset="50%" stopColor="#D2691E" stopOpacity="1" />
        <Stop offset="100%" stopColor="#CD853F" stopOpacity="1" />
      </SvgLinearGradient>
    </Defs>
    <Rect width="200" height="160" fill="#FDF0F0"/>
    <Path d="M40 80 Q60 60, 80 80 T120 80 T160 80" stroke="url(#hairGradient)" strokeWidth="8" fill="none"/>
    <Path d="M35 90 Q55 70, 75 90 T115 90 T155 90" stroke="url(#hairGradient)" strokeWidth="6" fill="none"/>
    <Path d="M45 100 Q65 80, 85 100 T125 100 T165 100" stroke="url(#hairGradient)" strokeWidth="7" fill="none"/>
    <Rect x="20" y="20" width="15" height="25" rx="3" fill="#ff86b5"/>
    <Rect x="40" y="15" width="12" height="30" rx="2" fill="#ff6b9d"/>
    <Circle cx="170" cy="30" r="8" fill="#ffb3d1"/>
  </Svg>
);

const PeleSVG = () => (
  <Svg width="100%" height="100%" viewBox="0 0 200 160">
    <Defs>
      <SvgRadialGradient id="skinGradient" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#FFE4E1" stopOpacity="1" />
        <Stop offset="100%" stopColor="#FFDAB9" stopOpacity="1" />
      </SvgRadialGradient>
    </Defs>
    <Rect width="200" height="160" fill="#F0FDF5"/>
    <Ellipse cx="100" cy="80" rx="45" ry="50" fill="url(#skinGradient)"/>
    <Rect x="30" y="30" width="20" height="15" rx="7" fill="#4ade80"/>
    <Circle cx="160" cy="40" r="12" fill="#22c55e"/>
    <Rect x="25" y="120" width="18" height="25" rx="4" fill="#16a34a"/>
    <Circle cx="85" cy="70" r="2" fill="#333"/>
    <Circle cx="115" cy="70" r="2" fill="#333"/>
    <Path d="M90 90 Q100 95, 110 90" stroke="#ff86b5" strokeWidth="2" fill="none"/>
  </Svg>
);

const MaquiagemSVG = () => (
  <Svg width="100%" height="100%" viewBox="0 0 200 160">
    <Rect width="200" height="160" fill="#F0F8FD"/>
    <Rect x="40" y="60" width="8" height="40" rx="4" fill="#333"/>
    <Rect x="38" y="50" width="12" height="15" rx="6" fill="#ff1744"/>
    <Rect x="80" y="40" width="60" height="35" rx="5" fill="#333"/>
    <Circle cx="95" cy="55" r="8" fill="#ff86b5"/>
    <Circle cx="115" cy="55" r="8" fill="#9c27b0"/>
    <Circle cx="125" cy="55" r="8" fill="#3f51b5"/>
    <Rect x="160" y="30" width="3" height="50" fill="#8d6e63"/>
    <Ellipse cx="161.5" cy="25" rx="6" ry="8" fill="#ff86b5"/>
    <Circle cx="120" cy="120" r="25" fill="#e3f2fd" stroke="#90caf9" strokeWidth="2"/>
  </Svg>
);

// --- Componente Card de Categoria ---
const CategoryCard = ({ item, onPress, index }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 600,
        delay: index * 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };



  return (
    <Animated.View 
      style={[
        styles.categoryCard,
        {
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
        {/* Área da Imagem */}
        <LinearGradient
          colors={item.bgColor}
          style={styles.imageContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Image 
            source={item.image}
            style={styles.categoryImage}
            resizeMode="cover"
          />
          
          {/* Overlay sutil */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.05)']}
            style={styles.imageOverlay}
          />
          
          {/* Ícone da categoria */}
          <View style={styles.categoryIconContainer}>
            <Text style={styles.categoryIcon}>{item.icon}</Text>
          </View>
        </LinearGradient>
        
        {/* Informações da Categoria */}
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <Text style={styles.categoryDescription}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// --- Tela Principal de Categorias ---
const CategoriesScreen = () => {
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient
      colors={['#f9f9f9', '#f5f5f5']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      
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
        <View style={styles.titleContainerWhite}>
          <Text style={styles.mainTitleWhite}>Navegue pelas</Text>
          <Text style={styles.mainTitleWhite}>Categorias</Text>
        </View>
        <Text style={styles.subtitle}>
          Descubra produtos incríveis para sua rotina de beleza
        </Text>
        <View style={styles.divider} />
      </Animated.View>
      
      {/* Grid de Categorias */}
      <FlatList
        data={categories}
        renderItem={({ item, index }) => (
          <CategoryCard 
            item={item} 
            index={index}
            onPress={() => console.log(`Navegando para: ${item.name}`)}
          />
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      />
    </LinearGradient>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 3,
  },

  titleContainerWhite: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    marginBottom: 5,
  },
  mainTitle: {
    fontSize: 35,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'left',
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  mainTitleWhite: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ff86b5',
    textAlign: 'left',
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'left',
    fontWeight: '400',
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#ff86b4d2',
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
    opacity: 0.5,
  },
  gridContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  categoryCard: {
    flex: 1,
    maxWidth: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  cardTouchable: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  categoryIconContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryIcon: {
    fontSize: 18,
  },
  categoryInfo: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    minHeight: 90,
    justifyContent: 'space-between',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontWeight: '400',
  },
});

export default CategoriesScreen;