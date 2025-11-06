import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
// useNavigation foi removido pois a funcionalidade de "voltar" foi eliminada
// import { useNavigation } from '@react-navigation/native'; 

// --- CONFIGURAÇÃO DE ESTILO E CORES ---
const { width } = Dimensions.get('window');

const PRIMARY_PINK = '#ff86b5';
const ACCENT_RED = '#DC143C';
const TEXT_COLOR = '#111827';
const SECONDARY_TEXT_COLOR = '#808080ff';
const BACKGROUND_GREY = '#F9FAFB';
const BORDER_COLOR = '#E5E7EB';

// --- DADOS MOCKADOS DAS NOTIFICAÇÕES ---
const notificationsData = [
    {
        id: '1',
        type: 'Compra',
        title: 'Pedido Enviado! 🚚',
        message: 'Seu pedido #P00456 já está a caminho. Previsão de entrega em 3 dias úteis. Acompanhe o rastreio!',
        time: '2 horas atrás',
        icon: 'cube-outline',
        color: '#3498db',
        read: false,
    },
    {
        id: '2',
        type: 'Novidade',
        title: 'MEGA SALE DE INVERNO! ❄️',
        message: 'Descontos de até 70% em toda a coleção. Aproveite as ofertas mais quentes do ano!',
        time: '4 horas atrás',
        icon: 'pricetags-outline',
        color: PRIMARY_PINK,
        read: false,
    },
    {
        id: '3',
        type: 'Compra',
        title: 'Pagamento Confirmado ✅',
        message: 'O pagamento do pedido #P00455 foi confirmado com sucesso. Estamos preparando o envio.',
        time: 'Ontem',
        icon: 'wallet-outline',
        color: '#2ecc71',
        read: true,
    },
    {
        id: '4',
        type: 'Novidade',
        title: 'Novos Produtos Chegando! ✨',
        message: 'Confira as últimas novidades em maquiagem e cuidados com a pele. Edição limitada!',
        time: '2 dias atrás',
        icon: 'sparkles-outline',
        color: '#f1c40f',
        read: true,
    },
    {
        id: '5',
        type: 'Sistema',
        title: 'Atualização Importante 🚀',
        message: 'Temos novas funcionalidades e melhorias de performance. Atualize seu app agora!',
        time: '1 semana atrás',
        icon: 'cog-outline',
        color: SECONDARY_TEXT_COLOR,
        read: true,
    },
];

// --- COMPONENTE DO ITEM DA NOTIFICAÇÃO (Card Aprimorado) ---
const NotificationItem = ({ item, onPress }) => (
    <TouchableOpacity
        style={[
            styles.notificationCard,
            !item.read && styles.unreadCard // Estilo de card não lido
        ]}
        onPress={onPress}
        activeOpacity={0.85}
    >
        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
            <Ionicons name={item.icon} size={28} color={item.color} />
        </View>
        <View style={styles.contentContainer}>
            <View style={styles.titleRow}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                {/* Ponto de notificação não lida */}
                {!item.read && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.itemMessage} numberOfLines={2}>{item.message}</Text>
            <Text style={styles.itemTime}>{item.time}</Text>
        </View>
    </TouchableOpacity>
);

// --- TELA PRINCIPAL DE NOTIFICAÇÕES ---
export default function NotificationsScreen() {
    // const navigation = useNavigation(); // Não é mais necessário

    const handleNotificationPress = (notification) => {
        console.log(`Notificação clicada: ${notification.title}`);
        alert(`Ação: Ver detalhes de ${notification.title}`);
    };
    
    // Header Simples e Focado na Ação
    const ListHeader = () => (
        <View style={styles.listHeader}>
            
            <TouchableOpacity 
                style={styles.markAllReadButton}
                onPress={() => alert('Todas as notificações foram marcadas como lidas!')}
            >
                <Ionicons name="checkmark-circle-outline" size={25} color={PRIMARY_PINK} />
                <Text style={styles.markAllReadText}>Marcar Lidas</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header Vazio, apenas para a margem da status bar (sem seta de voltar) */}
            <View style={styles.header} /> 

            <FlatList
                data={notificationsData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <NotificationItem 
                        item={item} 
                        onPress={() => handleNotificationPress(item)} 
                    />
                )}
                ListHeaderComponent={ListHeader}
                // Aplica margem lateral e padding inferior (compensação da tab bar)
                contentContainerStyle={styles.listContainer} 
                showsVerticalScrollIndicator={false}
                
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="notifications-off-outline" size={80} color={SECONDARY_TEXT_COLOR + '50'} />
                        <Text style={styles.emptyText}>Você está em dia! Nenhuma notificação nova por enquanto.</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

// --- ESTILOS PROFISSIONAIS E CLEAN ---

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: BACKGROUND_GREY,
    },
    // Header para dar espaço à Status Bar, sem conteúdo
    header: {
        height: 10, 
        backgroundColor: 'transparent',
    },
    
    // Container da lista e compensação para a tab bar
    listContainer: {
        paddingHorizontal: 0, 
        paddingBottom: 120, // Mantendo a compensação de 120 para o tab navigation
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10, // Menor padding top para subir o título
        paddingBottom: 25, // Maior padding bottom para separar os cards
        backgroundColor: BACKGROUND_GREY, 
    },
    listHeaderTitle: {
        fontSize: 32, // Título super destacado
        fontWeight: '900', // Ultra Bold
        color: TEXT_COLOR,
    },
    markAllReadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderRadius: 8,
    },
    markAllReadText: {
        fontSize: 30,
        color: PRIMARY_PINK,
        fontWeight: '700',
        marginLeft: 4,
    },
    
    // O Card de Notificação (Mais limpo e com mais margem)
    notificationCard: {
        flexDirection: 'row',
        marginHorizontal: 20, // Aumenta a margem lateral
        marginVertical: 6, // Reduz o espaçamento entre eles
        padding: 18, // Aumenta o padding interno
        backgroundColor: '#fff',
        borderRadius: 18, // Bordas suaves
        alignItems: 'flex-start',
        
        // Sombra sutil
        shadowColor: TEXT_COLOR,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },
    // Destaque para Notificação Não Lida
    unreadCard: {
        backgroundColor: '#fff', // Mantém o fundo branco para minimalismo
        borderLeftWidth: 4,
        borderLeftColor: PRIMARY_PINK, // A barra lateral é mantida para forte destaque profissional
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: PRIMARY_PINK, // Ponto de destaque na cor principal
        marginLeft: 8,
    },
    iconContainer: {
        width: 48, 
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        // Cor de fundo mais transparente
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    itemTitle: {
        fontSize: 18, // Título ligeiramente maior
        fontWeight: '900', 
        color: TEXT_COLOR,
        flexShrink: 1,
    },
    itemMessage: {
        fontSize: 14,
        color: SECONDARY_TEXT_COLOR, 
        lineHeight: 20,
        marginBottom: 4,
    },
    itemTime: {
        fontSize: 12,
        color: SECONDARY_TEXT_COLOR + '90',
        fontWeight: '500',
        alignSelf: 'flex-end', // Joga o tempo para o canto
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 50,
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: SECONDARY_TEXT_COLOR,
        marginTop: 15,
        textAlign: 'center',
    }
});