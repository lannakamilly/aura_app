import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// --- CONFIGURAÇÃO DE ESTILO E CORES ---
const PRIMARY_PINK = '#ff86b5'; 
const ACCENT_RED = '#000000ff'; // Usado para remoção
const SOFT_PINK = '#FFF0F5'; 
const TEXT_COLOR = '#111827'; 
const SECONDARY_TEXT_COLOR = '#6B7280'; 
const BACKGROUND_GREY = '#F9FAFB'; 
const BORDER_COLOR = '#E5E7EB'; 

// Dados mockados (limpeza do código original do usuário)
const initialCart = [
    {
        id: 1,
        name: 'Ácido Glicólico',
        desc: 'Sérum esfoliante para renovação da pele.', // Descrição mais clara
        price: 150,
        quantity: 1,
        image: 'https://res.cloudinary.com/beleza-na-web/image/upload/w_1500,f_auto,fl_progressive,q_auto:eco,w_800/v1/imagens/product/E2022020201/2f88ec40-3be3-497a-898c-22b1d9d5d9f5-kit-eudora-siage-cica-therapy-completo-4-produtos.png',
    },
    {
        id: 2,
        name: 'Manteiga Corporal',
        desc: 'Hidratação intensiva e aroma suave de baunilha.',
        price: 40,
        quantity: 2,
        image: 'https://acdn-us.mitiendanube.com/stores/004/599/657/products/frutas-4a762a9858af81d12117272424982864-640-0.png',
    },
    {
        id: 3,
        name: 'Leite de Amêndoas',
        desc: 'Loção facial de limpeza eficaz para pele oleosa.',
        price: 60,
        quantity: 1,
        image: 'https://acdn-us.mitiendanube.com/stores/004/599/657/products/leite-de-amendoas-ac405a9541ac122f4117276692711299-1024-1024.png',
    },
    {
        id: 4,
        name: 'Protetor Solar FPS 50',
        desc: 'Proteção UVA/UVB com toque seco e acabamento matte.',
        price: 70,
        quantity: 1,
        image: 'https://drogariaspacheco.vteximg.com.br/arquivos/ids/1366684-1000-1000/844713---Kit-Eudora-Siage-Nutri-Rose-Shampoo-250ml-+-Condicionador-125ml-+-Leave-In-30ml_0000_Layer-2.png.png?v=638687649630000000',
    },
];

