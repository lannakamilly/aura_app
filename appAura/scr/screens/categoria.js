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
    // OBS: Em um app real, você importaria ou usaria URIs de imagens
    image: require('../assets/banner.jpeg'), // Emoji como placeholder para a imagem
    imageBgColor: '#FDF0F0', // Fundo levemente rosa para a imagem
  },
  { 
    id: '2', 
    name: 'Pele', 
    description: 'Cuidados faciais e corporais',
    image: require('../assets/cabelo-categoria.jpg'), 
    imageBgColor: '#F0FDF5', // Fundo levemente verde/claro
  },
  { 
    id: '3', 
    name: 'Maquiagem', 
    description: 'Bases, batons e pincéis',
    image: require('../assets/cabelo-categoria.jpg'), 
    imageBgColor: '#F0F8FD', // Fundo levemente azul/claro
  },
  // Adicione mais categorias se desejar...
];

// --- Componente Card de Categoria ---
const CategoryCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
      
      {/* Área da Imagem Demonstrativa */}
      <View style={[styles.imageContainer, { backgroundColor: item.imageBgColor }]}>
        {/* Usando um Text/Emoji como placeholder. Em produção, use <Image source={...} /> */}
        <Text style={styles.imagePlaceholder}>{item.imagePlaceholder}</Text>
        
        {/* Se usasse imagem real:
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.categoryImage} 
          resizeMode="cover" 
        /> 
        */}
      </View>
      
      {/* Informações da Categoria */}
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.categoryDescription} numberOfLines={1}>{item.description}</Text>
        
        {/* Coração de Favorito (mantendo o elemento visual da imagem de referência) */}
        <TouchableOpacity style={styles.heartIcon}>
          <Text style={{fontSize: 18, color: '#888'}}>♡</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// --- Tela Principal de Categorias ---
const CategoriesScreen = () => {
  return (
    <View style={styles.container}>
      
      {/* Header/Título Simples (opcional, mantive a estrutura simples da imagem) */}
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
    backgroundColor: '#f9f9f9', // Fundo cinza/claro suave como na imagem de referência
  },
  header: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  itemCount: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  gridContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  categoryCard: {
    flex: 1,
    maxWidth: '47%', // Ajustado para margem
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 7,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    overflow: 'hidden', // Garante que a imagem se ajuste ao borderRadius
  },
  
  // Estilos da Imagem
  imageContainer: {
    width: '100%',
    height: 150, 
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  imagePlaceholder: {
    fontSize: 80, // Tamanho grande para o emoji demonstrativo
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },

  // Estilos das Informações
  categoryInfo: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 8,
    position: 'relative',
    minHeight: 80, // Altura mínima para o texto
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
  heartIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    padding: 5,
  },
});

export default CategoriesScreen;