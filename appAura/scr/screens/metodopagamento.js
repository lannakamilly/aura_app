import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    ScrollView,
    Platform, 
    TextInput,
    // NOVOS IMPORTS para o Modal e indicadores
    Modal,
    ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// Cores e Tipografia aprimoradas
const PRIMARY_PINK = '#ff86b5'; 
const SOFT_PINK = '#FFF5F8';
const TEXT_COLOR = '#1A202C'; 
const SECONDARY_TEXT_COLOR = '#4A5568';
const BACKGROUND_GREY = '#F7F9FB'; 
const BORDER_COLOR = '#E2E8F0';
const CARD_COLOR = '#663399'; 
const WHITE = '#FFFFFF';

// Componente do Modal de Sucesso de Pagamento
const PaymentSuccessModal = ({ visible, onClose, value, method }) => (
    <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
    >
        <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
                <Ionicons 
                    name="checkmark-circle" 
                    size={60} 
                    color="#4BB543" // Verde de sucesso
                    style={{ marginBottom: 15 }} 
                />
                <Text style={modalStyles.modalTitle}>Pagamento Confirmado!</Text>
                <Text style={modalStyles.modalText}>
                    Seu pedido foi processado com sucesso.
                </Text>
                
                <View style={modalStyles.detailBox}>
                    <Text style={modalStyles.detailLabel}>Valor:</Text>
                    <Text style={modalStyles.detailValue}>R$ {value.toFixed(2)}</Text>
                </View>
                 <View style={modalStyles.detailBox}>
                    <Text style={modalStyles.detailLabel}>Método:</Text>
                    <Text style={modalStyles.detailValue}>{method.toUpperCase()}</Text>
                </View>

                <TouchableOpacity 
                    style={modalStyles.okButton}
                    onPress={onClose}
                >
                    <Text style={modalStyles.okButtonText}>ENTENDI</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

export default function MetodoPagamento({ navigation }) {
    const [selectedMethod, setSelectedMethod] = useState('pix');
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });
    // NOVO ESTADO: Visibilidade do modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    // NOVO ESTADO: Carregamento
    const [isLoading, setIsLoading] = useState(false);


    const totalOrderValue = 420.00; 

    // Componente de Cartão de Crédito Fictício
    const CardDisplay = () => (
        <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
                <Ionicons name="card" size={26} color="#fff" />
                <Text style={styles.cardTypeText}>MASTERCARD</Text>
            </View>
            <Text style={styles.cardNumber}>
                {/* Formatação para Grupos de 4 dígitos */}
                {cardDetails.number.replace(/(\d{4})(?=\d)/g, '$1 ') || '•••• •••• •••• 1234'}
            </Text>
            <View style={styles.cardFooter}>
                <View>
                    <Text style={styles.cardLabel}>Nome do Titular</Text>
                    <Text style={styles.cardValue}>{cardDetails.name || 'Nome no Cartão'}</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.cardLabel}>Validade</Text>
                    <Text style={styles.cardValue}>{cardDetails.expiry || 'MM/AA'}</Text>
                </View>
            </View>
        </View>
    );

    // Nova função para simular o processamento e mostrar o modal
    const handlePayment = () => {
        if (totalOrderValue === 0) {
            alert("Carrinho vazio. Não é possível pagar."); // Mantém o alerta nativo para erro
            return;
        }

        // 1. Inicia o loading
        setIsLoading(true);

        // 2. Simula o tempo de processamento
        setTimeout(() => {
            setIsLoading(false);
            // 3. Mostra o modal de sucesso
            setIsModalVisible(true);
            // navigation.navigate('OrderConfirmation'); // Navegaria após o fechamento do modal
        }, 1500); // 1.5 segundo de "processamento" simulado
    };

    return (
        <View style={styles.outerContainer}>
            
            {/* Modal de Sucesso */}
            <PaymentSuccessModal 
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)} // Fecha o modal
                value={totalOrderValue}
                method={selectedMethod}
            />

            {/* Cabeçalho (mantido) */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={TEXT_COLOR} />
                </TouchableOpacity>
                <Text style={styles.title}>Método de Pagamento</Text> 
                <View style={{width: 24}}/>
            </View>

            <ScrollView 
                style={styles.scrollViewContent} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }} 
            >
                {/* ... Conteúdo mantido ... */}
                <View style={styles.summaryBox}>
                    <Text style={styles.summaryLabel}>Total a Pagar</Text>
                    <Text style={styles.totalValue}>R$ {totalOrderValue.toFixed(2)}</Text>
                </View>

                <Text style={styles.sectionTitle}>Selecione uma Opção</Text>
                
                {/* Opção Pix */}
                <TouchableOpacity 
                    style={[styles.methodCard, selectedMethod === 'pix' && styles.selectedMethod]}
                    onPress={() => setSelectedMethod('pix')}
                >
                    <Ionicons name="scan-circle-outline" size={30} color={selectedMethod === 'pix' ? PRIMARY_PINK : SECONDARY_TEXT_COLOR} />
                    <View style={styles.methodTextGroup}>
                        <Text style={styles.methodName}>Pix</Text>
                        <Text style={styles.methodInfo}>Pagamento instantâneo, confirmação imediata.</Text>
                    </View>
                    <Ionicons name={selectedMethod === 'pix' ? "radio-button-on" : "radio-button-off"} size={22} color={PRIMARY_PINK} />
                </TouchableOpacity>

                {/* Opção Cartão de Crédito */}
                <TouchableOpacity 
                    style={[styles.methodCard, selectedMethod === 'credit' && styles.selectedMethod]}
                    onPress={() => setSelectedMethod('credit')}
                >
                    <Ionicons name="card-outline" size={30} color={selectedMethod === 'credit' ? PRIMARY_PINK : SECONDARY_TEXT_COLOR} />
                    <View style={styles.methodTextGroup}>
                        <Text style={styles.methodName}>Cartão de Crédito</Text>
                        <Text style={styles.methodInfo}>Aceitamos todas as bandeiras.</Text>
                    </View>
                    <Ionicons name={selectedMethod === 'credit' ? "radio-button-on" : "radio-button-off"} size={22} color={PRIMARY_PINK} />
                </TouchableOpacity>
                
                {/* Formulário de Cartão (Condicional) */}
                {selectedMethod === 'credit' && (
                    <View style={styles.cardFormContainer}>
                        <CardDisplay />
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Número do Cartão"
                            placeholderTextColor={SECONDARY_TEXT_COLOR + '80'}
                            keyboardType="numeric"
                            maxLength={16}
                            onChangeText={(text) => setCardDetails({...cardDetails, number: text.replace(/\D/g, '')})}
                            value={cardDetails.number.replace(/(\d{4})(?=\d)/g, '$1 ')}
                        />
                         <TextInput
                            style={styles.input}
                            placeholder="Nome Completo (como no cartão)"
                            placeholderTextColor={SECONDARY_TEXT_COLOR + '80'}
                            onChangeText={(text) => setCardDetails({...cardDetails, name: text.toUpperCase()})}
                            value={cardDetails.name}
                        />
                        <View style={styles.inputRow}>
                            <TextInput
                                style={[styles.input, styles.halfInput]}
                                placeholder="MM/AA"
                                placeholderTextColor={SECONDARY_TEXT_COLOR + '80'}
                                keyboardType="numeric"
                                maxLength={5}
                                onChangeText={(text) => setCardDetails({...cardDetails, expiry: text.replace(/[^0-9/]/g, '')})}
                                value={cardDetails.expiry}
                            />
                            <TextInput
                                style={[styles.input, styles.halfInput]}
                                placeholder="CVV"
                                placeholderTextColor={SECONDARY_TEXT_COLOR + '80'}
                                keyboardType="numeric"
                                secureTextEntry={true}
                                maxLength={3}
                                onChangeText={(text) => setCardDetails({...cardDetails, cvv: text})}
                                value={cardDetails.cvv}
                            />
                        </View>
                    </View>
                )}

                {/* Opção Boleto */}
                <TouchableOpacity 
                    style={[styles.methodCard, selectedMethod === 'boleto' && styles.selectedMethod]}
                    onPress={() => setSelectedMethod('boleto')}
                >
                    <Ionicons name="barcode-outline" size={30} color={selectedMethod === 'boleto' ? PRIMARY_PINK : SECONDARY_TEXT_COLOR} />
                    <View style={styles.methodTextGroup}>
                        <Text style={styles.methodName}>Boleto Bancário</Text>
                        <Text style={styles.methodInfo}>Prazo de até 3 dias úteis para compensação.</Text>
                    </View>
                    <Ionicons name={selectedMethod === 'boleto' ? "radio-button-on" : "radio-button-off"} size={22} color={PRIMARY_PINK} />
                </TouchableOpacity>

            </ScrollView>
            
            {/* Botão Finalizar Pagamento */}
            <View style={styles.footerButtonContainer}>
                <TouchableOpacity 
                    style={styles.paymentButton} 
                    onPress={handlePayment}
                    disabled={isLoading} // Desabilita o botão durante o processamento
                >
                    {isLoading ? (
                        <ActivityIndicator color={WHITE} size="small" />
                    ) : (
                        <Text style={styles.paymentText}>PAGAR R$ {totalOrderValue.toFixed(2)}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Estilos para o Modal
const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro
    },
    modalView: {
        width: '85%',
        backgroundColor: WHITE,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        // Sombra
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    modalTitle: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '900',
        color: TEXT_COLOR,
    },
    modalText: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 16,
        color: SECONDARY_TEXT_COLOR,
    },
    detailBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
    },
    detailLabel: {
        fontSize: 16,
        color: SECONDARY_TEXT_COLOR,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '700',
        color: TEXT_COLOR,
        textTransform: 'uppercase',
    },
    okButton: {
        backgroundColor: PRIMARY_PINK,
        borderRadius: 12,
        padding: 15,
        elevation: 2,
        marginTop: 25,
        width: '100%',
    },
    okButtonText: {
        color: WHITE,
        fontWeight: '800',
        textAlign: 'center',
        fontSize: 16,
    },
});

