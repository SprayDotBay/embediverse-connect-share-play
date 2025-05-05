
import { useState, useEffect, useCallback } from 'react';

interface SerialOptions {
  baudRate?: number;
  dataBits?: number;
  stopBits?: number;
  parity?: 'none' | 'even' | 'odd';
  bufferSize?: number;
  flowControl?: 'none' | 'hardware';
}

interface SerialPortInfo {
  path: string;
  manufacturer?: string;
  productId?: string;
  vendorId?: string;
}

export const useSerialPort = () => {
  const [port, setPort] = useState<SerialPort | null>(null);
  const [reader, setReader] = useState<ReadableStreamDefaultReader | null>(null);
  const [writer, setWriter] = useState<WritableStreamDefaultWriter | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [availablePorts, setAvailablePorts] = useState<SerialPortInfo[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [baudRate, setBaudRate] = useState(115200);
  
  // Check if Web Serial API is supported
  const isSupported = 'serial' in navigator;
  
  // Scan for available serial ports
  const scanPorts = useCallback(async () => {
    if (!isSupported) return;
    
    try {
      setIsScanning(true);
      
      // Request port access to trigger the device list
      await navigator.serial.requestPort();
      const ports = await navigator.serial.getPorts();
      
      const portInfos: SerialPortInfo[] = ports.map(p => {
        const info = p.getInfo();
        return {
          path: `Port ${ports.indexOf(p) + 1}`,
          manufacturer: 'Unknown',
          productId: info.usbProductId ? info.usbProductId.toString(16) : undefined,
          vendorId: info.usbVendorId ? info.usbVendorId.toString(16) : undefined,
        };
      });
      
      setAvailablePorts(portInfos);
    } catch (error) {
      console.error('Failed to scan serial ports:', error);
    } finally {
      setIsScanning(false);
    }
  }, [isSupported]);
  
  // Connect to a serial port
  const connect = useCallback(async (options: SerialOptions = {}) => {
    if (!isSupported) {
      throw new Error('Web Serial API is not supported in this browser');
    }
    
    try {
      // Request user to select a serial port
      const selectedPort = await navigator.serial.requestPort();
      
      // Open the port with specified options
      await selectedPort.open({
        baudRate: options.baudRate || baudRate,
        dataBits: options.dataBits || 8,
        stopBits: options.stopBits || 1,
        parity: options.parity || 'none',
        bufferSize: options.bufferSize || 255,
        flowControl: options.flowControl || 'none',
      });
      
      setPort(selectedPort);
      
      // Set up reader and writer
      const portReader = selectedPort.readable?.getReader();
      const portWriter = selectedPort.writable?.getWriter();
      
      if (portReader && portWriter) {
        setReader(portReader);
        setWriter(portWriter);
        setIsConnected(true);
        return true;
      } else {
        throw new Error('Failed to get reader or writer for the serial port');
      }
    } catch (error) {
      console.error('Serial connection error:', error);
      setIsConnected(false);
      return false;
    }
  }, [baudRate, isSupported]);
  
  // Disconnect from the serial port
  const disconnect = useCallback(async () => {
    try {
      if (reader) {
        reader.releaseLock();
        setReader(null);
      }
      
      if (writer) {
        writer.releaseLock();
        setWriter(null);
      }
      
      if (port) {
        await port.close();
        setPort(null);
      }
      
      setIsConnected(false);
      return true;
    } catch (error) {
      console.error('Serial disconnection error:', error);
      return false;
    }
  }, [port, reader, writer]);
  
  // Read data from the serial port
  const readData = useCallback(async (): Promise<string | null> => {
    if (!reader || !isConnected) return null;
    
    try {
      const { value, done } = await reader.read();
      
      if (done) {
        // The stream has been canceled
        setIsConnected(false);
        return null;
      }
      
      // Convert the Uint8Array to a string
      const decoder = new TextDecoder();
      return decoder.decode(value);
    } catch (error) {
      console.error('Serial read error:', error);
      return null;
    }
  }, [reader, isConnected]);
  
  // Write data to the serial port
  const writeData = useCallback(async (data: string): Promise<boolean> => {
    if (!writer || !isConnected) return false;
    
    try {
      const encoder = new TextEncoder();
      const encoded = encoder.encode(data + '\r\n');
      await writer.write(encoded);
      return true;
    } catch (error) {
      console.error('Serial write error:', error);
      return false;
    }
  }, [writer, isConnected]);
  
  // Change baud rate
  const changeBaudRate = useCallback(async (newBaudRate: number): Promise<boolean> => {
    setBaudRate(newBaudRate);
    
    if (isConnected) {
      // We need to reconnect with the new baud rate
      await disconnect();
      return connect({ baudRate: newBaudRate });
    }
    
    return true;
  }, [connect, disconnect, isConnected]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (reader) {
        reader.releaseLock();
      }
      if (writer) {
        writer.releaseLock();
      }
      if (port && port.readable && port.writable) {
        // Close the port if it's open
        port.close().catch(console.error);
      }
    };
  }, [port, reader, writer]);
  
  return {
    isSupported,
    isConnected,
    connect,
    disconnect,
    readData,
    writeData,
    scanPorts,
    availablePorts,
    isScanning,
    baudRate,
    changeBaudRate,
  };
};
