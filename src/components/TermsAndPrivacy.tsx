import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Lock, 
  Building, 
  CheckCircle, 
  AlertTriangle, 
  Scale, 
  HelpCircle, 
  Hash, 
  Wallet, 
  Eye, 
  Database, 
  FileCheck,
  Printer,
  Sparkles,
  ExternalLink,
  Cookie,
  Info
} from 'lucide-react';

interface TermsAndPrivacyProps {
  initialTab?: 'terms' | 'privacy' | 'legal' | 'cookies';
  onBackToApp?: () => void;
  userNif?: string;
}

export default function TermsAndPrivacy({ initialTab = 'terms', onBackToApp, userNif }: TermsAndPrivacyProps) {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'legal' | 'cookies'>(initialTab);
  const [copiedStamp, setCopiedStamp] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<{ analytics: boolean; marketing: boolean; essential: boolean }>({
    essential: true,
    analytics: true,
    marketing: false
  });
  const [savedCookieMsg, setSavedCookieMsg] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyReference = () => {
    const text = `Documento Oficial J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA. (NIF: 5003037282) - Ref: PA-2026-NIF-${userNif || 'AGT'} - Termos & Privacidade Registados perante a AGT.`;
    navigator.clipboard.writeText(text);
    setCopiedStamp(true);
    setTimeout(() => setCopiedStamp(false), 3000);
  };

  const handleSaveCookiePreferences = () => {
    setSavedCookieMsg(true);
    setTimeout(() => setSavedCookieMsg(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* HEADER BANNER WITH FISCAL IDENTIFICATION */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5" />
                Conformidade Legal & Regulatória AGT
              </span>
              <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" />
                NIF AGT: 5003037282
              </span>
              <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-bold rounded-lg">
                Lei n.º 22/11 de Angola
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Termos, Privacidade & Aviso Legal
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Documentação contratual e fiscal oficial da plataforma <strong className="text-slate-900 font-semibold">Pesquisas Angola</strong>, detida e gerida por <strong className="text-indigo-700 font-semibold">J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA.</strong> (Nº Fiscal: 5003037282).
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={handleCopyReference}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck className="h-4 w-4 text-indigo-600" />
              {copiedStamp ? 'Copioso!' : 'Copiar Ref. NIF AGT'}
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="h-4 w-4" />
              Imprimir / PDF
            </button>
          </div>
        </div>

        {/* Company Ownership Box */}
        <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-indigo-600 shrink-0" />
            <span className="text-slate-700">
              Entidade Legal: <strong className="text-slate-900 font-bold">J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA.</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-700">
              NIF Fiscal: <strong className="text-indigo-700 font-mono font-bold">5003037282</strong>
            </span>
          </div>

          <a 
            href="https://medium.com/me/settings/account" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
          >
            Emitir Faturas Stripe / Definições
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Navigation sub-tabs */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            Termos & Condições
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Lock className="h-4 w-4" />
            Política de Privacidade
          </button>

          <button
            onClick={() => setActiveTab('legal')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'legal'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Info className="h-4 w-4" />
            Aviso Legal & AGT
          </button>

          <button
            onClick={() => setActiveTab('cookies')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'cookies'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Cookie className="h-4 w-4" />
            Política de Cookies
          </button>
        </div>
      </div>

      {/* DOCUMENT CONTENT PANEL */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-8">
        
        {/* TAB 1: TERMOS E CONDIÇÕES */}
        {activeTab === 'terms' && (
          <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
            
            {/* Meta summary box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono text-slate-500 flex-wrap gap-2">
                <span>Empresa Titular: <strong>J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA.</strong></span>
                <span>Nº Fiscal / NIF AGT: <strong>5003037282</strong></span>
              </div>
              <p className="text-slate-600">
                Este contrato vincula juridicamente qualquer utilizador cadastrado na plataforma <strong>Pesquisas Angola</strong> perante a sociedade <strong>J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA.</strong>, registada no sistema tributário de Angola.
              </p>
            </div>

            {/* Section 1 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base border-b border-slate-100 pb-2">
                <Building className="h-5 w-5 text-indigo-600 shrink-0" />
                <h2>1. Objeto, Identificação Social e Âmbito</h2>
              </div>
              <p>
                1.1. A marca e aplicação digital <strong>Pesquisas Angola</strong> são operadas pela sociedade comercial <strong>J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA.</strong>, pessoa coletiva de direito angolano com o NIF <strong>5003037282</strong>.
              </p>
              <p>
                1.2. A plataforma dedica-se ao recrutamento, realização e processamento estatístico de inquéritos de opinião e estudos de mercado remunerados para marcas, instituições e empresas atuantes em Angola e a nível internacional.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base border-b border-slate-100 pb-2">
                <Hash className="h-5 w-5 text-indigo-600 shrink-0" />
                <h2>2. Elegibilidade, Registo e Regra Estrita do NIF Único</h2>
              </div>
              <p>
                2.1. Apenas pessoas singulares com idade igual ou superior a <strong>18 anos</strong>, portadoras de um NIF (Número de Identificação Fiscal) válido perante a AGT podem criar conta.
              </p>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  Cláusula de Exclusividade do NIF Fiscal:
                </p>
                <p>
                  É estritamente proibida a criação de múltiplas contas por parte do mesmo indivíduo. O sistema valida automaticamente o NIF cruzando os registos com os comprovativos de transferências via EMIS, PayPay, PayPal, Stripe, RedotPay e Airtm.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base border-b border-slate-100 pb-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0" />
                <h2>3. Regras dos Inquéritos e Sistema Anti-Fraude</h2>
              </div>
              <p>
                3.1. <strong>Limite Diário Fixado:</strong> Cada utilizador qualificado tem acesso a um lote máximo de <strong>8 inquéritos por dia civil</strong>.
              </p>
              <p>
                3.2. Respostas submetidas de forma automatizada por robôs ou em velocidade anormal resultam em bloqueio de segurança e redução do Score de Qualidade.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base border-b border-slate-100 pb-2">
                <Wallet className="h-5 w-5 text-indigo-600 shrink-0" />
                <h2>4. Saldo, Recompensas e Métodos de Levantamento Nacionais e Globais</h2>
              </div>
              <p>
                4.1. As recompensas por inquérito variam de <strong>500 Kz a 2.500 Kz</strong> por atividade concluída.
              </p>
              <p>
                4.2. Métodos de levantamento suportados:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-indigo-700 block mb-1">EMIS / IBAN Bancário</span>
                  Transferência bancária (AO06) com compensação no sistema Multicaixa.
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-emerald-700 block mb-1">PayPay Angola & PayPal</span>
                  Creditação móvel instantânea para o número de telefone associado.
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-rose-600 block mb-1">RedotPay / Stripe / Airtm</span>
                  Transferências internacionais em Crypto, Cartão e Dólares Digitais (AirUSD).
                </div>
              </div>
            </section>

          </div>
        )}

        {/* TAB 2: POLÍTICA DE PRIVACIDADE */}
        {activeTab === 'privacy' && (
          <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
            
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono text-emerald-800 flex-wrap gap-2">
                <span className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Conformidade com a Lei n.º 22/11 de 17 de Junho
                </span>
                <span>Responsável pelo Tratamento: <strong>J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA.</strong></span>
              </div>
              <p className="text-emerald-900">
                O tratamento de dados pessoais é efetuado em rigoroso cumprimento das normas da Agência de Protecção de Dados (APD) da República de Angola.
              </p>
            </div>

            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base border-b border-slate-100 pb-2">
                <Database className="h-5 w-5 text-indigo-600 shrink-0" />
                <h2>1. Dados Recolhidos e Identificação da Entidade</h2>
              </div>
              <p>
                A recolha de dados é realizada pela empresa <strong className="text-slate-900 font-semibold">J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA.</strong> (NIF: <strong>5003037282</strong>) para fins operacionais, fiscais e bancários.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <Hash className="h-3.5 w-3.5 text-indigo-600" /> Identificação Fiscal
                  </span>
                  <p className="text-slate-600">
                    Nome Completo, NIF AGT, Telefone e E-mail.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <Wallet className="h-3.5 w-3.5 text-emerald-600" /> Dados de Pagamento
                  </span>
                  <p className="text-slate-600">
                    IBAN (AO06), Carteiras Móveis, ID RedotPay, E-mail Stripe/Airtm.
                  </p>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* TAB 3: AVISO LEGAL & AGT */}
        {activeTab === 'legal' && (
          <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
            
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-indigo-900 block text-sm">
                Aviso Legal, Fiscal e Faturação Oficial AGT / Stripe
              </span>
              <p className="text-indigo-800">
                A marca <strong>Pesquisas Angola</strong> é propriedade exclusiva e gerida legalmente pela empresa <strong>J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA.</strong>, devidamente matriculada e com enquadramento fiscal ativo na Autoridade Geral Tributária (AGT).
              </p>
            </div>

            <section className="space-y-4">
              <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base border-b border-slate-100 pb-2">
                <Building className="h-5 w-5 text-indigo-600 shrink-0" />
                <h2>Ficha de Identificação da Empresa</h2>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block">Denominação Social Completa:</span>
                    <strong className="text-slate-900 font-bold text-sm">J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA.</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Número de Identificação Fiscal (NIF AGT):</span>
                    <strong className="text-indigo-700 font-mono font-bold text-sm">5003037282</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Jurisdição e Sede:</span>
                    <span className="text-slate-800 font-semibold">República de Angola (Luanda)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Emissão de Faturas Stripe / Definições:</span>
                    <a 
                      href="https://medium.com/me/settings/account" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 font-bold underline flex items-center gap-1 mt-0.5"
                    >
                      https://medium.com/me/settings/account
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <h3 className="font-bold text-slate-900">Enquadramento Fiscal e Retenção na Fonte</h3>
                <p className="text-slate-600 leading-relaxed">
                  Todos os valores pagos em recompensa por estudos de mercado cumprem as obrigações de prestação de serviços comerciais e obrigações tributárias angolanas, geridos centraladamente pelo NIF <strong>5003037282</strong> da <strong>J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA.</strong>
                </p>
              </div>
            </section>

          </div>
        )}

        {/* TAB 4: POLÍTICA DE COOKIES & PREFERÊNCIAS */}
        {activeTab === 'cookies' && (
          <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
            
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-slate-900 block text-sm flex items-center gap-2">
                <Cookie className="h-4 w-4 text-amber-600" />
                Política de Cookies & Gestão de Preferências
              </span>
              <p className="text-slate-600">
                A <strong>J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA.</strong> utiliza cookies essenciais para autenticação de utilizadores, prevenção de fraudes por NIF e melhoria contínua da experiência de resposta aos inquéritos.
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-slate-900 font-extrabold text-base border-b border-slate-100 pb-2">
                Painel de Controlo de Preferências de Cookies
              </h2>

              <div className="space-y-3">
                {/* Essential Cookies */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-slate-900 block">Cookies Estritamente Necessários (Obrigatórios)</span>
                    <p className="text-slate-500">Permitem a autenticação segura do utilizador, sessão do NIF e prevenção de bots nos inquéritos.</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg shrink-0">Ativo</span>
                </div>

                {/* Analytics Cookies */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-slate-900 block">Cookies de Desempenho e Estatística</span>
                    <p className="text-slate-500">Ajudam a analisar a velocidade de resposta aos estudos e melhoria da interface.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      checked={cookieConsent.analytics}
                      onChange={(e) => setCookieConsent({ ...cookieConsent, analytics: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* Marketing Cookies */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-slate-900 block">Cookies de Marketing e Parceiros</span>
                    <p className="text-slate-500">Utilizados para personalizar convites de estudos de mercado direcionados ao seu perfil.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      checked={cookieConsent.marketing}
                      onChange={(e) => setCookieConsent({ ...cookieConsent, marketing: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSaveCookiePreferences}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
                >
                  Guardar Preferências de Cookies
                </button>
                {savedCookieMsg && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Preferências Guardadas com Sucesso!
                  </span>
                )}
              </div>
            </section>

          </div>
        )}

      </div>

      {/* FOOTER CALLOUT BANNER */}
      <div className="p-5 bg-white border border-slate-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA.</p>
            <p className="text-[11px] text-slate-500">Nº Fiscal / NIF AGT: 5003037282 • Plataforma Pesquisas Angola</p>
          </div>
        </div>

        {onBackToApp && (
          <button
            onClick={onBackToApp}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
          >
            Voltar ao Painel Principal
          </button>
        )}
      </div>

    </div>
  );
}
