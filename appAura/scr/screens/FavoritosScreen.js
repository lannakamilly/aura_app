import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const PRIMARY_PINK = "#ff86b5"; // Cor principal rosa
const CARD_MARGIN = 10;
const CARD_WIDTH = (width / 2) - (CARD_MARGIN * 2); // Duas colunas

// PLACEEHOLDERS DE IMAGENS (Substitua pelos caminhos reais no seu projeto)
// Exemplo: require('../assets/serum_antissinais.png')
const PLACEHOLDER_SERUM = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnoJJ6uwoWxgF86s2xAuxmVZuvNvB4nO3zHQ&s";
const PLACEHOLDER_PERFUME = "https://tdc0tj.vtexassets.com/arquivos/ids/185132/3614273673884_1.jpg?v=638461097239400000";
const PLACEHOLDER_BATONS = "https://images.tcdn.com.br/img/img_prod/765341/batom_nude_koloss_make_up_83_1_20200519151835.jpg";
const PLACEHOLDER_MASCARA = "https://res.cloudinary.com/beleza-na-web/image/upload/f_auto,fl_progressive,q_auto:best/v1/imagens/products/B80466/80466.jpg";


// Dados de Exemplo (Meus Favoritos)
const favoriteItems = [
  {
    id: '1',
    category: 'PELE',
    name: 'Sérum Antissinais',
    price: '89,00',
    imageUri: PLACEHOLDER_SERUM,
  },
  {
    id: '2',
    category: 'PERFUME',
    name: 'Eau de Parfum Floral',
    price: '199,90',
    imageUri: PLACEHOLDER_PERFUME,
  },
  {
    id: '3',
    category: 'MAQUIAGEM',
    name: 'Kit Batons Nude',
    price: '120,00',
    imageUri: PLACEHOLDER_BATONS,
  },
  {
    id: '4',
    category: 'CABELO',
    name: 'Máscara Restauradora',
    price: '78,50',
    imageUri: PLACEHOLDER_MASCARA,
  },
];

// --- Componente: Card de Item Favorito ---
const FavoriteItemCard = ({ item, onBuyPress, onRemovePress }) => (
  <View style={styles.cardContainer}>
    {/* Ícone de Remover (X) */}
    <TouchableOpacity onPress={() => onRemovePress(item.id)} style={styles.removeButton}>
      <Ionicons name="close-circle" size={20} color={PRIMARY_PINK} />
    </TouchableOpacity>

    {/* Imagem do Produto (Simulando assets) */}
    <Image 
        // Em um projeto real, você usaria: source={require('../assets/seuarquivo.png')}
        source={{ uri: item.imageUri }} 
        style={styles.productImage} 
        resizeMode="contain"
    />

    <View style={styles.textContainer}>
      <Text style={styles.categoryText}>{item.category}</Text>
      <Text style={styles.nameText} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.priceText}>R$ {item.price}</Text>
    </View>

    {/* Botão Comprar */}
    <TouchableOpacity onPress={() => onBuyPress(item)} style={styles.buyButton}>
      <Text style={styles.buyButtonText}>Comprar</Text>
    </TouchableOpacity>
  </View>
);


// --- Tela Principal: FavoritosScreen ---
export default function FavoritosScreen({ navigation }) {
  
  // Função que lida com a ação de compra
  const handleBuyPress = (item) => {
    console.log(`Produto ${item.name} adicionado ao carrinho.`);
    // Ação principal solicitada: Navegar para o carrinho
    navigation.navigate('Carrinho'); 
  };

  // Função para simular a remoção de um item
  const handleRemovePress = (itemId) => {
    console.log(`Item ${itemId} removido dos favoritos.`);
    // Em um app real, aqui você atualizaria o estado com a lista filtrada.
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Favoritos</Text>
      </View>
      
      <Text style={styles.favoriteCount}>Meus Favoritos ({favoriteItems.length})</Text>

      <FlatList
        data={favoriteItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FavoriteItemCard
            item={item}
            onBuyPress={handleBuyPress}
            onRemovePress={handleRemovePress}
          />
        )}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        // Margem inferior para evitar que o conteúdo fique atrás da Tab Bar
        // Baseado na altura da Tab Bar (75) + margem de rodapé (25) + buffer
        ListFooterComponent={<View style={{ height: 110 }} />}
      />
    </SafeAreaView>
  );
}


// --- Estilos ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Cor de fundo suave
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
      paddingRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  favoriteCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginTop: 5,
  },
  listContainer: {
    padding: CARD_MARGIN,
    // Garante que o conteúdo role verticalmente
    minHeight: '100%', 
  },
  // --- Estilos do Card ---
  cardContainer: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 280, // Altura mínima para consistência
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  productImage: {
    width: '90%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
  },
  textContainer: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 5,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: PRIMARY_PINK,
    marginBottom: 2,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#333',
    marginBottom: 10,
  },
  // --- Estilos do Botão Comprar ---
  buyButton: {
    width: '100%',
    backgroundColor: PRIMARY_PINK,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 5,
    shadowColor: PRIMARY_PINK,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
