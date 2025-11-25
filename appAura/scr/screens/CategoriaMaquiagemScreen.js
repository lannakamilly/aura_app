import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    Image,
    Modal,
    ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
// 🚨 ATENÇÃO: Verifique se o caminho para o seu arquivo 'supabase' está correto
import { supabase } from './supabase'; 

// ======================================================
// CONFIGURAÇÕES E CONSTANTES
// ======================================================
const { width } = Dimensions.get("window");

const MAIN_PINK = "#ff86b4";
const LIGHT_PINK = "#FDEFF1";
const LIGHT_BG = "#fff";

const HORIZONTAL_PADDING = 20;
const PRODUCT_CARD_MARGIN = 15;
const PRODUCT_CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - PRODUCT_CARD_MARGIN) / 2;

// 🎯 ALTERAÇÃO PRINCIPAL: ID da Categoria Maquiagem (ID = 4)
const CATEGORY_ID = 4; 
const CATEGORY_NAME = "Maquiagem"; 

// ======================================================
// COMPONENTE: TOAST DE SUCESSO
// ======================================================
const ToastMessage = ({ message }) => {
    if (!message) return null;

    return (
        <View style={toastStyles.container}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={toastStyles.text}>{message}</Text>
        </View>
    );
};

// ======================================================
// COMPONENTE: ProductCard 
// ======================================================

