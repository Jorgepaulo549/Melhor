/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'rating' | 'text';
  options?: string[];
}

export interface Survey {
  id: string;
  title: string;
  company: string;
  companyLogoUrl?: string;
  category: 'Telecom' | 'Banca' | 'Alimentação' | 'Retalho' | 'Combustíveis' | 'Geral' | 'Transportes';
  reward: number; // in Kwanza (Kz)
  estimatedTime: string; // e.g. "3 min"
  questions: SurveyQuestion[];
  completed?: boolean;
}

export interface UserProfile {
  name: string;
  phone: string;
  nif: string; // Número de Identificação Fiscal - predominant identifier
  email?: string;
  balance: number;
  completedCount: number;
  qualityScore: number; // percentage (0 - 100)
  isVerified: boolean;
  password?: string; // For password changes & local authentication
}

export interface Transaction {
  id: string;
  amount: number;
  method: 'PayPal' | 'PayPay Angola' | 'IBAN / Multicaixa' | 'RedotPay' | 'Stripe' | 'Airtm';
  target: string; // phone index or IBAN or email
  date: string;
  status: 'Pendente' | 'Processado' | 'Rejeitado';
}

export interface FraudLog {
  id: string;
  timestamp: string;
  surveyTitle: string;
  type: 'Atividade Rápida' | 'Contradição Lógica' | 'Tentativa Duplicada';
  description: string;
  severity: 'Aviso' | 'Grave';
}
