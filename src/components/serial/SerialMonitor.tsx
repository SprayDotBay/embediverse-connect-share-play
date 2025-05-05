
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, DownloadIcon, Send, Trash } from "lucide-react";

interface SerialMonitorProps {
  connected: boolean;
  onSend: (message: string) => void;
  onClear: () => void;
  onExport: () => void;
  baudRate: number;
  onBaudRateChange: (rate: number) => void;
  messages: Array<{
    type: 'sent' | 'received';
    content: string;
    timestamp: Date;
  }>;
}

export const SerialMonitor: React.FC<SerialMonitorProps> = ({
  connected,
  onSend,
  onClear,
  onExport,
  baudRate,
  onBaudRateChange,
  messages
}) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSend = () => {
    if (message.trim() && connected) {
      onSend(message);
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Serial Monitor</CardTitle>
        <div className="flex items-center gap-2">
          <Select 
            value={baudRate.toString()} 
            onValueChange={(value) => onBaudRateChange(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Baud Rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9600">9600</SelectItem>
              <SelectItem value="19200">19200</SelectItem>
              <SelectItem value="38400">38400</SelectItem>
              <SelectItem value="57600">57600</SelectItem>
              <SelectItem value="115200">115200</SelectItem>
            </SelectContent>
          </Select>
          <div className={`px-2 py-1 rounded text-xs ${connected ? 'bg-green-success/20 text-green-success' : 'bg-red-error/20 text-red-error'}`}>
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-auto p-4 bg-card border-y font-mono text-xs space-y-1">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.type === 'sent' ? 'text-blue-medium' : 'text-green-success'}`}
            >
              <span className="text-muted-foreground mr-2">
                {`[${msg.timestamp.toLocaleTimeString()}]`}
              </span>
              <span className="flex-1 break-all">
                {msg.type === 'sent' ? '> ' : '< '}{msg.content}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-3 flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message to send..."
            disabled={!connected}
          />
          <Button 
            variant="default" 
            size="icon" 
            onClick={handleSend}
            disabled={!connected}
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={onClear}
          >
            <Trash className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={onExport}
          >
            <DownloadIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
