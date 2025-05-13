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
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  
  // Check if Web Serial API is supported
  const isSupported = typeof navigator !== 'undefined' && 'serial' in navigator;
  
  // Enhanced port scanning with vendor/product ID detection
  const scanPorts = useCallback(async () => {
    if (!isSupported) {
      setLastError("Web Serial API is not supported in this browser");
      return false;
    }
    
    try {
      setIsScanning(true);
      
      const knownESP32Vendors = [
        { id: '0x10c4', name: 'Silicon Labs' },  // Common ESP32 USB-UART chip
        { id: '0x1a86', name: 'QinHeng Electronics' }, // CH340 converter used in many ESP32 boards
        { id: '0x303a', name: 'Espressif' } // Espressif's own USB VID
      ];
      
      // Get existing ports
      const ports = await navigator.serial.getPorts();
      
      const portInfos: SerialPortInfo[] = await Promise.all(
        ports.map(async (p) => {
          const info = p.getInfo();
          let manufacturer = 'Unknown';
          
          // Try to identify ESP32 devices by vendor ID
          if (info.usbVendorId) {
            const vendorHex = '0x' + info.usbVendorId.toString(16);
            const knownVendor = knownESP32Vendors.find(v => v.id === vendorHex);
            if (knownVendor) {
              manufacturer = `${knownVendor.name} (Likely ESP32)`;
            }
          }
          
          return {
            path: `Port ${ports.indexOf(p) + 1}`,
            manufacturer: manufacturer,
            productId: info.usbProductId ? '0x' + info.usbProductId.toString(16) : undefined,
            vendorId: info.usbVendorId ? '0x' + info.usbVendorId.toString(16) : undefined,
          };
        })
      );
      
      setAvailablePorts(portInfos);
      return true;
    } catch (error) {
      console.error('Failed to scan serial ports:', error);
      setLastError(`Failed to scan ports: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    } finally {
      setIsScanning(false);
    }
  }, [isSupported]);
  
  // Enhanced connection with retry mechanism
  const connect = useCallback(async (options: SerialOptions = {}): Promise<boolean> => {
    if (!isSupported) {
      setLastError("Web Serial API is not supported in this browser");
      return false;
    }
    
    try {
      setConnectionAttempts(prev => prev + 1);
      
      // Request user to select a serial port
      const selectedPort = await navigator.serial.requestPort({
        filters: [
          // Add filters for common ESP32 USB-UART chips
          { usbVendorId: 0x10C4 }, // Silicon Labs CP210x
          { usbVendorId: 0x1A86 }, // CH340
          { usbVendorId: 0x303A }  // Espressif
        ]
      });
      
      // Reset the port if it was previously opened
      if (selectedPort.readable || selectedPort.writable) {
        await selectedPort.close();
      }
      
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
        setLastError(null);
        return true;
      } else {
        throw new Error('Failed to get reader or writer for the serial port');
      }
    } catch (error) {
      console.error('Serial connection error:', error);
      setLastError(`Connection error: ${error instanceof Error ? error.message : String(error)}`);
      setIsConnected(false);
      return false;
    }
  }, [baudRate, isSupported]);
  
  // Robust disconnect function
  const disconnect = useCallback(async (): Promise<boolean> => {
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
      setLastError(`Disconnection error: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }, [port, reader, writer]);
  
  // Enhanced read with error handling and reconnection
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
      setLastError(`Read error: ${error instanceof Error ? error.message : String(error)}`);
      
      // If the port got disconnected, attempt to clean up
      if (port && isConnected) {
        try {
          await disconnect();
        } catch (cleanupError) {
          console.error('Error during cleanup after read failure:', cleanupError);
        }
      }
      
      return null;
    }
  }, [reader, isConnected, port, disconnect]);
  
  // Enhanced write with error handling and chunking for large data
  const writeData = useCallback(async (data: string): Promise<boolean> => {
    if (!writer || !isConnected) return false;
    
    try {
      const encoder = new TextEncoder();
      // Ensure we add a newline if not present
      const normalizedData = data.endsWith('\r\n') ? data : data + '\r\n';
      const encoded = encoder.encode(normalizedData);
      
      // For large data, chunk it to avoid buffer overflows
      const CHUNK_SIZE = 512;
      if (encoded.length > CHUNK_SIZE) {
        for (let i = 0; i < encoded.length; i += CHUNK_SIZE) {
          const chunk = encoded.slice(i, i + CHUNK_SIZE);
          await writer.write(chunk);
          // Small delay between chunks
          await new Promise(resolve => setTimeout(resolve, 5));
        }
      } else {
        await writer.write(encoded);
      }
      
      return true;
    } catch (error) {
      console.error('Serial write error:', error);
      setLastError(`Write error: ${error instanceof Error ? error.message : String(error)}`);
      
      // If the port got disconnected during write, attempt to clean up
      if (error instanceof Error && error.message.includes('disconnected') && isConnected) {
        try {
          await disconnect();
        } catch (cleanupError) {
          console.error('Error during cleanup after write failure:', cleanupError);
        }
      }
      
      return false;
    }
  }, [writer, isConnected, disconnect]);
  
  // Change baud rate with better error handling
  const changeBaudRate = useCallback(async (newBaudRate: number): Promise<boolean> => {
    setBaudRate(newBaudRate);
    
    if (isConnected) {
      // We need to reconnect with the new baud rate
      try {
        await disconnect();
        return await connect({ baudRate: newBaudRate });
      } catch (error) {
        console.error('Error changing baud rate:', error);
        setLastError(`Baud rate change error: ${error instanceof Error ? error.message : String(error)}`);
        return false;
      }
    }
    
    return true;
  }, [connect, disconnect, isConnected]);
  
  // Auto-discovery of ESP32 devices on mount
  useEffect(() => {
    if (isSupported) {
      scanPorts().catch(console.error);
      
      // Fix for addEventListener not existing on NavigatorSerial
      // Use a manual refresh approach instead of event listeners
      const checkForDeviceChanges = setInterval(() => {
        scanPorts().catch(console.error);
      }, 5000);
      
      return () => {
        clearInterval(checkForDeviceChanges);
      };
    }
  }, [isSupported, scanPorts]);
  
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
    connectionAttempts,
    lastError
  };
};
