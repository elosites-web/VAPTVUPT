import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertCircle,
  ArrowUpRight,
  Paperclip,
  FileText,
  CheckCircle2,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Truck,
  Briefcase,
  X,
  Check,
} from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { WhatsAppIcon } from './WhatsAppIcon';

interface RecruitmentFormState {
  nomeCompleto: string;
  email: string;
  telefone: string;
  cidadeBairro: string;
  categoriaCnh: string;
  vagaPretendida: string;
  consentimento: boolean;
}

const INITIAL_STATE: RecruitmentFormState = {
  nomeCompleto: '',
  email: '',
  telefone: '',
  cidadeBairro: '',
  categoriaCnh: '',
  vagaPretendida: '',
  consentimento: false,
};

// Opções de categorias de CNH brasileiras sem solicitar números ou documentos
const OPCOES_CNH = [
  { value: '', label: 'Selecione a categoria da sua CNH...' },
  { value: 'Categoria B (Carro de Passeio / Utilitário)', label: 'Categoria B (Carro de Passeio / Utilitário)' },
  { value: 'Categoria C (Caminhão / Carga)', label: 'Categoria C (Caminhão / Carga)' },
  { value: 'Categoria D (Passageiros / Veículos Especiais)', label: 'Categoria D (Passageiros / Veículos Especiais)' },
  { value: 'Categoria E (Cavalo Mecânico / Articulados / Prancha Pesada)', label: 'Categoria E (Cavalo Mecânico / Articulados / Prancha Pesada)' },
  { value: 'Categorias AB (Carro e Moto)', label: 'Categorias AB (Carro e Moto)' },
  { value: 'Categorias AC (Caminhão e Moto)', label: 'Categorias AC (Caminhão e Moto)' },
  { value: 'Categorias AD (Passageiros e Moto)', label: 'Categorias AD (Passageiros e Moto)' },
  { value: 'Categorias AE (Cavalo Mecânico e Moto)', label: 'Categorias AE (Cavalo Mecânico e Moto)' },
  { value: 'Categoria A (Apenas Moto)', label: 'Categoria A (Apenas Moto)' },
  { value: 'Não possuo CNH', label: 'Não possuo CNH / Outras áreas' },
];

// Lista oficial padronizada de áreas e vagas de interesse
const OPCOES_VAGAS = [
  { value: '', label: 'Selecione a vaga ou área de interesse' },
  { value: 'Motorista de Guincho Leve', label: 'Motorista de Guincho Leve' },
  { value: 'Motorista de Guincho Pesado', label: 'Motorista de Guincho Pesado' },
  { value: 'Motorista de Plataforma', label: 'Motorista de Plataforma' },
  { value: 'Motorista de Caminhão / Cavalo Mecânico', label: 'Motorista de Caminhão / Cavalo Mecânico' },
  { value: 'Operador(a) de Pátio', label: 'Operador(a) de Pátio' },
  { value: 'Auxiliar Operacional', label: 'Auxiliar Operacional' },
  { value: 'Auxiliar de Logística', label: 'Auxiliar de Logística' },
  { value: 'Assistente Administrativo', label: 'Assistente Administrativo' },
  { value: 'Atendimento ao Cliente', label: 'Atendimento ao Cliente' },
  { value: 'Comercial / Vendas', label: 'Comercial / Vendas' },
  { value: 'Outra Área de Interesse', label: 'Outra Área de Interesse' },
];

