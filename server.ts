import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import emisService from './src/services/emisService.js';
import paypayService from './src/services/paypayService.js';
import paypalService from './src/services/paypalService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCHANGE_RATE_USD_TO_AOA = 930.0;

// In-Memory store for pending wallets, withdrawals, and audit logs
let pendingWallets = [
  {
    id: 'wal-101',
    user_id: 'usr-4421',
    full_name: 'Mateus Manuel',
    email: 'mateus.manuel@gmail.com',
    gateway_type: 'PayPal Express',
    account_identifier: 'mateus.manuel@gmail.com',
    status: 'PENDING',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'wal-102',
    user_id: 'usr-8812',
    full_name: 'Ana Cláudia Silva',
    email: 'ana.silva@coqueiros.ao',
    gateway_type: 'PayPal',
    account_identifier: 'ana.silva.ao@gmail.com',
    status: 'PENDING',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: 'wal-103',
    user_id: 'usr-9012',
    full_name: 'António Agostinho',
    email: 'antonio.agostinho@sapo.ao',
    gateway_type: 'Stripe Direct',
    account_identifier: 'acct_1NJ920412384',
    status: 'PENDING',
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString()
  }
];

let auditLogs: any[] = [
  {
    id: 'aud-001',
    admin_id: 'admin-uuid-001',
    action: 'WALLET_APPROVED',
    target_type: 'WALLET',
    target_id: 'wal-099',
    details: { gateway: 'paypay_ao', account: '923450123', reason: 'Aprovado por conferência de NIF' },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 'aud-002',
    admin_id: 'admin-uuid-001',
    action: 'WALLET_APPROVED',
    target_type: 'WALLET',
    target_id: 'wal-098',
    details: { gateway: 'multicaixa_express', account: 'AO06004000001234567810144', reason: 'Autenticado via EMIS API' },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  }
];

