import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';

export default function CartScreen() {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: 'Óleo de cabelo',
      desc: 'Óleo de cabelo hidratante para cabelos ressecados.',
      price: 150,
      quantity: 1,
      image: 'https://m.media-amazon.com/images/I/51OawpG2RDL._AC_SL1000_.jpg',
    },
    {
      id: 2,
      name: 'Creme hidratante',
      desc: 'Hidratação profunda para cabelos.',
      price: 40,
      quantity: 2,
      image: 'https://m.media-amazon.com/images/I/61E2Jt5WTrL._AC_SL1500_.jpg',
    },
    {
      id: 3,
      name: 'Gel de limpeza',
      desc: 'Limpeza em pele oleosa.',
      price: 60,
      quantity: 1,
      image: 'https://m.media-amazon.com/images/I/61c5H2mUpiL._AC_SL1500_.jpg',
    },
    {
      id: 4,
      name: 'Protetor solar',
      desc: 'Proteção intensa para todos os tipos de pele.',
      price: 70,
      quantity: 1,
      image: 'https://m.media-amazon.com/images/I/71KhBznHjkL._AC_SL1500_.jpg',
    },
    {
      id: 5,
      name: 'Escova de cabelo',
      desc: 'Escova profissional para desembaraçar sem quebrar.',
      price: 20,
      quantity: 1,
      image: 'https://m.media-amazon.com/images/I/61UlMuW1X1L._AC_SL1500_.jpg',
    },
  ]);

  // Atualiza quantidade
  const updateQuantity = (id, type) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          let newQty = type === 'add' ? item.quantity + 1 : item.quantity - 1;
          if (newQty < 1) newQty = 1;
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  // Remove produto
  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.backArrow}>←</Text>
        <Text style={styles.title}>Carrinho</Text>
      </View>

      {/* Itens */}
      {cart.map((item) => (
        <View key={item.id} style={styles.item}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
            <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>

            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Text style={styles.remove}>Remover</Text>
            </TouchableOpacity>

            <View style={styles.qtyContainer}>
              <TouchableOpacity
                onPress={() => updateQuantity(item.id, 'sub')}
                style={styles.qtyButton}
              >
                <Text style={styles.qtyText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.qtyNumber}>{item.quantity}</Text>

              <TouchableOpacity
                onPress={() => updateQuantity(item.id, 'add')}
                style={styles.qtyButton}
              >
                <Text style={styles.qtyText}>＋</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      {/* Informações da compra */}
      <View style={styles.infoBox}>
        <View style={styles.infoHeader}>
          <Text style={styles.infoTitle}>Informação da compra</Text>
          <Text style={styles.infoDots}>•••</Text>
        </View>
        <Text style={styles.infoTotal}>Valor total: <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text></Text>
      </View>

      {/* Botão finalizar */}
      <TouchableOpacity style={styles.finishButton}>
        <Text style={styles.finishText}>FINALIZAR COMPRA</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 20,
  },

  // Cabeçalho
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: '#e38cb7',
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
  backArrow: {
    position: 'absolute',
    left: 20,
    fontSize: 22,
    color: '#fff',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },

  // Itens
  item: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  desc: {
    fontSize: 13,
    color: '#777',
    marginVertical: 2,
  },
  price: {
    fontWeight: 'bold',
    color: '#000',
    marginTop: 3,
  },
  remove: {
    color: '#e38cb7',
    fontSize: 13,
    marginTop: 5,
  },

  // Quantidade
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 15,
    backgroundColor: '#f8d6e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 18,
    color: '#d25b94',
    fontWeight: 'bold',
  },
  qtyNumber: {
    fontSize: 16,
    marginHorizontal: 10,
    fontWeight: '600',
  },

  // Info da compra
  infoBox: {
    backgroundColor: '#ffd2eb',
    borderRadius: 12,
    padding: 15,
    marginTop: 25,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoTitle: {
    fontWeight: 'bold',
    color: '#333',
  },
  infoDots: {
    color: '#555',
  },
  infoTotal: {
    color: '#444',
    fontSize: 15,
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#000',
  },

  // Botão
  finishButton: {
    backgroundColor: '#e38cb7',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  finishText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});