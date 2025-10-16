import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image 
} from 'react-native';

// --- Dados das Categorias ---
const categories = [
  { 
    id: '1', 
    name: 'Cabelo', 
    description: 'Shampoos, condicionadores e tratamentos',
    image: require('../assets/cabelo-categoria.jpg'),
    imageBgColor: '#FDF0F0',
  },
  { 
    id: '2', 
    name: 'Pele', 
    description: 'Cuidados faciais e corporais',
    image: require('../assets/pele-categoria.jpg'),
    imageBgColor: '#F0FDF5',
  },
  { 
    id: '3', 
    name: 'Maquiagem', 
    description: 'Bases, batons e pincéis',
    image: require('../assets/maquiag-categoria.jpg'),
    imageBgColor: '#F0F8FD',
  },
];

// --- Componente Card de Categoria ---
const CategoryCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
      
      {/* Área da Imagem Demonstrativa */}
      <View style={[styles.imageContainer, { backgroundColor: item.imageBgColor }]}>
        <Image 
          source={item.image} 
          style={styles.categoryImage} 
          resizeMode="cover" 
        />
      </View>
      
      {/* Informações da Categoria */}
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.categoryDescription} numberOfLines={2}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

// --- Tela Principal de Categorias ---
const CategoriesScreen = () => {
  return (
    <View style={styles.container}>
      
      {/* Header/Título */}
      <View style={styles.header}>
        <Text style={styles.itemCount}>Navegue pelas Categorias</Text>
      </View>
      
      {/* Grid de Categorias */}
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <CategoryCard 
            item={item} 
            onPress={() => console.log(`Navegando para: ${item.name}`)}
          />
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />
      
    </View>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  itemCount: {
  fontSize: 40,
  marginTop: 40,
  color: '#ff86b5',
  fontWeight: '700',
  textShadowColor: 'rgba(255, 134, 181, 0.3)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 2,
  letterSpacing: -0.3,
},
  gridContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  categoryCard: {
    flex: 1,
    maxWidth: '47%',
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 7,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 150, 
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryInfo: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 8,
    minHeight: 80,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#888',
  },
});

export default CategoriesScreen;
