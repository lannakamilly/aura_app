import React, { useState } from 'react'; // 💡 Importado useState para gerenciar o estado da pesquisa
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  TextInput, // 💡 Importado TextInput para a barra de pesquisa
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const PRIMARY_PINK = "#ff86b5";
const GRADIENT_START_COLOR = "#FDEFEE";
const GRADIENT_END_COLOR = "#FFFFFF";
const CARD_MARGIN = 10;
const CARD_WIDTH = (width / 2) - (CARD_MARGIN * 2);

// --- PLACEEHOLDERS DE IMAGENS ---
const ASSET_LYRA_EUDORA = require('../assets/2.png'); 
const ASSET_LOCAO = require('../assets/3.png');
const ASSET_BATOM = require('../assets/4.png');
const ASSET_CREME = require('../assets/5.png');


// Dados de Exemplo 
const allFavoriteItems = [ // Renomeada para melhor clareza
  {
    id: '1',
    name: 'Gloss Fran By Franciny',
    price: '59,67',
    rating: 4.8,
    imageSource: ASSET_LYRA_EUDORA,
  },
  {
    id: '2',
    name: 'Loção Hidratante Corporal Suave com Óleo de Amêndoas',
    price: '34,90',
    rating: 4.5,
    imageSource: ASSET_LOCAO,
  },
  {
    id: '3',
    name: 'Batom Líquido Matte Cor Vermelho Intenso',
    price: '28,00',
    rating: 5.0,
    imageSource: ASSET_BATOM,
  },
  {
    id: '4',
    name: 'Creme Facial Noturno Antirrugas',
    price: '115,00',
    rating: 4.3,
    imageSource: ASSET_CREME,
  },
];

// --- Componente: Card de Produto (Mantido) ---
const ProductCard = ({ item, onPress, onRemove, onAddToCart }) => {
  const imageSource = item.imageSource;

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={onPress}>
        <LinearGradient 
          colors={[GRADIENT_START_COLOR, GRADIENT_END_COLOR]}
          style={styles.imageBackground}
        >
          <Image
            source={imageSource} 
            style={styles.productImage}
            resizeMode="contain"
          />

          {/* 🗑️ Ícone de Lixeira (Remover dos Favoritos) */}
          <TouchableOpacity style={styles.removeButtonContainer} onPress={() => onRemove(item.id)}>
            <Ionicons name="trash-outline" size={24} color={'#000000ff'} /> 
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.textContainer}>
          <Text style={styles.nameText} numberOfLines={2}>
            {item.name}
          </Text>

          <Text style={styles.priceText}>
            R$ {item.price}
          </Text>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#000" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      {/* 🛒 Botão "Adicionar ao Carrinho" */}
      <TouchableOpacity 
        style={styles.addToCartButton} 
        onPress={() => onAddToCart(item.id)}
      >
        <Ionicons name="cart-outline" size={20} color="#fff" />
        <Text style={styles.addToCartButtonText}>
          Adicionar
        </Text>
      </TouchableOpacity>
    </View>
  );
};


// --- Componente: Lista Vazia (Mantido) ---
const EmptyList = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="heart-dislike-outline" size={60} color="#ccc" />
    <Text style={styles.emptyText}>
      Sua lista de favoritos está vazia.
    </Text>
    <Text style={styles.emptySubText}>
      Adicione produtos para encontrá-los facilmente aqui!
    </Text>
  </View>
);


// --- Tela Principal: FavoritosScreen (Com Search Bar e Título Limpo) ---
export default function FavoritosScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  // 💡 Lógica de Filtro
  const filteredItems = allFavoriteItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardPress = (item) => {
    console.log(`Detalhes do Produto: ${item.name}`);
  };

  const handleRemove = (itemId) => {
    console.log(`Remover item ${itemId} dos favoritos`);
    // Aqui você implementaria a remoção do estado
  };

  const handleAddToCart = (itemId) => {
    console.log(`Adicionar item ${itemId} ao carrinho`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* 🌟 Cabeçalho Profissional e Moderno */}
      <View style={styles.headerContainer}>
        {/* Título sem o emoji de carrinho */}
        <Text style={styles.headerTitle}>
          Meus Favoritos
        </Text>
      </View>

      {/* 🔍 Barra de Pesquisa Elegante (NOVA) */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#777" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar nos favoritos..."
          placeholderTextColor="#777"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#777" />
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={filteredItems} // Usando a lista filtrada
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPress={() => handleCardPress(item)}
            onRemove={handleRemove}
            onAddToCart={handleAddToCart}
          />
        )}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={EmptyList} 
        // Manter o espaçamento para o Tab Bar (Instrução salva)
        ListFooterComponent={<View style={{ height: 110 }} />} 
      />
    </SafeAreaView>
  );
}


// --- Estilos (Ajustados para o novo Header e Search Bar) ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // 🌟 NOVO: Estilos do Cabeçalho (Limpo e profissional)
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    // Remoção da borda inferior para um look mais limpo
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333', // Cor mais neutra para profissionalismo
  },
  // 🔍 NOVO: Estilos da Barra de Pesquisa Moderna
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15, // Espaçamento antes da lista
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5', // Fundo levemente cinza
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0, // Ajuste para centralizar o texto
  },
  clearButton: {
    marginLeft: 10,
    padding: 2,
  },
  
  // --- Estilos da Lista e do Card (Mantidos) ---
  listContainer: {
    padding: CARD_MARGIN,
    paddingBottom: 0,
    alignItems: 'center', 
    justifyContent: 'center',
    flexGrow: 1, 
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 15,
  },
  emptySubText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  cardContainer: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: PRIMARY_PINK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
    minHeight: 310, 
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  imageBackground: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 10,
  },
  productImage: {
    width: '90%',
    height: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08, 
    shadowRadius: 8,
    elevation: 4, 
  },
  removeButtonContainer: { 
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  textContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    flex: 1,
    justifyContent: 'flex-end',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
    lineHeight: 22, 
  },
  priceText: {
    fontSize: 22,
    fontWeight: '800',
    color: PRIMARY_PINK,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 5,
  },
  addToCartButton: {
    backgroundColor: PRIMARY_PINK,
    padding: 8,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 5,
  },
});