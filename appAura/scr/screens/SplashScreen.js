import React from "react";
import { View, Image, StyleSheet } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      {/* Imagem de fundo que cobre toda a tela */}
      <Image
        source={require("../assets/splash.jpg")}  // Substitua pelo caminho da sua imagem de fundo
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Logo sobreposta à imagem de fundo */}
      <Image
        source={require("../assets/logopng.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",  // Centraliza a logo verticalmente
    alignItems: "center",      // Centraliza a logo horizontalmente
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    // Isso faz a imagem cobrir toda a tela de forma bonita
  },
  logo: {
    width: 250,  // Aumentei um pouco o tamanho para ficar mais visível e bonito
    height: 250,
    shadowColor: "#000",  // Adiciona uma sombra para dar destaque
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.8,
    // shadowRadius: 1,
    // elevation: 5,  // Para Android, adiciona elevação para sombra
  },
});
