import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    ActivityIndicator, 
    Alert,
    Image,
    SafeAreaView, 
    Platform,
    Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ Ajuste o caminho para o seu arquivo supabase
import { supabase } from './supabase'; 

// --- Cores ---
const MAIN_PINK = "#ff86b4";
const LIGHT_PINK = "#FDEFF1";

// ================================
// LÓGICA CENTRAL DE ATUALIZAÇÃO DO SUPABASE (Mantida)
// ================================

const updateItemQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
        return await supabase
            .from('cart')
            .delete()
            .eq('id', itemId);
    }
    return await supabase
        .from('cart')
        .update({ quantity: newQuantity })
        .eq('id', itemId);
};

// ================================
// COMPONENTE DO CARD DE ITEM (Mantido o design)
// ================================
const CartItemCard = React.memo(({ item, onRemoveItem, onQuantityChange }) => {
    // ... (Código do CartItemCard)
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
            <View style={styles.imageWrapper}>
                {imageUrl ? (
                    <Image 
                        source={{ uri: imageUrl }} 
                        style={styles.productImage} 
                        resizeMode="cover" 
                    />
                ) : (
                    <Ionicons name="image-outline" size={40} color="#ccc" />
                )}
            </View>
            <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>{product.name}</Text>
                <View style={styles.priceRow}>
                    <Text style={styles.itemSubtotal}>
                        R$ {itemSubtotal.toFixed(2).replace('.', ',')}
                    </Text>
                    <Text style={styles.itemUnit}>
                        ({item.quantity} x R$ {item.price_unit.toFixed(2).replace('.', ',')})
                    </Text>
                </View>
                <View style={styles.quantityControlRow}>
                    <View style={styles.counterBox}>
                        <TouchableOpacity 
                            onPress={() => onQuantityChange(item.id, item.quantity - 1, product.name)}
                            style={styles.counterButton}
                            disabled={item.quantity <= 1} 
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
                    <TouchableOpacity 
                        style={styles.removeButton} 
                        onPress={() => onRemoveItem(item.id, product.name)}
                    >
                        <Ionicons name="trash-outline" size={22} color="rgba(247, 64, 140, 1)" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
});

// ================================
// COMPONENTE DO RESUMO (AGORA É UM CARD NORMAL)
// ================================
const CarrinhoResumoCard = ({ total, handleCheckoutPress }) => {
    return (
        <View style={styles.resumoCard}>
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal:</Text>
                <Text style={styles.totalValueSmall}>R$ {total.toFixed(2).replace('.', ',')}</Text>
            </View>
            <View style={styles.divider} /> 
            <View style={styles.totalRowFinal}>
                <Text style={styles.totalLabelFinal}>Total a Pagar:</Text>
                <Text style={styles.totalValueFinal}>R$ {total.toFixed(2).replace('.', ',')}</Text>
            </View>
            <TouchableOpacity 
                style={styles.checkoutButton}
                onPress={handleCheckoutPress} 
            >
                <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
            
            {/* 🎯 ESPAÇAMENTO EXTRA: Garante que o botão fique acima da Tab Bar */}
            <View style={styles.bottomSpacer} />
        </View>
    );
};


