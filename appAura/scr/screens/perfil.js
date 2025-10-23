import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Modal, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// --- CONFIGURAÇÃO DE ESTILO ---
const { width } = Dimensions.get('window');

const PRIMARY_PINK = '#ff86b5';
const ACCENT_RED = '#DC143C';
const TEXT_COLOR = '#111827';
const SECONDARY_TEXT_COLOR = '#b5b7bbff';
const BACKGROUND_GREY = '#F9FAFB';
const BORDER_COLOR = '#E5E7EB';
const HEADER_COLOR = PRIMARY_PINK; // Usando o rosa vibrante como cor principal do topo

// Dados mockados do usuário
const userData = {
    name: 'Ana Carolina Silva',
    email: 'ana.carol.silva@exemplo.com',
    profileImage: 'https://fly.metroimg.com/upload/q_85,w_700/https://uploads.metroimg.com/wp-content/uploads/2021/10/08145814/adele-13.jpg',
};

// Componente para cada item de menu
const MenuItem = ({ icon, text, color = SECONDARY_TEXT_COLOR, onPress, hasChevron = true }) => (
    <TouchableOpacity
        style={styles.menuItem}
        onPress={onPress}
        activeOpacity={0.7} // Efeito de clique mais suave
    >
        <View style={styles.menuItemLeft}>
            <Ionicons name={icon} size={24} color={color} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: color === ACCENT_RED ? ACCENT_RED : TEXT_COLOR }]}>{text}</Text>
        </View>
        {hasChevron && (
            <Ionicons name="chevron-forward-outline" size={20} color={SECONDARY_TEXT_COLOR} />
        )}
    </TouchableOpacity>
);

// --- COMPONENTE DO MODAL REUTILIZÁVEL (SUBSTITUI O ALERT) ---
const CustomModal = ({ isVisible, onClose, title, content, buttons = [{ text: "Fechar", onPress: onClose }] }) => (
    <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
    >
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={modalStyles.centeredView}>
                <TouchableWithoutFeedback>
                    <View style={modalStyles.modalView}>
                        <Text style={modalStyles.modalTitle}>{title}</Text>
                        <Text style={modalStyles.modalContent}>{content}</Text>
                        <View style={modalStyles.modalButtons}>
                            {buttons.map((button, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[modalStyles.button, index === 0 ? modalStyles.buttonClose : modalStyles.buttonPrimary]}
                                    onPress={button.onPress}
                                >
                                    <Text style={modalStyles.textStyle}>{button.text}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    </Modal>
);

export default function ProfileScreen() {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({});

    // Função para abrir o modal com dados específicos
    const openModal = (title, content, buttons) => {
        setModalData({ title, content, buttons });
        setModalVisible(true);
    };

    // Ações de Modal e Navegação
    const handleAction = (type) => {
        switch (type) {
            case 'Favoritos':
                openModal(
                    "Meus Favoritos",
                    "A lista de produtos que você mais ama! Criei este modal personalizado para deixar a tela de perfil mais elegante.",
                    [{ text: "Fechar", onPress: () => setModalVisible(false), color: TEXT_COLOR }]
                );
                break;

            case 'Idioma':
                openModal(
                    "Escolher Idioma",
                    "Selecione o idioma da aplicação (recurso visual, não funcional).",
                    [
                        { text: "Português", onPress: () => setModalVisible(false) },
                        { text: "Inglês", onPress: () => setModalVisible(false) },
                    ]
                );
                break;

            case 'Sobre':
                openModal(
                    "Sobre o Aplicativo",
                    "Esta é a versão mais profissional do nosso app, dedicada a oferecer uma experiência de compra moderna, intuitiva e segura, com foco total no cliente.",
                    [{ text: "Fechar", onPress: () => setModalVisible(false) }]
                );
                break;

            case 'Termos':
                openModal(
                    "Termos e Condições",
                    "Detalhes importantes sobre o uso dos serviços, direitos e responsabilidades. A leitura é recomendada antes de utilizar a plataforma.",
                    [{ text: "Fechar", onPress: () => setModalVisible(false) }]
                );
                break;

            case 'Privacy':
                openModal(
                    "Política de Privacidade",
                    "Compromisso total com a segurança dos seus dados. Nossa política explica como suas informações são coletadas, usadas e protegidas.",
                    [{ text: "Fechar", onPress: () => setModalVisible(false) }]
                );
                break;

            case 'Logout':
                openModal(
                    "Confirmação de Saída",
                    "Tem certeza de que deseja sair da sua conta? Você será redirecionado para a tela de Login.",
                    [
                        { text: "Cancelar", onPress: () => setModalVisible(false), style: 'cancel' },
                        {
                            text: "Sair",
                            onPress: () => {
                                setModalVisible(false);
                                // Navega para a tela de Login
                                navigation.navigate('Login');
                            },
                            color: ACCENT_RED
                        },
                    ]
                );
                break;

            default:
                break;
        }
    };

    // Lista de itens de menu
    const menuItems = [
        { icon: 'heart', text: 'Meus Favoritos', action: () => handleAction('Favoritos'), color: PRIMARY_PINK },
        { icon: 'language-outline', text: 'Idioma', action: () => handleAction('Idioma') },
        { icon: 'help-circle-outline', text: 'Sobre', action: () => handleAction('Sobre') },
        { icon: 'information-circle-outline', text: 'Termos e Condições', action: () => handleAction('Termos') },
        { icon: 'lock-closed-outline', text: 'Política de Privacidade', action: () => handleAction('Privacy') },
        { icon: 'log-out-outline', text: 'Sair', action: () => handleAction('Logout'), color: ACCENT_RED, hasChevron: false },
    ];

    // Compensação para a barra de navegação flutuante (conforme sua instrução)
    const TAB_NAVIGATION_HEIGHT = 120;

    return (
        <View style={styles.outerContainer}>
            {/* Modal para as descrições e ações */}
            <CustomModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                title={modalData.title}
                content={modalData.content}
                buttons={modalData.buttons}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: TAB_NAVIGATION_HEIGHT }]}>

                {/* CABEÇALHO SIMPLIFICADO E PROFISSIONAL */}
                <View style={styles.headerBackground}>
                    <Text style={styles.headerTitle}>Meu Perfil</Text>
                </View>

                {/* Card principal com as informações do perfil */}
                <View style={styles.profileCard}>

                    {/* Imagem de Perfil com Botão de Edição */}
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ uri: userData.profileImage }}
                            style={styles.profileImage}
                        />
                        <TouchableOpacity style={styles.editButton}>
                            <Ionicons name="pencil-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Nome e Email */}
                    <Text style={styles.userName}>{userData.name}</Text>
                    <Text style={styles.userEmail}>{userData.email}</Text>
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

            </ScrollView>
        </View>
    );
}


