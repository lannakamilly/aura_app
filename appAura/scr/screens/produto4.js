import React, { useState, useEffect, useCallback } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    FlatList, 
    Dimensions,
    ActivityIndicator,
    Image, // Componente de Imagem
    Modal,
    ScrollView,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

// 🚨 ATENÇÃO: VERIFIQUE O CAMINHO CORRETO PARA O SEU ARQUIVO SUPABASE!
import { supabase } from './supabase'; 

// ======================================================
// CONFIGURAÇÕES E CONSTANTES
// ======================================================
const { width } = Dimensions.get("window");

const MAIN_PINK = "#ff86b4";
const LIGHT_PINK = "#FDEFF1";
const LIGHT_BG = "#f9f9f9";

const HORIZONTAL_PADDING = 20;
const PRODUCT_CARD_MARGIN = 15;
const PRODUCT_CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - PRODUCT_CARD_MARGIN) / 2;


// ======================================================
// COMPONENTE: TOAST DE SUCESSO 
// (Para feedback ao adicionar ao carrinho)
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
// (Usado na FlatList de resultados)
// ======================================================
const ProductCard = ({ product, onCardPress }) => {
    // Função para obter URL da imagem do Supabase
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
                        <View style={productCardStyles.imagePlaceholder}>
                            <Ionicons name="image-outline" size={30} color="#999" />
                            <Text style={{ textAlign: 'center', color: '#999', fontSize: 12 }}>Sem Imagem</Text>
                        </View>
                    )}
                </LinearGradient>
            </View>
            {/* Botão de Favorito (mantido do seu código original) */}
            <TouchableOpacity 
                onPress={() => { /* navigation.navigate('Favoritos', { productToAdd: product }); */ }} 
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
// (Implementação completa do modal de detalhes)
// ======================================================
const ProductDetailModal = ({ product, visible, onClose, userId, onCartSuccess }) => { 
    const [quantity, setQuantity] = useState(1);
    
    // Resetar a quantidade ao abrir o modal para um novo produto
    useEffect(() => {
        if (visible && product) {
            setQuantity(1);
        }
    }, [visible, product]);

    const getProductImageUrl = (path) => {
        if (!path) return null;
        return supabase.storage.from("produtos").getPublicUrl(path).data.publicUrl;
    };
    
    const imageUrl = product ? getProductImageUrl(product.image_path) : null;
    
    const handleAddToCart = async () => {
        if (!product || !product.id || quantity <= 0 || !userId || typeof product.price !== 'number') {
            Alert.alert("Erro de Dados", "ID do Produto ou Usuário inválido.");
            onClose(); 
            return;
        }

        const unitPrice = product.price;
        
        // 1. Tenta buscar item existente
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

        // 2. Insere ou Atualiza no Supabase
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

        // 3. Resposta e Feedback
        if (error) {
            console.error("Erro ao adicionar/atualizar carrinho no Supabase:", error.message);
            Alert.alert("Erro", "Não foi possível adicionar o produto ao carrinho.");
        } else {
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
// TELA PRINCIPAL: PRODUTO 4 (PESQUISA)
// ======================================================
export default function Produto4Screen() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialState, setIsInitialState] = useState(true); 
    
    // Estados do Modal e Toast
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null); 
    const [toastMessage, setToastMessage] = useState(null); 

    const navigation = useNavigation();

    // Efeito para carregar o ID do usuário (necessário para o carrinho)
    useEffect(() => {
        const loadUserId = async () => {
            // Supondo que você salva o ID do usuário nesta chave
            const id = await AsyncStorage.getItem('user_session_id'); 
            setCurrentUserId(id);
        };
        loadUserId();
    }, []);

    // Função para abrir o modal
    const handleCardPress = (product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    // Função para exibir o Toast de sucesso
    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000); 
    };

    /**
     * Busca produtos no Supabase que correspondem ao termo de busca.
     * Usando useCallback para otimizar.
     */
    const performSearch = useCallback(async (term) => {
        const trimmedTerm = term.trim();
        
        if (trimmedTerm.length === 0) {
            setSearchResults([]);
            setIsInitialState(true);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setIsInitialState(false);

        const { data, error } = await supabase
            .from("products") 
            .select("*")
            // Busca o termo em 'name' OU em 'description'
            .or(`name.ilike.%${trimmedTerm}%,description.ilike.%${trimmedTerm}%`)
            // Filtra pelas categorias (ID 1 a 4)
            .in('category_id', [1, 2, 3, 4]);

        if (error) {
            console.error("Erro ao realizar busca:", error.message);
            setSearchResults([]);
        } else {
            setSearchResults(data || []);
        }
        
        setIsLoading(false);
    }, []); 

    // Hook para chamar a busca toda vez que o termo de busca mudar
    const handleSearchTextChange = (text) => {
        setSearchTerm(text);
        performSearch(text);
    };

    const renderEmptyState = () => {
        if (isInitialState) {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons name="bulb-outline" size={60} color="#ccc" />
                    <Text style={styles.emptyTextTitle}>Comece a Pesquisar</Text>
                    <Text style={styles.emptyText}>Use a barra acima para encontrar seus produtos.</Text>
                </View>
            );
        }
        
        if (!isLoading && searchResults.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons name="sad-outline" size={60} color="#ccc" />
                    <Text style={styles.emptyTextTitle}>Nenhum Resultado Encontrado</Text>
                    <Text style={styles.emptyText}>Tente refinar sua busca. Não encontramos produtos para "{searchTerm}".</Text>
                </View>
            );
        }
        return null;
    };
    
    return (
        <View style={styles.container}>
            {/* Cabeçalho Fixo da Busca */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Buscar em todas as categorias..."
                        placeholderTextColor="#999"
                        style={styles.searchInput}
                        value={searchTerm}
                        onChangeText={handleSearchTextChange} 
                        autoFocus={true} 
                        returnKeyType="search"
                        onSubmitEditing={() => performSearch(searchTerm)}
                    />
                    {searchTerm.length > 0 && (
                        <TouchableOpacity onPress={() => handleSearchTextChange("")} style={styles.clearButton}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            
            <View style={styles.resultsContainer}>
                {isLoading ? (
                    <ActivityIndicator size="large" color={MAIN_PINK} style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.productList}
                        ListEmptyComponent={renderEmptyState} 
                        renderItem={({ item }) => (
                            <ProductCard 
                                product={item} 
                                onCardPress={handleCardPress} 
                            />
                        )}
                    />
                )}
            </View>

            {/* MODAL DE DETALHES DO PRODUTO */}
            <ProductDetailModal
                product={selectedProduct}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                userId={currentUserId}
                onCartSuccess={showToast}
            />
            
            {/* O Toast Message */}
            <ToastMessage message={toastMessage} />
        </View>
    );
}

// ======================================================
// ESTILOS (Geral)
// ======================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LIGHT_BG,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50, 
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingBottom: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        marginRight: 10,
        padding: 5,
    },
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        height: 48,
        backgroundColor: LIGHT_PINK,
        borderRadius: 24,
        paddingHorizontal: 15,
    },
    searchIcon: {
        marginRight: 10,
        color: MAIN_PINK,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#000",
        height: '100%',
    },
    clearButton: {
        marginLeft: 8,
        padding: 5,
    },
    
    resultsContainer: {
        flex: 1,
        paddingHorizontal: HORIZONTAL_PADDING,
    },
    productList: {
        paddingVertical: 10,
        // ** Ajuste para a tab navigation (instrução salva) **
        paddingBottom: 100, 
        justifyContent: 'space-between', 
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 50,
    },
    emptyTextTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#666',
        marginTop: 15,
        marginBottom: 5,
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        lineHeight: 20,
    }
});

// ======================================================
// ESTILOS (Cards)
// ======================================================

const productCardStyles = StyleSheet.create({
    productCard: {
        width: PRODUCT_CARD_WIDTH,
        marginBottom: PRODUCT_CARD_MARGIN,
        marginHorizontal: PRODUCT_CARD_MARGIN / 2, 
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
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
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

// ======================================================
// ESTILOS (Modal)
// ======================================================

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

// ======================================================
// ESTILOS (Toast)
// ======================================================
const toastStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 100, 
        left: '5%',
        right: '5%',
        backgroundColor: '#4CAF50', 
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