// ================================
// TELA PRINCIPAL DO CARRINHO
// ================================
export default function CarrinhoScreen({ navigation }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null); 
    const isFocused = useIsFocused();
    const [modalVisible, setModalVisible] = useState(false);
    
    // ... (Funções de useEffect, fetchCart, handleQuantityChange, handleRemoveItem, etc.)

    useEffect(() => {
        const loadUserId = async () => {
            const id = await AsyncStorage.getItem('user_session_id'); 
            setCurrentUserId(id || '00000000-0000-0000-0000-000000000001'); 
        };
        loadUserId();
    }, []);

    const fetchCart = useCallback(async (userId) => {
        if (!userId) {
             setLoading(false);
             return;
        }
        
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
            .eq('user_id', userId); 

        if (!error) {
            const validItems = cartItemsData.filter(item => item.products); 
            setCartItems(validItems);
        } else {
            console.error("Erro ao buscar carrinho:", error.message);
            Alert.alert("Erro de Consulta", "Não foi possível carregar os itens do carrinho.");
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (isFocused && currentUserId) {
            fetchCart(currentUserId);
        }
    }, [isFocused, currentUserId, fetchCart]); 

    const handleQuantityChange = async (itemId, newQuantity, productName) => {
        if (newQuantity <= 0) {
            handleRemoveItem(itemId, productName);
            return;
        }

        const { error } = await updateItemQuantity(itemId, newQuantity);
        
        if (!error) {
            setCartItems(prevItems => 
                prevItems.map(item => 
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );
        } else {
            console.error("Erro ao atualizar quantidade:", error.message);
            Alert.alert("Erro", "Não foi possível atualizar a quantidade.");
        }
    };
    
    const handleRemoveItem = async (cartItemId, productName) => {
        Alert.alert(
            "Remover Item",
            `Deseja realmente remover "${productName}" do carrinho?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Remover", 
                    onPress: async () => {
                        const { error } = await updateItemQuantity(cartItemId, 0); 
                        if (!error) {
                            Alert.alert("Sucesso", "Item removido do carrinho.");
                            fetchCart(currentUserId); 
                        } else {
                            console.error("Erro ao remover:", error.message);
                            Alert.alert("Erro", "Não foi possível remover o item.");
                        }
                    }
                }
            ]
        );
    };

    const total = cartItems.reduce(
        (sum, item) => sum + (item.quantity * item.price_unit), 
        0
    );
    
    // 1. Abre o modal de confirmação
    const handleCheckoutPress = () => {
        if (cartItems.length === 0) {
            Alert.alert("Carrinho Vazio", "Adicione itens ao carrinho antes de finalizar a compra.");
            return;
        }
        setModalVisible(true);
    };
    
    // 2. 🎯 NOVO: Fecha o modal e navega para a tela de pagamento, passando o total
    const handlePaymentAdvance = () => {
        setModalVisible(false); 
        // Assumindo 'Pagamento' é o nome da rota
        navigation.navigate('Pagamento', { orderTotal: total });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={MAIN_PINK} />
                <Text style={{ marginTop: 10 }}>Carregando Carrinho...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: LIGHT_PINK }}> 
            <View style={styles.container}>
                
                {/* 1. HEADER MODERNO */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Seu Carrinho</Text>
                    <View style={styles.itemCountBadge}>
                        <Text style={styles.headerSubtitle}>
                           {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'}
                        </Text>
                    </View>
                </View>

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
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <CartItemCard 
                                item={item} 
                                onRemoveItem={handleRemoveItem}
                                onQuantityChange={handleQuantityChange}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        // 🎯 AQUI: Usamos o ListFooterComponent para o resumo
                        ListFooterComponent={
                            <CarrinhoResumoCard 
                                total={total}
                                handleCheckoutPress={handleCheckoutPress}
                            />
                        }
                    />
                )}
            </View>
            
            {/* MODAL/ALERTA MAIS PROFISSIONAL DE FEEDBACK */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Ionicons name="bag-check-outline" size={50} color={MAIN_PINK} />
                        <Text style={styles.modalTitle}>Quase lá!</Text>
                        <Text style={styles.modalText}>Sua compra de R$ {total.toFixed(2).replace('.', ',')} está pronta para o pagamento. Continuar?</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handlePaymentAdvance} // 👈 CHAMA A NOVA FUNÇÃO DE NAVEGAÇÃO
                        >
                            <Text style={styles.modalButtonText}>Avançar para o Pagamento</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

// ================================
// ESTILOS FINAIS (Mantidos)
// ================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // HEADER MODERNO
    header: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 20 : 0, 
        paddingBottom: 15,
        backgroundColor: LIGHT_PINK,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 30, 
        fontWeight: '900',
        color: '#333',
        marginBottom: 5,
    },
    itemCountBadge: {
        backgroundColor: MAIN_PINK,
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 15,
    },
    headerSubtitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
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
        marginTop: -100,
    },
    emptyText: {
        fontSize: 18,
        color: '#999',
        marginTop: 10,
    },
    continueShoppingButton: {
        marginTop: 20,
        backgroundColor: MAIN_PINK,
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
    continueShoppingText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    // ESTILO DO CARD DE ITEM (Mantido)
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff', 
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: LIGHT_PINK, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, 
        shadowRadius: 5,
        elevation: 5,
    },
    imageWrapper: {
        width: 90,
        height: 90,
        borderRadius: 10,
        backgroundColor: LIGHT_PINK,
        marginRight: 15,
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
        fontSize: 17,
        fontWeight: '700',
        color: '#333',
        marginBottom: 5,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 8,
    },
    itemUnit: {
        fontSize: 12,
        color: '#999',
        marginLeft: 8,
        fontWeight: '500',
    },
    itemSubtotal: {
        fontSize: 16,
        fontWeight: '900',
        color: MAIN_PINK,
    },

    quantityControlRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    counterBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: MAIN_PINK,
        borderRadius: 20,
        paddingVertical: 2,
    },
    counterButton: {
        padding: 5,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        paddingHorizontal: 8,
    },
    removeButton: {
        padding: 8,
        borderRadius: 50,
        backgroundColor: '#fee',
    },

    // 🎯 NOVO ESTILO: Resumo do Carrinho como um Card/Div normal
    resumoCard: {
        backgroundColor: '#fff', 
        borderRadius: 15,
        padding: 20,
        marginTop: 20, // Espaçamento do último item da lista
        marginBottom: 5,
        borderWidth: 1,
        borderColor: LIGHT_PINK, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, 
        shadowRadius: 4,
        elevation: 3,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalRowFinal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
    },
    totalLabelFinal: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    totalValueSmall: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    totalValueFinal: {
        fontSize: 24,
        fontWeight: '900',
        color: MAIN_PINK,
    },
    checkoutButton: {
        backgroundColor: MAIN_PINK,
        borderRadius: 30,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: MAIN_PINK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    // 🎯 ESPAÇADOR: Componente invisível para empurrar o card acima da Tab Bar
    bottomSpacer: {
        height: 80, // Deve ser maior que a altura da sua Tab Bar
        // O valor 80 é uma estimativa; ajuste se necessário (ex: 100)
    },
    
    // ESTILOS DO MODAL PROFISSIONAL
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalTitle: {
        marginBottom: 10,
        textAlign: "center",
        fontSize: 24,
        fontWeight: '900',
        color: '#333'
    },
    modalText: {
        marginBottom: 20,
        textAlign: "center",
        fontSize: 16,
        color: '#666'
    },
    modalButton: {
        backgroundColor: MAIN_PINK,
        borderRadius: 15,
        padding: 12,
        elevation: 2,
    },
    modalButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});