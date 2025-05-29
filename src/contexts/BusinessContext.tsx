
'use client';

import type { Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface BusinessContextType {
  businessName: string;
  setBusinessName: (name: string) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

const BUSINESS_NAME_STORAGE_KEY = 'malitrack-business-name';

export const BusinessProvider = ({ children }: { children: React.ReactNode }) => {
  const [businessName, setBusinessNameState] = useState<string>("Your Business"); // Default

  useEffect(() => {
    const storedName = localStorage.getItem(BUSINESS_NAME_STORAGE_KEY);
    if (storedName) {
      setBusinessNameState(storedName);
    }
  }, []);

  const setBusinessName = useCallback((name: string) => {
    setBusinessNameState(name);
    localStorage.setItem(BUSINESS_NAME_STORAGE_KEY, name);
  }, []);

  return (
    <BusinessContext.Provider value={{ businessName, setBusinessName }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
