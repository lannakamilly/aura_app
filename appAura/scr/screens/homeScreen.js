import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    FlatList,
    Dimensions,
    ActivityIndicator,
    Modal,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
// 🚨 ATENÇÃO: Verifique se o caminho para o seu arquivo 'supabase' está correto
import { supabase } from './supabase'; 

const { width } = Dimensions.get("window");

const BANNER_WIDTH = width - 40;
const MAIN_PINK = "#ff86b4";
const LIGHT_PINK = "#FDEFF1";
const LIGHT_BG = "#fff";

const HORIZONTAL_PADDING = 20;
const PRODUCT_CARD_MARGIN = 15;
const PRODUCT_CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - PRODUCT_CARD_MARGIN) / 2;

// ⚠️ Ajuste os caminhos de imagem
const LOGO_IMAGE = require('../assets/auralogo.png'); 

const categories = [
    { name: "Skin Care", image: require('../assets/cate_skin.png'), screen: "CategoriaPele" },
    { name: "Maquiagem", image: require('../assets/cate_make.png'), screen: "CategoriaMaquiagem" },
    { name: "Cabelo", image: require('../assets/cate_cabelo.png'), screen: "CategoriaCabelo" },
    { name: "Perfume", image: require('../assets/cate_perfume.png'), screen: "CategoriaPerfume" },
];

// 🎯 ALTERAÇÃO: Adicionado 'navigationScreen' para o carrossel de produtos específicos
const promotionBanners = [
    { id: 1, title: "Ofertas de Outono", subtitle: "Até 30% OFF em Maquiagem.", backgroundImage: "https://i.pinimg.com/736x/41/b5/27/41b527efe61cae9e5ede5b254cc5acc9.jpg", navigationScreen: "Produto" },
    { id: 2, title: "Dia da Beleza", subtitle: "Frete Grátis acima de $150.", backgroundImage: "https://i.pinimg.com/1200x/74/b6/81/74b681aaf4b8510f902aa4ab9d308445.jpg", navigationScreen: "Produto2" },
    { id: 3, title: "Lançamento Exclusivo", subtitle: "Novas coleções de Outono/Inverno.", backgroundImage: "https://i.pinimg.com/1200x/72/11/63/7211633244957d3b93a8f8679205c4af.jpg", navigationScreen: "Produto3" },
];

// ================================
// COMPONENTE DO BANNER DE PROMOÇÃO
// ================================
const PromotionBanner = ({ item }) => {
    const navigation = useNavigation();

    const handleBannerPress = () => {
        if (item.navigationScreen) {
            // NAVEGAÇÃO: Envia para a tela de Produto específica
            navigation.navigate(item.navigationScreen); 
        }
    };

    return (
        <TouchableOpacity style={bannerStyles.bannerContainer} onPress={handleBannerPress}>
             <Image
                 source={{ uri: item.backgroundImage }}
                 style={bannerStyles.backgroundImage}
                 resizeMode="cover"
             />
             <View style={bannerStyles.overlay}>
                 <Text style={bannerStyles.title}>{item.title}</Text>
                 <Text style={bannerStyles.subtitle}>{item.subtitle}</Text>
                 <View style={bannerStyles.orderButton}> 
                     <Text style={bannerStyles.orderButtonText}>Ver mais</Text>
                 </View>
             </View>
        </TouchableOpacity>
    );
};


