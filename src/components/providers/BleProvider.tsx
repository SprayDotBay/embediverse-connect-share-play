
import React, { ReactNode } from 'react';
import { BleProvider as BleContextProvider } from '@/hooks/ble/BleContext';

export const BleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <BleContextProvider>{children}</BleContextProvider>;
};
