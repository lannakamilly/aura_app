import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Configurações de Design
const PRIMARY_PINK = '#ff86b5'; // Rosa Vibrante
const LIGHT_PINK = '#ffeaf3'; // Rosa Claro para fundo
const CARD_BACKGROUND = '#fff'; // Branco
const STAR_COLOR = '#FFD700'; // Amarelo Dourado para estrelas
const INACTIVE_GRAY = '#aaa'; // Cinza para textos secundários e inativos
const DARK_TEXT = '#333'; // Texto Principal
const SECONDARY_TEXT = '#555'; // Texto Secundário

// Obter a altura da tela para layout responsivo
const { height, width } = Dimensions.get('window');
const FOOTER_HEIGHT = 90; // Nova altura reduzida para o rodapé (melhor UX)

// Dados Mock do Produto
const productData = {
    id: 1, 
    name: "Gloss Fran By Franciny", 
    priceValue: 59.67,
    location: "2.8 Km de distância", 
    rating: 4.8,
    details: "Um gloss labial com textura não pegajosa e acabamento luxuoso de mel. Contém ingredientes hidratantes que nutrem os lábios, proporcionando um volume natural e um brilho espelhado. Perfeito para uso diário ou sobre batom. Há muitas variações de passagens de Lorem Ipsum disponíveis, mas a maioria sofreu alguma forma, por humor injetado ou palavras aleatórias que não parecem...", 
    image: require('../assets/3.png'), 
};

