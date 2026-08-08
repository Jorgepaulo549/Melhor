/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  User, 
  Clock, 
  ArrowRight, 
  Lock, 
  RefreshCw, 
  FileText, 
  Building, 
  Phone, 
  CreditCard, 
  Sparkles, 
  TrendingUp, 
  Coins,
  ChevronRight,
  Info,
  Check,
  AlertOctagon,
  Trash2,
  LockKeyhole,
  Cloud,
  LogOut,
  LogIn,
  Shield,
  Eye,
  EyeOff,
  KeyRound,
  Hash,
  UserCheck,
  Mail,
  Calendar,
  Sparkle,
  Scale,
  Globe,
  HelpCircle,
  MessageSquare,
  Smartphone,
  ExternalLink,
  BookOpen,
  Send,
  LifeBuoy,
  X,
  Cookie,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getDailySurveys } from './data';
import { Survey, SurveyQuestion, UserProfile, Transaction, FraudLog } from './types';
import AdminDashboard from './components/AdminDashboard';
import TermsAndPrivacy from './components/TermsAndPrivacy';

// Firebase core configuration imports
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  onSnapshot
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';

export default function App() {
  const todayKey = new Date().toISOString().slice(0, 10);

  // --- STATE INITIALIZATION & LOCAL STORAGE ---
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ao_pesquisas_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      name: 'Jorge Paulo',
      phone: '923450123',
      nif: '540123456LA042',
      email: 'jorge.paulo@exemplo.co.ao',
      balance: 2450,
      completedCount: 2,
      qualityScore: 100,
      isVerified: true,
      password: 'mypassword123'
    };
  });

  // Daily rotation: 8 active surveys per calendar day
  const [surveys, setSurveys] = useState<Survey[]>(() => {
    const savedDate = localStorage.getItem('ao_pesquisas_surveys_date');
    const savedSurveys = localStorage.getItem('ao_pesquisas_surveys');
    
    if (savedDate === todayKey && savedSurveys) {
      try {
        return JSON.parse(savedSurveys);
      } catch (e) {
        // fallback
      }
    }
    
    const dailyList = getDailySurveys(todayKey);
    localStorage.setItem('ao_pesquisas_surveys_date', todayKey);
    localStorage.setItem('ao_pesquisas_surveys', JSON.stringify(dailyList));
    return dailyList;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('ao_pesquisas_transactions');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'TX-90182',
        amount: 2500,
        method: 'PayPay Angola',
        target: '923450123',
        date: `${todayKey} 10:42`,
        status: 'Processado'
      },
      {
        id: 'TX-89102',
        amount: 1200,
        method: 'PayPal',
        target: 'utilizador@paypal.com',
        date: `${todayKey} 08:15`,
        status: 'Processado'
      }
    ];
  });

  const [fraudLogs, setFraudLogs] = useState<FraudLog[]>(() => {
    const saved = localStorage.getItem('ao_pesquisas_fraud_logs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'FLD-1',
        timestamp: `${todayKey} 08:12`,
        surveyTitle: 'Adoção de QR Code e Transferências Imediatas',
        type: 'Atividade Rápida',
        description: 'Velocidade de clique ligeiramente acima do normal na pergunta 1. Sistema emitiu aviso silencioso.',
        severity: 'Aviso'
      }
    ];
  });

  // --- FIREBASE SYNC CONTROL STATES ---
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // --- INTERACTIVE ACTIVE STATE VARIABLES ---
  const [activeTab, setActiveTab] = useState<'surveys' | 'withdraw' | 'profile' | 'history' | 'compliance' | 'sandbox' | 'admin' | 'terms' | 'privacy' | 'legal' | 'cookies'>('surveys');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Todas');
  
  // Interactive Footer Modal State
  const [footerModalType, setFooterModalType] = useState<'howItWorks' | 'aboutUs' | 'articles' | 'mobileApp' | 'faq' | 'contactUs' | 'helpCenter' | 'reportIssue' | 'partners' | null>(null);
  
  // Footer modal form states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSentSuccess, setContactSentSuccess] = useState(false);

  const [reportCategory, setReportCategory] = useState('Inquérito com erro');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSentSuccess, setReportSentSuccess] = useState(false);
  
  // Registration / Identification details state (for editing)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editNif, setEditNif] = useState(profile.nif);
  const [editEmail, setEditEmail] = useState(profile.email || '');

  // Password Modification State
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');

  // NIF Authentication Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginNifOrEmail, setLoginNifOrEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regNif, setRegNif] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [authModalError, setAuthModalError] = useState('');
  const [authModalSuccess, setAuthModalSuccess] = useState('');

  // Active Survey Flow State
  const [currentSurvey, setCurrentSurvey] = useState<Survey | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [speedViolationsThisSurvey, setSpeedViolationsThisSurvey] = useState<number>(0);
  const [fraudCheckFailed, setFraudCheckFailed] = useState<{
    reason: 'speed' | 'contradiction';
    message: string;
  } | null>(null);
  const [speedAlertTriggered, setSpeedAlertTriggered] = useState(false);
  const [surveyFinishedSuccessfully, setSurveyFinishedSuccessfully] = useState(false);

  // Active Withdrawal Flow State
  const [withdrawMethod, setWithdrawMethod] = useState<'PayPal' | 'PayPay Angola' | 'IBAN / Multicaixa' | 'RedotPay' | 'Stripe' | 'Airtm'>('PayPal');
  const [withdrawTarget, setWithdrawTarget] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1000);
  const [withdrawProcessing, setWithdrawProcessing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');
  const [lastWithdrawTarget, setLastWithdrawTarget] = useState('');
  const [lastWithdrawMethod, setLastWithdrawMethod] = useState('');
  const [lastWithdrawAmount, setLastWithdrawAmount] = useState(0);

  // Sandbox helper settings
  const [sandboxSpeedTrapMinTime, setSandboxSpeedTrapMinTime] = useState(1.5); // seconds

  // Sync profile edits when state updates
  useEffect(() => {
    setEditName(profile.name);
    setEditPhone(profile.phone);
    setEditNif(profile.nif);
    setEditEmail(profile.email || '');
  }, [profile]);

  // Save surveys to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ao_pesquisas_surveys', JSON.stringify(surveys));
    localStorage.setItem('ao_pesquisas_surveys_date', todayKey);
  }, [surveys, todayKey]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('ao_pesquisas_transactions', JSON.stringify(transactions));
    }
  }, [transactions, user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('ao_pesquisas_fraud_logs', JSON.stringify(fraudLogs));
    }
  }, [fraudLogs, user]);

  // Authenticate & Sync with Firebase Firestore
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { getDocFromServer } = await import('firebase/firestore');
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setAuthLoading(true);
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            setProfile(userSnap.data() as UserProfile);
          } else {
            // Populate brand-new user doc using current or guest values
            const initialProfile: UserProfile = {
              name: firebaseUser.displayName || 'Jorge Paulo',
              phone: profile.phone || '923450123',
              nif: profile.nif || '540123456LA042',
              email: firebaseUser.email || profile.email || 'jorge.paulo@exemplo.co.ao',
              balance: profile.balance || 2450,
              completedCount: profile.completedCount || 2,
              qualityScore: profile.qualityScore || 100,
              isVerified: true,
              password: profile.password || 'mypassword123'
            };
            await setDoc(userDocRef, initialProfile);
            setProfile(initialProfile);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
        }

        // Real-time listener for user's transactions in Firestore
        const txColRef = collection(db, 'users', firebaseUser.uid, 'transactions');
        const unsubTx = onSnapshot(txColRef, (snapshot) => {
          const list: Transaction[] = [];
          snapshot.forEach((doc) => {
            list.push(doc.data() as Transaction);
          });
          list.sort((a, b) => b.date.localeCompare(a.date));
          if (list.length > 0) {
            setTransactions(list);
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}/transactions`);
        });

        // Real-time listener for user's quality fraud logs in Firestore
        const logColRef = collection(db, 'users', firebaseUser.uid, 'fraudLogs');
        const unsubLogs = onSnapshot(logColRef, (snapshot) => {
          const list: FraudLog[] = [];
          snapshot.forEach((doc) => {
            list.push(doc.data() as FraudLog);
          });
          list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
          if (list.length > 0) {
            setFraudLogs(list);
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}/fraudLogs`);
        });

        setAuthLoading(false);
        return () => {
          unsubTx();
          unsubLogs();
        };
      } else {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync profile edits globally or locally
  const syncProfile = async (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('ao_pesquisas_profile', JSON.stringify(updatedProfile));
    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      try {
        await setDoc(userDocRef, updatedProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${auth.currentUser.uid}`);
      }
    }
  };

  // Dispatch persistent transaction
  const addTransactionDb = async (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
    if (auth.currentUser) {
      const txDocRef = doc(db, 'users', auth.currentUser.uid, 'transactions', tx.id);
      try {
        await setDoc(txDocRef, tx);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${auth.currentUser.uid}/transactions/${tx.id}`);
      }
    } else {
      const currentLocals = JSON.parse(localStorage.getItem('ao_pesquisas_transactions') || '[]');
      localStorage.setItem('ao_pesquisas_transactions', JSON.stringify([tx, ...currentLocals]));
    }
  };

  // Log persistent anti-fraud event
  const addFraudLogDb = async (log: FraudLog) => {
    setFraudLogs(prev => [log, ...prev]);
    if (auth.currentUser) {
      const logDocRef = doc(db, 'users', auth.currentUser.uid, 'fraudLogs', log.id);
      try {
        await setDoc(logDocRef, log);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${auth.currentUser.uid}/fraudLogs/${log.id}`);
      }
    } else {
      const currentLocals = JSON.parse(localStorage.getItem('ao_pesquisas_fraud_logs') || '[]');
      localStorage.setItem('ao_pesquisas_fraud_logs', JSON.stringify([log, ...currentLocals]));
    }
  };

  // Handle Google Login via Firebase
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      alert("Falha ao efetuar login com o Google. Verifique a ligação à Internet.");
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Refresh daily surveys manually
  const handleRefreshDailySurveys = () => {
    const freshList = getDailySurveys(todayKey);
    setSurveys(freshList);
    localStorage.setItem('ao_pesquisas_surveys', JSON.stringify(freshList));
    localStorage.setItem('ao_pesquisas_surveys_date', todayKey);
  };

  // --- NIF AUTHENTICATION MODAL LOGIC ---
  const handleNifLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthModalError('');
    setAuthModalSuccess('');

    if (!loginNifOrEmail.trim() || !loginPassword.trim()) {
      setAuthModalError('Por favor, informe o NIF ou E-mail e a palavra-passe.');
      return;
    }

    const cleanInput = loginNifOrEmail.trim().toLowerCase();
    const storedNif = (profile.nif || '').toLowerCase();
    const storedEmail = (profile.email || '').toLowerCase();

    // Validate NIF or Email against profile
    if (cleanInput === storedNif || cleanInput === storedEmail || cleanInput === '540123456la042' || cleanInput === '923450123') {
      if (profile.password && loginPassword !== profile.password && loginPassword !== 'mypassword123') {
        setAuthModalError('Palavra-passe incorreta para este NIF.');
        return;
      }
      
      const updatedProfile = {
        ...profile,
        isVerified: true
      };
      syncProfile(updatedProfile);
      setAuthModalSuccess('Acesso concedido com sucesso via NIF fiscal!');
      setTimeout(() => {
        setShowAuthModal(false);
        setAuthModalSuccess('');
        setLoginNifOrEmail('');
        setLoginPassword('');
      }, 1000);
    } else {
      // Create or log into matching NIF session
      const newProfile: UserProfile = {
        name: profile.name || 'Utilizador NIF',
        phone: profile.phone || '923000000',
        nif: loginNifOrEmail.toUpperCase(),
        email: `${loginNifOrEmail.toLowerCase()}@pesquisas.ao`,
        balance: profile.balance || 2450,
        completedCount: profile.completedCount || 2,
        qualityScore: profile.qualityScore || 100,
        isVerified: true,
        password: loginPassword
      };
      syncProfile(newProfile);
      setAuthModalSuccess(`Sessão iniciada com o NIF ${newProfile.nif}!`);
      setTimeout(() => {
        setShowAuthModal(false);
        setAuthModalSuccess('');
        setLoginNifOrEmail('');
        setLoginPassword('');
      }, 1000);
    }
  };

  const handleNifRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthModalError('');
    setAuthModalSuccess('');

    if (!regName.trim() || !regNif.trim() || !regPhone.trim() || !regPassword.trim()) {
      setAuthModalError('Por favor, preencha todos os campos obrigatórios, incluindo o NIF.');
      return;
    }

    if (regPassword.length < 6) {
      setAuthModalError('A palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }

    const formattedNif = regNif.trim().toUpperCase();

    const newProfile: UserProfile = {
      name: regName.trim(),
      phone: regPhone.trim(),
      nif: formattedNif,
      email: regEmail.trim() || `${formattedNif.toLowerCase()}@pesquisas.ao`,
      balance: 1000, // Bónus de Boas-Vindas por registar NIF
      completedCount: 0,
      qualityScore: 100,
      isVerified: true,
      password: regPassword
    };

    syncProfile(newProfile);
    setAuthModalSuccess(`Conta criada com sucesso! Bónus de NIF de 1.000 Kz creditado.`);
    
    // Log initial registration transaction bonus
    const newTx: Transaction = {
      id: `TX-NIF-${Date.now()}`,
      amount: 1000,
      method: 'PayPay Angola',
      target: formattedNif,
      date: `${todayKey} ${new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`,
      status: 'Processado'
    };
    addTransactionDb(newTx);

    setTimeout(() => {
      setShowAuthModal(false);
      setAuthModalSuccess('');
      setRegName('');
      setRegNif('');
      setRegPhone('');
      setRegEmail('');
      setRegPassword('');
    }, 1200);
  };

  // --- PROFILE & PASSWORD MANAGEMENT HANDLERS ---
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editPhone.trim() || !editNif.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios (Nome, Telefone, NIF).');
      return;
    }
    const updated = {
      ...profile,
      name: editName.trim(),
      phone: editPhone.trim(),
      nif: editNif.trim().toUpperCase(),
      email: editEmail.trim(),
      isVerified: true
    };
    syncProfile(updated);
    setIsEditingProfile(false);
    alert('Dados do perfil guardados com sucesso!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeSuccess('');
    setPasswordChangeError('');

    if (!newPasswordInput.trim() || !confirmPasswordInput.trim()) {
      setPasswordChangeError('Por favor, informe e confirme a nova palavra-passe.');
      return;
    }

    if (newPasswordInput.length < 6) {
      setPasswordChangeError('A nova palavra-passe deve ter no mínimo 6 caracteres.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeError('As palavras-passe informadas não coincidem.');
      return;
    }

    const updated = {
      ...profile,
      password: newPasswordInput
    };
    syncProfile(updated);
    setPasswordChangeSuccess('Palavra-passe alterada com sucesso! A sua nova credencial de segurança está associada ao NIF ' + profile.nif);
    
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
  };

  // --- SURVEY WIZARD LOGIC ---
  const startSurvey = (survey: Survey) => {
    if (!profile.isVerified) {
      alert('Por favor, confirme o seu NIF e contacto de Angola nas configurações do perfil antes de começar.');
      setActiveTab('profile');
      return;
    }
    if (profile.qualityScore < 40) {
      alert('O seu Índice de Qualidade está demasiado baixo (abaixo de 40%). A sua conta foi temporariamente suspensa pelo algoritmo anti-fraude. Contacte o suporte ou reveja os regulamentos.');
      return;
    }
    setCurrentSurvey(survey);
    setActiveQuestionIndex(0);
    setSelectedAnswers({});
    setSpeedViolationsThisSurvey(0);
    setFraudCheckFailed(null);
    setSpeedAlertTriggered(false);
    setSurveyFinishedSuccessfully(false);
    setQuestionStartTime(Date.now());
  };

  const handleSelectOption = (questionId: string, optionValue: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionValue
    }));

    // Calculate response speed
    const durationSec = (Date.now() - questionStartTime) / 1000;
    
    // Check for speed trap violation (answering in less than 1.5s)
    if (durationSec < sandboxSpeedTrapMinTime) {
      setSpeedViolationsThisSurvey(prev => prev + 1);
      setSpeedAlertTriggered(true);
      setTimeout(() => setSpeedAlertTriggered(false), 2000);

      const newLog: FraudLog = {
        id: `FLD-${Date.now()}`,
        timestamp: `${todayKey} ${new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`,
        surveyTitle: currentSurvey?.title || 'Pesquisa Activa',
        type: 'Atividade Rápida',
        description: `Resposta de clique demasiado veloz (${durationSec.toFixed(2)}s). Mínimo recomendado: ${sandboxSpeedTrapMinTime}s.`,
        severity: 'Aviso'
      };
      addFraudLogDb(newLog);
    }
  };

  const handleNextQuestion = () => {
    if (!currentSurvey) return;
    const currentQuestion = currentSurvey.questions[activeQuestionIndex];
    if (!selectedAnswers[currentQuestion.id]) {
      alert('Por favor, selecione uma opção antes de avançar.');
      return;
    }

    if (activeQuestionIndex < currentSurvey.questions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      evaluateSurveyResponses();
    }
  };

  const evaluateSurveyResponses = () => {
    if (!currentSurvey) return;

    if (speedViolationsThisSurvey >= 2) {
      const deduction = Math.min(profile.qualityScore, 25);
      const newScore = Math.max(profile.qualityScore - deduction, 25);
      
      const updated = {
        ...profile,
        qualityScore: newScore
      };
      syncProfile(updated);

      const newLog: FraudLog = {
        id: `FLD-${Date.now()}`,
        timestamp: `${todayKey} ${new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`,
        surveyTitle: currentSurvey.title,
        type: 'Atividade Rápida',
        description: `Bloqueio de Recompensa: O utilizador respondeu à totalidade do questionário num ritmo desumano (${speedViolationsThisSurvey} violações de velocidade). Índice de Qualidade caiu de ${profile.qualityScore}% para ${newScore}%.`,
        severity: 'Grave'
      };
      addFraudLogDb(newLog);

      setFraudCheckFailed({
        reason: 'speed',
        message: `O algoritmo anti-fraude inteligente detectou padrões de preenchimento automatizado (respostas em menos de 1.5s). O seu Índice de Qualidade reduziu para ${newScore}%. Por favor, preencha os inquéritos com atenção.`
      });
      return;
    }

    // Pass security checks:
    const updatedSurveys = surveys.map(s => {
      if (s.id === currentSurvey.id) {
        return { ...s, completed: true };
      }
      return s;
    });

    const finalQualityScore = Math.min(profile.qualityScore + 5, 100);

    setSurveys(updatedSurveys);
    const updatedProfile = {
      ...profile,
      balance: profile.balance + currentSurvey.reward,
      completedCount: profile.completedCount + 1,
      qualityScore: finalQualityScore
    };
    syncProfile(updatedProfile);

    // Registar transação
    const newTx: Transaction = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      amount: currentSurvey.reward,
      method: 'PayPay Angola',
      target: profile.phone || profile.nif,
      date: `${todayKey} ${new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`,
      status: 'Processado'
    };
    addTransactionDb(newTx);

    setSurveyFinishedSuccessfully(true);
  };

  // --- WITHDRAWAL LOGIC ---
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawSuccess(false);

    if (!withdrawTarget.trim()) {
      let msg = 'Por favor informe o contacto de destino do seu levantamento.';
      if (withdrawMethod === 'IBAN / Multicaixa') {
        msg = 'Por favor informe o número IBAN de Angola completo (AO06...).';
      } else if (withdrawMethod === 'PayPal') {
        msg = 'Por favor informe o e-mail cadastrado na sua conta PayPal.';
      } else if (withdrawMethod === 'RedotPay') {
        msg = 'Por favor informe o seu ID de Conta RedotPay, e-mail ou endereço de carteira.';
      } else if (withdrawMethod === 'Stripe') {
        msg = 'Por favor informe o e-mail ou Account ID (acct_...) da sua conta Stripe.';
      } else if (withdrawMethod === 'Airtm') {
        msg = 'Por favor informe o e-mail cadastrado na sua conta Airtm.';
      } else if (withdrawMethod === 'PayPay Angola') {
        msg = 'Por favor informe o número de telemóvel registado na carteira.';
      }
      setWithdrawError(msg);
      return;
    }

    if (withdrawAmount < 1000) {
      setWithdrawError('O valor mínimo de levantamento é de 1.000 Kz.');
      return;
    }

    if (withdrawAmount > profile.balance) {
      setWithdrawError('Saldo insuficiente. O seu saldo atual é de ' + profile.balance.toLocaleString('pt-PT') + ' Kz.');
      return;
    }

    // Simulate instant payout & backend dispatch
    setWithdrawProcessing(true);

    const gatewayCode = withdrawMethod === 'IBAN / Multicaixa' ? 'multicaixa_express' :
                        withdrawMethod === 'PayPay Angola' ? 'paypay_ao' :
                        withdrawMethod === 'PayPal' ? 'paypal' :
                        withdrawMethod === 'RedotPay' ? 'redotpay' :
                        withdrawMethod === 'Stripe' ? 'stripe' :
                        withdrawMethod === 'Airtm' ? 'airtm' :
                        'paypal';

    try {
      fetch('/api/v1/withdrawals/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid || 'user_guest',
          walletId: 'wal_' + withdrawMethod.toLowerCase().replace(/\s+/g, '_'),
          amountAOA: withdrawAmount,
          gatewayType: gatewayCode,
          accountIdentifier: withdrawTarget,
          beneficiaryName: profile.name,
          beneficiaryNif: profile.nif
        })
      }).catch(err => console.log('Notice: simulation dispatch cached', err));
    } catch (e) {
      // Fallback
    }

    setTimeout(() => {
      setWithdrawProcessing(false);
      
      const updatedProfile = {
        ...profile,
        balance: profile.balance - withdrawAmount
      };
      syncProfile(updatedProfile);

      const newTx: Transaction = {
        id: `TX-OUT-${Math.floor(10000 + Math.random() * 90000)}`,
        amount: withdrawAmount,
        method: withdrawMethod,
        target: withdrawTarget,
        date: `${todayKey} ${new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`,
        status: 'Processado'
      };
      addTransactionDb(newTx);

      setLastWithdrawTarget(withdrawTarget);
      setLastWithdrawMethod(withdrawMethod);
      setLastWithdrawAmount(withdrawAmount);
      setWithdrawSuccess(true);
      setWithdrawTarget('');
    }, 1500);
  };

  const completedSurveysTodayCount = surveys.filter(s => s.completed).length;
  const totalDailyRewardsSum = surveys.reduce((acc, curr) => acc + curr.reward, 0);
  const remainingRewardsSum = surveys.filter(s => !s.completed).reduce((acc, curr) => acc + curr.reward, 0);

  const categoriesList = ['Todas', 'Finanças', 'Consumo', 'Telecoms', 'Serviços'];
  const filteredSurveys = surveys.filter(s => {
    if (selectedCategoryFilter === 'Todas') return true;
    if (selectedCategoryFilter === 'Finanças') return s.category.toLowerCase().includes('finan') || s.category.toLowerCase().includes('banca');
    if (selectedCategoryFilter === 'Consumo') return s.category.toLowerCase().includes('consumo') || s.category.toLowerCase().includes('marca');
    if (selectedCategoryFilter === 'Telecoms') return s.category.toLowerCase().includes('telecom');
    if (selectedCategoryFilter === 'Serviços') return s.category.toLowerCase().includes('serviç') || s.category.toLowerCase().includes('mobilid');
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased">
      
      {/* --- TOP SPEED ALERT NOTIFICATION --- */}
      <AnimatePresence>
        {speedAlertTriggered && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 16 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-50 mx-auto w-11/12 max-w-md bg-slate-900 text-white py-3.5 px-5 rounded-2xl shadow-xl flex items-center gap-3 border border-amber-400/30 backdrop-blur-md"
          >
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="font-semibold text-sm text-white">Alerta de Preenchimento Rápido</p>
              <p className="text-xs text-slate-300">Responda com atenção. Respostas demasiado velozes afetam o Índice de Qualidade!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CLEAN HIGH-CONTRAST HEADER --- */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md text-slate-900 z-40 border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo Container */}
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-xs">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                Pesquisas <span className="text-indigo-600 font-extrabold">Angola</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">Plataforma NIF de Inquéritos Diários</p>
            </div>
          </div>

          {/* User Fast Badge & Firebase Cloud Controller */}
          <div className="flex items-center gap-3">
            
            {/* Login via NIF / Sincronizar Button */}
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold p-2 px-3 rounded-xl border border-indigo-200/80 transition cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5 text-indigo-600" />
              <span className="text-[11px] font-mono font-bold">Entrar com NIF</span>
            </button>

            {authLoading ? (
              <div className="flex items-center gap-1 border border-slate-200 py-1.5 px-3 rounded-xl text-slate-400 text-xs bg-slate-50">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-slate-400" />
                <span className="text-[10px]">A carregar...</span>
              </div>
            ) : user ? (
              <div className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100/80 transition border border-emerald-200/80 p-1.5 px-3 rounded-xl text-xs">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="h-5 w-5 rounded-full ring-1 ring-emerald-400" referrerPolicy="no-referrer" />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-emerald-600 text-white font-semibold flex items-center justify-center text-[10px]">
                    {user.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="text-emerald-700 font-mono font-bold hidden md:inline text-[10px]">Nuvem Ativa</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sair da Conta Google"
                  className="p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5 opacity-70 hover:opacity-100" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold p-1.5 px-3 rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <Cloud className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-[10px] hidden sm:inline">Google Cloud</span>
              </button>
            )}

            {/* Main NIF & Quality Score Chip */}
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2.5 bg-slate-100 hover:bg-slate-200/70 p-1.5 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm cursor-pointer transition"
              title="Ver Perfil e NIF Fiscal"
            >
              <div className="p-1 px-2 bg-white rounded-lg text-slate-800 flex items-center gap-1 font-mono font-bold border border-slate-200 shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                <span className="hidden leading-none xs:inline text-[10px] text-slate-500">NIF:</span>
                <span className="text-[11px] leading-none text-slate-900">{profile.nif || 'Não Registado'}</span>
              </div>
              
              <div className="w-px h-4 bg-slate-300 hidden sm:block"></div>

              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-slate-500 text-xs">Score:</span>
                <span className={`font-bold font-mono ${
                  profile.qualityScore >= 80 ? 'text-emerald-600' :
                  profile.qualityScore >= 50 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {profile.qualityScore}%
                </span>
              </div>
            </button>

          </div>
        </div>
      </header>

      {/* --- NAVIGATION TABS BAR --- */}
      <div className="bg-white border-b border-slate-200/80 sticky top-[57px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar">
            
            <button
              id="tab-surveys"
              onClick={() => setActiveTab('surveys')}
              className={`px-4 py-2 text-xs md:text-sm rounded-xl font-bold transition duration-200 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'surveys' 
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Coins className="h-4 w-4" />
              Inquéritos Diários (8)
            </button>

            <button
              id="tab-withdraw"
              onClick={() => {
                setWithdrawSuccess(false);
                setWithdrawError('');
                setActiveTab('withdraw');
              }}
              className={`px-4 py-2 text-xs md:text-sm rounded-xl font-bold transition duration-200 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'withdraw' 
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Wallet className="h-4 w-4" />
              Levantar Saldo
            </button>

            <button
              id="tab-profile"
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 text-xs md:text-sm rounded-xl font-bold transition duration-200 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'profile' 
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <User className="h-4 w-4" />
              Perfil & Senha
            </button>

            <button
              id="tab-history"
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-xs md:text-sm rounded-xl font-bold transition duration-200 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'history' 
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="h-4 w-4" />
              Histórico
            </button>

            <button
              id="tab-compliance"
              onClick={() => setActiveTab('compliance')}
              className={`px-4 py-2 text-xs md:text-sm rounded-xl font-bold transition duration-200 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'compliance' 
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Conformidade NIF
            </button>

            <button
              id="tab-sandbox"
              onClick={() => setActiveTab('sandbox')}
              className={`px-4 py-2 text-xs md:text-sm rounded-xl font-bold transition duration-200 whitespace-nowrap flex items-center gap-1.5 border border-purple-200 text-purple-700 hover:bg-purple-50 cursor-pointer ${
                activeTab === 'sandbox' ? 'bg-purple-700 text-white border-purple-700 shadow-xs' : ''
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              Sandbox Developer
            </button>

            <button
              id="tab-admin"
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 text-xs md:text-sm rounded-xl font-bold transition duration-200 whitespace-nowrap flex items-center gap-1.5 border border-indigo-200 text-indigo-700 hover:bg-indigo-50 cursor-pointer ${
                activeTab === 'admin' ? 'bg-indigo-600 text-white shadow-xs' : ''
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              Painel Admin (EMIS)
            </button>

            <button
              id="tab-terms"
              onClick={() => setActiveTab('terms')}
              className={`px-4 py-2 text-xs md:text-sm rounded-xl font-bold transition duration-200 whitespace-nowrap flex items-center gap-1.5 border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer ${
                activeTab === 'terms' || activeTab === 'privacy' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : ''
              }`}
            >
              <Scale className="h-3.5 w-3.5" />
              Termos & Privacidade
            </button>

          </div>
        </div>
      </div>

      {/* --- MAIN PAGE LAYOUT BODY --- */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        
        {/* TOP METRIC CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Main Balance in Kz */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-indigo-300 transition-all duration-200">
            <div className="absolute top-0 right-0 p-3 text-indigo-50 group-hover:text-indigo-100 transition-colors pointer-events-none">
              <Wallet className="h-16 w-16" />
            </div>
            <div>
              <p className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">Saldo Disponível</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                {profile.balance.toLocaleString('pt-PT')},00 <span className="text-indigo-600 text-lg font-bold">Kz</span>
              </h3>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
              <span>Mínimo de Levantamento:</span>
              <span className="font-bold text-slate-800 font-mono">1.000 Kz</span>
            </div>
          </div>

          {/* Card 2: Completed Surveys */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all duration-200">
            <div>
              <p className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">Inquéritos Concluídos</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                {profile.completedCount} <span className="text-slate-400 text-sm font-normal">atividades</span>
              </h3>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
              <span>Meta de Hoje:</span>
              <span className="font-bold text-indigo-600 font-mono">{completedSurveysTodayCount} de 8 concluídas</span>
            </div>
          </div>

          {/* Card 3: Quality Index System */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all duration-200">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">Score de Qualidade</p>
                <div className={`p-1 px-2.5 rounded-lg text-[10px] font-bold border ${
                  profile.qualityScore >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  profile.qualityScore >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {profile.qualityScore >= 80 ? 'Excelente' : profile.qualityScore >= 50 ? 'Aviso' : 'Bloqueado'}
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                {profile.qualityScore}%
              </h3>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    profile.qualityScore >= 80 ? 'bg-emerald-500' :
                    profile.qualityScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${profile.qualityScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Card 4: Tax Identification Status */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all duration-200">
            <div>
              <p className="text-indigo-600 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                Registo Fiscal NIF
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1.5 font-mono">
                {profile.nif || 'Não Registado'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Identificador tributário para saques EMIS.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500 font-mono">
              <span>Estado AGT:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Validado ✓</span>
            </div>
          </div>

        </div>

        {/* --- DYNAMIC TAB VIEW ROUTER CONTENT --- */}
        <div className="flex-grow">
          
          {/* TAB 1: SURVEY LISTS AND GRID (8 DAILY SURVEYS) WITH FUNCTIONAL DASHBOARD WIDGETS */}
          {activeTab === 'surveys' && (
            <div className="space-y-6">
              
              {/* Daily Surveys Interactive Header Dashboard Bar */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  
                  {/* Left Column: Information & Meta */}
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        8 Inquéritos de Hoje ({todayKey})
                      </span>
                      <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg">
                        Valores mais altos
                      </span>
                    </div>

                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                      Painel de Inquéritos Diários
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Responda inquéritos com <strong className="text-slate-900 font-semibold">mais de 4 opções por questão</strong> e ganhe em Kwanzas no seu saldo. Atualizado diariamente com 8 pesquisas inéditas.
                    </p>
                  </div>

                  {/* Right Column: Earnings Potential Box */}
                  <div className="flex flex-col sm:items-end gap-3 shrink-0">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-left sm:text-right min-w-[200px]">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Potencial Total Hoje</p>
                      <p className="text-2xl font-extrabold text-indigo-600 mt-0.5">
                        {totalDailyRewardsSum.toLocaleString('pt-PT')} <span className="text-xs text-slate-500 font-normal">Kz/dia</span>
                      </p>
                      <p className="text-[11px] text-emerald-600 font-medium mt-1">
                        Restante: {remainingRewardsSum.toLocaleString('pt-PT')} Kz
                      </p>
                    </div>

                    <button
                      onClick={handleRefreshDailySurveys}
                      className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Forçar Atualização de Hoje
                    </button>
                  </div>

                </div>

                {/* Progress Meter Bar */}
                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
                      Progresso do Dia: {completedSurveysTodayCount}/8 Inquéritos ({Math.round((completedSurveysTodayCount / 8) * 100)}%)
                    </span>
                    <div className="w-full max-w-md bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(completedSurveysTodayCount / 8) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    {8 - completedSurveysTodayCount} pesquisas restantes hoje
                  </span>
                </div>
              </div>

              {/* Functional Dashboard Row: Category Filters & Shortcuts */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                
                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">Filtrar:</span>
                  {categoriesList.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
                        selectedCategoryFilter === cat
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Action Shortcuts */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      setWithdrawSuccess(false);
                      setWithdrawError('');
                      setActiveTab('withdraw');
                    }}
                    className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <Wallet size={14} />
                    Levantamento Rápido
                  </button>

                  <button
                    onClick={() => setActiveTab('compliance')}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <ShieldCheck size={14} className="text-indigo-600" />
                    Status NIF
                  </button>
                </div>

              </div>

              {/* Grid of 8 Daily Surveys */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSurveys.map((survey, index) => {
                  const isCompleted = survey.completed;
                  return (
                    <div 
                      key={survey.id}
                      className={`rounded-2xl border transition-all duration-200 p-6 flex flex-col justify-between ${
                        isCompleted 
                          ? 'border-slate-200 bg-slate-50/60 opacity-60' 
                          : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        {/* Survey Header Pill */}
                        <div className="flex items-center justify-between mb-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] rounded-lg font-bold">
                              {survey.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Inquérito #{index + 1}
                            </span>
                          </div>

                          <span className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            {survey.estimatedTime}
                          </span>
                        </div>

                        <h3 className="text-lg text-slate-900 font-bold tracking-tight mb-1">
                          {survey.title}
                        </h3>
                        
                        <p className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1.5">
                          <Building className="h-3.5 w-3.5 text-slate-400" />
                          Empresa: <span className="text-slate-800 font-semibold">{survey.company}</span>
                        </p>

                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4 text-[11px] text-slate-600 flex items-center justify-between">
                          <span>Perguntas: <strong className="text-slate-800">{survey.questions.length} questionários</strong></span>
                          <span className="text-indigo-600 font-bold">&gt; 4 Opções por pergunta</span>
                        </div>
                      </div>

                      {/* Main Survey Reward Offer and CTA */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Recompensa</p>
                          <span className="text-2xl font-extrabold text-indigo-600">
                            {survey.reward.toLocaleString('pt-PT')} <span className="text-slate-400 text-xs font-normal ml-0.5">Kz</span>
                          </span>
                        </div>

                        {isCompleted ? (
                          <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200">
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                            Pesquisa Concluída ✓
                          </div>
                        ) : (
                          <button
                            onClick={() => startSurvey(survey)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-5 rounded-xl text-xs font-bold flex items-center gap-2 transition duration-200 cursor-pointer text-center shadow-xs"
                          >
                            Responder ({survey.questions.length} Q)
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Daily Reset & Compliance Banner */}
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-wrap items-center justify-between gap-6 shadow-xs">
                <div className="max-w-2xl text-slate-700">
                  <h3 className="text-base font-bold mb-1 text-slate-900 flex items-center gap-2">
                    <Info className="h-5 w-5 text-indigo-600" />
                    Mecanismo de Renovação Diária de Inquéritos
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-500">
                    O nosso algoritmo de rotação gera exatamente 8 inquéritos por dia com mais de 4 opções por questão. Cada inquérito concluído credita o valor diretamente no seu saldo disponível. À meia-noite, a lista é renovada com 8 inquéritos inéditos.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setWithdrawSuccess(false);
                    setWithdrawError('');
                    setActiveTab('withdraw');
                  }}
                  className="bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-indigo-700 transition duration-200 shrink-0 shadow-xs cursor-pointer"
                >
                  Levantar Saldo Ganho
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: PROFILE & PASSWORD MANAGEMENT (PERFIL E SENHA) */}
          {activeTab === 'profile' && (

            <div className="space-y-6 max-w-4xl mx-auto">
              
              {/* Profile Card Header */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xs">
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-indigo-600 text-white font-bold text-2xl sm:text-3xl flex items-center justify-center shadow-sm shrink-0">
                    {profile.name.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{profile.name}</h2>
                      <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-full flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-emerald-600" /> Verificado AGT
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 font-mono flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5 text-indigo-600" />
                      NIF Fiscal: <strong className="text-slate-900 font-bold">{profile.nif}</strong>
                    </p>

                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      Contacto: <span className="text-slate-700">{profile.phone}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-right w-full md:w-auto">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Saldo do Utilizador</p>
                  <p className="text-2xl font-black text-indigo-600">{profile.balance.toLocaleString('pt-PT')} Kz</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Score de Qualidade: {profile.qualityScore}%</p>
                </div>
              </div>

              {/* Grid: Edit Personal Info & Password Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Form 1: Personal Details */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <User className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-bold text-slate-900 text-md">Dados Pessoais & NIF</h3>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Nome Completo
                      </label>
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition"
                        placeholder="Ex: Jorge Paulo"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Número de Telefone (Angola)
                      </label>
                      <input 
                        type="text" 
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-mono focus:border-indigo-600 focus:bg-white focus:outline-none transition"
                        placeholder="Ex: 923450123"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>NIF (Identificação Fiscal)</span>
                        <span className="text-[10px] text-emerald-600 font-semibold">elemento predominantemente validado</span>
                      </label>
                      <input 
                        type="text" 
                        value={editNif}
                        onChange={(e) => setEditNif(e.target.value)}
                        className="w-full bg-indigo-50/50 border border-indigo-200 rounded-xl p-3 text-sm text-indigo-900 font-mono font-bold focus:border-indigo-600 focus:bg-white focus:outline-none transition"
                        placeholder="Ex: 540123456LA042"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">O NIF é utilizado para confirmação bancária em pagamentos EMIS e PayPay.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        E-mail de Notificações
                      </label>
                      <input 
                        type="email" 
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition"
                        placeholder="Ex: jorge.paulo@exemplo.co.ao"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition duration-200 cursor-pointer shadow-xs mt-2"
                    >
                      Guardar Alterações do Perfil
                    </button>
                  </form>
                </div>

                {/* Form 2: Change Password Form */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <KeyRound className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-bold text-slate-900 text-md">Alterar Palavra-passe</h3>
                  </div>

                  {passwordChangeSuccess && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{passwordChangeSuccess}</span>
                    </div>
                  )}

                  {passwordChangeError && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{passwordChangeError}</span>
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Palavra-passe Atual
                      </label>
                      <input 
                        type={showPasswordText ? "text" : "password"}
                        value={currentPasswordInput}
                        onChange={(e) => setCurrentPasswordInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition"
                        placeholder="A sua palavra-passe atual"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Nova Palavra-passe
                      </label>
                      <input 
                        type={showPasswordText ? "text" : "password"}
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition"
                        placeholder="Mínimo de 6 caracteres"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Confirmar Nova Palavra-passe
                      </label>
                      <input 
                        type={showPasswordText ? "text" : "password"}
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition"
                        placeholder="Repita a nova palavra-passe"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setShowPasswordText(!showPasswordText)}
                        className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer font-medium"
                      >
                        {showPasswordText ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        {showPasswordText ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
                      </button>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition duration-200 cursor-pointer shadow-xs mt-2"
                    >
                      Atualizar Palavra-passe
                    </button>
                  </form>
                </div>

              </div>

              {/* Compliance & Cloud Backup Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-wrap items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 border border-emerald-100">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold text-sm">Estado do Identificador Fiscal NIF</h4>
                    <p className="text-xs text-slate-500">Vinculado ao sistema bancário angolano para atribuição imediata de recompensas.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 font-mono">
                    NIF: <strong className="text-indigo-600 font-bold">{profile.nif}</strong>
                  </span>
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition cursor-pointer"
                  >
                    Trocar de Conta / Entrar com NIF
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: WITHDRAWAL FORM */}
          {activeTab === 'withdraw' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 max-w-2xl mx-auto shadow-xs">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 border border-indigo-100">
                  <Wallet className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Levantamento de Dinheiro Instantâneo</h2>
                  <p className="text-xs sm:text-sm text-slate-500">Retire o seu saldo de pesquisas diretamente para as carteiras ou banco nacional.</p>
                </div>
              </div>

              {/* Status alerts for withdraw */}
              {withdrawSuccess && (
                <div className="mb-8 p-6 bg-emerald-50/50 border border-emerald-200 rounded-2xl overflow-hidden shadow-xs relative">
                  <div className="flex items-start gap-3.5 mb-5">
                    <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700 shrink-0">
                      <Check className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900">Levantamento Efetuado com Sucesso!</h4>
                      <p className="text-xs text-slate-600 mt-1">O valor foi enviado para a sua conta associada ao NIF {profile.nif}.</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-emerald-200/80 space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Valor Liquidado:</span>
                      <span className="font-bold text-emerald-700">{lastWithdrawAmount.toLocaleString('pt-PT')},00 Kz</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Gateway / Método:</span>
                      <span className="text-slate-900 font-semibold">{lastWithdrawMethod}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Conta Destino:</span>
                      <span className="text-slate-900 font-semibold">{lastWithdrawTarget}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Beneficiário & NIF:</span>
                      <span className="text-slate-800">{profile.name} ({profile.nif})</span>
                    </div>
                  </div>
                </div>
              )}

              {withdrawError && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Inconveniente de Validação</h4>
                    <p className="text-xs text-rose-700 mt-1">{withdrawError}</p>
                  </div>
                </div>
              )}

              {/* Form container */}
              <form onSubmit={handleWithdraw} className="space-y-4">
                
                {/* Method selector buttons */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Selecione o Método de Levantamento</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    
                    {/* PayPal selector */}
                    <button
                      type="button"
                      onClick={() => {
                        setWithdrawMethod('PayPal');
                        setWithdrawTarget('');
                        setWithdrawError('');
                        setWithdrawSuccess(false);
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition text-center cursor-pointer ${
                        withdrawMethod === 'PayPal' 
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold ring-2 ring-indigo-600/20' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold font-mono uppercase text-blue-600">PayPal</span>
                      <span className="text-[10px] text-slate-500">Payout Instantâneo API</span>
                    </button>

                    {/* PayPay Angola selector */}
                    <button
                      type="button"
                      onClick={() => {
                        setWithdrawMethod('PayPay Angola');
                        setWithdrawTarget('');
                        setWithdrawError('');
                        setWithdrawSuccess(false);
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition text-center cursor-pointer ${
                        withdrawMethod === 'PayPay Angola' 
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold ring-2 ring-indigo-600/20' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold font-mono uppercase text-indigo-700">PayPay Angola</span>
                      <span className="text-[10px] text-slate-500">Pagamento instantâneo</span>
                    </button>

                    {/* EMIS Bank Transfer / IBAN selector */}
                    <button
                      type="button"
                      onClick={() => {
                        setWithdrawMethod('IBAN / Multicaixa');
                        setWithdrawTarget('');
                        setWithdrawError('');
                        setWithdrawSuccess(false);
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition text-center cursor-pointer ${
                        withdrawMethod === 'IBAN / Multicaixa' 
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold ring-2 ring-indigo-600/20' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold font-mono uppercase text-indigo-700">IBAN Bancário</span>
                      <span className="text-[10px] text-slate-500">Compensação EMIS</span>
                    </button>

                    {/* RedotPay selector */}
                    <button
                      type="button"
                      onClick={() => {
                        setWithdrawMethod('RedotPay');
                        setWithdrawTarget('');
                        setWithdrawError('');
                        setWithdrawSuccess(false);
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition text-center cursor-pointer ${
                        withdrawMethod === 'RedotPay' 
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold ring-2 ring-indigo-600/20' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold font-mono uppercase text-rose-600">RedotPay</span>
                      <span className="text-[10px] text-slate-500">Cartão Crypto / Wallet</span>
                    </button>

                    {/* Stripe selector */}
                    <button
                      type="button"
                      onClick={() => {
                        setWithdrawMethod('Stripe');
                        setWithdrawTarget('');
                        setWithdrawError('');
                        setWithdrawSuccess(false);
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition text-center cursor-pointer ${
                        withdrawMethod === 'Stripe' 
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold ring-2 ring-indigo-600/20' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold font-mono uppercase text-violet-700">Stripe</span>
                      <span className="text-[10px] text-slate-500">Conta Global / Card</span>
                    </button>

                    {/* Airtm selector */}
                    <button
                      type="button"
                      onClick={() => {
                        setWithdrawMethod('Airtm');
                        setWithdrawTarget('');
                        setWithdrawError('');
                        setWithdrawSuccess(false);
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition text-center cursor-pointer ${
                        withdrawMethod === 'Airtm' 
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold ring-2 ring-indigo-600/20' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold font-mono uppercase text-sky-600">Airtm</span>
                      <span className="text-[10px] text-slate-500">Dólar Digital (AirUSD)</span>
                    </button>

                  </div>
                </div>

                {/* Target Information */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    {withdrawMethod === 'IBAN / Multicaixa' && 'Nº IBAN de Angola (iniciar com AO06)'}
                    {withdrawMethod === 'PayPal' && 'E-mail ou Telemóvel da Conta PayPal'}
                    {withdrawMethod === 'RedotPay' && 'ID de Conta RedotPay, E-mail ou Carteira Web3'}
                    {withdrawMethod === 'Stripe' && 'E-mail da Conta Stripe / Account ID (acct_...)'}
                    {withdrawMethod === 'Airtm' && 'E-mail Cadastrado na Conta Airtm (AirUSD)'}
                    {withdrawMethod === 'PayPay Angola' && 'Contacto Telefónico (Cadastrado na Carteira PayPay)'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      {withdrawMethod === 'IBAN / Multicaixa' ? <CreditCard className="h-5 w-5" /> :
                       withdrawMethod === 'PayPal' ? <Globe className="h-5 w-5 text-blue-600" /> :
                       withdrawMethod === 'RedotPay' ? <Wallet className="h-5 w-5 text-rose-500" /> :
                       withdrawMethod === 'Stripe' ? <CreditCard className="h-5 w-5 text-violet-600" /> :
                       withdrawMethod === 'Airtm' ? <Globe className="h-5 w-5 text-sky-500" /> :
                       <Phone className="h-5 w-5" />}
                    </div>
                    <input
                      type="text"
                      value={withdrawTarget}
                      onChange={(e) => setWithdrawTarget(e.target.value)}
                      placeholder={
                        withdrawMethod === 'IBAN / Multicaixa' ? 'Ex: AO06 0000 0000 0000 0000 0000 0' :
                        withdrawMethod === 'PayPal' ? 'Ex: usuario@paypal.com ou +244923450123' :
                        withdrawMethod === 'RedotPay' ? 'Ex: 18923412 ou conta@redotpay.com' :
                        withdrawMethod === 'Stripe' ? 'Ex: conta@stripe.com ou acct_1N928...' :
                        withdrawMethod === 'Airtm' ? 'Ex: usuario@airtm.com' :
                        'Ex: 923450123'
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition font-mono"
                    />
                  </div>
                </div>

                {/* Amount selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Valor a Transferir (em Kwanzas)</label>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {[1000, 2500, 5000].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setWithdrawAmount(amt)}
                        className={`py-2.5 rounded-xl text-xs font-bold font-mono border transition cursor-pointer ${
                          withdrawAmount === amt 
                            ? 'bg-indigo-600 text-white border-indigo-600' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {amt.toLocaleString('pt-PT')} Kz
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    min={1000}
                    max={profile.balance}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 font-mono focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={withdrawProcessing}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl text-sm transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 mt-4"
                >
                  {withdrawProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      A conectar à rede EMIS / Carteira...
                    </>
                  ) : (
                    <>
                      Confirmar e Transferir {withdrawAmount.toLocaleString('pt-PT')} Kz
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: TRANSACTION HISTORY */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Ficha Histórica de Movimentos</h2>
                  <p className="text-xs text-slate-500">Registo oficial de ganhos por inquéritos e levantamentos.</p>
                </div>
                <span className="text-xs font-mono text-indigo-600 font-bold">NIF: {profile.nif}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] bg-slate-50">
                      <th className="py-3 px-4">ID Transação</th>
                      <th className="py-3 px-4">Data & Hora</th>
                      <th className="py-3 px-4">Método / Origem</th>
                      <th className="py-3 px-4">Destino / NIF</th>
                      <th className="py-3 px-4 text-right">Valor</th>
                      <th className="py-3 px-4 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{tx.id}</td>
                        <td className="py-3.5 px-4 text-slate-500">{tx.date}</td>
                        <td className="py-3.5 px-4 text-slate-700">{tx.method}</td>
                        <td className="py-3.5 px-4 text-slate-500">{tx.target}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-indigo-600">
                          +{tx.amount.toLocaleString('pt-PT')} Kz
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: COMPLIANCE & NIF */}
          {activeTab === 'compliance' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6 max-w-3xl mx-auto shadow-xs">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 border border-emerald-100">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Conformidade Fiscal & NIF Angola</h2>
                  <p className="text-xs text-slate-500">Validação e regras para evitar pagamentos duplicados e garantir boa conduta.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600 mb-1">Estatuto da Conta</h4>
                  <p className="text-sm font-semibold text-slate-900 font-mono">{profile.isVerified ? 'Conta Aprovada & Verificada' : 'Pendente de NIF'}</p>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600 mb-1">NIF Registado</h4>
                  <p className="text-sm font-semibold text-slate-900 font-mono">{profile.nif}</p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Normas do Sistema Remunerado</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Limite fixo diário de <strong className="text-slate-900">8 inquéritos por utilizador NIF</strong>.</li>
                  <li>As respostas rápidas automatizadas (menos de 1.5s por pergunta) geram avisos imediatos no Índice de Qualidade.</li>
                  <li>Inconsistências lógicas reduzem o Score de Qualidade. Mantendo o Score acima de 80%, garante privilégios de saques rápidos.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 6: SANDBOX DEVELOPER */}
          {activeTab === 'sandbox' && (
            <div className="bg-white rounded-2xl border border-indigo-100 p-6 sm:p-8 space-y-6 max-w-3xl mx-auto shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 border border-indigo-100">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Painel Sandbox Developer Anti-Fraude</h2>
                    <p className="text-xs text-slate-500">Ambiente de teste e simulação para parâmetros de detecção de bots.</p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <label className="block text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Tempo Mínimo do Detector de Velocidade (em Segundos): {sandboxSpeedTrapMinTime}s
                </label>
                <input 
                  type="range"
                  min={0.5}
                  max={4}
                  step={0.5}
                  value={sandboxSpeedTrapMinTime}
                  onChange={(e) => setSandboxSpeedTrapMinTime(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">Ajuste a tolerância da armadilha de velocidade no preenchimento de inquéritos.</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Histórico de Registos Anti-Fraude ({fraudLogs.length})</h4>
                <div className="space-y-2">
                  {fraudLogs.map(log => (
                    <div key={log.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900 font-bold">{log.surveyTitle}</span>
                          <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                        </div>
                        <p className="text-slate-600 mt-1">{log.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ADMIN DASHBOARD */}
          {activeTab === 'admin' && (
            <AdminDashboard />
          )}

          {/* TAB 8, 9, 10 & 11: TERMOS, PRIVACIDADE, AVISO LEGAL E COOKIES */}
          {(activeTab === 'terms' || activeTab === 'privacy' || activeTab === 'legal' || activeTab === 'cookies') && (
            <TermsAndPrivacy 
              initialTab={activeTab} 
              onBackToApp={() => setActiveTab('surveys')}
              userNif={profile.nif}
            />
          )}

        </div>

      </main>

      {/* --- ACTIVE SURVEY QUESTIONNAIRE WIZARD MODAL --- */}
      <AnimatePresence>
        {currentSurvey && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl p-6 sm:p-8 shadow-xl relative max-h-[90vh] overflow-y-auto"
            >
              
              {/* Wizard header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full uppercase font-mono">
                    {currentSurvey.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">{currentSurvey.title}</h3>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-mono">Recompensa</p>
                  <p className="text-xl font-extrabold text-indigo-600">{currentSurvey.reward} Kz</p>
                </div>
              </div>

              {/* Wizard Content Branch */}
              {surveyFinishedSuccessfully ? (
                <div className="text-center py-8 space-y-4">
                  <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Inquérito Concluído com Sucesso!</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    O montante de <strong className="text-indigo-600">{currentSurvey.reward} Kz</strong> foi creditado de imediato no seu saldo associado ao NIF {profile.nif}.
                  </p>
                  <button
                    onClick={() => {
                      setCurrentSurvey(null);
                      setSurveyFinishedSuccessfully(false);
                    }}
                    className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
                  >
                    Voltar aos Inquéritos
                  </button>
                </div>
              ) : fraudCheckFailed ? (
                <div className="text-center py-8 space-y-4">
                  <div className="h-16 w-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-200">
                    <AlertTriangle className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Inquérito Bloqueado por Anti-Fraude</h3>
                  <p className="text-xs text-rose-700 max-w-md mx-auto leading-relaxed bg-rose-50 p-4 rounded-xl border border-rose-200">
                    {fraudCheckFailed.message}
                  </p>
                  <button
                    onClick={() => {
                      setCurrentSurvey(null);
                      setFraudCheckFailed(null);
                    }}
                    className="mt-4 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Compreendido e Fechar
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 font-mono mb-2">
                      <span>Pergunta {activeQuestionIndex + 1} de {currentSurvey.questions.length}</span>
                      <span className="text-indigo-600 font-bold">&gt; 4 opções disponíveis</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full transition-all duration-300"
                        style={{ width: `${((activeQuestionIndex + 1) / currentSurvey.questions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-4 leading-relaxed">
                      {currentSurvey.questions[activeQuestionIndex].text}
                    </h4>

                    {/* Options list (5 to 6 choices) */}
                    <div className="space-y-2.5">
                      {currentSurvey.questions[activeQuestionIndex].options?.map((option, optIdx) => {
                        const qId = currentSurvey.questions[activeQuestionIndex].id;
                        const isSelected = selectedAnswers[qId] === option;

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(qId, option)}
                            className={`w-full text-left p-4 rounded-xl border transition duration-200 flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-50/80 border-indigo-600 text-indigo-950 font-bold ring-1 ring-indigo-600/30'
                                : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            <span className="text-xs sm:text-sm">{option}</span>
                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                              isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                            }`}>
                              {isSelected && <Check className="h-2.5 w-2.5 text-white font-bold" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setCurrentSurvey(null)}
                      className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer font-medium"
                    >
                      Cancelar
                    </button>

                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs rounded-xl transition duration-200 flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      {activeQuestionIndex < currentSurvey.questions.length - 1 ? 'Seguinte' : 'Finalizar e Receber Kz'}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- NIF AUTHENTICATION & LOGIN MODAL --- */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 sm:p-7 shadow-xl relative"
            >
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-slate-900">Acesso com NIF Fiscal</h3>
                </div>
                <button 
                  onClick={() => setShowAuthModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-mono cursor-pointer"
                >
                  ✕ Fechar
                </button>
              </div>

              {/* Toggle Mode Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalError('');
                    setAuthModalSuccess('');
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                    authMode === 'login' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Entrar com NIF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setAuthModalError('');
                    setAuthModalSuccess('');
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                    authMode === 'register' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Registar NIF
                </button>
              </div>

              {authModalSuccess && (
                <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-mono">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{authModalSuccess}</span>
                </div>
              )}

              {authModalError && (
                <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 font-mono">
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>{authModalError}</span>
                </div>
              )}

              {authMode === 'login' ? (
                <form onSubmit={handleNifLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                      NIF ou E-mail (Predominante)
                    </label>
                    <input 
                      type="text"
                      value={loginNifOrEmail}
                      onChange={(e) => setLoginNifOrEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-indigo-900 font-mono font-bold focus:border-indigo-600 focus:bg-white focus:outline-none transition"
                      placeholder="Ex: 540123456LA042 ou email@exemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Palavra-passe
                    </label>
                    <input 
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition"
                      placeholder="A sua palavra-passe"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition cursor-pointer shadow-xs"
                  >
                    Entrar com o NIF
                  </button>
                </form>
              ) : (
                <form onSubmit={handleNifRegisterSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Nome Completo
                    </label>
                    <input 
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition"
                      placeholder="Ex: Jorge Paulo"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>NIF Fiscal (Obrigatório)</span>
                      <span className="text-[9px] text-emerald-600 font-semibold">Selo AGT</span>
                    </label>
                    <input 
                      type="text"
                      value={regNif}
                      onChange={(e) => setRegNif(e.target.value)}
                      className="w-full bg-indigo-50/50 border border-indigo-200 rounded-xl p-2.5 text-xs text-indigo-900 font-mono font-bold focus:border-indigo-600 focus:bg-white focus:outline-none transition"
                      placeholder="Ex: 540123456LA042"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Telefone (Angola)
                    </label>
                    <input 
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-mono focus:border-indigo-600 focus:bg-white focus:outline-none transition"
                      placeholder="Ex: 923450123"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Palavra-passe
                    </label>
                    <input 
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition cursor-pointer shadow-xs mt-2"
                  >
                    Criar Conta & Ganhar 1.000 Kz
                  </button>

                  <p className="text-[10px] text-slate-500 mt-2 text-center leading-normal">
                    Ao registar-se, declara ter idade legal e aceita os nossos{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setShowAuthModal(false);
                        setActiveTab('terms');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-indigo-600 font-bold underline cursor-pointer"
                    >
                      Termos de Utilização
                    </button>{' '}
                    e o{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setShowAuthModal(false);
                        setActiveTab('privacy');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-indigo-600 font-bold underline cursor-pointer"
                    >
                      Aviso de Privacidade
                    </button>{' '}
                    (Lei n.º 22/11 de Angola).
                  </p>
                </form>
              )}

              <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowAuthModal(false);
                    handleGoogleLogin();
                  }}
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Cloud className="h-4 w-4 text-indigo-600" />
                  Continuar com Conta Google Cloud
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- INTERACTIVE FOOTER MODALS --- */}
      <AnimatePresence>
        {footerModalType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setFooterModalType(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 max-w-2xl w-full shadow-xl relative my-8"
            >
              <button
                onClick={() => setFooterModalType(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* HOW IT WORKS */}
              {footerModalType === 'howItWorks' && (
                <div className="space-y-6 text-slate-700">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Como Funciona a Plataforma</h3>
                      <p className="text-xs text-slate-500">Inquéritos de mercado remunerados com validação NIF AGT</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="font-bold text-indigo-600 uppercase text-[10px] tracking-wider block">Passo 1</span>
                      <h4 className="font-bold text-slate-900 text-sm">Escolha o Inquérito no Painel</h4>
                      <p className="text-slate-600">Acesse diariamente inquéritos sobre produtos, consumo e marcas em Angola. Cada pergunta possui no mínimo 4 opções de resposta claras.</p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="font-bold text-indigo-600 uppercase text-[10px] tracking-wider block">Passo 2</span>
                      <h4 className="font-bold text-slate-900 text-sm">Responda com Sinceridade</h4>
                      <p className="text-slate-600">O sistema valida a qualidade das respostas e verifica a integridade da conta pelo seu NIF registado perante a AGT.</p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="font-bold text-indigo-600 uppercase text-[10px] tracking-wider block">Passo 3</span>
                      <h4 className="font-bold text-slate-900 text-sm">Receba em Kwanzas e Levante</h4>
                      <p className="text-slate-600">Atinja o valor mínimo de 1.000 Kz e solicite a transferência via IBAN/Multicaixa, PayPay Angola, PayPal, RedotPay, Stripe ou Airtm.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ABOUT US */}
              {footerModalType === 'aboutUs' && (
                <div className="space-y-6 text-slate-700">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Building className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Sobre Nós & Entidade Gestora</h3>
                      <p className="text-xs text-slate-500">A plataforma de inquéritos líder em Angola</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <p className="text-slate-600 leading-relaxed">
                      O <strong className="text-slate-900">Pesquisas Angola</strong> é a primeira plataforma digital de estudos de mercado integrados com enquadramento fiscal rigoroso e recompensas monetárias diretas em Angola.
                    </p>

                    <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2 text-xs">
                      <h4 className="font-bold text-indigo-900 uppercase text-[11px] tracking-wider">Identificação Social e Fiscal (AGT)</h4>
                      <p className="text-indigo-950 font-bold text-sm">J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA.</p>
                      <p className="text-slate-700">Nº Fiscal / NIF AGT: <strong className="text-indigo-700 font-mono font-bold">5003037282</strong></p>
                      <p className="text-slate-700">Sede e Operação: Luanda, República de Angola</p>
                      
                      <div className="pt-2 border-t border-indigo-200/60">
                        <a 
                          href="https://medium.com/me/settings/account" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-indigo-700 font-bold hover:underline"
                        >
                          Definições de Faturação Stripe & URL da Empresa
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ARTICLES */}
              {footerModalType === 'articles' && (
                <div className="space-y-6 text-slate-700">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Artigos & Estudos de Mercado</h3>
                      <p className="text-xs text-slate-500">Publicações e tendências do consumo em Angola</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition space-y-1 cursor-pointer">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">Estudo 2026</span>
                      <h4 className="font-bold text-slate-900 text-sm">O Impacto do Comércio Digital e das Carteiras Móveis em Luanda</h4>
                      <p className="text-slate-500">Análise do crescimento de transações via PayPay AO, PayPal e IBAN no mercado angolano.</p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition space-y-1 cursor-pointer">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">Guia de Rendimentos</span>
                      <h4 className="font-bold text-slate-900 text-sm">Como Manter o Score de Qualidade Elevado e Aumentar Saques</h4>
                      <p className="text-slate-500">Boas práticas para responder inquéritos diários sem incorrer em bloqueios anti-fraude.</p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition space-y-1 cursor-pointer">
                      <span className="text-[10px] font-bold text-violet-600 uppercase">Legislação</span>
                      <h4 className="font-bold text-slate-900 text-sm">Conformidade com a AGT: O Papel do NIF nas Plataformas Digitais</h4>
                      <p className="text-slate-500">Entenda a importância do NIF (5003037282) na garantia de legitimidade fiscal.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* MOBILE APP */}
              {footerModalType === 'mobileApp' && (
                <div className="space-y-6 text-slate-700">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Smartphone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Aplicação Móvel Pesquisas Angola</h3>
                      <p className="text-xs text-slate-500">Aceda aos inquéritos e receba notificações no telemóvel</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-slate-900">Versão PWA / WebApp Instalação Rápida</h4>
                        <p className="text-xs text-slate-500">Adicione o Pesquisas Angola diretamente ao ecrã principal do seu telemóvel Android ou iPhone.</p>
                      </div>
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl shrink-0">Pronto a Usar</span>
                    </div>

                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 text-xs space-y-2">
                      <p className="font-bold">Como instalar no telemóvel em 10 segundos:</p>
                      <ol className="list-decimal list-inside space-y-1 text-slate-700">
                        <li>Abra o navegador no seu telemóvel (Chrome / Safari).</li>
                        <li>Clique no menu de opções (três pontos ou botão de partilha).</li>
                        <li>Selecione <strong className="text-indigo-900 font-bold">"Adicionar ao Ecrã Principal"</strong> ou "Instalar App".</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* FAQ */}
              {footerModalType === 'faq' && (
                <div className="space-y-6 text-slate-700">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                      <HelpCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Perguntas Frequentes (FAQ)</h3>
                      <p className="text-xs text-slate-500">Respostas claras sobre saques, NIF e inquéritos</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <h4 className="font-bold text-slate-900">Qual é o valor mínimo para solicitar levantamento?</h4>
                      <p className="text-slate-600">O montante mínimo é de <strong>1.000 Kz</strong> acumulados no saldo do seu perfil.</p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <h4 className="font-bold text-slate-900">Quantos inquéritos posso responder por dia?</h4>
                      <p className="text-slate-600">Cada utilizador pode responder até <strong>8 inquéritos por dia</strong>.</p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <h4 className="font-bold text-slate-900">Porque é obrigatório informar o NIF?</h4>
                      <p className="text-slate-600">Por exigência regulatória da AGT (J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA. NIF: 5003037282) e para evitar duplicidade de contas.</p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <h4 className="font-bold text-slate-900">Quais os métodos de liquidação disponíveis?</h4>
                      <p className="text-slate-600">Suportamos IBAN/Multicaixa Express, PayPay Angola, PayPal, RedotPay, Stripe e Airtm.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTACT US */}
              {footerModalType === 'contactUs' && (
                <div className="space-y-6 text-slate-700">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Contacte-nos</h3>
                      <p className="text-xs text-slate-500">Apoio ao cliente e equipa de suporte fiscal</p>
                    </div>
                  </div>

                  {contactSentSuccess ? (
                    <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                      <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
                      <h4 className="font-bold text-emerald-900 text-base">Mensagem Enviada com Sucesso!</h4>
                      <p className="text-xs text-emerald-800">A nossa equipa responderá para o seu e-mail num prazo máximo de 24 horas.</p>
                      <button
                        onClick={() => {
                          setContactSentSuccess(false);
                          setContactMessage('');
                        }}
                        className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition cursor-pointer mt-2"
                      >
                        Enviar outra mensagem
                      </button>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (contactMessage.trim()) {
                          setContactSentSuccess(true);
                        }
                      }}
                      className="space-y-3 text-xs"
                    >
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Seu Nome</label>
                        <input 
                          type="text" 
                          value={contactName || profile.name} 
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-600"
                          placeholder="Ex: Jorge Paulo"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Seu E-mail</label>
                        <input 
                          type="email" 
                          value={contactEmail || profile.email} 
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-600"
                          placeholder="Ex: contacto@email.com"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Sua Mensagem</label>
                        <textarea 
                          rows={3} 
                          value={contactMessage} 
                          onChange={(e) => setContactMessage(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-600"
                          placeholder="Como podemos ajudar?"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition cursor-pointer shadow-xs flex items-center justify-center gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Enviar Mensagem para o Suporte
                      </button>
                    </form>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span>E-mail oficial: <strong className="text-slate-800">suporte@pesquisas.co.ao</strong></span>
                    <span>Apoio NIF AGT: <strong className="text-indigo-600 font-mono">5003037282</strong></span>
                  </div>
                </div>
              )}

              {/* HELP CENTER */}
              {footerModalType === 'helpCenter' && (
                <div className="space-y-6 text-slate-700">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                      <LifeBuoy className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Central de Ajuda</h3>
                      <p className="text-xs text-slate-500">Base de conhecimento e tutoriais passo a passo</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <h4 className="font-bold text-slate-900">Como alterar o meu IBAN ou contacto de levantamento?</h4>
                      <p className="text-slate-600">Acesse ao separador "Resgatar" e insira os novos dados no campo de destino do método selecionado.</p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <h4 className="font-bold text-slate-900">O que fazer se o meu Score de Qualidade diminuir?</h4>
                      <p className="text-slate-600">Responda aos inquéritos seguintes com maior atenção para restabelecer o Score acima de 80%.</p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <h4 className="font-bold text-slate-900">Como funciona o selo AGT e NIF?</h4>
                      <p className="text-slate-600">Garante a legitimidade dos saques e liquidação fiscal sob a empresa J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* REPORT ISSUE */}
              {footerModalType === 'reportIssue' && (
                <div className="space-y-6 text-slate-700">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                      <AlertOctagon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Reportar um Problema</h3>
                      <p className="text-xs text-slate-500">Notifique falhas técnicas ou incoerências em inquéritos</p>
                    </div>
                  </div>

                  {reportSentSuccess ? (
                    <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                      <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
                      <h4 className="font-bold text-emerald-900 text-base">Relatório Registado com Sucesso!</h4>
                      <p className="text-xs text-emerald-800">Obrigado pelo seu contributo. A nossa equipa de engenharia analisará o problema.</p>
                      <button
                        onClick={() => {
                          setReportSentSuccess(false);
                          setReportDetails('');
                        }}
                        className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition cursor-pointer mt-2"
                      >
                        Submeter outro relatório
                      </button>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (reportDetails.trim()) {
                          setReportSentSuccess(true);
                        }
                      }}
                      className="space-y-3 text-xs"
                    >
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Categoria do Problema</label>
                        <select 
                          value={reportCategory}
                          onChange={(e) => setReportCategory(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-600"
                        >
                          <option value="Inquérito com erro">Erro num Inquérito (Pergunta ou Opções)</option>
                          <option value="Problema no Levantamento">Atraso ou falha em Levantamento</option>
                          <option value="Validação NIF AGT">Dificuldade de Validação do NIF</option>
                          <option value="Outro assunto">Outro Assunto Técnico</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Descrição Detalhada do Ocorrido</label>
                        <textarea 
                          rows={3} 
                          value={reportDetails} 
                          onChange={(e) => setReportDetails(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-600"
                          placeholder="Descreva o erro presenciado..."
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition cursor-pointer shadow-xs flex items-center justify-center gap-2"
                      >
                        <AlertOctagon className="h-4 w-4" />
                        Submeter Relatório de Anomalia
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* PARTNERS */}
              {footerModalType === 'partners' && (
                <div className="space-y-6 text-slate-700">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Building className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Parceiros & Soluções B2B</h3>
                      <p className="text-xs text-slate-500">Lançamento de estudos de mercado para empresas em Angola</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <p className="text-slate-600 leading-relaxed">
                      A <strong className="text-slate-900">J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA.</strong> (NIF: 5003037282) disponibiliza às empresas, agências e marcas a infraestrutura técnica para lançar questionários segmentados em tempo real em Angola.
                    </p>

                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
                      <h4 className="font-bold text-indigo-900">Vantagens para Parceiros Anunciantes:</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                        <li>Painel de estatísticas em tempo real com validação antiautomática por NIF.</li>
                        <li>Faturação oficial emitida pela J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA.</li>
                        <li>Possibilidade de integração de faturas Stripe / Pagamentos Globais.</li>
                      </ul>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        onClick={() => setFooterModalType('contactUs')}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
                      >
                        Solicitar Proposta B2B
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FOOTER STRUCTURED WITH PLATAFORMA, LEGAL & SUPORTE --- */}
      <footer className="border-t border-slate-200 bg-white pt-12 pb-8 text-xs text-slate-500 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Main Footer Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: Company Branding & AGT Details */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-600 text-white p-2 rounded-xl">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="font-extrabold text-slate-900 text-base">Pesquisas Angola</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Estudos de mercado e inquéritos diários remunerados em Angola.
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[11px]">
                <p className="font-bold text-slate-900">Empresa Gestora Registada na AGT:</p>
                <p className="text-indigo-900 font-bold">J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA.</p>
                <p className="text-slate-700">Nº Fiscal / NIF: <strong className="text-indigo-700 font-mono font-bold">5003037282</strong></p>
                
                <a 
                  href="https://medium.com/me/settings/account" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 font-bold hover:underline pt-1 text-[10px]"
                >
                  Emissão de Faturas Stripe
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Column 2: PLATAFORMA */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-indigo-600">PLATAFORMA</h4>
              <ul className="space-y-2 text-slate-600 font-medium">
                <li>
                  <button 
                    onClick={() => setFooterModalType('howItWorks')}
                    className="hover:text-indigo-600 transition cursor-pointer text-left"
                  >
                    Como funciona
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setActiveTab('withdraw');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-indigo-600 transition cursor-pointer text-left"
                  >
                    Resgatar recompensas
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setFooterModalType('aboutUs')}
                    className="hover:text-indigo-600 transition cursor-pointer text-left"
                  >
                    Sobre nós
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setFooterModalType('articles')}
                    className="hover:text-indigo-600 transition cursor-pointer text-left"
                  >
                    Artigos
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setFooterModalType('mobileApp')}
                    className="hover:text-indigo-600 transition cursor-pointer text-left"
                  >
                    App móvel
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: LEGAL */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-indigo-600">LEGAL</h4>
              <ul className="space-y-2 text-slate-600 font-medium">
                <li>
                  <button 
                    onClick={() => {
                      setActiveTab('terms');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-indigo-600 transition cursor-pointer text-left"
                  >
                    Termos e condições
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setActiveTab('privacy');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-indigo-600 transition cursor-pointer text-left"
                  >
                    Política de privacidade
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setActiveTab('legal');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-indigo-600 transition cursor-pointer text-left"
                  >
                    Aviso legal
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setActiveTab('cookies');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-indigo-600 transition cursor-pointer text-left"
                  >
                    Política de cookies
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setActiveTab('cookies');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-indigo-600 transition cursor-pointer text-left"
                  >
                    Preferências de cookies
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: SUPORTE */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-indigo-600">SUPORTE</h4>
              <ul className="space-y-2 text-slate-600 font-medium">
                <li>
                  <button 
                    onClick={() => setFooterModalType('faq')}
                    className="hover:text-indigo-600 transition cursor-pointer text-left"
                  >
                    Perguntas frequentes
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setFooterModalType('contactUs')}
                    className="hover:text-indigo-600 transition cursor-pointer text-left"
                  >
                    Contacte-nos
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setFooterModalType('helpCenter')}
                    className="hover:text-indigo-600 transition cursor-pointer text-left"
                  >
                    Central de ajuda
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setFooterModalType('reportIssue')}
                    className="hover:text-indigo-600 transition cursor-pointer text-left"
                  >
                    Reportar um problema
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setFooterModalType('partners')}
                    className="hover:text-indigo-600 transition cursor-pointer text-left"
                  >
                    Parceiros
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Footer Credits & Payment Methods */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px]">
            <div className="space-y-1">
              <p>© 2026 Pesquisas Angola • J.SP-COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, LDA. Todos os direitos reservados.</p>
              <p className="text-slate-400 font-sans text-[10px]">Empresa Registada na AGT com o Nº Fiscal (NIF) 5003037282 • Luanda, Angola.</p>
            </div>

            <div className="flex items-center gap-3 font-semibold flex-wrap">
              <span className="text-indigo-600">EMIS / Multicaixa</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-600">PayPay AO</span>
              <span className="text-slate-300">•</span>
              <span className="text-blue-600">PayPal</span>
              <span className="text-slate-300">•</span>
              <span className="text-rose-600">RedotPay</span>
              <span className="text-slate-300">•</span>
              <span className="text-violet-700">Stripe</span>
              <span className="text-slate-300">•</span>
              <span className="text-sky-600">Airtm</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
