import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// Cores baseadas no Carrinho
const PRIMARY_PINK = '#ff86b5'; // Rosa escuro (usado no botão/destaques)
const SECONDARY_BLUE = '#ff86b5'; // Azul Marinho escuro para o cabeçalho
const ACCENT_RED = '#DC143C'; // Vermelho para "Sair" (Logout)
const TEXT_COLOR = '#111827'; 
const SECONDARY_TEXT_COLOR = '#6B7280'; // Cinza para a maioria dos ícones de menu
const BACKGROUND_GREY = '#F9FAFB'; 
const BORDER_COLOR = '#E5E7EB'; 

// Dados mockados do usuário
const userData = {
  name: 'Ana Carolina Silva',
  email: 'ana.carol.silva@exemplo.com',
  transactionCount: 4,
  profileImage: 'https://fly.metroimg.com/upload/q_85,w_700/https://uploads.metroimg.com/wp-content/uploads/2021/10/08145814/adele-13.jpg', // Placeholder light blue/black text
};

// Componente para cada item de menu
const MenuItem = ({ icon, text, color = SECONDARY_TEXT_COLOR, onPress, hasChevron = true }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuItemLeft}>
            {/* Ícone com cor personalizada */}
            <Ionicons name={icon} size={24} color={color} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: TEXT_COLOR }]}>{text}</Text>
        </View>
        {hasChevron && (
            <Ionicons name="chevron-forward-outline" size={20} color={SECONDARY_TEXT_COLOR} />
        )}
    </TouchableOpacity>
);


export default function ProfileScreen() {
    
    // Lista de itens de menu (Atualizada conforme a nova imagem)
    const menuItems = [
        // Novo item: Meus Favoritos (destacado em rosa)
        { icon: 'heart', text: 'Meus Favoritos', action: () => console.log('Favorites'), color: PRIMARY_PINK },
        
        // Novo item: Idioma (usando ícone global)
        { icon: 'language-outline', text: 'Idioma', action: () => console.log('Language') }, 
        
        // Novo item: Sobre
        { icon: 'help-circle-outline', text: 'Sobre', action: () => console.log('About') }, 
        
        // Novo item: Termos e Condições
        { icon: 'information-circle-outline', text: 'Termos e Condições', action: () => console.log('Terms') },
        
        // Novo item: Política de Privacidade
        { icon: 'lock-closed-outline', text: 'Política de Privacidade', action: () => console.log('Privacy') }, 

        // Item Sair (Logout) - Mantido em vermelho
        { icon: 'log-out-outline', text: 'Sair', action: () => console.log('Logout'), color: ACCENT_RED, hasChevron: false },
    ];

    return (
        <View style={styles.outerContainer}>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Cabeçalho superior azul, conforme a imagem de referência */}
                <View style={styles.headerBackground}>
                    {/* Botões do topo (Voltar e Mais Opções) */}
                    <View style={styles.headerButtons}>
                        <TouchableOpacity onPress={() => { /* Voltar */ }}>
                            <Ionicons name="arrow-back" size={28} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { /* Opções */ }}>
                            <Ionicons name="ellipsis-vertical" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Card principal com as informações do perfil */}
                <View style={styles.profileCard}>
                    
                    {/* Imagem de Perfil com Botão de Edição */}
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ uri: userData.profileImage }}
                            style={styles.profileImage}
                        />
                        {/* Botão de Edição na imagem */}
                        <TouchableOpacity style={styles.editButton}>
                            <Ionicons name="pencil-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Nome e Email */}
                    <Text style={styles.userName}>{userData.name}</Text>
                    <View style={styles.emailContainer}>
                        <Text style={styles.userEmail}>{userData.email}</Text>
                    </View>

                    {/* Transações Ativas REMOVIDAS, conforme solicitado */}
                    {/* <TouchableOpacity style={styles.transactionLink}>
                        ...
                    </TouchableOpacity> */}
                </View>

                {/* Área de Itens de Menu */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <MenuItem 
                            key={index} 
                            icon={item.icon} 
                            text={item.text} 
                            color={item.color} 
                            hasChevron={item.hasChevron}
                            onPress={item.action} 
                        />
                    ))}
                </View>

                {/* Espaço Vazio para garantir que o menu role */}
                <View style={{ height: 100 }} />

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: BACKGROUND_GREY, 
    },
    scrollContent: {
        paddingBottom: 20,
    },

    // CABEÇALHO (Seção Azul Marinho)
    headerBackground: {
        height: 200, // Altura do topo azul
        backgroundColor: SECONDARY_BLUE,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        paddingHorizontal: 20,
        paddingTop: 50, 
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    // CARD DO PERFIL
    profileCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        
        // Joga o card para cima, sobrepondo o fundo azul
        marginTop: -100, 

        // Sombra suave e profissional
        shadowColor: TEXT_COLOR,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1, 
        shadowRadius: 15,
        elevation: 5,
        marginBottom: 30,
    },
    
    // IMAGEM DE PERFIL E EDIÇÃO
    imageWrapper: {
        marginBottom: 15,
        position: 'relative',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: BACKGROUND_GREY, // Borda externa clara
    },
    editButton: {
        position: 'absolute',
        bottom: 5,
        right: 0,
        backgroundColor: PRIMARY_PINK,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        elevation: 5,
    },
    
    // NOME E EMAIL
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: TEXT_COLOR,
        marginBottom: 5,
    },
    emailContainer: {
        backgroundColor: BORDER_COLOR + '50', // Fundo sutil
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10,
        marginBottom: 20,
    },
    userEmail: {
        fontSize: 14,
        color: SECONDARY_TEXT_COLOR,
        fontWeight: '500',
    },

    // Transações REMOVIDAS. Estilos mantidos para referência, mas não são usados:
    /*
    transactionLink: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: PRIMARY_PINK + '10', 
        borderWidth: 1,
        borderColor: PRIMARY_PINK + '30',
        width: '100%',
        justifyContent: 'space-between',
    },
    transactionText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        fontWeight: '600',
        color: TEXT_COLOR,
    },
    */

    // ITENS DE MENU
    menuContainer: {
        marginHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden', 
        
        // Sombra suave e profissional
        shadowColor: TEXT_COLOR,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05, 
        shadowRadius: 10,
        elevation: 3,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        width: 30, // Garante que todos os ícones fiquem alinhados
    },
    menuText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
        color: TEXT_COLOR, // Garantir que o texto seja sempre escuro
    },
});
