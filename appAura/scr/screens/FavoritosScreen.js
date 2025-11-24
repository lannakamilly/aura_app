import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    StyleSheet, 
    ActivityIndicator, 
    Alert, 
    TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

// ⚠️ Ajuste o caminho para o seu arquivo supabase
import { supabase } from './supabase'; 

const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001'; 
const MAIN_PINK = "#ff86b4";

// Assumindo que você tem um ProductCard genérico ou irá implementá-lo aqui
// Se você moveu o ProductCard do HomeScreen.js para um componente separado, importe-o aqui!
// Ex: import ProductCard from '../components/ProductCard';


export default function FavoritosScreen({ navigation }) {
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    // 🚀 Função para buscar itens favoritos
    const fetchFavorites = useCallback(async () => {
        setLoading(true);
        
        // 🎯 Buscar a tabela 'favorites' e juntar (JOIN) com 'products'
        const { data: favoritesData, error } = await supabase
            .from('favorites')
            .select(`
                products:product_id(
                    id,
                    name,
                    price,
                    image_path
                    // Adicione outras colunas do produto que você precisa
                )
            `)
            .eq('user_id', MOCK_USER_ID);

        if (!error) {
            // Extrai apenas os dados dos produtos e remove itens nulos
            const products = favoritesData
                .map(fav => fav.products)
                .filter(p => p !== null); 
            
            setFavoriteProducts(products);
        } else {
            console.error("Erro ao buscar favoritos:", error.message);
            Alert.alert("Erro de Consulta", "Não foi possível carregar seus favoritos.");
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (isFocused) {
            fetchFavorites();
        }
    }, [isFocused, fetchFavorites]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={MAIN_PINK} />
                <Text style={{ marginTop: 10 }}>Carregando Favoritos...</Text>
            </View>
        );
    }
    
    // Simples renderização dos itens para validação:
    const renderFavoriteItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.productItem} 
            onPress={() => navigation.navigate('DetalhesProduto', { product: item })}
        >
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Meus Favoritos</Text>
            
            {favoriteProducts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-outline" size={80} color="#ccc" />
                    <Text style={styles.emptyText}>Você ainda não tem favoritos.</Text>
                </View>
            ) : (
                <FlatList
                    data={favoriteProducts}
                    keyExtractor={(item) => item.id}
                    renderItem={renderFavoriteItem}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#333',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: MAIN_PINK,
        color: '#fff',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#999',
        marginTop: 10,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: MAIN_PINK,
        marginRight: 10,
    }
});