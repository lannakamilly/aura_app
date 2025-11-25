import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    ScrollView,
    Platform, 
    TextInput,
    Modal,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useRoute } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Não é mais necessário para endereço/usuário
// import { supabase } from './supabase'; // Não é mais necessário para endereço/usuário

// Cores e Tipografia (Mantendo o estilo do seu print)
const PRIMARY_PINK = '#ff86b5'; 
const SOFT_PINK = '#FFF5F8';
const TEXT_COLOR = '#1A202C'; 
const SECONDARY_TEXT_COLOR = '#4A5568';
const BACKGROUND_GREY = '#F7F9FB'; 
const BORDER_COLOR = '#E2E8F0';
const CARD_COLOR = '#663399'; // Roxo do seu cartão
const WHITE = '#FFFFFF';


// ========================================================
// 🎯 ESTILOS AUXILIARES DO MODAL DE SUCESSO
// ========================================================
const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalView: {
        width: '85%',
        backgroundColor: WHITE,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
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
        color: TEXT_COLOR
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
        paddingVertical: 5,
    },
    detailLabel: {
        fontSize: 15,
        color: SECONDARY_TEXT_COLOR,
        fontWeight: '600'
    },
    detailValue: {
        fontSize: 15,
        color: TEXT_COLOR,
        fontWeight: '700'
    },
    okButton: {
        backgroundColor: PRIMARY_PINK,
        borderRadius: 15,
        paddingVertical: 12,
        paddingHorizontal: 30,
        marginTop: 20,
        elevation: 2,
    },
    okButtonText: {
        color: WHITE,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16
    }
});


// ========================================================
// 🎯 COMPONENTE 1: Modal de Sucesso de Pagamento
// ========================================================
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
                    <Text style={modalStyles.detailValue}>R$ {value.toFixed(2).replace('.', ',')}</Text>
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

// ========================================================
// 🎯 COMPONENTE 2: Exibição Fictícia do Cartão
// ========================================================
const CardDisplay = ({ cardDetails }) => (
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
                <Text style={styles.cardValue}>{cardDetails.name || 'NOME NO CARTÃO'}</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.cardLabel}>Validade</Text>
                <Text style={styles.cardValue}>{cardDetails.expiry || 'MM/AA'}</Text>
            </View>
        </View>
    </View>
);

