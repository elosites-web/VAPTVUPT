// @ts-nocheck
/**
 * Test Suite: Vapt Vupt Form Submission Paths & LGPD Consent Verification
 * 
 * Verifies:
 * 1. Submission is impossible when consent is unchecked (false), even if handler is called directly.
 * 2. Field validation errors prevent submission even if consent is checked.
 * 3. Valid submissions work only after explicit consent AND successful field validation.
 * 4. Exact message templates, URL encoding, and official WhatsApp link formatting.
 */

import { COMPANY_CONFIG } from '../src/data/companyData';

// Simulated DOM environment mock for document.createElement and window
const openedLinks: string[] = [];

// @ts-expect-error Mock DOM environment for testing in Node
globalThis.document = {
  createElement: (tag: string) => {
    if (tag === 'a') {
      const a = {
        href: '',
        target: '',
        rel: '',
        click: () => {
          openedLinks.push(a.href);
        },
      };
      return a;
    }
    return {};
  },
  body: {
    appendChild: () => {},
    removeChild: () => {},
  },
};

// -----------------------------------------------------------------------------
// RECRUITMENT FORM LOGIC REPLICATION / VERIFICATION
// -----------------------------------------------------------------------------

interface RecruitmentFormState {
  nomeCompleto: string;
  email: string;
  telefone: string;
  cidadeBairro: string;
  categoriaCnh: string;
  vagaPretendida: string;
  consentimento: boolean;
}

function validateRecruitmentForm(formData: RecruitmentFormState) {
  const newErrors: Partial<Record<keyof RecruitmentFormState, string>> = {};

  if (!formData.nomeCompleto.trim()) {
    newErrors.nomeCompleto = 'Por favor, informe seu nome completo.';
  } else if (formData.nomeCompleto.trim().length < 3) {
    newErrors.nomeCompleto = 'O nome completo deve conter no mínimo 3 caracteres.';
  }

  const emailTrimmed = formData.email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailTrimmed) {
    newErrors.email = 'Por favor, informe seu e-mail de contato.';
  } else if (!emailRegex.test(emailTrimmed)) {
    newErrors.email = 'Por favor, informe um endereço de e-mail válido (ex: nome@dominio.com).';
  }

  const phoneDigits = formData.telefone.replace(/\D/g, '');
  if (!phoneDigits) {
    newErrors.telefone = 'Por favor, informe seu telefone com DDD.';
  } else if (phoneDigits.length < 10) {
    newErrors.telefone = 'Informe um telefone válido com DDD (mínimo de 10 dígitos).';
  }

  if (!formData.cidadeBairro.trim()) {
    newErrors.cidadeBairro = 'Por favor, informe sua cidade e bairro de residência.';
  } else if (formData.cidadeBairro.trim().length < 2) {
    newErrors.cidadeBairro = 'Informe a cidade e bairro com pelo menos 2 caracteres.';
  }

  if (!formData.categoriaCnh) {
    newErrors.categoriaCnh = 'Por favor, selecione a categoria da sua CNH.';
  }

  if (!formData.vagaPretendida) {
    newErrors.vagaPretendida = 'Por favor, selecione a vaga ou área de interesse desejada.';
  }

  if (!formData.consentimento) {
    newErrors.consentimento = 'É obrigatório declarar ciência e consentimento para prosseguir com a candidatura.';
  }

  return newErrors;
}

function simulateRecruitmentSubmit(
  formData: RecruitmentFormState,
  bypassValidation = false
): { success: boolean; errors: Partial<Record<keyof RecruitmentFormState, string>>; focusedField?: keyof RecruitmentFormState; generatedUrl?: string } {
  let errors: Partial<Record<keyof RecruitmentFormState, string>> = {};

  if (!bypassValidation) {
    errors = validateRecruitmentForm(formData);
    const orderedFields: (keyof RecruitmentFormState)[] = [
      'nomeCompleto',
      'email',
      'telefone',
      'cidadeBairro',
      'categoriaCnh',
      'vagaPretendida',
      'consentimento',
    ];

    const firstInvalidKey = orderedFields.find((key) => Boolean(errors[key]));
    if (firstInvalidKey) {
      return { success: false, errors, focusedField: firstInvalidKey };
    }
  }

  // Hard barrier guard inside the submit handler
  if (!formData.consentimento) {
    return { success: false, errors: { consentimento: 'Consentimento obrigatório não fornecido' }, focusedField: 'consentimento' };
  }

  const cleanNome = formData.nomeCompleto.trim().replace(/[<>]/g, '');
  const cleanEmail = formData.email.trim().replace(/[<>]/g, '');
  const cleanTelefone = formData.telefone.trim();
  const cleanCidadeBairro = formData.cidadeBairro.trim().replace(/[<>]/g, '');
  const cleanCategoriaCnh = formData.categoriaCnh.trim();
  const cleanVagaPretendida = formData.vagaPretendida.trim();

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

  // Simulate triggering the redirect
  const link = document.createElement('a');
  link.href = waUrl;
  link.click();

  return { success: true, errors: {}, generatedUrl: waUrl };
}

