import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    ActivityIndicator, 
    Alert,
    Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';

// ⚠️ Ajuste o caminho para o seu arquivo supabase
import { supabase } from './supabase'; 

const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001'; 
const MAIN_PINK = "#ff86b4";
const LIGHT_PINK = "#FDEFF1";

// ================================
// LÓGICA DE ATUALIZAÇÃO DO SUPABASE
// ================================

const updateItemQuantity = async (itemId, newQuantity) => {
    // Se a quantidade for zero, o item será removido.
    if (newQuantity <= 0) {
        return await supabase
            .from('cart')
            .delete()
            .eq('id', itemId);
    }
    
    // Se for maior que zero, atualiza.
    return await supabase
        .from('cart')
        .update({ quantity: newQuantity })
        .eq('id', itemId);
};

// ================================
// COMPONENTE DO CARD DE ITEM (NOVO DESIGN)
// ================================
const CartItemCard = React.memo(({ item, onRemoveItem, onQuantityChange }) => {
    const itemSubtotal = item.quantity * item.price_unit;
    const product = item.products;

    if (!product) return null;

    const getProductImageUrl = (path) => {
        if (!path) return null;
        return supabase.storage.from("produtos").getPublicUrl(path).data.publicUrl;
    };
    const imageUrl = getProductImageUrl(product.image_path);
    
    return (
        <View style={styles.card}>
            {/* 1. Imagem */}
            <View style={styles.imageWrapper}>
                {imageUrl ? (
                    <Image 
                        source={{ uri: imageUrl }} 
                        style={styles.productImage} 
                        resizeMode="contain" 
                    />
                ) : (
                    <Ionicons name="image-outline" size={40} color="#ccc" />
                )}
            </View>

            {/* 2. Detalhes e Controles */}
            <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>{product.name}</Text>
                
                {/* Preço Unitário e Subtotal */}
                <View style={styles.priceRow}>
                    <Text style={styles.itemUnit}>(R$ {item.price_unit.toFixed(2).replace('.', ',')} / un.)</Text>
                    <Text style={styles.itemSubtotal}>
                        R$ {itemSubtotal.toFixed(2).replace('.', ',')}
                    </Text>
                </View>

                {/* Contador e Botão de Remover */}
                <View style={styles.quantityControlRow}>
                    {/* Botões de Quantidade */}
                    <View style={styles.counterBox}>
                        <TouchableOpacity 
                            onPress={() => onQuantityChange(item.id, item.quantity - 1, product.name)}
                            style={styles.counterButton}
                            disabled={item.quantity <= 1} // Desabilita se for 1 para forçar o botão de lixo
                        >
                            <Ionicons name="remove-outline" size={20} color={MAIN_PINK} />
                        </TouchableOpacity>
                        
                        <Text style={styles.quantityText}>{item.quantity}</Text>

                        <TouchableOpacity 
                            onPress={() => onQuantityChange(item.id, item.quantity + 1, product.name)}
                            style={styles.counterButton}
                        >
                            <Ionicons name="add-outline" size={20} color={MAIN_PINK} />
                        </TouchableOpacity>
                    </View>

                    {/* Botão de Remover (Lixeira) */}
                    <TouchableOpacity 
                        style={styles.removeButton} 
                        onPress={() => onRemoveItem(item.id, product.name)}
                    >
                        <Ionicons name="trash-outline" size={22} color="#F00" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
});


// ================================
// TELA PRINCIPAL DO CARRINHO
// ================================
export default function CarrinhoScreen() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();
    
    // Função de fetch corrigida (mantida)
    const fetchCart = useCallback(async () => {
        setLoading(true);
        const { data: cartItemsData, error } = await supabase
            .from('cart')
            .select(`
                id,
                quantity,
                price_unit,
                products:product_id(
                    id,
                    name,
                    description,
                    image_path
                )
            `)
            .eq('user_id', MOCK_USER_ID);

        if (!error) {
            const validItems = cartItemsData.filter(item => item.products); 
            setCartItems(validItems);
        } else {
            console.error("Erro ao buscar carrinho:", error.message);
            Alert.alert("Erro de Consulta", "Não foi possível carregar os itens do carrinho.");
        }
        setLoading(false);
    }, []);

    // 🚀 Lógica para alterar a quantidade
    const handleQuantityChange = async (itemId, newQuantity, productName) => {
        if (newQuantity <= 0) {
            // Se a quantidade for 0, chama a função de remover para confirmar
            handleRemoveItem(itemId, productName);
            return;
        }

        const { error } = await updateItemQuantity(itemId, newQuantity);
        
        if (!error) {
            // Atualiza o estado local para uma resposta mais rápida
            setCartItems(prevItems => 
                prevItems.map(item => 
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );
            // Atualiza o total
        } else {
            console.error("Erro ao atualizar quantidade:", error.message);
            Alert.alert("Erro", "Não foi possível atualizar a quantidade.");
        }
    };
    
    // 🚀 Lógica para remover item
    const handleRemoveItem = async (cartItemId, productName) => {
        Alert.alert(
            "Remover Item",
            `Deseja realmente remover "${productName}" do carrinho?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Remover", 
                    onPress: async () => {
                        const { error } = await updateItemQuantity(cartItemId, 0); // Usa 0 para acionar o DELETE
                        if (!error) {
                            Alert.alert("Sucesso", "Item removido do carrinho.");
                            fetchCart(); // Recarrega a lista
                        } else {
                            console.error("Erro ao remover:", error.message);
                            Alert.alert("Erro", "Não foi possível remover o item.");
                        }
                    }
                }
            ]
        );
    };

    useEffect(() => {
        if (isFocused) {
            fetchCart();
        }
    }, [isFocused, fetchCart]);

    const total = cartItems.reduce(
        (sum, item) => sum + (item.quantity * item.price_unit), 
        0
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={MAIN_PINK} />
                <Text style={{ marginTop: 10 }}>Carregando Carrinho...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Seu Carrinho ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})</Text>

            {cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={80} color="#ccc" />
                    <Text style={styles.emptyText}>Seu carrinho está vazio.</Text>
                    <TouchableOpacity 
                        style={styles.continueShoppingButton}
                        onPress={() => navigation.navigate('Home')}
                    >
                         <Text style={styles.continueShoppingText}>Continuar Comprando</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={cartItems}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <CartItemCard 
                            item={item} 
                            onRemoveItem={handleRemoveItem}
                            onQuantityChange={handleQuantityChange}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    // Adiciona um espaço no fim para o footer não esconder o último item
                    ListFooterComponent={<View style={{ height: 100 }} />} 
                />
            )}

            {/* O footer é fixo na parte inferior da tela, garantindo visibilidade */}
            {cartItems.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total a Pagar:</Text>
                        <Text style={styles.totalValue}>R$ {total.toFixed(2).replace('.', ',')}</Text>
                    </View>
                    <TouchableOpacity style={styles.checkoutButton}>
                        <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 10 }} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

// ================================
// ESTILOS ATUALIZADOS
// ================================
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
        backgroundColor: LIGHT_PINK,
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
        marginTop: -100, // Centraliza melhor na tela
    },
    emptyText: {
        fontSize: 18,
        color: '#999',
        marginTop: 10,
    },
    continueShoppingButton: {
        marginTop: 20,
        backgroundColor: MAIN_PINK,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    continueShoppingText: {
        color: '#fff',
        fontWeight: '700',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    // NOVO ESTILO DO CARD
    card: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        borderRadius: 15,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
    },
    imageWrapper: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    itemName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 5,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemUnit: {
        fontSize: 12,
        color: '#999',
        marginRight: 10,
    },
    itemSubtotal: {
        fontSize: 15,
        fontWeight: '800',
        color: MAIN_PINK,
    },

    quantityControlRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    counterBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: LIGHT_PINK,
        borderRadius: 20,
    },
    counterButton: {
        padding: 5,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        paddingHorizontal: 5,
    },
    removeButton: {
        padding: 8,
        borderRadius: 50,
        backgroundColor: LIGHT_PINK,
    },

    // ESTILOS DO FOOTER (FIXO)
    footer: {
        position: 'absolute', // Torna o footer fixo
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        padding: 20,
        paddingBottom: 30, // Garante que o botão não fique colado no fundo
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '900',
        color: MAIN_PINK,
    },
    checkoutButton: {
        backgroundColor: MAIN_PINK,
        borderRadius: 25,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});