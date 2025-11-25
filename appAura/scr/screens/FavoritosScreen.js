// Arquivo: scr/screens/FavoritosScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity, 
    Alert,
    Image,
    Modal, // Importado para o nosso Modal personalizado
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native'; // Não precisamos mais de useNavigation aqui
import { supabase } from '../screens/supabase';


// 💡 PALETA DE CORES MODERNA
const PRIMARY_COLOR = "#ff86b4"; // Rosa Principal (Vibrante)
const SECONDARY_BG = "#f5f5f5"; // Fundo claro dos cards/imagem
const CARD_BG = "#ffffff";
const TEXT_DARK = "#1f2937"; 
const TEXT_SUBTLE = "#6b7280"; 
const SUCCESS_COLOR = "#10b981"; // Verde de sucesso
const HORIZONTAL_PADDING = 20;

const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001'; 
let globalFavoritesList = []; 

// ================================
// 🟢 NOVO COMPONENTE: MODAL DE SUCESSO (Feedback Moderno)
// ================================
const SuccessModal = ({ isVisible, onClose, productName }) => {
    return (
        <Modal
            animationType="fade" // Efeito mais suave
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={modalStyles.centeredView}>
                <View style={modalStyles.modalView}>
                    <Ionicons name="checkmark-circle" size={60} color={SUCCESS_COLOR} />
                    <Text style={modalStyles.modalTitle}>Adicionado ao Carrinho!</Text>
                    <Text style={modalStyles.modalText}>{productName} foi adicionado com sucesso.</Text>
                    <TouchableOpacity
                        style={[modalStyles.button, { backgroundColor: PRIMARY_COLOR }]}
                        onPress={onClose}
                    >
                        <Text style={modalStyles.textStyle}>Continuar Comprando</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

// ================================
// LÓGICA DE ADICIONAR AO CARRINHO (AJUSTADA PARA USAR O MODAL)
// ================================
const handleAddToCart = async (product, showSuccessModal) => {
    const quantity = 1; 
    
    if (!product) return;

    const unitPrice = product.price;
    
    // 1. Verifica se o item já está no carrinho (Lógica mantida)
    const { data: existingCartItem, error: fetchError } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', MOCK_USER_ID)
        .eq('product_id', product.id)
        .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Erro ao verificar carrinho:", fetchError.message);
        Alert.alert("Erro", "Não foi possível verificar o carrinho.");
        return;
    }

    let error;

    // 2. Atualiza ou Insere (Lógica mantida)
    if (existingCartItem) {
        const newQuantity = existingCartItem.quantity + quantity;
        const { error: updateError } = await supabase
            .from('cart')
            .update({ quantity: newQuantity })
            .eq('user_id', MOCK_USER_ID)
            .eq('product_id', product.id);
        error = updateError;
    } else {
        const { error: insertError } = await supabase
            .from('cart')
            .insert([
                { 
                    user_id: MOCK_USER_ID,
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
        // 🚀 NOVO: Chama a função para exibir o modal personalizado!
        showSuccessModal(product.name);
    }
};

// ================================
// COMPONENTE DO CARD DE FAVORITO
// ================================
// Adicionamos a função showSuccessModal como prop aqui
const FavoriteItem = React.memo(({ item, onRemove, onCardPress, showSuccessModal }) => {
    const imageUrl = item.image_url; 

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={() => onCardPress(item)}>
            {/* ... (Visual do Card mantido) */}
            <View style={styles.imageWrapper}>
                {imageUrl ? (
                    <Image 
                        source={{ uri: imageUrl }} 
                        style={styles.productImage} 
                        resizeMode="cover" 
                    />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Ionicons name="image-outline" size={30} color="#ccc" />
                    </View>
                )}
            </View>

            <View style={styles.detailsWrapper}>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.productPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
            </View>

            <View style={styles.actionsWrapper}>
                <TouchableOpacity 
                    style={styles.addToCartButton} 
                    onPress={(e) => {
                        e.stopPropagation();
                        // 🔑 CHAMADA AJUSTADA: Passa showSuccessModal para handleAddToCart
                        handleAddToCart(item, showSuccessModal);
                    }}
                >
                    <Ionicons name="cart-outline" size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.removeButton} 
                    onPress={(e) => {
                        e.stopPropagation(); 
                        onRemove(item.id);
                    }}
                >
                    <Ionicons name="close-circle" size={26} color={TEXT_SUBTLE} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
});


// ================================
// TELA DE FAVORITOS
// ================================
export default function FavoritosScreen() {
    const [favoritosList, setFavoritosList] = useState(globalFavoritesList);
    const route = useRoute();
    // 💡 NOVO ESTADO: Para controlar a visibilidade e o nome do produto no modal
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [lastAddedProductName, setLastAddedProductName] = useState('');

    // Função que handleAddToCart irá chamar
    const showSuccessModal = useCallback((productName) => {
        setLastAddedProductName(productName);
        setIsSuccessModalVisible(true);
        // Opcional: Fechar o modal após 2 segundos
        setTimeout(() => setIsSuccessModalVisible(false), 2000); 
    }, []);

    // ... (Lógica para adicionar item via navegação e remover item mantida)
    useEffect(() => {
        if (route.params?.productToAdd) {
            const product = route.params.productToAdd;
            const isAlreadyFavorite = globalFavoritesList.some(item => item.id === product.id);

            if (!isAlreadyFavorite) {
                globalFavoritesList.push(product);
                setFavoritosList([...globalFavoritesList]); 
                Alert.alert("Adicionado!", `${product.name} agora está nos seus favoritos.`);
            }
            route.params.productToAdd = undefined; 
        }
    }, [route.params?.productToAdd]); 

    const handleRemoveFavorite = useCallback((productId) => {
        Alert.alert(
            "Remover Favorito",
            "Tem certeza que deseja remover este produto dos seus favoritos?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Remover", 
                    onPress: () => {
                        globalFavoritesList = globalFavoritesList.filter(item => item.id !== productId);
                        setFavoritosList([...globalFavoritesList]);
                        Alert.alert("Sucesso", "Produto removido dos favoritos.");
                    }
                }
            ]
        );
    }, []);

    const handleItemPress = (product) => {
        Alert.alert(
            product.name,
            `${product.description || 'Nenhuma descrição disponível.'}\n\nPreço: R$ ${product.price.toFixed(2).replace('.', ',')}`,
            [
                { text: "Fechar", style: "cancel" },
            ]
        );
    };


    const renderItem = ({ item }) => (
        <FavoriteItem 
            item={item} 
            onRemove={handleRemoveFavorite} 
            onCardPress={handleItemPress}
            // 🔑 NOVO: Passando a função para exibir o modal de sucesso
            showSuccessModal={showSuccessModal} 
        />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Meus Favoritos</Text>
            <Text style={styles.headerSubtitle}>Itens que você amou e salvou.</Text>
            
            {favoritosList.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-dislike-outline" size={80} color={TEXT_SUBTLE} />
                    <Text style={styles.emptyText}>Sua lista de favoritos está vazia.</Text>
                    <Text style={styles.emptyTextSmall}>Clique no coração nos cards para adicionar!</Text>
                </View>
            ) : (
                <FlatList
                    data={favoritosList}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()} 
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* 🔑 NOVO: Renderiza o Modal de Sucesso */}
            <SuccessModal 
                isVisible={isSuccessModalVisible} 
                onClose={() => setIsSuccessModalVisible(false)}
                productName={lastAddedProductName}
            />
        </View>
    );
}

