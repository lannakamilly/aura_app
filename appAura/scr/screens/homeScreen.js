import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Para Expo, instale com: expo install @expo/vector-icons

export default function HomeScreen() {
  const [liked, setLiked] = useState({});

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const products = [
    { id: 1, name: 'Creme Hidratante', price: 'R$59,90' },
    { id: 2, name: 'Sérum Facial', price: 'R$89,90' },
    { id: 3, name: 'Shampoo Natural', price: 'R$49,90' },
    { id: 4, name: 'Máscara Capilar', price: 'R$79,90' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Barra de busca e ícones */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={18} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produtos..."
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconContainer}>
            <MaterialIcons name="favorite-border" size={22} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer}>
            <MaterialIcons name="notifications" size={22} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Banner - Apenas imagem, sem texto */}
      <View style={styles.banner}>
        <Image
          source={require('../assets/banner.jpeg')} // coloque sua imagem de banner aqui
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

      {/* Categorias - Cards menores */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categorias</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>Ver tudo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categories}>
        <TouchableOpacity style={styles.categoryBox}>
          <Image
            source={require('../assets/cabelo.jpeg')} // suas imagens aqui
            style={styles.categoryImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryBox}>
          <Image
            source={require('../assets/make.jpeg')}
            style={styles.categoryImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryBox}>
          <Image
            source={require('../assets/pele.jpeg')}
            style={styles.categoryImage}
          />
        </TouchableOpacity>
      </View>

      {/* Produtos - Cards mais bonitos */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nossos Produtos</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.productsContainer}>
        {products.map((item) => (
          <View key={item.id} style={styles.productCard}>
            <TouchableOpacity onPress={() => toggleLike(item.id)} style={styles.likeButton}>
              <MaterialIcons
                name={liked[item.id] ? "favorite" : "favorite-border"}
                size={22}
                color={liked[item.id] ? '#f5427b' : '#999'}
              />
            </TouchableOpacity>

            <View style={styles.productImageContainer}>
              <Image
                source={require('../assets/1.jpg')} // imagem padrão ou personalizada
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>Ver produto</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
    marginLeft: 8,
    fontSize: 16,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconContainer: {
    marginLeft: 12,
    padding: 4,
  },

  // Banner - Apenas imagem
  banner: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  bannerImage: {
    width: '100%',
    height: 180,
  },

  // Seções
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  viewAll: {
    fontSize: 14,
    color: '#fd42bfff',
    fontWeight: '600',
  },

  // Categorias - Menores
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  categoryBox: {
    width: '30%',
    height: 100, // Altura fixa menor para cards menores
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },

  // Produtos - Mais bonitos
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  likeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageContainer: {
    backgroundColor: '#f8f8f8',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 160,
  },
  productInfo: {
    padding: 14,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
    lineHeight: 20,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f5427b',
    marginBottom: 12,
  },
  viewButton: {
    backgroundColor: '#f70090ff',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  viewButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
});