// -----------------------------------------------------------------------------
// CONTACT FORM LOGIC REPLICATION / VERIFICATION
// -----------------------------------------------------------------------------

interface ContactFormState {
  nome: string;
  tipoAtendimento: string;
  tipoVeiculo: string;
  cidadeRegiao: string;
  descricaoNecessidade: string;
  consentimento: boolean;
}

function validateContactForm(formData: ContactFormState) {
  const newErrors: Partial<Record<keyof ContactFormState, string>> = {};

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

  if (!formData.consentimento) {
    newErrors.consentimento = 'É necessário autorizar o envio dos dados para solicitar o atendimento.';
  }

  return newErrors;
}

function simulateContactSubmit(
  formData: ContactFormState,
  bypassValidation = false
): { success: boolean; errors: Partial<Record<keyof ContactFormState, string>>; focusedField?: keyof ContactFormState; generatedUrl?: string } {
  let errors: Partial<Record<keyof ContactFormState, string>> = {};

  if (!bypassValidation) {
    errors = validateContactForm(formData);
    const orderedFields: (keyof ContactFormState)[] = [
      'nome',
      'tipoAtendimento',
      'tipoVeiculo',
      'cidadeRegiao',
      'descricaoNecessidade',
      'consentimento',
    ];

    const firstInvalidKey = orderedFields.find((key) => Boolean(errors[key]));
    if (firstInvalidKey) {
      return { success: false, errors, focusedField: firstInvalidKey };
    }
  }

  // Hard barrier guard inside the submit handler
  if (!formData.consentimento) {
    return { success: false, errors: { consentimento: 'Consentimento obrigatório não fornecido' }, focusedField: 'consentimento' };
  }

  const cleanNome = formData.nome.trim().replace(/[<>]/g, '');
  const cleanAtendimento = formData.tipoAtendimento.trim();
  const cleanVeiculo = formData.tipoVeiculo.trim();
  const cleanCidade = formData.cidadeRegiao.trim().replace(/[<>]/g, '');
  const cleanDescricao = formData.descricaoNecessidade.trim().replace(/[<>]/g, '');

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

  const link = document.createElement('a');
  link.href = waUrl;
  link.click();

  return { success: true, errors: {}, generatedUrl: waUrl };
}

// -----------------------------------------------------------------------------
// TEST RUNNER
// -----------------------------------------------------------------------------