let withdrawalRequests: any[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API ROUTES ---

  // 1. SOLICITAÇÃO DE SAQUE (Móvel / App)
  app.post('/api/v1/withdrawals/request', async (req, res) => {
    try {
      const { userId, walletId, amountUSD, gatewayType, accountIdentifier, beneficiaryName } = req.body;

      if (amountUSD && amountUSD < 2.0) {
        return res.status(400).json({ error: 'O valor mínimo para saque é de $2.00 USD.' });
      }

      const amountAOA = amountUSD ? amountUSD * EXCHANGE_RATE_USD_TO_AOA : (req.body.amountAOA || 1000);
      const gwType = gatewayType || req.body.gateway_type || 'multicaixa_express';
      const withdrawalId = `WTD-${Date.now()}`;

      const instantGateways = [
        'multicaixa_express', 
        'paypay_ao', 
        'paypal', 
        'paypal_express', 
        'Multicaixa Express', 
        'PayPay Angola', 
        'IBAN / Multicaixa',
        'PayPal',
        'PayPal Express'
      ];
      const isInstant = instantGateways.includes(gwType);
      const initialStatus = isInstant ? 'PROCESSING' : 'PENDING';

      withdrawalRequests.push({
        id: withdrawalId,
        user_id: userId || 'user_demo',
        wallet_id: walletId || 'wal_demo',
        amount_usd: amountUSD || 2.0,
        amount_aoa: amountAOA,
        gateway_type: gwType,
        status: initialStatus,
        created_at: new Date().toISOString()
      });

      let payoutResult: any = { success: true };

      if (isInstant) {
        if (gwType === 'multicaixa_express' || gwType === 'IBAN / Multicaixa' || gwType === 'Multicaixa Express') {
          payoutResult = await emisService.sendCreditTransfer({
            transactionId: withdrawalId,
            destinationIban: accountIdentifier || 'AO06004000001234567810144',
            amountAOA,
            beneficiaryName: beneficiaryName || 'Utilizador Angola'
          });
        } else if (gwType === 'paypay_ao' || gwType === 'PayPay Angola') {
          payoutResult = await paypayService.executePayout({
            transactionId: withdrawalId,
            phoneNumber: accountIdentifier || '244923450123',
            amountAOA
          });
        } else if (gwType === 'paypal' || gwType === 'paypal_express' || gwType === 'PayPal' || gwType === 'PayPal Express') {
          payoutResult = await paypalService.executePayout({
            transactionId: withdrawalId,
            paypalEmail: accountIdentifier || 'utilizador@paypal.com',
            amountUSD: amountUSD || (amountAOA / EXCHANGE_RATE_USD_TO_AOA),
            amountAOA
          });
        }
      }

      return res.status(201).json({
        message: isInstant ? 'Saque em processamento automático via gateway instantâneo (EMIS / PayPay / PayPal).' : 'Saque registrado! Aguardando aprovação no painel admin.',
        withdrawalId,
        status: isInstant ? 'COMPLETED' : 'PENDING',
        payoutResult
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // 1B. ENDPOINT DEDICADO DE API PAYPAL
  app.post('/api/v1/paypal/payout', async (req, res) => {
    try {
      const { transactionId, paypalEmail, amountUSD, amountAOA } = req.body;
      if (!paypalEmail || !paypalEmail.includes('@')) {
        return res.status(400).json({ error: 'Por favor, informe um e-mail PayPal válido.' });
      }

      const txId = transactionId || `PP-TX-${Date.now()}`;
      const result = await paypalService.executePayout({
        transactionId: txId,
        paypalEmail,
        amountUSD: amountUSD || 2.0,
        amountAOA: amountAOA || 1860
      });

      if (result.success) {
        return res.json({
          status: 'SUCCESS',
          message: 'Payout do PayPal processado com sucesso!',
          batchHeaderId: result.batchHeaderId,
          details: result
        });
      } else {
        return res.status(400).json({
          status: 'FAILED',
          error: result.error || 'Não foi possível concluir o payout no PayPal.'
        });
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // 2. ENDPOINTS DO PAINEL ADMIN
  app.get('/api/v1/admin/pending-wallets', async (req, res) => {
    try {
      const activePending = pendingWallets.filter(w => w.status === 'PENDING');
      return res.json(activePending);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/v1/admin/wallets/review', async (req, res) => {
    try {
      const { adminId, walletId, status, reason } = req.body;

      const wallet = pendingWallets.find(w => w.id === walletId);
      if (!wallet) {
        return res.status(404).json({ error: 'Carteira não encontrada.' });
      }

      wallet.status = status;

      const log = {
        id: `aud-${Date.now()}`,
        admin_id: adminId || 'admin-uuid-001',
        action: `WALLET_${status}`,
        target_type: 'WALLET',
        target_id: walletId,
        details: {
          gateway: wallet.gateway_type,
          account: wallet.account_identifier,
          user: wallet.full_name,
          reason: reason || (status === 'APPROVED' ? 'Aprovado pelo administrador' : 'Rejeitado por desconformidade')
        },
        created_at: new Date().toISOString()
      };

      auditLogs.unshift(log);

      return res.json({ message: `Carteira ${status === 'APPROVED' ? 'aprovada' : 'rejeitada'} com sucesso.` });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/v1/admin/audit-logs', async (req, res) => {
    try {
      return res.json(auditLogs);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // Seed endpoint to create a test wallet for admin demo
  app.post('/api/v1/admin/seed-pending-wallet', async (req, res) => {
    const { name, gateway, identifier, email } = req.body;
    const newWal = {
      id: `wal-${Date.now()}`,
      user_id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      full_name: name || 'Novo Utilizador Teste',
      email: email || 'utilizador@angola.co.ao',
      gateway_type: gateway || 'PayPal Express',
      account_identifier: identifier || 'utilizador@paypal.com',
      status: 'PENDING',
      created_at: new Date().toISOString()
    };
    pendingWallets.unshift(newWal);
    return res.json({ message: 'Carteira adicionada para análise', wallet: newWal });
  });

  // --- VITE MIDDLEWARE / STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
