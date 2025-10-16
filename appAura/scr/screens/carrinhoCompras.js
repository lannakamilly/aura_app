import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// Cores para um visual mais premium e moderno
const PRIMARY_PINK = '#ff86b5'; // Rosa mais escuro (Rubi) para destaque
const SOFT_PINK = '#FFF0F5'; // Fundo rosa muito suave
const TEXT_COLOR = '#111827'; // Texto principal quase preto (Dark Grey)
const SECONDARY_TEXT_COLOR = '#6B7280'; // Cinza médio para descrição
const BACKGROUND_GREY = '#F9FAFB'; // Fundo bem claro
const BORDER_COLOR = '#E5E7EB'; // Borda e divisores sutis

export default function CartScreen() {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: 'Ácido Glicólico',
      desc: 'Óleo hidratante para cabelos ressecados.',
      price: 150,
      quantity: 1,
      image: 'https://res.cloudinary.com/beleza-na-web/image/upload/w_1500,f_auto,fl_progressive,q_auto:eco,w_800/v1/imagens/product/E2022020201/2f88ec40-3be3-497a-898c-22b1d9d5d9f5-kit-eudora-siage-cica-therapy-completo-4-produtos.png',
    },
    {
      id: 2,
      name: 'Manteiga Corporal',
      desc: 'Hidratação profunda para cabelos.',
      price: 40,
      quantity: 2,
      image: 'https://acdn-us.mitiendanube.com/stores/004/599/657/products/frutas-4a762a9858af81d12117272424982864-640-0.png',
    },
    {
      id: 3,
      name: 'Leite de Amêndoas',
      desc: 'Limpeza eficaz para pele oleosa.',
      price: 60,
      quantity: 1,
      image: 'https://acdn-us.mitiendanube.com/stores/004/599/657/products/leite-de-amendoas-ac405a9541ac122f4117276692711299-1024-1024.png',
    },
    {
      id: 4,
      name: 'Protetor Solar FPS 50',
      desc: 'Proteção intensa para todos os tipos de pele.',
      price: 70,
      quantity: 1,
      image: 'https://drogariaspacheco.vteximg.com.br/arquivos/ids/1366684-1000-1000/844713---Kit-Eudora-Siage-Nutri-Rose-Shampoo-250ml-+-Condicionador-125ml-+-Leave-In-30ml_0000_Layer-2.png.png?v=638687649630000000',
    },
  ]);

  // Atualiza quantidade
  const updateQuantity = (id, type) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          let newQty = type === 'add' ? item.quantity + 1 : item.quantity - 1;
          // Se a nova quantidade for zero, o item é removido
          if (newQty < 1) {
            return null; // Marca para remoção
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) // Remove os itens marcados como null
    );
  };

  // Remove produto
  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Total
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const frete = 0; // Mantido Frete Grátis
  const total = subtotal + frete; 

  // Componente de Item do Carrinho (refinado)
  const CartItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.itemImage} 
            // fallback para imagem quebrada
            onError={(e) => { 
                console.log('Image failed to load', e.nativeEvent.error);
                e.target.uri = 'https://placehold.co/90x90/DDA0DD/ffffff?text=Produto'; 
            }}
          />
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDesc}>{item.desc}</Text>
        
        {/* Preço Total do Item - Corrigido e destacado */}
        <Text style={styles.itemPriceTotal}>R$ {(item.price * item.quantity).toFixed(2)}</Text>
      </View>
      
      <View style={styles.itemActions}>
        {/* Controle de Quantidade */}
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

        {/* Ícone de Remover */}
        <TouchableOpacity style={styles.removeIcon} onPress={() => removeItem(item.id)}>
          <Ionicons name="trash-outline" size={24} color={SECONDARY_TEXT_COLOR} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.outerContainer}>
        {/* Cabeçalho Limpo e Profissional */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => { /* Navegação de volta */ }}>
                <Ionicons name="arrow-back" size={24} color={TEXT_COLOR} />
            </TouchableOpacity>
            <Text style={styles.title}>Meu Carrinho ({cart.length})</Text> 
            <TouchableOpacity onPress={() => { /* Opções do menu */ }}>
                <Ionicons name="ellipsis-vertical" size={24} color={TEXT_COLOR} />
            </TouchableOpacity>
        </View>

        {/* ScrollView agora contém todos os elementos, incluindo o resumo e o botão */}
        <ScrollView 
            style={styles.scrollViewContent} 
            showsVerticalScrollIndicator={false}
            // Adicionado padding maior no final (30 + espaço livre)
            contentContainerStyle={{ paddingBottom: 150 }} 
        >
            {cart.length > 0 ? (
                cart.map((item) => (
                    <CartItem key={item.id} item={item} />
                ))
            ) : (
                <Text style={styles.emptyCartText}>Seu carrinho está vazio! Adicione alguns produtos.</Text>
            )}
            
            {/* Resumo da Compra */}
            <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>Resumo do Pedido</Text>
                
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal ({cart.length} itens)</Text>
                    <Text style={styles.summaryValue}>R$ {subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Frete</Text>
                    <Text style={styles.summaryValueFree}>Grátis</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={[styles.summaryRow, {marginTop: 10}]}>
                    <Text style={styles.totalLabel}>Total a Pagar</Text>
                    <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
                </View>
            </View>
            
            {/* Botão Principal - Finalizar Compra - AGORA ROLÁVEL */}
            <View style={styles.buttonContainerInsideScroll}>
                <TouchableOpacity style={styles.checkoutButton}>
                    <Text style={styles.checkoutText}>FINALIZAR COMPRA</Text>
                    <Ionicons name="arrow-forward-circle" size={24} color="#fff" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
            </View>
            
            {/* O paddingBottom do ScrollView garante o espaço livre embaixo */}

        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: BACKGROUND_GREY, // Fundo bem claro
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    // O paddingBottom: 150 é definido no contentContainerStyle para dar o espaço livre
  },
  emptyCartText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: SECONDARY_TEXT_COLOR,
    fontWeight: '500',
  },
  
  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50, 
    paddingBottom: 15,
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: BORDER_COLOR,
  },
  title: {
    color: TEXT_COLOR,
    fontWeight: '800',
    fontSize: 20,
  },

  // ITENS DO CARRINHO (CARTÃO)
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20, // Cantos bem arredondados
    padding: 15,
    marginBottom: 15,
    minHeight: 120, 
    
    // Sombra mais suave
    shadowColor: PRIMARY_PINK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, 
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 15,
    marginRight: 15,
    backgroundColor: SOFT_PINK, // Fundo suave para a imagem
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  itemImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain', 
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between', // Distribui os itens verticalmente
    paddingVertical: 5,
  },
  itemName: {
    fontWeight: '700',
    fontSize: 16,
    color: TEXT_COLOR,
  },
  itemDesc: {
    fontSize: 12,
    color: SECONDARY_TEXT_COLOR,
    // Removido margin vertical para apertar um pouco
  },
  // NOVO ESTILO: Preço Total do Item
  itemPriceTotal: {
    fontWeight: '900', 
    color: PRIMARY_PINK, 
    fontSize: 18, // Mais destaque que o nome
  },
  
  // AÇÕES (Quantidade e Remover)
  itemActions: {
    width: 90,
    justifyContent: 'space-between', 
    alignItems: 'flex-end',
  },
  
  // Ícone de Remover
  removeIcon: {
    padding: 5,
  },

  // CONTROLE DE QUANTIDADE
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BORDER_COLOR + '50', // Fundo sutil para o container
    borderRadius: 10,
    overflow: 'hidden',
    height: 35,
    // Alinha à direita no espaço
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
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
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
    color: '#34A853', // Verde para 'Grátis'
  },
  divider: {
    height: 1,
    backgroundColor: BORDER_COLOR,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 22, // Total maior
    fontWeight: '800',
    color: TEXT_COLOR,
  },
  totalValue: {
    fontSize: 22, // Total maior
    fontWeight: '900',
    color: PRIMARY_PINK, 
  },
  
  // BOTÃO DE AÇÃO (DENTRO DO SCROLLVIEW)
  buttonContainerInsideScroll: {
    paddingTop: 30,
    paddingBottom: 20, // O espaço final é controlado pelo contentContainerStyle
    backgroundColor: 'transparent',
  },
  
  // Botão Principal (Finalizar)
  checkoutButton: {
    backgroundColor: PRIMARY_PINK,
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    
    // Sombra premium para destacar o CTA
    shadowColor: PRIMARY_PINK,
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  checkoutText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18, 
    letterSpacing: 0.8,
  },
});
