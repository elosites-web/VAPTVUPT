import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, ArrowUpRight } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { WhatsAppIcon } from './WhatsAppIcon';

export interface WhatsAppContactFormProps {
  defaultServiceType?: string;
  defaultVehicleType?: string;
}

interface FormState {
  nome: string;
  tipoAtendimento: string;
  tipoVeiculo: string;
  cidadeRegiao: string;
  descricaoNecessidade: string;
}

const INITIAL_STATE: FormState = {
  nome: '',
  tipoAtendimento: 'Remoção de Veículo Leve',
  tipoVeiculo: 'Automóvel de Passeio (Hatch / Sedã)',
  cidadeRegiao: '',
  descricaoNecessidade: '',
};

export const WhatsAppContactForm: React.FC<WhatsAppContactFormProps> = ({
  defaultServiceType,
  defaultVehicleType,
}) => {
  // Pure in-memory component state — zero storage in localStorage, sessionStorage, cookies or external APIs
  const [formData, setFormData] = useState<FormState>(() => ({
    ...INITIAL_STATE,
    ...(defaultServiceType ? { tipoAtendimento: defaultServiceType } : {}),
    ...(defaultVehicleType ? { tipoVeiculo: defaultVehicleType } : {}),
  }));
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // Sync pre-selected service/vehicle when navigating between service detail pages
  useEffect(() => {
    if (defaultServiceType || defaultVehicleType) {
      setFormData((prev) => ({
        ...prev,
        ...(defaultServiceType ? { tipoAtendimento: defaultServiceType } : {}),
        ...(defaultVehicleType ? { tipoVeiculo: defaultVehicleType } : {}),
      }));
    }
  }, [defaultServiceType, defaultVehicleType]);

  const nomeInputRef = useRef<HTMLInputElement>(null);
  const atendimentoSelectRef = useRef<HTMLSelectElement>(null);
  const veiculoSelectRef = useRef<HTMLSelectElement>(null);
  const cidadeInputRef = useRef<HTMLInputElement>(null);
  const descricaoTextareaRef = useRef<HTMLTextAreaElement>(null);

  const validate = (): Partial<Record<keyof FormState, string>> => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Por favor, informe seu nome ou identificação.';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'O nome deve ter no mínimo 2 caracteres.';
    }

    if (!formData.tipoAtendimento) {
      newErrors.tipoAtendimento = 'Selecione o tipo de atendimento solicitado.';
    }

    if (!formData.tipoVeiculo) {
      newErrors.tipoVeiculo = 'Selecione o tipo de veículo.';
    }

    if (!formData.cidadeRegiao.trim()) {
      newErrors.cidadeRegiao = 'Informe a cidade ou região aproximada da ocorrência.';
    }

    if (!formData.descricaoNecessidade.trim()) {
      newErrors.descricaoNecessidade = 'Descreva resumidamente a situação do veículo.';
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    const errorKeys = Object.keys(validationErrors) as (keyof FormState)[];

    if (errorKeys.length > 0) {
      const firstError = errorKeys[0];
      if (firstError === 'nome') nomeInputRef.current?.focus();
      else if (firstError === 'tipoAtendimento') atendimentoSelectRef.current?.focus();
      else if (firstError === 'tipoVeiculo') veiculoSelectRef.current?.focus();
      else if (firstError === 'cidadeRegiao') cidadeInputRef.current?.focus();
      else if (firstError === 'descricaoNecessidade') descricaoTextareaRef.current?.focus();
      return;
    }

    // Sanitização de entradas simples contra caracteres de formatação
    const cleanNome = formData.nome.trim().replace(/[<>]/g, '');
    const cleanAtendimento = formData.tipoAtendimento.trim();
    const cleanVeiculo = formData.tipoVeiculo.trim();
    const cleanCidade = formData.cidadeRegiao.trim().replace(/[<>]/g, '');
    const cleanDescricao = formData.descricaoNecessidade.trim().replace(/[<>]/g, '');

    // Montagem organizada e padronizada da mensagem
    const messageLines = [
      'Olá! Gostaria de consultar atendimento com a Vapt Vupt:',
      `• Nome: ${cleanNome}`,
      `• Atendimento: ${cleanAtendimento}`,
      `• Tipo de Veículo: ${cleanVeiculo}`,
      `• Cidade / Região: ${cleanCidade}`,
      `• Situação / Detalhes: ${cleanDescricao}`,
    ];

    const fullMessage = messageLines.join('\n');
    const waUrl = `${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(fullMessage)}`;

    // Redirecionamento direto ao WhatsApp oficial com fallback contra bloqueador de nova aba
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div id="solicitar-atendimento" className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 p-6 sm:p-8 shadow-xl dark:shadow-2xl space-y-6 transition-colors">
      <div>
        <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-1.5 font-heading">
          <span className="w-4 h-0.5 bg-[#B43034]" />
          <span>Atendimento Direto & Ágil</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight font-heading">
          Formulário de Solicitação de Atendimento
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 mt-1 leading-relaxed">
          Preencha os campos abaixo para preparar sua mensagem estruturada para a nossa equipe no WhatsApp.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Nome */}
        <div>
          <label
            htmlFor="field-nome"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1.5"
          >
            Nome Completo ou Identificação <span className="text-[#B43034]" aria-hidden="true">*</span>
          </label>
          <input
            ref={nomeInputRef}
            id="field-nome"
            name="nome"
            type="text"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.nome)}
            aria-describedby={errors.nome ? 'error-nome' : undefined}
            value={formData.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            placeholder="Ex: Carlos Eduardo"
            className={`w-full bg-slate-50 dark:bg-neutral-950 border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#B43034] transition-colors ${
              errors.nome ? 'border-red-500 bg-red-50 dark:bg-red-950/10' : 'border-slate-300 dark:border-neutral-800'
            }`}
          />
          {errors.nome && (
            <p
              id="error-nome"
              role="alert"
              className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.nome}</span>
            </p>
          )}
        </div>

        {/* Tipo de Atendimento & Tipo de Veículo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="field-atendimento"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1.5"
            >
              Tipo de Atendimento <span className="text-[#B43034]" aria-hidden="true">*</span>
            </label>
            <select
              ref={atendimentoSelectRef}
              id="field-atendimento"
              name="tipoAtendimento"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.tipoAtendimento)}
              aria-describedby={errors.tipoAtendimento ? 'error-atendimento' : undefined}
              value={formData.tipoAtendimento}
              onChange={(e) => handleChange('tipoAtendimento', e.target.value)}
              className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B43034]"
            >
              <option value="Remoção de Veículo Leve">Remoção de Veículo Leve (Prancha)</option>
              <option value="Remoção de Veículo Pesado">Remoção de Veículo Pesado / Caminhão</option>
              <option value="Soluções em Remoção / Transporte Logístico">Soluções em Remoção / Logística</option>
              <option value="Transferência Programada">Transferência Programada</option>
              <option value="Outro Atendimento">Outro Atendimento sob Consulta</option>
            </select>
            {errors.tipoAtendimento && (
              <p
                id="error-atendimento"
                role="alert"
                className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.tipoAtendimento}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="field-veiculo"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1.5"
            >
              Tipo de Veículo <span className="text-[#B43034]" aria-hidden="true">*</span>
            </label>
            <select
              ref={veiculoSelectRef}
              id="field-veiculo"
              name="tipoVeiculo"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.tipoVeiculo)}
              aria-describedby={errors.tipoVeiculo ? 'error-veiculo' : undefined}
              value={formData.tipoVeiculo}
              onChange={(e) => handleChange('tipoVeiculo', e.target.value)}
              className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B43034]"
            >
              <option value="Automóvel de Passeio (Hatch / Sedã)">Automóvel de Passeio (Hatch / Sedã)</option>
              <option value="SUV / Picape / Caminhonete">SUV / Picape / Caminhonete</option>
              <option value="Van / Furgão Comercial">Van / Furgão Comercial</option>
              <option value="Caminhão Leve / Médio">Caminhão Leve / Médio</option>
              <option value="Cavalo Mecânico / Caminhão Pesado">Cavalo Mecânico / Caminhão Pesado</option>
              <option value="Outro Veículo">Outro Veículo</option>
            </select>
            {errors.tipoVeiculo && (
              <p
                id="error-veiculo"
                role="alert"
                className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.tipoVeiculo}</span>
              </p>
            )}
          </div>
        </div>

        {/* Cidade ou Região */}
        <div>
          <label
            htmlFor="field-cidade"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1.5"
          >
            Cidade ou Região da Ocorrência <span className="text-[#B43034]" aria-hidden="true">*</span>
          </label>
          <input
            ref={cidadeInputRef}
            id="field-cidade"
            name="cidadeRegiao"
            type="text"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.cidadeRegiao)}
            aria-describedby={errors.cidadeRegiao ? 'error-cidade' : undefined}
            value={formData.cidadeRegiao}
            onChange={(e) => handleChange('cidadeRegiao', e.target.value)}
            placeholder="Informe a cidade, bairro ou rodovia de referência"
            className={`w-full bg-slate-50 dark:bg-neutral-950 border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#B43034] transition-colors ${
              errors.cidadeRegiao ? 'border-red-500 bg-red-50 dark:bg-red-950/10' : 'border-slate-300 dark:border-neutral-800'
            }`}
          />
          {errors.cidadeRegiao && (
            <p
              id="error-cidade"
              role="alert"
              className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.cidadeRegiao}</span>
            </p>
          )}
        </div>

        {/* Descrição Breve da Necessidade */}
        <div>
          <label
            htmlFor="field-descricao"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1.5"
          >
            Descrição Breve da Necessidade <span className="text-[#B43034]" aria-hidden="true">*</span>
          </label>
          <textarea
            ref={descricaoTextareaRef}
            id="field-descricao"
            name="descricaoNecessidade"
            rows={3}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.descricaoNecessidade)}
            aria-describedby={errors.descricaoNecessidade ? 'error-descricao' : undefined}
            value={formData.descricaoNecessidade}
            onChange={(e) => handleChange('descricaoNecessidade', e.target.value)}
            placeholder="Ex: Veículo com pane mecânica; informe condição aproximada e local de destino..."
            className={`w-full bg-slate-50 dark:bg-neutral-950 border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#B43034] transition-colors ${
              errors.descricaoNecessidade ? 'border-red-500 bg-red-50 dark:bg-red-950/10' : 'border-slate-300 dark:border-neutral-800'
            }`}
          />
          {errors.descricaoNecessidade && (
            <p
              id="error-descricao"
              role="alert"
              className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.descricaoNecessidade}</span>
            </p>
          )}
        </div>

        {/* Mandatory Transparency & Privacy Notice */}
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-neutral-950/90 border border-slate-200 dark:border-neutral-800 text-xs text-slate-700 dark:text-neutral-300 leading-relaxed space-y-2">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#B43034] shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              Os dados informados serão utilizados apenas para preparar uma mensagem de atendimento à Vapt Vupt. Ao continuar, o WhatsApp será aberto com a mensagem preenchida, e o envio só ocorrerá quando você confirmar no aplicativo. Não envie números de documentos (CPF, RG ou CNH) por este formulário. Consulte nossa{' '}
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

        {/* Action Button */}
        <button
          type="submit"
          className="w-full button-3d flex items-center justify-center gap-2.5 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-4 rounded-lg shadow-xl transition-colors font-heading cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B43034]"
        >
          <WhatsAppIcon className="w-5 h-5 shrink-0" />
          <span>Continuar e Abrir Mensagem no WhatsApp</span>
        </button>

        <p className="text-[11px] text-slate-500 dark:text-neutral-500 text-center">
          Canal oficial: {COMPANY_CONFIG.whatsapp.display}. Nenhum dado deste formulário é armazenado em banco de dados ou cookies.
        </p>
      </form>
    </div>
  );
};
