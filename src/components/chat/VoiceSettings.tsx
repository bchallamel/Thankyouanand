
import React, { useState, useRef } from 'react';
import { Zap, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface VoiceSettingsValues {
  model: string;
  stability: number;
  similarity: number;
  style: number;
  speakerBoost: boolean;
  speed: number;
}

interface VoiceSettingsProps {
  settings: VoiceSettingsValues;
  onChange: (settings: VoiceSettingsValues) => void;
}

// Fast generation preset (current default values)
export const fastGenerationPreset: VoiceSettingsValues = {
  model: 'eleven_turbo_v2_5',
  stability: 0.3,
  similarity: 0.9,
  style: 0.5,
  speakerBoost: false,
  speed: 0.95,
};

// Updated high quality preset based on the provided image
export const highQualityPreset: VoiceSettingsValues = {
  model: 'eleven_multilingual_v2',
  stability: 0.9,       // 90%
  similarity: 0.95,     // 95%
  style: 0.3,           // 30%
  speakerBoost: true,   // Enabled
  speed: 1.05,          // 1.05
};

export const defaultVoiceSettings: VoiceSettingsValues = fastGenerationPreset;

const VoiceSettings = ({ settings, onChange }: VoiceSettingsProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [activeOption, setActiveOption] = useState<'speed' | 'quality'>('speed');
  
  const handleOptionSelect = (option: 'speed' | 'quality') => {
    if (option === 'speed') {
      onChange(fastGenerationPreset);
    } else {
      onChange(highQualityPreset);
    }
    setActiveOption(option);
    setIsOpen(false);
  };

  // Render the active icon based on the current selection
  const renderActiveIcon = () => {
    return activeOption === 'speed' 
      ? <Zap className="h-3.5 w-3.5" /> 
      : <Gem className="h-3.5 w-3.5" />;
  };

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            ref={buttonRef}
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 p-0" 
            title={`Voice Settings (${activeOption === 'speed' ? 'Speed' : 'Quality'})`}
          >
            {renderActiveIcon()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          sideOffset={5}
          className="w-32 p-1"
        >
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleOptionSelect('speed')}
          >
            <Zap className="h-4 w-4" />
            Speed
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleOptionSelect('quality')}
          >
            <Gem className="h-4 w-4" />
            Quality
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default VoiceSettings;