// ================================
// LÓGICA DE DETALHES E CARRINHO (MANTIDA)
// ================================
const ProductDetailModal = ({ product, visible, onClose, userId }) => {
    const [quantity, setQuantity] = useState(1);
    const navigation = useNavigation();

    const getProductImageUrl = (path) => {
        if (!path) return null;
        return supabase.storage.from("produtos").getPublicUrl(path).data.publicUrl;
    };
    const imageUrl = getProductImageUrl(product?.image_path);
    
    const handleAddToCart = async () => {
        if (!product || quantity <= 0) return;
        
        if (!userId) {
            Alert.alert("Atenção", "Você precisa estar logado para adicionar itens ao carrinho.");
            onClose(); 
            return;
        }

        const unitPrice = product.price;
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
                .insert([
                    { 
                        user_id: userId, 
                        product_id: product.id,
                        quantity: quantity,
                        price_unit: unitPrice,
                    }
                ]);
            error = insertError;
        }

        if (error) {
            console.error("Erro ao adicionar/atualizar carrinho:", error.message);
            Alert.alert("Erro", "Não foi possível adicionar o produto ao carrinho.");
        } else {
            Alert.alert('Sucesso!', `${quantity}x ${product.name} adicionado ao seu carrinho!`);
            onClose(); 
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


// ================================
// CARD DO PRODUTO (MANTIDO)
// ================================
const ProductCard = ({ product, onCardPress }) => {
    const navigation = useNavigation();
    
    const handleFavoritePress = () => {
        navigation.navigate('Favoritos', { productToAdd: product }); 
    };

    const imageUrl = product.image_path 
        ? supabase.storage.from("produtos").getPublicUrl(product.image_path).data.publicUrl
        : null;

    return (
        <TouchableOpacity style={styles.productCard} onPress={() => onCardPress(product)}>
            <View style={styles.productImageBackground}>
                <LinearGradient
                    colors={[LIGHT_PINK, '#fff']}
                    style={styles.gradientOverlay}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                >
                    {imageUrl ? (
                        <Image 
                            source={{ uri: imageUrl }} 
                            style={styles.productImage} 
                            resizeMode="contain" 
                        />
                    ) : (
                        <Text>Sem imagem</Text>
                    )}
                </LinearGradient>
            </View>
            <TouchableOpacity 
                onPress={handleFavoritePress} 
                style={styles.favoriteButton}
            >
                <Ionicons 
                    name={'heart-outline'} 
                    size={22} 
                    color={MAIN_PINK} 
                />
            </TouchableOpacity>

            <View style={styles.productDetails}>
                <View style={styles.nameRatingRow}>
                    <Text style={styles.productName} numberOfLines={2}>
                        {product.name}
                    </Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.ratingText}>4.5</Text> 
                    </View>
                </View>
                
                <View style={styles.priceContainer}>
                    <Text style={styles.currentPrice}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};


// ================================
// CARD DE CATEGORIA (MANTIDO)
// ================================
const CategoryCard = ({ item }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        const screenName = item.screen;
        if (screenName) {
            // NAVEGAÇÃO: Envia para a tela de Categoria
            navigation.navigate(screenName, { categoryName: item.name }); 
        }
    };

    return (
        <TouchableOpacity style={styles.categoryCard} onPress={handlePress}>
            {/* O estilo 'categoryIconCircle' garante que o background seja redondo */}
            <View style={styles.categoryIconCircle}>
                {/* A imagem interna é contida dentro do círculo */}
                <Image
                    source={item.image}
                    style={styles.categoryImage}
                    resizeMode="contain" // 'contain' é melhor para ícones dentro de círculos
                />
            </View>
            <Text style={styles.categoryName} numberOfLines={2}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );
};


// ================================
// TELA PRINCIPAL (COM CORREÇÃO NA BUSCA)
// ================================
export default function HomeScreen() {
    const [searchText, setSearchText] = useState("");
    const [activeIndex, setActiveIndex] = useState(0); 
    
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null); 

    const navigation = useNavigation();

    // EFEITO: Carregar o ID do usuário na inicialização
    useEffect(() => {
        const loadUserId = async () => {
            const id = await AsyncStorage.getItem('user_session_id'); 
            setCurrentUserId(id); 
        };
        loadUserId();
    }, []);

    const fetchProducts = async () => {
        setLoadingProducts(true);
        
        const { data, error } = await supabase
            .from("products") 
            .select("*")
            .eq('is_home', true)
            .limit(6);

        if (!error) {
            const productsWithUrls = data.map(p => ({
                ...p,
                image_url: p.image_path ? supabase.storage.from("produtos").getPublicUrl(p.image_path).data.publicUrl : null
            }));
            setProducts(productsWithUrls);
        } else {
            console.error("Erro ao buscar produtos:", error.message);
        }
        setLoadingProducts(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);
    
    const handleCardPress = (product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    const handleFavoritesPress = () => {
        navigation.navigate('Favoritos');
    };
    
    // NOVO: "Ver Todas" na seção Ofertas Especiais navega para Categoria
    const handleViewAllOffers = () => {
         navigation.navigate('Categoria'); 
    };
    
    // NOVO: "Ver Todos" na seção Recomendado Para Você navega para TodosProdutos
    const handleViewAllProducts = () => {
         navigation.navigate('TodosProdutos'); 
    };

    // 🎯 FUNÇÃO QUE REDIRECIONA PARA A TELA DE BUSCA (Produto4)
    const handleSearchRedirect = () => {
        // ASSUMIMOS que a rota para Produto4 é 'Produto4Screen' no seu Navigator
        navigation.navigate('Produto4'); 
    };


    const onScroll = (event) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        if (roundIndex !== activeIndex) {
            setActiveIndex(roundIndex);
        }
    };


    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent} 
        >
            <View style={styles.topBackground} />

            {/* ===================== LOGO & SEARCH ===================== */}
            <View style={styles.searchBarContainer}>
                <Image source={LOGO_IMAGE} style={styles.logoImage} resizeMode="contain" />
            </View>

            <View style={styles.searchFilterRow}>
                {/* 🎯 ALTERAÇÃO AQUI: O searchBox agora é um TouchableOpacity que chama a função de redirecionamento */}
                <TouchableOpacity 
                    style={styles.searchBox} 
                    onPress={handleSearchRedirect} // <-- AÇÃO DE REDIRECIONAMENTO
                    activeOpacity={0.8}
                >
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Pesquisar produtos..."
                        placeholderTextColor="#999"
                        style={styles.searchInput}
                        // Impedimos a edição direta na home, forçando a navegação
                        editable={false} 
                        pointerEvents="none" 
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton} onPress={handleFavoritesPress}>
                    <Ionicons name="heart-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* ===================== BANNERS ===================== */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ofertas Especiais</Text>
                {/* NAVEGAÇÃO: Vai para a página 'Categoria' */}
                <TouchableOpacity onPress={handleViewAllOffers}> 
                    <Text style={styles.seeAllText}>Ver Todas</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.carouselContainer}>
                <FlatList
                    horizontal
                    data={promotionBanners}
                    keyExtractor={(item) => item.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    snapToInterval={BANNER_WIDTH + 15}
                    decelerationRate="fast"
                    // O PromotionBanner agora tem a lógica de navegação interna
                    renderItem={({ item }) => <PromotionBanner item={item} />} 
                    contentContainerStyle={styles.carouselList}
                    onScroll={onScroll} 
                />
                <View style={styles.indicatorContainer}>
                    {promotionBanners.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                index === activeIndex
                                    ? styles.activeIndicator
                                    : styles.inactiveIndicator,
                            ]}
                        />
                    ))}
                </View>
            </View>

            {/* ===================== CATEGORIAS ===================== */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Categorias</Text>
                {/* NAVEGAÇÃO: Vai para a página 'Categoria' */}
                <TouchableOpacity onPress={handleViewAllOffers}> 
                    <Text style={styles.seeAllText}>Ver Todas</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                horizontal
                data={categories}
                keyExtractor={(item) => item.name}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <CategoryCard item={item} />}
                contentContainerStyle={styles.categoryList}
            />

            {/* ===================== PRODUTOS ===================== */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recomendado Para Você</Text>
                {/* NAVEGAÇÃO: Vai para a página 'TodosProdutos' */}
                <TouchableOpacity onPress={handleViewAllProducts}> 
                    <Text style={styles.seeAllText}>Ver Todos</Text>
                </TouchableOpacity>
            </View>
            
            {loadingProducts ? (
                <ActivityIndicator size="large" color={MAIN_PINK} style={{ marginTop: 20 }} />
            ) : (
                <View style={styles.productsGrid}>
                    {products.map((item) => (
                        <ProductCard key={item.id} product={item} onCardPress={handleCardPress} />
                    ))}
                </View>
            )}

            <View style={{ height: 20 }} /> 
            
            {/* MODAL DE DETALHES DO PRODUTO */}
            <ProductDetailModal
                product={selectedProduct}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                userId={currentUserId} 
            />
        </ScrollView>
    );
}

