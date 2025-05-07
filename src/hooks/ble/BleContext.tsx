
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BleDeviceInfo, BleCharacteristic, BleDevice } from './types';

interface BleContextType {
  isSupported: boolean;
  device: BluetoothDevice | null;
  deviceInfo: BleDeviceInfo | null;
  characteristics: BleCharacteristic[];
  connecting: boolean;
  error: string | null;
  isConnected: boolean;
  isScanning: boolean;
  availableDevices: BleDevice[];
  setDevice: (device: BluetoothDevice | null) => void;
  setDeviceInfo: (deviceInfo: BleDeviceInfo | null) => void;
  setCharacteristics: (characteristics: BleCharacteristic[]) => void;
  setConnecting: (connecting: boolean) => void;
  setError: (error: string | null) => void;
  setIsConnected: (isConnected: boolean) => void;
  setIsScanning: (isScanning: boolean) => void;
  setAvailableDevices: (devices: BleDevice[]) => void;
}

const BleContext = createContext<BleContextType | null>(null);

export const BleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<BleDeviceInfo | null>(null);
  const [characteristics, setCharacteristics] = useState<BleCharacteristic[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<BleDevice[]>([]);
  
  const isSupported = typeof navigator !== 'undefined' && 'bluetooth' in navigator;

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Disconnect BLE device on unmount
      if (device?.gatt?.connected) {
        device.gatt.disconnect();
      }
    };
  }, [device]);

  return (
    <BleContext.Provider
      value={{
        isSupported,
        device,
        deviceInfo,
        characteristics,
        connecting,
        error,
        isConnected,
        isScanning,
        availableDevices,
        setDevice,
        setDeviceInfo,
        setCharacteristics,
        setConnecting,
        setError,
        setIsConnected,
        setIsScanning,
        setAvailableDevices,
      }}
    >
      {children}
    </BleContext.Provider>
  );
};

export const useBleContext = (): BleContextType => {
  const context = useContext(BleContext);
  if (!context) {
    throw new Error('useBleContext must be used within a BleProvider');
  }
  return context;
};