// Estilos da tela principal (mantidos e aprimorados)
const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: BACKGROUND_GREY,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 50 : 60, 
        paddingBottom: 15,
        backgroundColor: WHITE, 
        borderBottomWidth: 0, 
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    title: {
        color: TEXT_COLOR,
        fontWeight: '900', 
        fontSize: 20,
    },
    scrollViewContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: TEXT_COLOR,
        marginTop: 30,
        marginBottom: 15,
        textTransform: 'uppercase',
    },
    
    // Total Summary
    summaryBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 25,
        backgroundColor: PRIMARY_PINK, 
        borderRadius: 20, 
        marginTop: 15,
        ...Platform.select({
            ios: {
                shadowColor: PRIMARY_PINK,
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    summaryLabel: {
        fontSize: 18,
        fontWeight: '500',
        color: WHITE,
    },
    totalValue: {
        fontSize: 28,
        fontWeight: '900',
        color: WHITE,
    },

    // Method Cards
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: WHITE,
        padding: 20,
        borderRadius: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: BORDER_COLOR,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    selectedMethod: {
        borderColor: PRIMARY_PINK, 
        backgroundColor: SOFT_PINK,
    },
    methodTextGroup: {
        flex: 1,
        marginLeft: 15,
    },
    methodName: {
        fontSize: 17,
        fontWeight: '700',
        color: TEXT_COLOR,
    },
    methodInfo: {
        fontSize: 12,
        fontWeight: '400',
        color: SECONDARY_TEXT_COLOR,
        marginTop: 2,
    },

    // Card Form
    cardFormContainer: {
        padding: 15,
        backgroundColor: WHITE,
        borderRadius: 15,
        marginTop: 5,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: BORDER_COLOR,
    },
    input: {
        backgroundColor: BACKGROUND_GREY,
        borderRadius: 10,
        padding: 15,
        marginTop: 10,
        fontSize: 15,
        color: TEXT_COLOR,
        borderWidth: 1,
        borderColor: BORDER_COLOR,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    halfInput: {
        width: '48%',
        marginTop: 0,
    },

    // Card Display (Fictício)
    cardContainer: {
        backgroundColor: CARD_COLOR, 
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        marginTop: 5,
        shadowColor: CARD_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 35,
    },
    cardTypeText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 18,
    },
    cardNumber: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginBottom: 20,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cardLabel: {
        color: '#ccc',
        fontSize: 11,
        fontWeight: '400',
        marginBottom: 2,
    },
    cardValue: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        textTransform: 'uppercase',
    },

    // Footer Button
    footerButtonContainer: {
        padding: 20,
        paddingBottom: Platform.OS === 'android' ? 20 : 35, 
        backgroundColor: WHITE,
        borderTopWidth: 1,
        borderTopColor: BORDER_COLOR,
    },
    paymentButton: {
        backgroundColor: PRIMARY_PINK,
        borderRadius: 15,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: PRIMARY_PINK,
        shadowOpacity: 0.35,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 10,
    },
    paymentText: {
        color: WHITE,
        fontWeight: '800',
        fontSize: 17, 
        letterSpacing: 1,
    },
});