import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ title, description }) => {
  useEffect(() => {
    // Atualiza title
    document.title = `${title} | Vapt Vupt Remoção de Veículos`;

    // Atualiza meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Atualiza OpenGraph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', `${title} | Vapt Vupt Remoção de Veículos`);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
};
