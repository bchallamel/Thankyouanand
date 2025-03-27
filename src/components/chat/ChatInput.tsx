
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import React, { useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

type ChatInputProps = {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
};

const ChatInput = ({ inputValue, setInputValue, handleSendMessage, isLoading }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      try {
        handleSendMessage();
      } catch (error) {
        console.error('Error sending message:', error);
        // Don't propagate the error to prevent app crash
      }
    }
  };

  const handleSubmit = () => {
    try {
      handleSendMessage();
    } catch (error) {
      console.error('Error sending message:', error);
      // Don't propagate the error to prevent app crash
    }
  };

  return (
    <div className="relative w-full mb-2">
      <Textarea
        ref={textareaRef}
        placeholder="Ask a question..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`min-h-[42px] resize-none overflow-hidden pr-12 border-0 bg-secondary/50 focus-visible:ring-0 focus-visible:ring-offset-0 ${isMobile ? 'text-sm' : ''}`}
        rows={1}
      />
      
      {/* Send button positioned to the right of the textarea */}
      <div className="absolute right-2 bottom-1/2 transform translate-y-1/2">
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading}
          size="icon"
          className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
          variant="default"
        >
          <ArrowUp className="h-4 w-4 text-primary-foreground" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