export default function CartScreen({ navigation }) {
    const [cart, setCart] = useState(initialCart);

    // Atualiza quantidade
    const updateQuantity = (id, type) => {
        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item.id === id) {
                    let newQty = type === 'add' ? item.quantity + 1 : item.quantity - 1;
                    if (newQty < 1) {
                        return null; // Marca para remoção se a quantidade for zero
                    }
                    return { ...item, quantity: newQty };
                }
                return item;
            }).filter(Boolean) // Remove os itens marcados como null
        );
    };

    // Remove produto
    const removeItem = (id) => {
        // No React Native, é melhor usar um modal customizado, mas aqui usamos Alert para simplificar a confirmação
        Alert.alert(
            "Remover Item",
            "Deseja realmente remover este produto do seu carrinho?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    onPress: () => {
                        setCart((prev) => prev.filter((item) => item.id !== id));
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    // Total
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const frete = subtotal > 200 ? 0 : 25; // Exemplo: frete grátis acima de R$ 200
    const total = subtotal + frete;

    // Componente de Item do Carrinho (refinado)
    const CartItem = ({ item }) => (
        <View style={styles.itemCard}>
            {/* 1. Imagem */}
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: item.image }} 
                    style={styles.itemImage} 
                />
            </View>
            
            {/* 2. Detalhes e Preço */}
            <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemDesc} numberOfLines={2}>{item.desc}</Text>
                
                {/* Preço Unitário (Adicionado para clareza) */}
                <Text style={styles.itemPriceUnit}>R$ {item.price.toFixed(2)}/un.</Text>
            </View>
            
            {/* 3. Ações (Quantidade e Remover) */}
            <View style={styles.itemActions}>
                {/* Ícone de Remover (Topo) */}
                <TouchableOpacity style={styles.removeIcon} onPress={() => removeItem(item.id)}>
                    <Ionicons name="trash-outline" size={24} color={ACCENT_RED} />
                </TouchableOpacity>

                {/* Controle de Quantidade (Fundo) */}
                <View style={styles.qtyContainer}>
                    <TouchableOpacity
                        onPress={() => updateQuantity(item.id, 'sub')}
                        style={styles.qtyButton}
                    >
                        <Ionicons name="remove-outline" size={18} color={PRIMARY_PINK} />
                    </TouchableOpacity>

                    <Text style={styles.qtyNumber}>{item.quantity}</Text>

                    <TouchableOpacity
                        onPress={() => updateQuantity(item.id, 'add')}
                        style={styles.qtyButton}
                    >
                        <Ionicons name="add-outline" size={18} color={PRIMARY_PINK} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
    
    // Função de checkout
    const handleCheckout = () => {
        if (cart.length === 0) {
             Alert.alert("Carrinho Vazio", "Adicione itens antes de prosseguir para o pagamento.");
             return;
        }
        if (navigation) {
            // Redireciona para a tela Pagamento
            navigation.navigate('Pagamento');
        }
    };

    return (
        <View style={styles.outerContainer}>
            {/* Cabeçalho Limpo e Profissional */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color={TEXT_COLOR} />
                </TouchableOpacity>
                <Text style={styles.title}>Meu Carrinho ({cart.length})</Text> 
                <TouchableOpacity onPress={() => { /* Opções do menu */ }} style={styles.headerButton}>
                    <Ionicons name="ellipsis-vertical" size={24} color={TEXT_COLOR} />
                </TouchableOpacity>
            </View>

            {/* ScrollView */}
            <ScrollView 
                style={styles.scrollViewContent} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }} 
            >
                {/* Renderização dos Itens */}
                {cart.length > 0 ? (
                    cart.map((item) => (
                        <CartItem key={item.id} item={item} />
                    ))
                ) : (
                    <View style={styles.emptyCartContainer}>
                        <Ionicons name="cart-outline" size={80} color={SECONDARY_TEXT_COLOR} />
                        <Text style={styles.emptyCartText}>Seu carrinho está vazio.</Text>
                        <Text style={styles.emptyCartSubText}>Adicione produtos para continuar a sua compra!</Text>
                    </View>
                )}
                
                {/* Resumo da Compra (Só mostra se houver itens) */}
                {cart.length > 0 && (
                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryTitle}>Resumo do Pedido</Text>
                        
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'itens'})</Text>
                            <Text style={styles.summaryValue}>R$ {subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Frete</Text>
                            <Text style={frete === 0 ? styles.summaryValueFree : styles.summaryValue}>
                                {frete === 0 ? 'Grátis' : `R$ ${frete.toFixed(2)}`}
                            </Text>
                        </View>
                        
                        <View style={styles.divider} />
                        
                        <View style={[styles.summaryRow, {marginTop: 10}]}>
                            <Text style={styles.totalLabel}>Total a Pagar</Text>
                            <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
                        </View>
                    </View>
                )}
                
                {/* Botão Finalizar Compra (Apenas se houver itens) */}
                {cart.length > 0 && (
                    <View style={styles.buttonContainerInsideScroll}>
                        <TouchableOpacity 
                            style={styles.checkoutButton} 
                            onPress={handleCheckout} 
                        >
                            <Text style={styles.checkoutText}>FINALIZAR COMPRA</Text>
                            <Ionicons name="arrow-forward-circle" size={24} color="#fff" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                    </View>
                )}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: BACKGROUND_GREY,
    },
    scrollViewContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50, 
        paddingBottom: 15,
        backgroundColor: '#fff', 
        borderBottomWidth: 0, // Tiramos a borda para um look mais limpo
    },
    headerButton: {
        padding: 5,
    },
    title: {
        color: TEXT_COLOR,
        fontWeight: '800',
        fontSize: 20,
    },

    // ITENS DO CARRINHO (CARTÃO ELEGANTE)
    itemCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
        minHeight: 120,
        
        // Sombra suave, focada para cima e um pouco colorida
        shadowColor: TEXT_COLOR,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, 
        shadowRadius: 5,
        elevation: 3,
    },
    imageContainer: {
        width: 90,
        height: 90,
        borderRadius: 15,
        marginRight: 15,
        backgroundColor: SOFT_PINK, 
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    itemImage: {
        width: '90%', // Aumentamos um pouco o tamanho da imagem interna
        height: '90%',
        resizeMode: 'contain', 
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'space-around', 
        paddingVertical: 2,
    },
    itemName: {
        fontWeight: '700',
        fontSize: 16,
        color: TEXT_COLOR,
    },
    itemDesc: {
        fontSize: 12,
        color: SECONDARY_TEXT_COLOR,
        marginBottom: 4,
    },
    itemPriceUnit: {
        fontWeight: '600',
        color: SECONDARY_TEXT_COLOR,
        fontSize: 13,
    },
    
    // AÇÕES (Quantidade e Remover)
    itemActions: {
        width: 90,
        justifyContent: 'space-between', 
        alignItems: 'flex-end',
    },
    removeIcon: {
        padding: 5,
        // Alinha o ícone de remover ao topo/direita
    },
    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: SOFT_PINK, // Usamos o rosa suave para destacar o controle
        borderRadius: 10,
        overflow: 'hidden',
        height: 35,
        alignSelf: 'flex-end', 
    },
    qtyButton: {
        width: 30,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyNumber: {
        fontSize: 15,
        color: TEXT_COLOR, 
        marginHorizontal: 4,
        fontWeight: '700',
    },

    // RESUMO DA COMPRA
    summaryBox: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginTop: 20,
        shadowColor: PRIMARY_PINK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, // Sombra mais perceptível no resumo
        shadowRadius: 10,
        elevation: 5,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: TEXT_COLOR,
        marginBottom: 15,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    summaryLabel: {
        fontSize: 16,
        color: SECONDARY_TEXT_COLOR,
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '700',
        color: TEXT_COLOR,
    },
    summaryValueFree: {
        fontSize: 16,
        fontWeight: '700',
        color: '#34A853',
    },
    divider: {
        height: 1.5, // Divisor mais grosso
        backgroundColor: BORDER_COLOR,
        marginVertical: 10,
    },
    totalLabel: {
        fontSize: 22,
        fontWeight: '800',
        color: TEXT_COLOR,
    },
    totalValue: {
        fontSize: 22,
        fontWeight: '900',
        color: PRIMARY_PINK, // O total é o mais destacado
    },
    
    // BOTÃO FINALIZAR COMPRA
    buttonContainerInsideScroll: {
        paddingTop: 30,
        paddingBottom: 20,
        backgroundColor: 'transparent',
    },
    checkoutButton: {
        backgroundColor: PRIMARY_PINK,
        borderRadius: 15,
        paddingVertical: 18,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        
        // Sombra de destaque para o CTA
        shadowColor: PRIMARY_PINK,
        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
    },
    checkoutText: {
        color: '#fff',
        fontWeight: '900', // Mais peso
        fontSize: 18, 
        letterSpacing: 1, // Espaçamento para o efeito premium
    },

    // Carrinho Vazio
    emptyCartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginTop: 40,
        borderWidth: 1,
        borderColor: BORDER_COLOR,
    },
    emptyCartText: {
        fontSize: 18,
        fontWeight: '700',
        color: TEXT_COLOR,
        marginTop: 15,
        marginBottom: 5,
    },
    emptyCartSubText: {
        fontSize: 14,
        color: SECONDARY_TEXT_COLOR,
        textAlign: 'center',
    }
});