const ProductCard = ({ product, onCardPress }) => {
    const navigation = useNavigation();
    
    const handleFavoritePress = () => {
        navigation.navigate('Favoritos', { productToAdd: product }); 
    };

    const imageUrl = product.image_path 
        ? supabase.storage.from("produtos").getPublicUrl(product.image_path).data.publicUrl
        : null;

    return (
        <TouchableOpacity style={productCardStyles.productCard} onPress={() => onCardPress(product)}>
            <View style={productCardStyles.productImageBackground}>
                <LinearGradient
                    colors={[LIGHT_PINK, '#fff']}
                    style={productCardStyles.gradientOverlay}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                >
                    {imageUrl ? (
                        <Image 
                            source={{ uri: imageUrl }} 
                            style={productCardStyles.productImage} 
                            resizeMode="contain" 
                        />
                    ) : (
                        <Text>Sem imagem</Text>
                    )}
                </LinearGradient>
            </View>
            <TouchableOpacity 
                onPress={handleFavoritePress} 
                style={productCardStyles.favoriteButton}
            >
                <Ionicons name={'heart-outline'} size={22} color={MAIN_PINK} />
            </TouchableOpacity>
            <View style={productCardStyles.productDetails}>
                <View style={productCardStyles.nameRatingRow}>
                    <Text style={productCardStyles.productName} numberOfLines={2}>
                        {product.name}
                    </Text>
                    <View style={productCardStyles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={productCardStyles.ratingText}>4.5</Text> 
                    </View>
                </View>
                <View style={productCardStyles.priceContainer}>
                    <Text style={productCardStyles.currentPrice}>
                        R$ {product.price ? product.price.toFixed(2).replace('.', ',') : '0,00'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// ======================================================
// COMPONENTE: ProductDetailModal 
// ======================================================

const ProductDetailModal = ({ product, visible, onClose, userId, onCartSuccess }) => { 
    const [quantity, setQuantity] = useState(1);
    const navigation = useNavigation();

    const getProductImageUrl = (path) => {
        if (!path) return null;
        return supabase.storage.from("produtos").getPublicUrl(path).data.publicUrl;
    };
    const imageUrl = getProductImageUrl(product?.image_path);
    
    const handleAddToCart = async () => {
        // 1. Verificação de Dados
        if (!product || !product.id || quantity <= 0 || !userId || typeof product.price !== 'number') {
            Alert.alert("Erro de Dados", "O produto selecionado está com dados incompletos (ID, Preço ou Usuário inválido).");
            onClose(); 
            return;
        }

        const unitPrice = product.price;
        
        // 2. Tenta buscar item existente
        const { data: existingCartItem, error: fetchError } = await supabase
            .from('cart')
            .select('*')
            .eq('user_id', userId) 
            .eq('product_id', product.id)
            .single();
        
        if (fetchError && fetchError.code !== 'PGRST116') { 
            console.error("Erro ao verificar carrinho:", fetchError.message);
            Alert.alert("Erro de DB", "Não foi possível verificar o carrinho. Tente novamente.");
            return;
        }

        let error;

        // 3. Insere ou Atualiza no Supabase
        if (existingCartItem) {
            const newQuantity = existingCartItem.quantity + quantity;
            const { error: updateError } = await supabase
                .from('cart')
                .update({ quantity: newQuantity })
                .eq('user_id', userId) 
                .eq('product_id', product.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('cart')
                .insert([{ user_id: userId, product_id: product.id, quantity: quantity, price_unit: unitPrice }]);
            error = insertError;
        }

        // 4. Resposta e Feedback
        if (error) {
            console.error("Erro ao adicionar/atualizar carrinho no Supabase:", error.message);
            Alert.alert("Erro", "Não foi possível adicionar o produto ao carrinho.");
        } else {
            // SUCESSO: Apenas fecha o modal e mostra a mensagem Toast.
            onClose(); 
            onCartSuccess(`${quantity}x ${product.name} adicionado ao carrinho!`);
        }
    };

    if (!product) return null;

    const totalPrice = product.price ? (product.price * quantity).toFixed(2).replace('.', ',') : '0,00';
    const productPriceDisplay = product.price ? product.price.toFixed(2).replace('.', ',') : '0,00';


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={modalStyles.modalOverlay}>
                <View style={modalStyles.modalContainer}>
                    <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={28} color="#333" />
                    </TouchableOpacity>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={modalStyles.imageContainer}>
                            <LinearGradient
                                colors={[LIGHT_PINK, '#fff']}
                                style={modalStyles.gradientOverlay}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                            >
                                {imageUrl ? (
                                    <Image source={{ uri: imageUrl }} style={modalStyles.productImage} resizeMode="contain" />
                                ) : (
                                    <Text>Sem imagem</Text>
                                )}
                            </LinearGradient>
                        </View>
                        <View style={modalStyles.detailsContent}>
                            <Text style={modalStyles.productName}>{product.name}</Text>
                            <Text style={modalStyles.productPrice}>R$ {productPriceDisplay}</Text>
                            
                            <View style={modalStyles.separator} />
                            <Text style={modalStyles.sectionTitle}>Descrição:</Text>
                            <Text style={modalStyles.productDescription}>{product.description}</Text>
                            <View style={modalStyles.separator} />

                            <View style={modalStyles.quantityContainer}>
                                <Text style={modalStyles.sectionTitle}>Quantidade:</Text>
                                <View style={modalStyles.counterBox}>
                                    <TouchableOpacity onPress={() => setQuantity(prev => Math.max(1, prev - 1))} style={modalStyles.counterButton}>
                                        <Ionicons name="remove" size={20} color={MAIN_PINK} />
                                    </TouchableOpacity>
                                    <Text style={modalStyles.quantityText}>{quantity}</Text>
                                    <TouchableOpacity onPress={() => setQuantity(prev => prev + 1)} style={modalStyles.counterButton}>
                                        <Ionicons name="add" size={20} color={MAIN_PINK} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={modalStyles.footer}>
                        <TouchableOpacity 
                            style={modalStyles.cartButton}
                            onPress={handleAddToCart}
                        >
                            <Ionicons name="cart" size={22} color="#fff" style={{ marginRight: 10 }} />
                            <Text style={modalStyles.cartButtonText}>
                                Adicionar {quantity} item(s) (R$ {totalPrice})
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};


// ======================================================
// TELA CATEGORIA MAQUIAGEM (Exportada)
// ======================================================
export default function CategoriaMaquiagemScreen() {
    const navigation = useNavigation();
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null); 
    const [toastMessage, setToastMessage] = useState(null); 
    
    // EFEITO: Carregar ID do usuário e produtos
    useEffect(() => {
        const loadAndFetch = async () => {
            const id = await AsyncStorage.getItem('user_session_id'); 
            setCurrentUserId(id); 
            fetchCategoryProducts();
        };
        loadAndFetch();
    }, []);

    const fetchCategoryProducts = async () => {
        setLoading(true);
        
        const { data, error } = await supabase
            .from("products") 
            .select("*")
            // FILTRO DE CATEGORIA: ID = 4
            .eq('category_id', CATEGORY_ID); 

        if (!error) {
            setProducts(data);
        } else {
            console.error(`Erro ao buscar produtos da categoria ${CATEGORY_NAME}:`, error.message);
            Alert.alert("Erro de Carga", "Não foi possível carregar os produtos.");
        }
        setLoading(false);
    };
    
    const handleCardPress = (product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };
    
    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000); 
    };

    const renderProduct = ({ item }) => (
        <ProductCard product={item} onCardPress={handleCardPress} />
    );


    return (
        <View style={screenStyles.container}>
            {/* CABEÇALHO DA CATEGORIA */}
            <View style={screenStyles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={screenStyles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={screenStyles.headerTitle}>{CATEGORY_NAME}</Text>
                <View style={screenStyles.placeholder} /> 
            </View>

            {loading ? (
                <View style={screenStyles.loadingContainer}>
                    <ActivityIndicator size="large" color={MAIN_PINK} />
                    <Text style={screenStyles.loadingText}>Carregando produtos...</Text>
                </View>
            ) : products.length === 0 ? (
                <View style={screenStyles.emptyContainer}>
                    <Ionicons name="alert-circle-outline" size={50} color="#ccc" />
                    <Text style={screenStyles.emptyText}>Nenhum produto encontrado na categoria {CATEGORY_NAME}.</Text>
                    <Text style={screenStyles.emptySubtext}>Verifique se a coluna 'category_id' na tabela 'products' está definida como {CATEGORY_ID} para os produtos de Maquiagem.</Text>
                </View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProduct}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={screenStyles.row}
                    contentContainerStyle={screenStyles.listContentContainer} 
                />
            )}

            {/* MODAL DE DETALHES DO PRODUTO */}
            <ProductDetailModal
                product={selectedProduct}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                userId={currentUserId}
                onCartSuccess={showToast} 
            />
            
            {/* COMPONENTE: O Toast Message */}
            <ToastMessage message={toastMessage} />
        </View>
    );
}

// ======================================================
// ESTILOS
// ======================================================

const screenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LIGHT_BG,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: LIGHT_PINK,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 10,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#000',
    },
    placeholder: {
        width: 38,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 10,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        textAlign: 'center',
    },
    listContentContainer: {
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingBottom: 100, // Espaço para a Tab Navigation
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: PRODUCT_CARD_MARGIN,
    },
});

