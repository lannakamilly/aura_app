import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Configurações de Design
const PRIMARY_PINK = '#ff86b5'; // Rosa Vibrante
const LIGHT_PINK = '#ffeaf3'; // Rosa Claro para fundo
const CARD_BACKGROUND = '#fff'; // Branco
const STAR_COLOR = '#FFD700'; // Amarelo Dourado para estrelas
const INACTIVE_GRAY = '#aaa'; // Cinza para textos secundários e inativos

// Obter a altura da tela para layout responsivo
const { height, width } = Dimensions.get('window');

// Dados Mock do Produto (Simulando o Gloss Fran com um Preço de Exemplo)
const productData = {
    id: 1, 
    name: "Gloss Fran By Franciny", 
    priceValue: 59.67, // Valor numérico para cálculo
    priceText: "R$ 59,67", 
    location: "2.8 Km de distância", // TRADUZIDO
    rating: 4.8,
    details: "Um gloss labial com textura não pegajosa e acabamento luxuoso de mel. Contém ingredientes hidratantes que nutrem os lábios, proporcionando um volume natural e um brilho espelhado. Perfeito para uso diário ou sobre batom. Há muitas variações de passagens de Lorem Ipsum disponíveis, mas a maioria sofreu alguma forma, por humor injetado ou palavras aleatórias que não parecem...", // TRADUZIDO
    image: require('../assets/prod.png'), 
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

    // TRADUZIDO
    const handleAddToCart = () => {
        alert(`Adicionado ${quantity}x de "${productData.name}" ao carrinho!`);
    };
    
    // TRADUZIDO
    const handlePlaceOrder = () => {
        alert(`Pedido de ${quantity}x de "${productData.name}" realizado!`);
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    // Formatação do preço total para o padrão brasileiro (R$ X,XX)
    const totalPrice = (productData.priceValue * quantity).toFixed(2).replace('.', ',');

    // Renderiza 5 estrelas ativas para a avaliação do produto
    const renderActiveStars = () => {
        const fullStars = Math.floor(productData.rating);
        const hasHalfStar = productData.rating % 1 !== 0;
        const stars = [];

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Ionicons key={i} name="star" size={18} color={PRIMARY_PINK} style={styles.star} />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<Ionicons key={i} name="star-half" size={18} color={PRIMARY_PINK} style={styles.star} />);
            } else {
                stars.push(<Ionicons key={i} name="star-outline" size={18} color={PRIMARY_PINK} style={styles.star} />);
            }
        }
        return stars;
    };
    
    // Renderiza 5 estrelas inativas para a seção "Dê sua avaliação"
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
            contentContainerStyle={styles.scrollContent}
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
          <TouchableOpacity onPress={handleGoBack} style={styles.buttonStyle}>
            <Ionicons name="arrow-back-outline" size={24} color="#444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => setIsFavorite(!isFavorite)}>
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? PRIMARY_PINK : "#444"} /> 
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
                    {/* TRADUZIDO: "4.8 avaliação" */}
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
            {/* TRADUZIDO: "... Ler mais" */}
            <TouchableOpacity onPress={() => {/* Adicionar lógica de "Ler Mais" */}}>
                <Text style={styles.readMoreText}>... Ler mais</Text>
            </TouchableOpacity>

            {/* Linha Divisória */}
            <View style={styles.divider} />

            {/* Quantidade */}
            <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Quantidade</Text>
                <View style={styles.quantityControls}>
                    <TouchableOpacity style={styles.qtyButton} onPress={() => handleQuantityChange('decrement')}>
                        <Ionicons name="remove-circle-sharp" size={28} color={quantity > 1 ? PRIMARY_PINK : INACTIVE_GRAY} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{quantity}</Text>
                    <TouchableOpacity style={styles.qtyButton} onPress={() => handleQuantityChange('increment')}>
                        <Ionicons name="add-circle-sharp" size={28} color={PRIMARY_PINK} />
                    </TouchableOpacity>
                </View>
            </View>
            
            {/* Preço Total */}
            <View style={styles.totalPriceContainer}>
                <Text style={styles.totalPriceLabel}>Preço Total</Text>
                <Text style={styles.totalPriceText}>R$ {totalPrice}</Text>
            </View>

        </View>

        {/* Espaço extra para compensar o rodapé/Tab Bar */}
        <View style={{ height: 100 }}></View> 

      </ScrollView>

      {/* RODAPÉ - Botões "Adicionar ao Carrinho" e "Finalizar Pedido" */}
      <View style={styles.footer}>
        {/* Botão Adicionar ao Carrinho */}
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Adicionar ao Carrinho</Text>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10, 
  },
  buttonStyle: {
    backgroundColor: CARD_BACKGROUND,
    borderRadius: 50,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
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
    width: '80%', 
    height: '80%',
    borderRadius: 15,
  },

// --- CARD DE DETALHES ---
  detailsCard: {
    backgroundColor: CARD_BACKGROUND,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 25,
    marginTop: -50,
    elevation: 15, 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -5 },
    shadowRadius: 15,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#333',
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
    fontSize: 16,
    color: INACTIVE_GRAY,
    fontWeight: '500',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: PRIMARY_PINK,
  },
  freeShippingText: {
    fontSize: 14,
    color: INACTIVE_GRAY,
    fontWeight: '500',
  },

// --- LINHA DE AVALIAÇÃO ---
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  ratingHeader: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 2,
  },

// --- DETALHES E DESCRIÇÃO ---
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  readMoreText: {
    color: PRIMARY_PINK,
    fontWeight: '600',
    fontSize: 15,
    marginTop: 5,
  },
  
// --- QUANTIDADE E PREÇO TOTAL ---
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  quantityLabel: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    paddingHorizontal: 5,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginHorizontal: 10,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  totalPriceLabel: {
    fontSize: 20,
    color: '#333',
    fontWeight: '700',
  },
  totalPriceText: {
    fontSize: 20,
    fontWeight: '800',
    color: PRIMARY_PINK,
  },


// --- RODAPÉ COM DOIS BOTÕES ---
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 35,
    backgroundColor: CARD_BACKGROUND,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: CARD_BACKGROUND,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: PRIMARY_PINK,
    marginRight: 10,
  },
  addToCartText: {
    color: PRIMARY_PINK,
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeOrderButton: {
    flex: 1,
    backgroundColor: PRIMARY_PINK,
    padding: 15,
    borderRadius: 15,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
});