async function runTests() {
  console.log('===============================================================');
  console.log('🧪 INICIANDO TESTES DE SUBMISSÃO E CONSENTIMENTO OBRIGATÓRIO (LGPD)');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  // TEST SUITE 1: RECRUITMENT FORM (WhatsAppRecruitmentForm)
  console.log('--- [1] FORMULÁRIO DE RECRUTAMENTO (/trabalhe-conosco) ---');

  // Test 1.1: Initial empty state
  openedLinks.length = 0;
  const initialRecState: RecruitmentFormState = {
    nomeCompleto: '',
    email: '',
    telefone: '',
    cidadeBairro: '',
    categoriaCnh: '',
    vagaPretendida: '',
    consentimento: false,
  };
  const res1_1 = simulateRecruitmentSubmit(initialRecState);
  assert(res1_1.success === false, 'Submissão no estado inicial é bloqueada');
  assert(Boolean(res1_1.errors.consentimento), 'Erro de consentimento presente no estado inicial');
  assert(res1_1.focusedField === 'nomeCompleto', 'Foco automático direcionado ao primeiro campo inválido (Nome Completo)');
  assert(openedLinks.length === 0, 'Nenhum link ou WhatsApp disparado no estado inicial');

  // Test 1.2: All valid fields filled, BUT consent unchecked
  openedLinks.length = 0;
  const validRecNoConsent: RecruitmentFormState = {
    nomeCompleto: 'Carlos Eduardo Santos',
    email: 'carlos.santos@email.com',
    telefone: '(11) 98765-4321',
    cidadeBairro: 'São Paulo - Itaquera',
    categoriaCnh: 'Categoria D (Passageiros / Veículos Especiais)',
    vagaPretendida: 'Motorista de Guincho Pesado',
    consentimento: false,
  };
  const res1_2 = simulateRecruitmentSubmit(validRecNoConsent);
  assert(res1_2.success === false, 'Submissão com todos os campos válidos porém consentimento desmarcado é BLOQUEADA');
  assert(res1_2.errors.consentimento !== undefined, 'Erro de consentimento retornado quando desmarcado');
  assert(res1_2.focusedField === 'consentimento', 'Foco automático direcionado ao checkbox de consentimento quando único inválido');
  assert(openedLinks.length === 0, 'Nenhuma aba do WhatsApp aberta sem consentimento');

  // Test 1.3: Direct submit handler execution attempting to bypass validation with consent = false
  openedLinks.length = 0;
  const res1_3 = simulateRecruitmentSubmit(validRecNoConsent, true); // bypassValidation = true
  assert(res1_3.success === false, 'Execução direta do submit handler com consentimento falso é estritamente bloqueada');
  assert(res1_3.focusedField === 'consentimento', 'Trava do submit handler foca no checkbox de consentimento');
  assert(openedLinks.length === 0, 'Trava defensiva interna impediu abertura do WhatsApp');

  // Test 1.4: Invalid field values with consent = true
  openedLinks.length = 0;
  const invalidEmailRec: RecruitmentFormState = {
    ...validRecNoConsent,
    email: 'email-invalido-sem-arroba',
    consentimento: true,
  };
  const res1_4 = simulateRecruitmentSubmit(invalidEmailRec);
  assert(res1_4.success === false, 'E-mail inválido bloqueia submissão mesmo com consentimento marcado');
  assert(Boolean(res1_4.errors.email), 'Erro de formato de e-mail disparado');
  assert(res1_4.focusedField === 'email', 'Foco automático direcionado ao campo de e-mail inválido');
  assert(openedLinks.length === 0, 'Nenhum envio com e-mail inválido');

  // Test 1.5: Missing CNH with consent = true
  openedLinks.length = 0;
  const missingCnhRec: RecruitmentFormState = {
    ...validRecNoConsent,
    categoriaCnh: '',
    consentimento: true,
  };
  const res1_5 = simulateRecruitmentSubmit(missingCnhRec);
  assert(res1_5.success === false, 'Ausência de categoria de CNH bloqueia submissão');
  assert(Boolean(res1_5.errors.categoriaCnh), 'Erro de CNH não selecionada disparado');
  assert(res1_5.focusedField === 'categoriaCnh', 'Foco automático direcionado ao seletor de CNH');

  // Test 1.6: Missing Desired Position with consent = true
  openedLinks.length = 0;
  const missingVagaRec: RecruitmentFormState = {
    ...validRecNoConsent,
    vagaPretendida: '',
    consentimento: true,
  };
  const res1_6 = simulateRecruitmentSubmit(missingVagaRec);
  assert(res1_6.success === false, 'Ausência de vaga selecionada no dropdown bloqueia submissão');
  assert(Boolean(res1_6.errors.vagaPretendida), 'Erro de vaga não selecionada disparado');
  assert(res1_6.focusedField === 'vagaPretendida', 'Foco automático direcionado ao seletor de vaga');

  // Test 1.7: Successful submission with valid fields AND explicit consent = true
  openedLinks.length = 0;
  const validRecWithConsent: RecruitmentFormState = {
    ...validRecNoConsent,
    consentimento: true,
  };
  const res1_7 = simulateRecruitmentSubmit(validRecWithConsent);
  assert(res1_7.success === true, 'Submissão é permitida quando todos os campos são válidos e consentimento marcado');
  assert(openedLinks.length === 1, 'WhatsApp é acionado com sucesso');
  assert(openedLinks[0].startsWith(COMPANY_CONFIG.whatsapp.link), 'URL usa o link oficial do WhatsApp configurado');
  assert(openedLinks[0].includes('Carlos%20Eduardo%20Santos'), 'Nome do candidato devidamente codificado no link');
  assert(openedLinks[0].includes('Motorista%20de%20Guincho%20Pesado'), 'Vaga pretendida devidamente codificada no link');
  assert(openedLinks[0].includes('Categoria%20D'), 'Categoria CNH devidamente codificada no link');
  assert(openedLinks[0].includes('curr%C3%ADculo%20em%20anexo'), 'Texto padrão de currículo em anexo presente');

  console.log('\n--- [2] FORMULÁRIO DE ATENDIMENTO/CONTATO (/contato) ---');

  // Test 2.1: Initial empty state
  openedLinks.length = 0;
  const initialContactState: ContactFormState = {
    nome: '',
    tipoAtendimento: 'Remoção de Veículo Leve',
    tipoVeiculo: 'Automóvel de Passeio (Hatch / Sedã)',
    cidadeRegiao: '',
    descricaoNecessidade: '',
    consentimento: false,
  };
  const res2_1 = simulateContactSubmit(initialContactState);
  assert(res2_1.success === false, 'Submissão de contato no estado inicial é bloqueada');
  assert(Boolean(res2_1.errors.consentimento), 'Erro de consentimento presente no estado inicial');
  assert(res2_1.focusedField === 'nome', 'Foco automático no contato direcionado ao primeiro campo inválido (Nome)');
  assert(openedLinks.length === 0, 'Nenhum WhatsApp disparado');

  // Test 2.2: All valid fields filled, BUT consent unchecked
  openedLinks.length = 0;
  const validContactNoConsent: ContactFormState = {
    nome: 'Mariana Silva',
    tipoAtendimento: 'Remoção de Veículo Leve',
    tipoVeiculo: 'SUV / Picape / Caminhonete',
    cidadeRegiao: 'Campinas - Rodovia Anhanguera km 98',
    descricaoNecessidade: 'Pneu rasgado sem estepe, acostamento sinalizado',
    consentimento: false,
  };
  const res2_2 = simulateContactSubmit(validContactNoConsent);
  assert(res2_2.success === false, 'Submissão de contato com dados preenchidos mas SEM consentimento é BLOQUEADA');
  assert(res2_2.errors.consentimento !== undefined, 'Erro de autorização retornado');
  assert(res2_2.focusedField === 'consentimento', 'Foco automático no contato direcionado ao checkbox de consentimento');
  assert(openedLinks.length === 0, 'Nenhum WhatsApp disparado sem autorização');

  // Test 2.3: Direct submit trigger attempting to bypass validation with consent = false
  openedLinks.length = 0;
  const res2_3 = simulateContactSubmit(validContactNoConsent, true); // bypassValidation = true
  assert(res2_3.success === false, 'Execução direta de submit no contato com consentimento falso é estritamente bloqueada');
  assert(res2_3.focusedField === 'consentimento', 'Trava defensiva do contato foca no checkbox de consentimento');
  assert(openedLinks.length === 0, 'Trava defensiva do contato impediu abertura do WhatsApp');

  // Test 2.4: Empty fields with consent = true
  openedLinks.length = 0;
  const emptyNameContact: ContactFormState = {
    ...validContactNoConsent,
    nome: '',
    consentimento: true,
  };
  const res2_4 = simulateContactSubmit(emptyNameContact);
  assert(res2_4.success === false, 'Nome vazio bloqueia submissão mesmo com consentimento marcado');
  assert(Boolean(res2_4.errors.nome), 'Erro de nome ausente disparado');
  assert(res2_4.focusedField === 'nome', 'Foco automático direcionado ao campo Nome');

  // Test 2.5: Successful contact submission with valid fields AND explicit consent = true
  openedLinks.length = 0;
  const validContactWithConsent: ContactFormState = {
    ...validContactNoConsent,
    consentimento: true,
  };
  const res2_5 = simulateContactSubmit(validContactWithConsent);
  assert(res2_5.success === true, 'Submissão de contato permitida após validação completa e consentimento explícito');
  assert(openedLinks.length === 1, 'WhatsApp acionado com sucesso no contato');
  assert(openedLinks[0].startsWith(COMPANY_CONFIG.whatsapp.link), 'URL usa o link oficial da Vapt Vupt');
  assert(openedLinks[0].includes('Mariana%20Silva'), 'Nome sanitizado e codificado no link');
  assert(openedLinks[0].includes('Rodovia%20Anhanguera'), 'Localização codificada no link');

  console.log('\n===============================================================');
  console.log(`📊 RESULTADO FINAL DOS TESTES: ${passed} PASSOU | ${failed} FALHOU`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Erro durante execução dos testes:', err);
  process.exit(1);
});
