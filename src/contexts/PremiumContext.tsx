import React, { createContext, useState, useContext } from 'react';

interface PremiumContextProps {
  isPremium: boolean;
  setPremium: (value: boolean) => void;
}

const PremiumContext = createContext<PremiumContextProps | undefined>(undefined);

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);

  return (
    <PremiumContext.Provider value={{ isPremium, setPremium: setIsPremium }}>
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};
