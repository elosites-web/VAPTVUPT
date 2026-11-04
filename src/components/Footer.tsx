import React from 'react';
import { MessageCircle, Instagram, Briefcase, ChevronRight, Shield } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111113] border-t border-neutral-800 text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Brand & Summary */}
          <div className="lg:col-span-5 space-y-4">
            <img
              src={COMPANY_CONFIG.logos.horizontalWhite}
              alt="Vapt Vupt Remoção de Veículos"
              className="h-10 w-auto object-contain"
            />
            <p className="text-sm text-neutral-300 max-w-sm leading-relaxed">
              Atuação especializada em remoção e transporte de veículos leves e pesados, com compromisso operacional, segurança e agilidade.
            </p>
            <div className="text-xs text-neutral-400">
              <span className="font-semibold text-neutral-300">Razão Social:</span> {COMPANY_CONFIG.legalName}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#inicio" className="hover:text-white transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#empresa" className="hover:text-white transition-colors">
                  Apresentação Institucional
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-white transition-colors">
                  Serviços (Leves & Pesados)
                </a>
              </li>
              <li>
                <a href="#frota" className="hover:text-white transition-colors">
                  Estrutura e Frota
                </a>
              </li>
              <li>
                <a href="#modelo-3d" className="hover:text-white transition-colors">
                  Visualizador 3D Interativo
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-white transition-colors">
                  Como Solicitar Atendimento
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-white transition-colors">
                  Canais de Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Verified Contacts & Trabalhe Conosco */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Canais Oficiais
            </h4>
            
            <div className="space-y-2 text-xs">
              <a
                href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                  COMPANY_CONFIG.whatsapp.defaultMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors group"
              >
                <MessageCircle className="w-4 h-4 text-[#B43034] group-hover:scale-110 transition-transform" />
                <span>WhatsApp: {COMPANY_CONFIG.whatsapp.display}</span>
              </a>

              <a
                href={COMPANY_CONFIG.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors group"
              >
                <Instagram className="w-4 h-4 text-[#B43034] group-hover:scale-110 transition-transform" />
                <span>Instagram: {COMPANY_CONFIG.instagram.handle}</span>
              </a>
            </div>

            {/* Trabalhe Conosco - Section 8.8 guideline: discrete secondary career inquiry via WhatsApp */}
            <div className="pt-4 border-t border-neutral-800">
              <a
                href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                  COMPANY_CONFIG.whatsapp.careersMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium text-neutral-300 hover:text-[#B43034] transition-colors bg-neutral-900 px-3 py-2 rounded border border-neutral-800"
              >
                <Briefcase className="w-3.5 h-3.5 text-[#B43034]" />
                <span>Trabalhe Conosco (Oportunidades)</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            © {new Date().getFullYear()} {COMPANY_CONFIG.legalName} Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4 text-[11px] text-neutral-400">
            <span>Privacidade & LGPD Respeitadas</span>
            <span>•</span>
            <span>Site Institucional</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