const productCardStyles = StyleSheet.create({
    productCard: {
        width: PRODUCT_CARD_WIDTH,
        marginBottom: PRODUCT_CARD_MARGIN,
        backgroundColor: "#fff",
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    productImageBackground: {
        width: '100%',
        height: PRODUCT_CARD_WIDTH,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        overflow: 'hidden',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 15,
        padding: 4,
    },
    productDetails: {
        padding: 10,
    },
    nameRatingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        minHeight: 40, 
    },
    productName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        flex: 1,
        paddingRight: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: LIGHT_PINK,
        borderRadius: 8,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    ratingText: {
        fontSize: 10,
        fontWeight: '700',
        color: MAIN_PINK,
        marginLeft: 2,
    },
    priceContainer: {
        marginTop: 5,
        alignSelf: 'flex-start',
    },
    currentPrice: {
        fontSize: 16,
        fontWeight: "800",
        color: MAIN_PINK,
    },
});

const modalStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fff',
        width: '100%',
        height: '80%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 15,
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 5,
    },
    imageContainer: {
        width: '100%',
        height: 300,
        paddingHorizontal: 20,
    },
    gradientOverlay: {
        flex: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: {
        width: '80%',
        height: '80%',
    },
    detailsContent: {
        padding: 20,
    },
    productName: {
        fontSize: 26,
        fontWeight: '900',
        color: '#333',
        marginBottom: 5,
    },
    productPrice: {
        fontSize: 22,
        fontWeight: '800',
        color: MAIN_PINK,
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
    },
    productDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    counterBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: LIGHT_PINK,
        borderRadius: 20,
    },
    counterButton: {
        padding: 10,
    },
    quantityText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        paddingHorizontal: 10,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    cartButton: {
        backgroundColor: MAIN_PINK,
        borderRadius: 25,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: MAIN_PINK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    cartButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

const toastStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 100, // Acima da Tab Navigation
        left: '5%',
        right: '5%',
        backgroundColor: '#4CAF50', // Verde de sucesso
        borderRadius: 25,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    }
});