import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Instagram, Briefcase, ChevronRight, HelpCircle } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';

export const Footer: React.FC = () => {
  return (
    <footer className="keep-dark bg-[#111113] border-t border-neutral-800 text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Brand & Summary */}
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="inline-block">
              <img
                src={COMPANY_CONFIG.logos.horizontalWhite}
                alt="Vapt Vupt Remoção de Veículos"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-neutral-300 max-w-sm leading-relaxed">
              Atuação especializada em remoção e transporte técnico de veículos leves e pesados, com compromisso operacional, segurança e agilidade.
            </p>
            <div className="text-xs text-neutral-400 space-y-1">
              <div>
                <span className="font-semibold text-neutral-300">Razão Social:</span> {COMPANY_CONFIG.legalName}
              </div>
              <div>
                <span className="font-semibold text-neutral-300">Segmento:</span> {COMPANY_CONFIG.segment}
              </div>
            </div>
          </div>

          {/* Institutional Navigation Links */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Páginas Institucionais
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <Link to="/" className="hover:text-white transition-colors">
                Início
              </Link>
              <Link to="/empresa" className="hover:text-white transition-colors">
                A Empresa
              </Link>
              <Link to="/servicos" className="hover:text-white transition-colors">
                Todos os Serviços
              </Link>
              <Link to="/servicos/remocao-veiculos-leves" className="hover:text-white transition-colors">
                Veículos Leves
              </Link>
              <Link to="/servicos/remocao-veiculos-pesados" className="hover:text-white transition-colors">
                Veículos Pesados
              </Link>
              <Link to="/servicos/solucoes-em-remocao" className="hover:text-white transition-colors">
                Soluções Especiais
              </Link>
              <Link to="/frota" className="hover:text-white transition-colors">
                Estrutura & Frota
              </Link>
              <Link to="/perguntas-frequentes" className="hover:text-white transition-colors flex items-center gap-1">
                <span>Perguntas (FAQ)</span>
              </Link>
              <Link to="/trabalhe-conosco" className="hover:text-white transition-colors">
                Trabalhe Conosco
              </Link>
              <Link to="/contato" className="hover:text-white transition-colors">
                Fale Conosco
              </Link>
              <Link to="/politica-de-privacidade" className="hover:text-[#B43034] transition-colors">
                Privacidade (LGPD)
              </Link>
              <Link to="/termos-de-uso" className="hover:text-white transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>

          {/* Official Channels & Careers */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Canais Oficiais
            </h4>
            
            <div className="space-y-2.5 text-xs">
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

            {/* Direct Links to Careers and FAQ */}
            <div className="pt-3 border-t border-neutral-800 space-y-2">
              <Link
                to="/trabalhe-conosco"
                className="flex items-center justify-between text-xs font-medium text-neutral-300 hover:text-[#B43034] transition-colors bg-neutral-900/80 px-3 py-2 rounded border border-neutral-800"
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-[#B43034]" />
                  <span>Trabalhe Conosco</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </Link>

              <Link
                to="/perguntas-frequentes"
                className="flex items-center justify-between text-xs font-medium text-neutral-300 hover:text-white transition-colors bg-neutral-900/40 px-3 py-2 rounded border border-neutral-800/80"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Dúvidas Frequentes</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            © {new Date().getFullYear()} {COMPANY_CONFIG.legalName} • Todos os direitos reservados.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] text-neutral-400">
            <Link to="/politica-de-privacidade" className="hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <span>•</span>
            <Link to="/termos-de-uso" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <span>•</span>
            <Link to="/contato" className="hover:text-neutral-300">
              Canais Oficiais
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
