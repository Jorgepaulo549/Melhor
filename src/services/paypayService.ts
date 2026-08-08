import axios from 'axios';

export interface PayPayPayoutParams {
  transactionId: string;
  phoneNumber: string;
  amountAOA: number;
}

export interface PayoutResult {
  success: boolean;
  reference?: string;
  rawResponse?: any;
  error?: string;
}

export class PayPayService {
  private baseUrl: string;
  private apiKey: string | undefined;
  private merchantId: string | undefined;

  constructor() {
    this.baseUrl = process.env.PAYPAY_API_URL || 'https://api.paypay.ao/v2';
    this.apiKey = process.env.PAYPAY_API_KEY;
    this.merchantId = process.env.PAYPAY_MERCHANT_ID || 'PAYPAY_ANGOLA_DEMO';
  }

  // Executa a transferência direta para a conta do usuário no PayPay AO
  async executePayout({ transactionId, phoneNumber, amountAOA }: PayPayPayoutParams): Promise<PayoutResult> {
    // Normalização do número de telefone (Garante formato 2449XXXXXXXX)
    const formattedPhone = phoneNumber.replace(/\D/g, '').replace(/^0+/, '');
    const finalPhone = formattedPhone.startsWith('244') ? formattedPhone : `244${formattedPhone}`;

    const payload = {
      merchant_id: this.merchantId,
      out_trade_no: transactionId,
      payee_account: finalPhone,
      amount: amountAOA.toFixed(2),
      currency: 'AOA',
      remark: 'Saque de Pesquisas'
    };

    if (!this.apiKey) {
      console.log('PayPay AO API Key não configurada. Executando simulação de transferência...', payload);
      return {
        success: true,
        reference: `PP-AO-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        rawResponse: { status: 'COMPLETED', code: 'SUCCESS', mode: 'SIMULATION', payload }
      };
    }

    try {
      const response = await axios.post(`${this.baseUrl}/payout/transfer`, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.code === 'SUCCESS' || response.data.status === 'COMPLETED') {
        return {
          success: true,
          reference: response.data.trade_no || response.data.transfer_id,
          rawResponse: response.data
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Transferência rejeitada pelo PayPay AO.'
        };
      }
    } catch (error: any) {
      console.error('Erro na API PayPay AO:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Falha de comunicação com PayPay AO.'
      };
    }
  }
}

export default new PayPayService();
