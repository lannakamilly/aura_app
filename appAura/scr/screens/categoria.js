import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity } from "react-native";

export default function CategoriesScreen() {
  const [search, setSearch] = useState("");

  const categories = [
    {
      id: 1,
      name: "Pele",
      image: "https://i.imgur.com/djG6Wqp.jpg",
    },
    {
      id: 2,
      name: "Maquiagem",
      image: "https://i.imgur.com/Zn8TVfZ.jpg",
    },
    {
      id: 3,
      name: "Cabelo",
      image: "https://i.imgur.com/pX0nzwZ.jpg",
    },
  ];

  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categorias</Text>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Buscar produtos..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {filtered.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#e36aa5",
    paddingVertical: 15,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 25,
    margin: 15,
    paddingHorizontal: 15,
  },
  searchIcon: {
    fontSize: 18,
    color: "#888",
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: 20,
  },
  card: {
    width: 120,
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    margin: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    padding: 10,
  },
});