// ================================
// ESTILOS (MANTIDOS)
// ================================

const bannerStyles = StyleSheet.create({
    bannerContainer: {
        width: BANNER_WIDTH,
        height: 180,
        marginRight: 15,
        borderRadius: 25,
        overflow: "hidden",
        backgroundColor: MAIN_PINK,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 10,
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        padding: 20,
        justifyContent: "space-between",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    title: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "900",
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        textShadowColor: "rgba(0, 0, 0, 0.4)",
        textShadowOffset: { width: 0.5, height: 0.5 },
        textShadowRadius: 1,
    },
    orderButton: {
        backgroundColor: "#fff",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 15,
        alignSelf: "flex-start",
    },
    orderButtonText: {
        color: MAIN_PINK,
        fontWeight: "700",
        fontSize: 14,
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LIGHT_BG,
    },
    scrollViewContent: {
        // Garantindo espaço para a tab navigation (Lembrete: 2025-10-21)
        paddingBottom: 100, 
    },

    topBackground: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 175,
        backgroundColor: LIGHT_PINK,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },

    searchBarContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingTop: 50,
    },
    logoImage: {
        width: 140,
        height: 50,
        resizeMode: 'contain',
    },

    searchFilterRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingBottom: 20,
        marginTop: 10,
        zIndex: 5,
    },
    searchBox: {
        // O searchBox é o TouchableOpacity que engloba o input
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        height: 48,
        backgroundColor: "#fff",
        borderRadius: 24,
        paddingHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 10,
        color: "#B0B0B0",
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#000",
    },
    filterButton: {
        marginLeft: 15,
        backgroundColor: MAIN_PINK,
        padding: 12,
        borderRadius: 18,
        shadowColor: MAIN_PINK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: HORIZONTAL_PADDING,
        marginBottom: 15,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#000",
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: "600",
        color: MAIN_PINK,
    },

    carouselContainer: {
        marginBottom: 30,
    },
    carouselList: {
        paddingHorizontal: HORIZONTAL_PADDING,
    },
    indicatorContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 15,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeIndicator: {
        backgroundColor: MAIN_PINK,
        width: 20,
    },
    inactiveIndicator: {
        backgroundColor: "#ccc",
    },

    categoryList: {
        paddingHorizontal: HORIZONTAL_PADDING,
        marginBottom: 30,
    },
    categoryCard: {
        alignItems: "center",
        marginRight: 20,
        width: 75,
    },
    // ESTILO PARA BOTÃO REDONDO DE CATEGORIA
    categoryIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 35, // Metade do width/height para ser perfeitamente redondo
        backgroundColor: "rgb(245 212 219)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 5,
        overflow: 'hidden', // Importante para garantir o corte
    },
    categoryImage: {
        width: 60,
        height: 60,
    },
    categoryName: {
        fontSize: 12,
        fontWeight: "600",
        color: "#333",
        textAlign: "center",
    },

    productsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: HORIZONTAL_PADDING,
    },
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
        paddingHorizontal: 5
    },
    counterButton: {
        padding: 5,
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