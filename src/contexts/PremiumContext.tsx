import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { checkPremium, buyPremium } from '../api/premium';
import { userData } from '../stores/UserDataStore';

interface PremiumContextProps {
  isPremium: boolean;
  refreshPremium: () => Promise<void>;
  handleBuy: () => Promise<void>;
}

export const PremiumContext = createContext<PremiumContextProps | undefined>(undefined);

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);

  const refreshPremium = useCallback(async () => {
    const isu = userData.getIsu();
    if (isu === -1) {
      console.error("isu is invalid");
      setIsPremium(false);
      return;
    }

    try {
      const { isPremium } = await checkPremium(isu);
      setIsPremium(isPremium);
    } catch (error) {
      console.error("failed to refresh premium status:", error);
      setIsPremium(false);
    }
  }, []);

  const handleBuy = useCallback(async () => {
    const isu = userData.getIsu();
    if (isu === -1) {
      console.error("isu is invalid");
      return;
    }

    try {
      await buyPremium(isu);
      await refreshPremium();
    } catch (error) {
      console.error("failed to buy premium:", error);
    }
  }, [refreshPremium]);

  useEffect(() => {
    refreshPremium();
  }, [refreshPremium]);

  return (
    <PremiumContext.Provider value={{ isPremium, refreshPremium, handleBuy }}>
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
