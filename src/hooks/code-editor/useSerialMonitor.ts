
import { useState, useEffect } from 'react';
import { useSerialPort } from "@/hooks/useSerialPort";
import { toast } from "@/hooks/use-toast";

export interface SerialMessage {
  type: 'sent' | 'received';
  content: string;
  timestamp: Date;
}

export const useSerialMonitor = () => {
  const serialHooks = useSerialPort();
  
  const [serialMessages, setSerialMessages] = useState<SerialMessage[]>([
    { type: 'received', content: 'ESP32 GPIO Monitor initialized', timestamp: new Date() },
    { type: 'received', content: 'GPIO:32:1,GPIO:33:0,GPIO:34:1,GPIO:35:0', timestamp: new Date() }
  ]);
  
  // Serial communication handlers
  const handleSendSerialMessage = (message: string) => {
    if (serialHooks.isConnected) {
      serialHooks.writeData(message);
      setSerialMessages(prev => [
        ...prev,
        { type: 'sent', content: message, timestamp: new Date() }
      ]);
    }
  };
  
  const handleSerialConnect = async (portPath: string) => {
    try {
      const connected = await serialHooks.connect({ baudRate: serialHooks.baudRate });
      
      if (connected) {
        toast({
          title: "Device Connected",
          description: "Serial connection established successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to serial port. Check permissions and try again.",
        variant: "destructive"
      });
    }
  };
  
  // Clear serial monitor messages
  const handleClearSerialMessages = () => {
    setSerialMessages([]);
  };
  
  // Export serial monitor messages
  const handleExportSerialMessages = () => {
    // Create a text version of the messages
    const text = serialMessages.map(msg => 
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.type === 'sent' ? '> ' : '< '}${msg.content}`
    ).join('\n');
    
    // Create a blob and download link
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'serial_log.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Log Exported",
      description: "Serial communication log has been exported to a text file.",
    });
  };

  // Poll for serial data
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (serialHooks.isConnected) {
      interval = setInterval(async () => {
        const data = await serialHooks.readData();
        if (data) {
          setSerialMessages(prev => [
            ...prev,
            { type: 'received', content: data, timestamp: new Date() }
          ]);
        }
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [serialHooks.isConnected, serialHooks.readData]);

  return {
    serialMessages,
    setSerialMessages,
    serialHooks,
    handleSendSerialMessage,
    handleSerialConnect,
    handleClearSerialMessages,
    handleExportSerialMessages
  };
};
