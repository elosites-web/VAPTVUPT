import test from 'node:test';
import assert from 'node:assert/strict';
import { COMPANY_CONFIG } from './companyData';

test('companyData: official institutional description exact match', () => {
  const expectedDesc =
    'Vapt Vupt Remoção de Veículos Ltda é uma empresa especializada em serviços de guincho e reboque 24 horas para veículos leves e pesados, atuando em parceria com grandes seguradoras.';
  assert.equal(COMPANY_CONFIG.institutionalDescription, expectedDesc);
});

test('companyData: Jundiaí branch registration details', () => {
  const branch = COMPANY_CONFIG.branchJundiai;
  assert.equal(branch.label, 'Unidade em Jundiaí (Filial)');
  assert.equal(
    branch.address,
    'Travessa Egydio Matheo, 105 - Bairro da Colônia, Jundiaí - SP, CEP 13219-810'
  );
  assert.equal(branch.cnpj, '03.235.721/0004-11');
  assert.equal(branch.city, 'Jundiaí');
  assert.equal(branch.state, 'SP');
  assert.equal(branch.cep, '13219-810');
  assert.equal(branch.tag, 'Filial');
  // Must NOT be labeled as Matriz
  assert.notEqual(branch.label, 'Matriz');
  assert.notEqual(branch.tag, 'Matriz');
});

test('companyData: all four central telephone numbers with correct display and tel: URI', () => {
  const phones = COMPANY_CONFIG.centralPhones;
  assert.equal(phones.length, 4);

  const expectedNumbers = [
    { display: '(11) 4934-1997', telUri: 'tel:+551149341997' },
    { display: '(11) 94149-4402', telUri: 'tel:+5511941494402' },
    { display: '(11) 4402-3115', telUri: 'tel:+551144023115' },
    { display: '(19) 2042-2350', telUri: 'tel:+551920422350' },
  ];

  for (let i = 0; i < expectedNumbers.length; i++) {
    assert.equal(phones[i].display, expectedNumbers[i].display);
    assert.equal(phones[i].telUri, expectedNumbers[i].telUri);
    assert.ok(phones[i].telUri.startsWith('tel:'));
  }
});

test('companyData: WhatsApp channel is clearly labeled as Vagas/Contato and maintains (11) 91372-1849', () => {
  const wa = COMPANY_CONFIG.whatsapp;
  assert.equal(wa.display, '(11) 91372-1849');
  assert.equal(wa.channelLabel, 'WhatsApp (Vagas/Contato)');
  assert.equal(wa.raw, '5511913721849');
  assert.equal(wa.link, 'https://wa.me/5511913721849');
  assert.equal(wa.telUri, 'tel:+5511913721849');
});
