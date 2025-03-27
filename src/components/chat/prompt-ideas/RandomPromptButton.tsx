
import { Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { PromptCategory } from './CategoryFilter';
import { PromptIdea } from './types';

type RandomPromptButtonProps = {
  promptsData: PromptIdea[];
  selectedCategory: PromptCategory;
  onSelectPrompt: (prompt: string) => void;
};

const RandomPromptButton = ({ 
  promptsData, 
  selectedCategory, 
  onSelectPrompt 
}: RandomPromptButtonProps) => {
  const isMobile = useIsMobile();
  
  const handleRandomPrompt = () => {
    // Get all available prompts based on current filter
    const availablePrompts = selectedCategory === 'all' 
      ? promptsData 
      : promptsData.filter(prompt => prompt.category === selectedCategory);
    
    if (availablePrompts.length > 0) {
      // Select a random prompt
      const randomIndex = Math.floor(Math.random() * availablePrompts.length);
      const randomPrompt = availablePrompts[randomIndex].text;
      
      // Start conversation with this prompt but don't close the prompt ideas
      onSelectPrompt(randomPrompt);
    }
  };

  return (
    <Button 
      onClick={handleRandomPrompt}
      variant="outline"
      className={`bg-background border border-input flex items-center justify-center ${
        isMobile
          ? 'w-10 h-10 rounded-full p-0'
          : 'h-10 min-w-[120px] rounded-full px-4 justify-between'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <Dices className="h-4 w-4 flex-shrink-0" />
        {!isMobile && <span className="text-sm">Random</span>}
      </div>
    </Button>
  );
};

export default RandomPromptButton;
