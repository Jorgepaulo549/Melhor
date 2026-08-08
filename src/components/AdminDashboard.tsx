import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Shield, CreditCard, FileText, AlertCircle, Plus, RefreshCw } from 'lucide-react';

export interface PendingWallet {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  gateway_type: string;
  account_identifier: string;
  status: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id: string;
  details: any;
  created_at: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'wallets' | 'logs'>('wallets');
  const [pendingWallets, setPendingWallets] = useState<PendingWallet[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<PendingWallet | null>(null);
  const [showSeedModal, setShowSeedModal] = useState(false);

  // Seed form state
  const [seedName, setSeedName] = useState('Nzinga Mbandi');
  const [seedGateway, setSeedGateway] = useState('PayPal');
  const [seedIdentifier, setSeedIdentifier] = useState('nzinga@paypal.com');

  const adminId = "admin-uuid-001"; // ID do admin autenticado

  useEffect(() => {
    if (activeTab === 'wallets') fetchPendingWallets();
    if (activeTab === 'logs') fetchAuditLogs();
  }, [activeTab]);

  const fetchPendingWallets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/pending-wallets');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPendingWallets(data);
      }
    } catch (err) {
      console.error("Erro ao carregar carteiras:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/audit-logs');
      const data = await res.json();
      if (Array.isArray(data)) {
        setAuditLogs(data);
      }
    } catch (err) {
      console.error("Erro ao carregar logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (walletId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch('/api/v1/admin/wallets/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId,
          walletId,
          status,
          reason: status === 'REJECTED' ? (rejectionReason || 'Dados em desconformidade') : 'Aprovado pelo administrador'
        })
      });

      if (response.ok) {
        setPendingWallets(prev => prev.filter(w => w.id !== walletId));
        setSelectedWallet(null);
        setRejectionReason('');
        // Refresh logs if in background
        fetchAuditLogs();
      } else {
        alert("Erro ao processar ação.");
      }
    } catch (err) {
      alert("Erro de conexão ao processar ação.");
    }
  };

  const handleCreateSeedWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/seed-pending-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: seedName,
          gateway: seedGateway,
          identifier: seedIdentifier,
          email: `${seedName.toLowerCase().replace(/\s+/g, '.')}@angola.co.ao`
        })
      });
      if (res.ok) {
        setShowSeedModal(false);
        fetchPendingWallets();
      }
    } catch (err) {
      console.error("Erro ao criar carteira teste:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-8 font-sans">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Painel de Controlo Financeiro</h1>
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-mono font-bold border border-indigo-200">EMIS / PayPay AO</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Gestão de Carteiras Manuais, Liquidações e Logs de Auditoria</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSeedModal(true)}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Plus size={16} />
            Nova Solicitação Teste
          </button>
          
          <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-xl font-medium text-sm">
            <Shield size={18} />
            <span className="font-mono font-bold text-xs uppercase tracking-wider">Modo Administrador</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setActiveTab('wallets')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'wallets'
              ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard size={18} />
          Carteiras Pendentes ({pendingWallets.length})
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText size={18} />
          Logs de Auditoria ({auditLogs.length})
        </button>

        <button
          onClick={() => activeTab === 'wallets' ? fetchPendingWallets() : fetchAuditLogs()}
          className="ml-auto flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-600 p-2.5 rounded-xl border border-slate-200 text-xs transition cursor-pointer"
          title="Atualizar dados"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin text-indigo-600' : ''} />
        </button>
      </div>

      {/* Conteúdo Principal: Carteiras Pendentes */}
      {activeTab === 'wallets' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Carteiras Internacionais / Manuais Aguardando Análise</h2>
              <p className="text-xs text-slate-500 mt-0.5">Análise de conformidade e liberação de levantamento manual.</p>
            </div>
            <span className="text-xs text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 font-mono">
              * Multicaixa Express, PayPay AO e Kwik são liquidados instantaneamente via API.
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 flex justify-center items-center gap-2">
              <RefreshCw className="animate-spin text-indigo-600" size={20} />
              <span>A carregar solicitações de carteira...</span>
            </div>
          ) : pendingWallets.length === 0 ? (
            <div className="p-16 text-center text-slate-500 space-y-3">
              <CheckCircle className="mx-auto h-12 w-12 text-emerald-500/60" />
              <p className="text-slate-800 font-semibold">Nenhuma carteira pendente para análise no momento.</p>
              <p className="text-xs text-slate-500">Todas as carteiras foram auditadas e processadas pela equipa financeira.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 font-mono">
                    <th className="p-4">Usuário / Titular</th>
                    <th className="p-4">Gateway</th>
                    <th className="p-4">Identificador / Conta</th>
                    <th className="p-4">Data da Solicitação</th>
                    <th className="p-4 text-center">Ações de Decisão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {pendingWallets.map((wallet) => (
                    <tr key={wallet.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">{wallet.full_name}</div>
                        <div className="text-xs text-slate-500 font-mono">{wallet.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                          {wallet.gateway_type}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-indigo-600">{wallet.account_identifier}</td>
                      <td className="p-4 text-slate-500 text-xs font-mono">
                        {new Date(wallet.created_at).toLocaleString('pt-PT')}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleReview(wallet.id, 'APPROVED')}
                            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            <CheckCircle size={15} /> Aprovar
                          </button>
                          <button
                            onClick={() => setSelectedWallet(wallet)}
                            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            <XCircle size={15} /> Rejeitar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal de Motivo da Rejeição */}
      {selectedWallet && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 border-b border-slate-100 pb-3">
              <AlertCircle size={22} />
              <h3 className="text-lg font-bold text-slate-900">Motivo do Indeferimento</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Informe a razão do indeferimento para a carteira (<span className="text-indigo-600 font-bold">{selectedWallet.gateway_type}</span>) do utilizador{' '}
              <strong className="text-slate-900">{selectedWallet.full_name}</strong>.
            </p>

            <textarea
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:border-rose-500 focus:outline-none placeholder:text-slate-400 font-sans"
              rows={3}
              placeholder="Ex: Formato do e-mail incorreto ou dados não correspondem ao NIF cadastrado."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedWallet(null)}
                className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleReview(selectedWallet.id, 'REJECTED')}
                className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition shadow-sm cursor-pointer"
              >
                Confirmar Rejeição
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Seed Nova Carteira Teste */}
      {showSeedModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateSeedWallet} className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Simular Pedido de Carteira Manual</h3>
            
            <div>
              <label className="block text-xs font-mono text-slate-600 mb-1">Nome Completo do Utilizador</label>
              <input
                type="text"
                required
                value={seedName}
                onChange={e => setSeedName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-600 mb-1">Tipo de Gateway / Carteira</label>
              <select
                value={seedGateway}
                onChange={e => setSeedGateway(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800"
              >
                <option value="PayPal">PayPal (Global Payout)</option>
                <option value="PayPay Angola">PayPay Angola</option>
                <option value="IBAN / Multicaixa">IBAN / Multicaixa (EMIS)</option>
                <option value="RedotPay">RedotPay (Crypto / Card)</option>
                <option value="Stripe">Stripe Direct</option>
                <option value="Airtm">Airtm (AirUSD / P2P)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-600 mb-1">Identificador da Conta / E-mail / Telefone</label>
              <input
                type="text"
                required
                value={seedIdentifier}
                onChange={e => setSeedIdentifier(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800 font-mono"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowSeedModal(false)}
                className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              >
                Inserir na Fila
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabela de Audit Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Trilhas de Auditoria de Decisões Administrativas</h2>
            <p className="text-xs text-slate-500 mt-1">Registos imutáveis de ações tomadas por administradores no sistema financeiro.</p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">A carregar logs de auditoria...</div>
          ) : auditLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-500">Nenhum log de auditoria registado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 font-mono">
                    <th className="p-4">Data / Hora</th>
                    <th className="p-4">ID Admin</th>
                    <th className="p-4">Ação</th>
                    <th className="p-4">Detalhes da Operação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 text-slate-500 text-xs font-mono">
                        {new Date(log.created_at).toLocaleString('pt-PT')}
                      </td>
                      <td className="p-4 font-mono text-xs text-indigo-600 font-bold">{log.admin_id}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                            log.action.includes('APPROVED')
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-mono bg-slate-50 text-slate-700 rounded-lg max-w-md border border-slate-100">
                        {typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
