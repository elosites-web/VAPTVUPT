import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ShieldCheck, AlertCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';

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
  tipoVeiculo: 'Automóvel de Passeio',
  cidadeRegiao: '',
  descricaoNecessidade: '',
};

export const WhatsAppContactForm: React.FC = () => {
  // Pure in-memory component state — zero storage in localStorage, sessionStorage, cookies or external APIs
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validate = (): boolean => {
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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (!validate()) {
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

    // Redirecionamento direto ao WhatsApp oficial sem persistir dados no cliente
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleChange = (
    field: keyof FormState,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 p-6 sm:p-8 shadow-xl dark:shadow-2xl space-y-6 transition-colors">
      <div>
        <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-1.5 font-heading">
          <span className="w-4 h-0.5 bg-[#B43034]" />
          <span>Atendimento Direto & Ágil</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight font-heading">
          Formulário de Solicitação de Atendimento
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 mt-1 leading-relaxed">
          Preencha os campos abaixo para que sua mensagem chegue estruturada à nossa equipe operacional.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Nome */}
        <div>
          <label htmlFor="field-nome" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1.5">
            Nome Completo ou Identificação <span className="text-[#B43034]">*</span>
          </label>
          <input
            id="field-nome"
            type="text"
            value={formData.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            placeholder="Ex: Carlos Eduardo"
            className={`w-full bg-slate-50 dark:bg-neutral-950 border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#B43034] transition-colors ${
              errors.nome ? 'border-red-500 bg-red-50 dark:bg-red-950/10' : 'border-slate-300 dark:border-neutral-800'
            }`}
          />
          {errors.nome && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.nome}</span>
            </p>
          )}
        </div>

        {/* Tipo de Atendimento & Tipo de Veículo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field-atendimento" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1.5">
              Tipo de Atendimento <span className="text-[#B43034]">*</span>
            </label>
            <select
              id="field-atendimento"
              value={formData.tipoAtendimento}
              onChange={(e) => handleChange('tipoAtendimento', e.target.value)}
              className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B43034]"
            >
              <option value="Remoção de Veículo Leve">Remoção de Veículo Leve (Prancha)</option>
              <option value="Remoção de Veículo Pesado">Remoção de Veículo Pesado / Caminhão</option>
              <option value="Soluções em Remoção / Transporte Logístico">Soluções em Remoção / Logística</option>
              <option value="Transferência Programada">Transferência Programada entre Pátios</option>
              <option value="Outro Atendimento">Outro Atendimento sob Consulta</option>
            </select>
          </div>

          <div>
            <label htmlFor="field-veiculo" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1.5">
              Tipo de Veículo <span className="text-[#B43034]">*</span>
            </label>
            <select
              id="field-veiculo"
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
          </div>
        </div>

        {/* Cidade ou Região */}
        <div>
          <label htmlFor="field-cidade" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1.5">
            Cidade ou Região da Ocorrência <span className="text-[#B43034]">*</span>
          </label>
          <input
            id="field-cidade"
            type="text"
            value={formData.cidadeRegiao}
            onChange={(e) => handleChange('cidadeRegiao', e.target.value)}
            placeholder="Ex: Campinas (próximo à Rodovia Anhanguera) ou São Paulo - Zona Leste"
            className={`w-full bg-slate-50 dark:bg-neutral-950 border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#B43034] transition-colors ${
              errors.cidadeRegiao ? 'border-red-500 bg-red-50 dark:bg-red-950/10' : 'border-slate-300 dark:border-neutral-800'
            }`}
          />
          {errors.cidadeRegiao && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.cidadeRegiao}</span>
            </p>
          )}
        </div>

        {/* Descrição Breve da Necessidade */}
        <div>
          <label htmlFor="field-descricao" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1.5">
            Descrição Breve da Necessidade <span className="text-[#B43034]">*</span>
          </label>
          <textarea
            id="field-descricao"
            rows={3}
            value={formData.descricaoNecessidade}
            onChange={(e) => handleChange('descricaoNecessidade', e.target.value)}
            placeholder="Ex: Veículo com pane mecânica; rodas destravadas; destino é a oficina na mesma cidade..."
            className={`w-full bg-slate-50 dark:bg-neutral-950 border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#B43034] transition-colors ${
              errors.descricaoNecessidade ? 'border-red-500 bg-red-50 dark:bg-red-950/10' : 'border-slate-300 dark:border-neutral-800'
            }`}
          />
          {errors.descricaoNecessidade && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.descricaoNecessidade}</span>
            </p>
          )}
        </div>

        {/* Mandatory Transparency & Privacy Notice */}
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-neutral-950/90 border border-slate-200 dark:border-neutral-800 text-xs text-slate-700 dark:text-neutral-300 leading-relaxed space-y-2">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#B43034] shrink-0 mt-0.5" />
            <p>
              Os dados informados serão utilizados para preparar uma mensagem de atendimento à Vapt Vupt. Ao continuar, o WhatsApp será aberto com a mensagem preenchida. O envio só ocorrerá quando você confirmar no aplicativo. Consulte nosso{' '}
              <Link to="/politica-de-privacidade" className="text-[#B43034] hover:underline font-semibold inline-flex items-center gap-0.5">
                <span>Aviso de Privacidade</span>
                <ArrowUpRight className="w-3 h-3 inline" />
              </Link>.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2.5 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-4 rounded-lg shadow-xl transition-all font-heading"
        >
          <MessageCircle className="w-5 h-5 shrink-0" />
          <span>Continuar e Abrir Mensagem no WhatsApp</span>
        </button>

        <p className="text-[11px] text-slate-500 dark:text-neutral-500 text-center">
          Canal verificado: {COMPANY_CONFIG.whatsapp.display}. Nenhum dado deste formulário é armazenado em servidores ou cookies.
        </p>
      </form>
    </div>
  );
};