export const WhatsAppRecruitmentForm: React.FC = () => {
  // Pure client-side component state — zero persistência em backend, cookies, localStorage ou rastreamento
  const [formData, setFormData] = useState<RecruitmentFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof RecruitmentFormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [toastNotification, setToastNotification] = useState<{
    title: string;
    message: string;
    step: 'preparing' | 'ready';
  } | null>(null);

  const timeoutRef = useRef<number | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const nomeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const telefoneRef = useRef<HTMLInputElement>(null);
  const cidadeRef = useRef<HTMLInputElement>(null);
  const cnhRef = useRef<HTMLSelectElement>(null);
  const vagaRef = useRef<HTMLSelectElement>(null);
  const consentCheckboxRef = useRef<HTMLInputElement>(null);

  // Formatação de telefone brasileiro amigável enquanto digita
  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const validate = (): Partial<Record<keyof RecruitmentFormState, string>> => {
    const newErrors: Partial<Record<keyof RecruitmentFormState, string>> = {};

    // 1. Nome Completo
    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Por favor, informe seu nome completo.';
    } else if (formData.nomeCompleto.trim().length < 3) {
      newErrors.nomeCompleto = 'O nome completo deve conter no mínimo 3 caracteres.';
    }

    // 2. E-mail com validação básica de formato
    const emailTrimmed = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrimmed) {
      newErrors.email = 'Por favor, informe seu e-mail de contato.';
    } else if (!emailRegex.test(emailTrimmed)) {
      newErrors.email = 'Por favor, informe um endereço de e-mail válido (ex: nome@dominio.com).';
    }

    // 3. Telefone / WhatsApp
    const phoneDigits = formData.telefone.replace(/\D/g, '');
    if (!phoneDigits) {
      newErrors.telefone = 'Por favor, informe seu telefone com DDD.';
    } else if (phoneDigits.length < 10) {
      newErrors.telefone = 'Informe um telefone válido com DDD (mínimo de 10 dígitos).';
    }

    // 4. Cidade / Bairro
    if (!formData.cidadeBairro.trim()) {
      newErrors.cidadeBairro = 'Por favor, informe sua cidade e bairro de residência.';
    } else if (formData.cidadeBairro.trim().length < 2) {
      newErrors.cidadeBairro = 'Informe a cidade e bairro com pelo menos 2 caracteres.';
    }

    // 5. Categoria da CNH
    if (!formData.categoriaCnh) {
      newErrors.categoriaCnh = 'Por favor, selecione a categoria da sua CNH.';
    }

    // 6. Vaga pretendida (Select)
    if (!formData.vagaPretendida) {
      newErrors.vagaPretendida = 'Por favor, selecione a vaga ou área de interesse desejada.';
    }

    // 7. Consentimento LGPD Obrigatório
    if (!formData.consentimento) {
      newErrors.consentimento = 'É obrigatório declarar ciência e consentimento para prosseguir com a candidatura.';
    }

    setErrors(newErrors);
    return newErrors;
  };

  const focusField = (element: HTMLElement | null) => {
    if (!element) return;
    try {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch {
      // Fallback se scrollIntoView não for suportado
    }
    element.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    const orderedFields: (keyof RecruitmentFormState)[] = [
      'nomeCompleto',
      'email',
      'telefone',
      'cidadeBairro',
      'categoriaCnh',
      'vagaPretendida',
      'consentimento',
    ];

    const firstInvalidKey = orderedFields.find((key) => Boolean(validationErrors[key]));

    if (firstInvalidKey) {
      // Foco acessível no primeiro campo com erro em ordem visual do formulário
      const fieldRefMap: Record<keyof RecruitmentFormState, React.RefObject<HTMLElement | null>> = {
        nomeCompleto: nomeRef,
        email: emailRef,
        telefone: telefoneRef,
        cidadeBairro: cidadeRef,
        categoriaCnh: cnhRef,
        vagaPretendida: vagaRef,
        consentimento: consentCheckboxRef,
      };

      focusField(fieldRefMap[firstInvalidKey]?.current || null);
      return;
    }

    // Bloqueio rigoroso caso o consentimento não tenha sido confirmado
    if (!formData.consentimento) {
      focusField(consentCheckboxRef.current);
      return;
    }

    // Sanitização de entradas simples contra formatações indesejadas
    const cleanNome = formData.nomeCompleto.trim().replace(/[<>]/g, '');
    const cleanEmail = formData.email.trim().replace(/[<>]/g, '');
    const cleanTelefone = formData.telefone.trim();
    const cleanCidadeBairro = formData.cidadeBairro.trim().replace(/[<>]/g, '');
    const cleanCategoriaCnh = formData.categoriaCnh.trim();
    const cleanVagaPretendida = formData.vagaPretendida.trim();

    // Formato de mensagem oficial exigido para candidatura
    const messageLines = [
      'Olá! Gostaria de me candidatar a uma oportunidade na Vapt Vupt.',
      '',
      '*Dados do candidato*',
      `• Nome: ${cleanNome}`,
      `• E-mail: ${cleanEmail}`,
      `• Telefone: ${cleanTelefone}`,
      `• Cidade/Bairro: ${cleanCidadeBairro}`,
      `• Categoria da CNH: ${cleanCategoriaCnh}`,
      `• Vaga pretendida: ${cleanVagaPretendida}`,
      '',
      'Estou enviando meu currículo em anexo para análise.',
      '',
      'Agradeço pela oportunidade!',
    ];

    const fullMessage = messageLines.join('\n');
    const waUrl = `${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(fullMessage)}`;

    if (isSubmitting) return;

    setIsSubmitting(true);
    setIsSubmittedSuccess(false);

    // Exibe Toast de confirmação inicial antes do redirecionamento
    setToastNotification({
      title: 'Preparando Candidatura...',
      message: 'Formatando seus dados e abrindo o WhatsApp oficial da Vapt Vupt.',
      step: 'preparing',
    });

    // Feedback visual imediato durante fração de segundo (~550ms) antes do disparo da aba do WhatsApp
    timeoutRef.current = window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmittedSuccess(true);

      // Atualiza o Toast para instruir sobre o anexo manual do currículo
      setToastNotification({
        title: 'WhatsApp Oficial Aberto!',
        message: 'Lembre-se de anexar seu currículo (PDF ou Word) na conversa antes de enviar a mensagem.',
        step: 'ready',
      });

      // Disparo confiável de abertura em nova aba acionado por ação direta do usuário
      const link = document.createElement('a');
      link.href = waUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Auto-dispensa do toast após 9 segundos
      toastTimeoutRef.current = window.setTimeout(() => {
        setToastNotification(null);
      }, 9000);
    }, 550);
  };

  const handleChange = (field: keyof RecruitmentFormState, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (isSubmittedSuccess) {
      setIsSubmittedSuccess(false);
    }
  };

  return (
    <div
      id="formulario-recrutamento"
      className="relative bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 p-6 sm:p-8 lg:p-10 shadow-xl dark:shadow-2xl space-y-8 transition-colors"
    >
      {/* Toast Notificação Flutuante / Overlay Sutil de Sucesso */}
      {toastNotification && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] p-4 rounded-2xl bg-white/95 dark:bg-neutral-900/95 border border-emerald-500/40 dark:border-emerald-500/30 shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="flex items-start gap-3.5">
            <div
              className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                toastNotification.step === 'preparing'
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400'
                  : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {toastNotification.step === 'preparing' ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
                <Check className="w-5 h-5" aria-hidden="true" />
              )}
            </div>

            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                  {toastNotification.title}
                </h4>
                <button
                  type="button"
                  onClick={() => setToastNotification(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 -mr-1 rounded-md"
                  aria-label="Fechar notificação"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                {toastNotification.message}
              </p>
            </div>
          </div>
        </aside>
      )}

      {/* Cabeçalho do Formulário */}
      <div className="space-y-2 border-b border-slate-200 dark:border-neutral-800 pb-6">
        <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest font-heading">
          <span className="w-5 h-0.5 bg-[#B43034]" />
          <span>Inscrição Profissional Direta</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight font-heading">
          Cadastro de Candidatura Profissional
        </h2>
        <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
          Preencha seus dados essenciais abaixo. Ao clicar no botão, seu WhatsApp oficial será aberto com a apresentação pronta. Em seguida, basta anexar seu currículo (CV) em formato PDF ou documento na conversa para análise da nossa equipe de contratação.
        </p>
      </div>

      {/* Caixa de Orientação Clara sobre o Anexo do Currículo */}
      <div className="p-4 sm:p-5 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-300/80 dark:border-amber-800/60 flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 shrink-0 mt-0.5">
          <Paperclip className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm text-slate-800 dark:text-neutral-200">
          <strong className="block text-slate-900 dark:text-white font-bold uppercase tracking-wide font-heading">
            Como funciona o envio do currículo (CV)
          </strong>
          <p className="leading-relaxed">
            O site <strong>não faz upload automático</strong> de arquivos. Ao clicar em <em>&ldquo;Enviar Candidatura pelo WhatsApp&rdquo;</em>, o aplicativo do WhatsApp será aberto no seu aparelho com seus dados pré-preenchidos. O seu único passo seguinte será <strong>anexar manualmente o seu currículo em arquivo (PDF ou Word)</strong> no ícone de clipe do próprio WhatsApp e enviar a mensagem.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate aria-label="Formulário de Candidatura Profissional">
        {/* Linha 1: Nome Completo & E-mail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. Nome Completo */}
          <div>
            <label
              htmlFor="rec-nome"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1.5"
            >
              Nome Completo <span className="text-[#B43034]" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500">
                <User className="w-4 h-4" aria-hidden="true" />
              </div>
              <input
                ref={nomeRef}
                id="rec-nome"
                name="nomeCompleto"
                type="text"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.nomeCompleto)}
                aria-describedby={errors.nomeCompleto ? 'error-rec-nome' : undefined}
                autoComplete="name"
                value={formData.nomeCompleto}
                onChange={(e) => handleChange('nomeCompleto', e.target.value)}
                placeholder="Ex: Carlos Eduardo dos Santos"
                className={`w-full bg-slate-50 dark:bg-neutral-950 border rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#B43034] transition-colors ${
                  errors.nomeCompleto
                    ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20'
                    : 'border-slate-300 dark:border-neutral-800'
                }`}
              />
            </div>
            {errors.nomeCompleto && (
              <p
                id="error-rec-nome"
                role="alert"
                className="text-xs text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.nomeCompleto}</span>
              </p>
            )}
          </div>

          {/* 2. E-mail */}
          <div>
            <label
              htmlFor="rec-email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1.5"
            >
              E-mail para Contato <span className="text-[#B43034]" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500">
                <Mail className="w-4 h-4" aria-hidden="true" />
              </div>
              <input
                ref={emailRef}
                id="rec-email"
                name="email"
                type="email"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'error-rec-email' : undefined}
                autoComplete="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Ex: seuemail@exemplo.com.br"
                className={`w-full bg-slate-50 dark:bg-neutral-950 border rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#B43034] transition-colors ${
                  errors.email
                    ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20'
                    : 'border-slate-300 dark:border-neutral-800'
                }`}
              />
            </div>
            {errors.email && (
              <p
                id="error-rec-email"
                role="alert"
                className="text-xs text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>
        </div>

        {/* Linha 2: Telefone/WhatsApp & Cidade/Bairro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 3. Telefone / WhatsApp */}
          <div>
            <label
              htmlFor="rec-telefone"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1.5"
            >
              Telefone / WhatsApp <span className="text-[#B43034]" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500">
                <Phone className="w-4 h-4" aria-hidden="true" />
              </div>
              <input
                ref={telefoneRef}
                id="rec-telefone"
                name="telefone"
                type="tel"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.telefone)}
                aria-describedby={errors.telefone ? 'error-rec-telefone' : undefined}
                autoComplete="tel"
                value={formData.telefone}
                onChange={(e) => handleChange('telefone', formatPhone(e.target.value))}
                placeholder="(11) 99999-9999"
                className={`w-full bg-slate-50 dark:bg-neutral-950 border rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#B43034] transition-colors ${
                  errors.telefone
                    ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20'
                    : 'border-slate-300 dark:border-neutral-800'
                }`}
              />
            </div>
            {errors.telefone && (
              <p
                id="error-rec-telefone"
                role="alert"
                className="text-xs text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.telefone}</span>
              </p>
            )}
          </div>

          {/* 4. Cidade / Bairro */}
          <div>
            <label
              htmlFor="rec-cidade"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1.5"
            >
              Cidade / Bairro de Residência <span className="text-[#B43034]" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500">
                <MapPin className="w-4 h-4" aria-hidden="true" />
              </div>
              <input
                ref={cidadeRef}
                id="rec-cidade"
                name="cidadeBairro"
                type="text"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.cidadeBairro)}
                aria-describedby={errors.cidadeBairro ? 'error-rec-cidade' : undefined}
                autoComplete="address-level2"
                value={formData.cidadeBairro}
                onChange={(e) => handleChange('cidadeBairro', e.target.value)}
                placeholder="Ex: São Paulo - Zona Leste (Itaquera)"
                className={`w-full bg-slate-50 dark:bg-neutral-950 border rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#B43034] transition-colors ${
                  errors.cidadeBairro
                    ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20'
                    : 'border-slate-300 dark:border-neutral-800'
                }`}
              />
            </div>
            {errors.cidadeBairro && (
              <p
                id="error-rec-cidade"
                role="alert"
                className="text-xs text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.cidadeBairro}</span>
              </p>
            )}
          </div>
        </div>

        {/* Linha 3: Categoria da CNH & Vaga Pretendida (Dropdown Nativo) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 5. Categoria da CNH */}
          <div>
            <label
              htmlFor="rec-cnh"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1.5"
            >
              Categoria da CNH <span className="text-[#B43034]" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500">
                <Truck className="w-4 h-4" aria-hidden="true" />
              </div>
              <select
                ref={cnhRef}
                id="rec-cnh"
                name="categoriaCnh"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.categoriaCnh)}
                aria-describedby={errors.categoriaCnh ? 'error-rec-cnh' : 'help-rec-cnh'}
                value={formData.categoriaCnh}
                onChange={(e) => handleChange('categoriaCnh', e.target.value)}
                className={`w-full bg-slate-50 dark:bg-neutral-950 border rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B43034] transition-colors ${
                  errors.categoriaCnh
                    ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20'
                    : 'border-slate-300 dark:border-neutral-800'
                }`}
              >
                {OPCOES_CNH.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.categoriaCnh ? (
              <p
                id="error-rec-cnh"
                role="alert"
                className="text-xs text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.categoriaCnh}</span>
              </p>
            ) : (
              <p id="help-rec-cnh" className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1">
                Apenas a categoria. Não solicitamos número de registro, CPF ou fotos de documentos nesta etapa.
              </p>
            )}
          </div>

          {/* 6. Vaga Pretendida (Dropdown Nativo com Opções de Interesse) */}
          <div>
            <label
              htmlFor="rec-vaga"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1.5"
            >
              Vaga Pretendida ou Área de Interesse <span className="text-[#B43034]" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500">
                <Briefcase className="w-4 h-4" aria-hidden="true" />
              </div>
              <select
                ref={vagaRef}
                id="rec-vaga"
                name="vagaPretendida"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.vagaPretendida)}
                aria-describedby={errors.vagaPretendida ? 'error-rec-vaga' : 'help-rec-vaga'}
                value={formData.vagaPretendida}
                onChange={(e) => handleChange('vagaPretendida', e.target.value)}
                className={`w-full bg-slate-50 dark:bg-neutral-950 border rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B43034] transition-colors ${
                  errors.vagaPretendida
                    ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20'
                    : 'border-slate-300 dark:border-neutral-800'
                }`}
              >
                {OPCOES_VAGAS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.vagaPretendida ? (
              <p
                id="error-rec-vaga"
                role="alert"
                className="text-xs text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.vagaPretendida}</span>
              </p>
            ) : (
              <p id="help-rec-vaga" className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1 leading-normal">
                A lista acima representa áreas de interesse profissional para cadastro no banco de talentos e não garante a existência de vaga aberta imediata ou contratação.
              </p>
            )}
          </div>
        </div>

        {/* Checkbox de Consentimento Obrigatório (LGPD) */}
        <div className="pt-2">
          <div
            className={`p-3.5 sm:p-4 rounded-xl border transition-colors ${
              errors.consentimento
                ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20'
                : 'border-slate-300 dark:border-neutral-800 bg-slate-50/80 dark:bg-neutral-950/60'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                ref={consentCheckboxRef}
                type="checkbox"
                id="rec-consent"
                name="consentimento"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.consentimento)}
                aria-describedby={errors.consentimento ? 'error-rec-consent' : undefined}
                checked={formData.consentimento}
                onChange={(e) => handleChange('consentimento', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-neutral-700 text-[#B43034] focus:ring-2 focus:ring-[#B43034] focus:ring-offset-2 focus:outline-none accent-[#B43034] cursor-pointer shrink-0"
              />
              <label
                htmlFor="rec-consent"
                className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed cursor-pointer select-none"
              >
                Declaro que forneço voluntariamente meus dados pessoais para que a Vapt Vupt Remoção de Veículos possa analisar minha candidatura e entrar em contato sobre oportunidades profissionais, conforme a{' '}
                <Link
                  to="/politica-de-privacidade"
                  className="text-[#B43034] hover:underline font-semibold inline-flex items-center gap-0.5"
                >
                  <span>Política de Privacidade</span>
                  <ArrowUpRight className="w-3 h-3 inline" aria-hidden="true" />
                </Link>
                .{' '}
                <span className="text-[#B43034] font-bold" aria-hidden="true">*</span>
              </label>
            </div>
          </div>
          {errors.consentimento && (
            <p
              id="error-rec-consent"
              role="alert"
              className="text-xs text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1.5"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.consentimento}</span>
            </p>
          )}
        </div>

        {/* Aviso de Privacidade e Proteção de Dados (LGPD) */}
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-neutral-950/90 border border-slate-200 dark:border-neutral-800 text-xs text-slate-700 dark:text-neutral-300 leading-relaxed space-y-2">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#B43034] shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              Os dados fornecidos são mantidos exclusivamente na memória do seu navegador e não são gravados em banco de dados ou cookies pelo site. Ao clicar no botão abaixo, o aplicativo do WhatsApp oficial será aberto com os dados preenchidos para que você realize o envio voluntário. O WhatsApp é uma plataforma externa regida por suas próprias políticas de privacidade. Para mais informações, consulte nossa{' '}
              <Link
                to="/politica-de-privacidade"
                className="text-[#B43034] hover:underline font-semibold inline-flex items-center gap-0.5"
              >
                <span>Política de Privacidade</span>
                <ArrowUpRight className="w-3 h-3 inline" aria-hidden="true" />
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Botão de Envio Principal com Feedback Visual de Carregamento */}
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className={`w-full button-3d flex items-center justify-center gap-2 sm:gap-2.5 text-white text-[11px] min-[360px]:text-xs sm:text-sm font-bold uppercase tracking-tight min-[400px]:tracking-normal sm:tracking-wider px-3 sm:px-5 py-3 sm:py-3.5 rounded-lg shadow-xl transition-all font-heading ${
            isSubmitting
              ? 'bg-[#8F2428] cursor-wait opacity-95 ring-2 ring-red-400/40'
              : 'bg-[#B43034] hover:bg-[#8F2428] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B43034]'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 animate-spin text-white" aria-hidden="true" />
              <span className="text-center leading-tight">Preparando Candidatura...</span>
            </>
          ) : (
            <>
              <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-center leading-tight whitespace-normal sm:whitespace-nowrap">
                Enviar Candidatura pelo WhatsApp
              </span>
            </>
          )}
        </button>

        {/* Confirmação amigável de abertura recente */}
        {isSubmittedSuccess && (
          <div
            role="status"
            className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              O WhatsApp oficial foi aberto em uma nova aba com a sua mensagem pronta. Lembre-se de anexar seu currículo (PDF/documento) antes de enviar!
            </span>
          </div>
        )}

        {/* Informação sobre canal e segurança */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[11px] text-slate-500 dark:text-neutral-500 text-center sm:text-left">
          <span>Canal de WhatsApp oficial: {COMPANY_CONFIG.whatsapp.display}</span>
          <span className="flex items-center gap-1 text-slate-600 dark:text-neutral-400">
            <FileText className="w-3.5 h-3.5 text-[#B43034]" />
            Lembre-se de anexar o arquivo do seu currículo
          </span>
        </div>
      </form>
    </div>
  );
};