// ================================
// ESTILOS (MELHORADOS)
// ================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CARD_BG,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: TEXT_DARK,
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingTop: 55,
    },
    headerSubtitle: {
        fontSize: 16,
        color: TEXT_SUBTLE,
        paddingHorizontal: HORIZONTAL_PADDING,
        marginBottom: 20,
    },
    listContent: {
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingBottom: 100, // Espaço para a tab navigation
    },
    cardContainer: {
        flexDirection: 'row',
        backgroundColor: CARD_BG,
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: TEXT_DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#eee',
    },
    imageWrapper: {
        width: 100,
        height: 100,
        backgroundColor: SECONDARY_BG,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsWrapper: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 18,
        fontWeight: '700',
        color: TEXT_DARK,
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 22,
        fontWeight: '900',
        color: PRIMARY_COLOR,
    },
    actionsWrapper: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 100,
        marginLeft: 10,
    },
    addToCartButton: {
        backgroundColor: PRIMARY_COLOR,
        padding: 8,
        borderRadius: 50,
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    removeButton: {
        padding: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 50,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        color: TEXT_SUBTLE,
        marginTop: 20,
    },
    emptyTextSmall: {
        fontSize: 15,
        color: '#bbb',
        marginTop: 5,
    }
});

// ================================
// ESTILOS DO MODAL DE SUCESSO
// ================================
const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fundo semitransparente
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
            height: 4
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '85%'
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 24,
        fontWeight: 'bold',
        color: TEXT_DARK,
        marginTop: 10,
    },
    modalText: {
        marginBottom: 25,
        textAlign: "center",
        fontSize: 16,
        color: TEXT_SUBTLE,
    },
    button: {
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        width: '100%',
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
    }
});