// Componente da Tela de Produto
export default function Produto({ navigation }) {
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleQuantityChange = (type) => {
        if (type === 'increment') {
            setQuantity(prev => prev + 1);
        } else if (type === 'decrement' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };
    
    const handleAddToCart = () => {
        alert(`Adicionado ${quantity}x de "${productData.name}" ao carrinho!`);
    };
    
    const handlePlaceOrder = () => {
        alert(`Pedido de ${quantity}x de "${productData.name}" realizado!`);
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    // Formatação do preço total para o padrão brasileiro (R$ X,XX)
    const totalPrice = (productData.priceValue * quantity).toFixed(2).replace('.', ',');

    // Renderiza estrelas ativas
    const renderActiveStars = () => {
        const fullStars = Math.floor(productData.rating);
        const hasHalfStar = productData.rating % 1 !== 0;
        const stars = [];

        for (let i = 0; i < 5; i++) {
            let name = "star-outline";
            let color = PRIMARY_PINK;

            if (i < fullStars) {
                name = "star";
            } else if (i === fullStars && hasHalfStar) {
                name = "star-half";
            }
            
            stars.push(<Ionicons key={i} name={name} size={18} color={color} style={styles.star} />);
        }
        return stars;
    };
    
    // Renderiza estrelas inativas
    const renderInactiveStars = () => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(<Ionicons key={i} name="star-outline" size={18} color={INACTIVE_GRAY} style={styles.star} />);
        }
        return stars;
    };


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                // Aplica o padding no final para compensar a altura do rodapé fixo
                contentContainerStyle={[styles.scrollContent, { paddingBottom: FOOTER_HEIGHT + 20 }]} 
                showsVerticalScrollIndicator={false}
            >
                
                {/* Área da Imagem em Destaque */}
                <View style={styles.imagePlaceholderContainer}>
                   <Image
                     source={productData.image}
                     style={styles.productImage}
                     resizeMode="contain"
                   />
                </View>

                {/* Header e Botão Voltar (Flutuante) */}
                <View style={styles.header}>
                  {/* Ajuste: Usando `buttonStyleFloting` para centralizar melhor */}
                  <TouchableOpacity onPress={handleGoBack} style={styles.buttonStyleFloating}>
                    <Ionicons name="arrow-back-outline" size={24} color={DARK_TEXT} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonStyleFloating} onPress={() => setIsFavorite(!isFavorite)}>
                    <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? PRIMARY_PINK : DARK_TEXT} /> 
                  </TouchableOpacity>
                </View>


                {/* Card de Detalhes do Produto */}
                <View style={styles.detailsCard}>
                  <Text style={styles.productTitle}>{productData.name}</Text>
                  
                  {/* Distância e Preço */}
                    <View style={styles.topInfoRow}>
                        {/* Distância */}
                        <View style={styles.locationContainer}>
                            <Ionicons name="location-outline" size={16} color={INACTIVE_GRAY} style={{ marginRight: 5 }} />
                            <Text style={styles.locationText}>{productData.location}</Text>
                        </View>
                        {/* Preço e Frete Grátis */}
                        <View style={styles.priceContainer}>
                            <Text style={styles.productPrice}>R$ {productData.priceValue.toFixed(2).replace('.', ',')}</Text>
                            <Text style={styles.freeShippingText}>Frete Grátis</Text>
                        </View>
                    </View>
                  
                  {/* Avaliação e Dê sua avaliação */}
                    <View style={styles.ratingRow}>
                        <View>
                            <Text style={styles.ratingHeader}>{productData.rating.toFixed(1)} avaliação</Text>
                            <View style={styles.starsContainer}>
                                {renderActiveStars()}
                            </View>
                        </View>
                        
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.ratingHeader}>Dê sua avaliação</Text>
                            <View style={styles.starsContainer}>
                                {renderInactiveStars()}
                            </View>
                        </View>
                    </View>

                    {/* Linha Divisória */}
                    <View style={styles.divider} />


                  {/* Descrição do Produto (Detalhes) */}
                  <Text style={styles.sectionHeader}>Detalhes</Text>
                  <Text style={styles.productDescription} numberOfLines={4}>
                    {productData.details}
                  </Text>
                 

                    {/* Linha Divisória */}
                    <View style={styles.divider} />

                    {/* Quantidade */}
                    <View style={styles.quantityContainer}>
                        <Text style={styles.quantityLabel}>Quantidade</Text>
                        <View style={styles.quantityControls}>
                            <TouchableOpacity style={styles.qtyButton} onPress={() => handleQuantityChange('decrement')}>
                                <Ionicons name="remove-circle-sharp" size={30} color={quantity > 1 ? PRIMARY_PINK : INACTIVE_GRAY} />
                            </TouchableOpacity>
                            <Text style={styles.qtyText}>{quantity}</Text>
                            <TouchableOpacity style={styles.qtyButton} onPress={() => handleQuantityChange('increment')}>
                                <Ionicons name="add-circle-sharp" size={30} color={PRIMARY_PINK} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    {/* Preço Total */}
                    <View style={styles.totalPriceContainer}>
                        <Text style={styles.totalPriceLabel}>Preço Total</Text>
                        <Text style={styles.totalPriceText}>R$ {totalPrice}</Text>
                    </View>

                </View>
            </ScrollView>

            {/* RODAPÉ - Botões "Adicionar ao Carrinho" e "Finalizar Pedido" */}
            <View style={styles.footer}>
                {/* Botão Adicionar ao Carrinho */}
                <TouchableOpacity 
                  style={styles.addToCartButton}
                  onPress={handleAddToCart}
                >
                  <Text style={styles.addToCartText}>Carrinho</Text>
                </TouchableOpacity>
                
                {/* Botão Finalizar Pedido */}
                <TouchableOpacity 
                  style={styles.placeOrderButton}
                  onPress={handlePlaceOrder}
                >
                  <Text style={styles.placeOrderText}>Finalizar Pedido</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: LIGHT_PINK,
    },
    scrollContent: {
      paddingBottom: 0, 
      minHeight: height, 
    },

// --- CABEÇALHO (FLUTUANTE) ---
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 25, // Aumentado para melhor respiro
      paddingTop: Platform.OS === 'android' ? 20 : 0, // Ajuste para Android
      position: 'absolute',
      top: 50,
      left: 0,
      right: 0,
      zIndex: 10, 
    },
    buttonStyleFloating: {
      backgroundColor: CARD_BACKGROUND,
      borderRadius: 50,
      padding: 10,
      // Sombra mais suave
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },

// --- IMAGEM ---
    imagePlaceholderContainer: {
      width: '100%',
      height: height * 0.45, 
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: LIGHT_PINK,
      overflow: 'hidden',
    },
    productImage: {
      width: '85%', // Levemente maior
      height: '85%',
      borderRadius: 20, // Borda mais arredondada
    },

