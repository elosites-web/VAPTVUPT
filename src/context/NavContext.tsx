import React, { createContext, useContext, useState, useEffect } from 'react';

interface NavContextType {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export const NavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Synchronize mobile menu open state with body attribute and custom event for maximum interoperability
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.setAttribute('data-mobile-menu-open', 'true');
      window.dispatchEvent(new CustomEvent('mobilemenuopen', { detail: { open: true } }));
    } else {
      document.body.removeAttribute('data-mobile-menu-open');
      window.dispatchEvent(new CustomEvent('mobilemenuopen', { detail: { open: false } }));
    }
  }, [mobileMenuOpen]);

  return (
    <NavContext.Provider
      value={{
        mobileMenuOpen,
        setMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};

export const useNav = (): NavContextType => {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error('useNav must be used within a NavProvider');
  }
  return context;
};