// --- ESTILOS PROFISSIONAIS ---

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: BACKGROUND_GREY,
    },

    // A cor de fundo aqui é definida dinamicamente na função
    scrollContent: {},

    // CABEÇALHO (Seção Rosa Vibrante) - Mais limpo e sem botões de navegação
    headerBackground: {
        height: 150, // Altura reduzida para mais elegância
        backgroundColor: HEADER_COLOR,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        justifyContent: 'center', // Centraliza o título
        alignItems: 'center',
        paddingTop: 30,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 15,
    },

    // CARD DO PERFIL
    profileCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 25, // Borda mais suave
        padding: 25,
        alignItems: 'center',

        // Joga o card para cima, sobrepondo o fundo
        marginTop: -70, // Ajuste para subir menos

        // Sombra mais profunda
        shadowColor: PRIMARY_PINK,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
        marginBottom: 30,
    },

    // IMAGEM DE PERFIL E EDIÇÃO
    imageWrapper: {
        marginBottom: 15,
        position: 'relative',
    },
    profileImage: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 4,
        borderColor: PRIMARY_PINK + '50', // Borda levemente rosa
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: PRIMARY_PINK,
        width: 35,
        height: 35,
        borderRadius: 17.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        elevation: 5,
    },

    // NOME E EMAIL
    userName: {
        fontSize: 22,
        fontWeight: '900',
        color: TEXT_COLOR,
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 14,
        color: SECONDARY_TEXT_COLOR,
        fontWeight: '500',
        marginBottom: 10,
    },

    // ITENS DE MENU
    menuContainer: {
        marginHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',

        // Sombra mais suave
        shadowColor: TEXT_COLOR,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 10, // Para o scroll
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15, // Padding ligeiramente menor
        paddingHorizontal: 20,
        borderBottomWidth: 0.5, // Linha mais fina
        borderBottomColor: BORDER_COLOR,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        width: 30,
        opacity: 0.8, // Ícones mais suaves
    },
    menuText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
});

// --- ESTILOS DO MODAL CUSTOMIZADO (ALERTE BONITO) ---
const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro
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
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: width * 0.85,
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 20,
        fontWeight: 'bold',
        color: TEXT_COLOR,
    },
    modalContent: {
        marginBottom: 20,
        textAlign: "center",
        fontSize: 14,
        color: SECONDARY_TEXT_COLOR,
        lineHeight: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonPrimary: {
        backgroundColor: PRIMARY_PINK,
    },
    buttonClose: {
        backgroundColor: BORDER_COLOR,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    }
});