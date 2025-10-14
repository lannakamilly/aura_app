import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: "https://i.imgur.com/dYcYQ7E.png" }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>Jessica Suarez</Text>
          <Text style={styles.email}>hello@reallygreatsite.com</Text>
        </View>

        <View style={styles.settings}>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.icon}>✏️</Text>
            <Text style={styles.label}>Editar perfil</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Configurações Gerais</Text>

          <TouchableOpacity style={styles.item}>
            <Text style={styles.icon}>❤️</Text>
            <Text style={styles.label}>Meus favoritos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <Text style={styles.icon}>🌐</Text>
            <Text style={styles.label}>Idioma</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <Text style={styles.icon}>ℹ️</Text>
            <Text style={styles.label}>Sobre</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <Text style={styles.icon}>📜</Text>
            <Text style={styles.label}>Termos e Condições</Text>
          </TouchableOpacity>
        </View>
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
  profileSection: {
    alignItems: "center",
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
  email: {
    color: "#666",
    fontSize: 14,
  },
  settings: {
    marginTop: 25,
    paddingHorizontal: 25,
  },
  sectionTitle: {
    color: "#888",
    fontSize: 14,
    textTransform: "uppercase",
    marginVertical: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
});