// ========================================================
// 🎯 COMPONENTE PRINCIPAL: MetodoPagamento
// ========================================================
export default function MetodoPagamento({ navigation }) {
    const route = useRoute();
    // Pega o total do carrinho da rota. Se não houver, usa 420.00 como fallback.
    const { orderTotal } = route.params || {}; 

    const [selectedMethod, setSelectedMethod] = useState('pix');
    const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // CUPOM E DESCONTO
    const [cupomCode, setCupomCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0); 
    const [cupomStatus, setCupomStatus] = useState(null); // 'valid', 'invalid', null

    // Valores calculados
    const totalOrderValue = orderTotal !== undefined ? orderTotal : 420.00; 
    const finalValue = totalOrderValue - discountAmount;

    // --- LÓGICA DO CUPOM ---
    const applyCoupon = () => {
        const CUPOM_VALIDO = 'AURA21';
        const DISCOUNT_PERCENTAGE = 0.10; // 10%
        
        if (cupomCode.toUpperCase() === CUPOM_VALIDO) {
            const discount = totalOrderValue * DISCOUNT_PERCENTAGE;
            setDiscountAmount(discount);
            setCupomStatus('valid');
            Alert.alert("Cupom Aplicado", `Você recebeu 10% de desconto! (R$ ${discount.toFixed(2).replace('.', ',')})`);
        } else {
            setDiscountAmount(0);
            setCupomStatus('invalid');
            Alert.alert("Cupom Inválido", "O cupom inserido não é válido ou expirou.");
        }
    };

    // --- LÓGICA DE PAGAMENTO (Simulação) ---
    const handlePayment = () => {
        // Simulação de validação de cartão
        if (selectedMethod === 'credit' && cardDetails.number.replace(/\s/g, '').length !== 16) {
             Alert.alert("Cartão Inválido", "Preencha os 16 dígitos do cartão corretamente.");
             return;
        }

        setIsLoading(true);

        // Simulação de delay de processamento
        setTimeout(() => {
            setIsLoading(false);
            // 🚨 Aqui você chamaria sua API de pagamento real e depois setaria o modal!
            setIsModalVisible(true);
        }, 1500); 
    };

    return (
        <View style={styles.outerContainer}>
            
            <PaymentSuccessModal 
                visible={isModalVisible}
                onClose={() => {
                    setIsModalVisible(false);
                    // Aqui você navegaria para a confirmação do pedido (ex: 'OrderConfirmation'); 
                    // navigation.navigate('OrderConfirmation', { orderValue: finalValue }); 
                }}
                value={finalValue}
                method={selectedMethod}
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={TEXT_COLOR} />
                </TouchableOpacity>
                <Text style={styles.title}>Finalizar Pedido</Text> 
                <View style={{width: 24}}/>
            </View>

            <ScrollView 
                style={styles.scrollViewContent} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }} 
            >
                
                {/* ❌ REMOVIDO: SEÇÃO DE ENDEREÇO */}
                {/* ❌ REMOVIDO: AVISO SOBRE ENDEREÇO */}


                {/* --- SEÇÃO DE CUPOM --- */}
                <Text style={styles.sectionTitle}>Cupom de Desconto</Text>
                <View style={styles.couponContainer}>
                    <TextInput
                        style={[
                            styles.input, 
                            { 
                                flex: 1, 
                                marginBottom: 0, 
                                borderColor: cupomStatus === 'valid' ? '#4BB543' : cupomStatus === 'invalid' ? 'red' : BORDER_COLOR 
                            }
                        ]}
                        placeholder="Digite seu código (AURA21)"
                        placeholderTextColor={SECONDARY_TEXT_COLOR + '80'}
                        onChangeText={setCupomCode}
                        value={cupomCode}
                        autoCapitalize="characters"
                    />
                    <TouchableOpacity 
                        style={styles.couponButton}
                        onPress={applyCoupon}
                        disabled={cupomStatus === 'valid'}
                    >
                        <Text style={styles.couponButtonText}>{cupomStatus === 'valid' ? 'Aplicado' : 'Aplicar'}</Text>
                    </TouchableOpacity>
                </View>
                {cupomStatus === 'valid' && <Text style={styles.cupomSuccessText}>Cupom **AURA21** aplicado! R$ {discountAmount.toFixed(2).replace('.', ',')} de desconto.</Text>}
                {cupomStatus === 'invalid' && <Text style={styles.cupomErrorText}>Cupom inválido ou expirado.</Text>}
                
                
                {/* --- SEÇÃO DE PAGAMENTO --- */}
                <Text style={styles.sectionTitle}>Método de Pagamento</Text>
                
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
                        <CardDisplay cardDetails={cardDetails} />
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Número do Cartão"
                            placeholderTextColor={SECONDARY_TEXT_COLOR + '80'}
                            keyboardType="numeric"
                            maxLength={19} // 16 dígitos + 3 espaços
                            onChangeText={(text) => {
                                const cleanedText = text.replace(/\D/g, '');
                                let formattedText = '';
                                for (let i = 0; i < cleanedText.length; i++) {
                                    if (i > 0 && i % 4 === 0) {
                                        formattedText += ' ';
                                    }
                                    formattedText += cleanedText[i];
                                }
                                setCardDetails({...cardDetails, number: formattedText});
                            }}
                            value={cardDetails.number}
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
                                onChangeText={(text) => {
                                    const cleanedText = text.replace(/[^0-9]/g, '');
                                    let formattedText = cleanedText;
                                    if (cleanedText.length > 2) {
                                        formattedText = cleanedText.substring(0, 2) + '/' + cleanedText.substring(2, 4);
                                    }
                                    setCardDetails({...cardDetails, expiry: formattedText});
                                }}
                                value={cardDetails.expiry}
                            />
                            <TextInput
                                style={[styles.input, styles.halfInput]}
                                placeholder="CVV"
                                placeholderTextColor={SECONDARY_TEXT_COLOR + '80'}
                                keyboardType="numeric"
                                secureTextEntry={true}
                                maxLength={3}
                                onChangeText={(text) => setCardDetails({...cardDetails, cvv: text.replace(/\D/g, '')})}
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

                {/* --- RESUMO DO PEDIDO COM DESCONTO --- */}
                <Text style={styles.sectionTitle}>Resumo</Text>
                <View style={styles.summaryBoxFinal}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>R$ {totalOrderValue.toFixed(2).replace('.', ',')}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, discountAmount > 0 && { color: '#4BB543', fontWeight: 'bold' }]}>
                            Desconto ({cupomStatus === 'valid' ? cupomCode.toUpperCase() : 'Nenhum'})
                        </Text>
                        <Text style={[styles.summaryValue, discountAmount > 0 && { color: '#4BB543', fontWeight: 'bold' }]}>
                            - R$ {discountAmount.toFixed(2).replace('.', ',')}
                        </Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabelTotal}>Total a Pagar</Text>
                        <Text style={styles.summaryValueTotal}>R$ {finalValue.toFixed(2).replace('.', ',')}</Text>
                    </View>
                </View>

            </ScrollView>
            
            {/* Botão Finalizar Pagamento - MOVIDO PARA O FOOTER FIXO (Corrigido) */}
            <View style={styles.footerButtonContainer}>
                <TouchableOpacity 
                    style={styles.paymentButton} 
                    onPress={handlePayment}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color={WHITE} size="small" />
                    ) : (
                        <Text style={styles.paymentText}>PAGAR R$ {finalValue.toFixed(2).replace('.', ',')}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ========================================================
// 🎯 ESTILOS DO COMPONENTE PRINCIPAL
// ========================================================
const styles = StyleSheet.create({
    // --- Gerais ---
    outerContainer: {
        flex: 1,
        backgroundColor: BACKGROUND_GREY,
    },
    scrollViewContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 20, 
        paddingBottom: 15,
        backgroundColor: WHITE,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: TEXT_COLOR,
    },
    backButton: {
        padding: 5,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: TEXT_COLOR,
        marginTop: 25,
        marginBottom: 10,
    },

    // --- Cupom ---
    couponContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    couponButton: {
        backgroundColor: PRIMARY_PINK,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginLeft: 10,
        justifyContent: 'center',
        height: 50, // Alinha com o input
    },
    couponButtonText: {
        color: WHITE,
        fontWeight: '700',
        fontSize: 14,
    },
    cupomSuccessText: {
        color: '#4BB543',
        marginTop: -5,
        marginBottom: 10,
        marginLeft: 5,
        fontSize: 13,
        fontWeight: '600',
    },
    cupomErrorText: {
        color: 'red',
        marginTop: -5,
        marginBottom: 10,
        marginLeft: 5,
        fontSize: 13,
        fontWeight: '600',
    },

    // --- Métodos de Pagamento ---
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: WHITE,
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: BORDER_COLOR,
        marginBottom: 10,
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
        fontSize: 16,
        fontWeight: '700',
        color: TEXT_COLOR,
    },
    methodInfo: {
        fontSize: 13,
        color: SECONDARY_TEXT_COLOR,
    },

    // --- Cartão de Crédito (Design Antes) ---
    cardFormContainer: {
        backgroundColor: WHITE,
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: BORDER_COLOR,
    },
    cardContainer: {
        backgroundColor: CARD_COLOR, // Cor roxa original
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    cardTypeText: {
        color: WHITE,
        fontSize: 14,
        fontWeight: 'bold',
    },
    cardNumber: {
        color: WHITE,
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 20,
        textAlign: 'center',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardLabel: {
        color: WHITE + '80',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    cardValue: {
        color: WHITE,
        fontSize: 14,
        fontWeight: '600',
    },
    
    // --- Inputs e Linhas de Formulário ---
    input: {
        height: 50,
        backgroundColor: BACKGROUND_GREY,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 15,
        color: TEXT_COLOR,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: BORDER_COLOR,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
        marginBottom: 15,
    },


    // --- Resumo (Final) ---
    summaryBoxFinal: {
        backgroundColor: WHITE,
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    summaryLabel: {
        fontSize: 15,
        color: SECONDARY_TEXT_COLOR,
    },
    summaryValue: {
        fontSize: 15,
        fontWeight: '600',
        color: TEXT_COLOR,
    },
    summaryDivider: {
        height: 1,
        backgroundColor: BORDER_COLOR,
        marginVertical: 10,
    },
    summaryLabelTotal: {
        fontSize: 18,
        fontWeight: '800',
        color: TEXT_COLOR,
    },
    summaryValueTotal: {
        fontSize: 18,
        fontWeight: '800',
        color: PRIMARY_PINK,
    },

    // --- Footer Fixo com Botão PAGAR ---
    footerButtonContainer: {
        backgroundColor: WHITE,
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: Platform.OS === 'ios' ? 35 : 15, 
        borderTopWidth: 1,
        borderTopColor: BORDER_COLOR,
    },
    paymentButton: {
        backgroundColor: PRIMARY_PINK,
        borderRadius: 15,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: PRIMARY_PINK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    paymentText: {
        color: WHITE,
        fontSize: 18,
        fontWeight: '900',
    }
});