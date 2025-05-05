
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DevicesHeaderProps {
  onAddDevice?: () => void;
  onSearch?: (term: string) => void;
}

export const DevicesHeader = ({ onAddDevice, onSearch }: DevicesHeaderProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };
  
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight">Devices</h1>
      <div className="flex gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search devices..." 
            className="pl-8 w-[250px]" 
            onChange={handleSearchChange}
          />
        </div>
        <Button onClick={onAddDevice}>Add Device</Button>
      </div>
    </div>
  );
};