// --- CARD DE DETALHES ---
    detailsCard: {
      backgroundColor: CARD_BACKGROUND,
      borderTopLeftRadius: 50, // Borda mais arredondada
      borderTopRightRadius: 50, // Borda mais arredondada
      padding: 30, // Aumentado o padding
      marginTop: -50,
      elevation: 10, 
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: -5 },
      shadowRadius: 15,
    },
    productTitle: {
      fontSize: 26, // Levemente maior
      fontWeight: '800',
      color: DARK_TEXT,
      marginBottom: 10,
    },

// --- LINHA DE INFORMAÇÃO SUPERIOR (Distância e Preço/Frete) ---
    topInfoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationText: {
      fontSize: 15,
      color: INACTIVE_GRAY,
      fontWeight: '500',
    },
    priceContainer: {
      alignItems: 'flex-end',
    },
    productPrice: {
      fontSize: 28, // Destacado
      fontWeight: '900',
      color: PRIMARY_PINK,
    },
    freeShippingText: {
      fontSize: 14,
      color: PRIMARY_PINK, // Cor da marca para destaque sutil
      fontWeight: '700',
      marginTop: 2,
    },

// --- LINHA DE AVALIAÇÃO ---
    ratingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
    },
    ratingHeader: {
      fontSize: 15,
      color: SECONDARY_TEXT,
      fontWeight: '600',
      marginBottom: 5,
    },
    starsContainer: {
      flexDirection: 'row',
    },
    star: {
      marginRight: 3,
    },

// --- DETALHES E DESCRIÇÃO ---
    divider: {
      height: 1,
      backgroundColor: '#f0f0f0', // Divisor mais sutil
      marginVertical: 18, // Mais espaço
    },
    sectionHeader: {
      fontSize: 20,
      fontWeight: '700',
      color: DARK_TEXT,
      marginBottom: 12,
    },
    productDescription: {
      fontSize: 15,
      color: SECONDARY_TEXT,
      lineHeight: 24, // Maior espaçamento entre linhas
    },
    readMoreText: {
      color: PRIMARY_PINK,
      fontWeight: '600',
      fontSize: 15,
      marginTop: 8,
    },
    
// --- QUANTIDADE E PREÇO TOTAL ---
    quantityContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
      paddingVertical: 5,
    },
    quantityLabel: {
      fontSize: 18,
      color: DARK_TEXT,
      fontWeight: '600',
    },
    quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    qtyButton: {
      paddingHorizontal: 8,
    },
    qtyText: {
      fontSize: 20, // Maior e mais visível
      fontWeight: '700',
      color: DARK_TEXT,
      marginHorizontal: 10,
    },
    totalPriceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20, // Mais espaço antes do total
      paddingVertical: 10,
    },
    totalPriceLabel: {
      fontSize: 22, // Destacado
      color: DARK_TEXT,
      fontWeight: '700',
    },
    totalPriceText: {
      fontSize: 24, // Destacado
      fontWeight: '900',
      color: PRIMARY_PINK,
    },


// --- RODAPÉ COM DOIS BOTÕES (AJUSTADO) ---
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row', 
      justifyContent: 'space-between',
      paddingHorizontal: 25,
      paddingVertical: 15, // Reduzido o padding vertical
      paddingBottom: Platform.OS === 'ios' ? 30 : 15, // Ajuste para o Safe Area em iOS
      height: FOOTER_HEIGHT, // Altura total definida
      backgroundColor: CARD_BACKGROUND,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      elevation: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
    addToCartButton: {
      flex: 1,
      backgroundColor: CARD_BACKGROUND,
      padding: 12, // Diminuído o padding
      borderRadius: 12, // Borda mais suave
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: PRIMARY_PINK,
      marginRight: 10,
    },
    addToCartText: {
      color: PRIMARY_PINK,
      fontSize: 16, // Levemente menor
      fontWeight: 'bold',
    },
    placeOrderButton: {
      flex: 1.5, // Botão de Finalizar Pedido um pouco maior (prioridade)
      backgroundColor: PRIMARY_PINK,
      padding: 12, // Diminuído o padding
      borderRadius: 12, // Borda mais suave
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 10,
      elevation: 5,
      shadowColor: PRIMARY_PINK,
      shadowOpacity: 0.5,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
    },
    placeOrderText: {
      color: '#fff',
      fontSize: 16, // Levemente menor
      fontWeight: 'bold',
    },
});