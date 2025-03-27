import { useState, useEffect } from 'react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { shuffleArray } from '@/lib/utils';
import PromptIdeasHeader from './prompt-ideas/PromptIdeasHeader';
import PromptCarousel from './prompt-ideas/PromptCarousel';
import NavigationControls from './prompt-ideas/NavigationControls';
import { PromptIdea, promptIdeasData } from './prompt-ideas/types';
import { PromptCategory } from './prompt-ideas/CategoryFilter';

type PromptIdeasProps = {
  onSelectPrompt: (prompt: string) => void;
};

const PromptIdeas = ({ onSelectPrompt }: PromptIdeasProps) => {
  const [isPromptsOpen, setIsPromptsOpen] = useState(false);
  const [shuffledPrompts, setShuffledPrompts] = useState<PromptIdea[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory>('all');
  const [filteredPrompts, setFilteredPrompts] = useState<PromptIdea[]>([]);
  const [carouselApi, setCarouselApi] = useState<any>(null);
  
  // Deduplicate prompts by their text to avoid repeats
  const deduplicatePrompts = (prompts: PromptIdea[]): PromptIdea[] => {
    const seen = new Set<string>();
    return prompts.filter(prompt => {
      // If we've seen this prompt text before, filter it out
      if (seen.has(prompt.text)) {
        return false;
      }
      // Otherwise, add it to our set and keep it
      seen.add(prompt.text);
      return true;
    });
  };
  
  // Shuffle prompts when the component mounts or when the collapsible is opened
  useEffect(() => {
    if (isPromptsOpen) {
      setShuffledPrompts(deduplicatePrompts(shuffleArray(promptIdeasData)));
    }
  }, [isPromptsOpen]);

  // Initial shuffle on component mount
  useEffect(() => {
    setShuffledPrompts(deduplicatePrompts(shuffleArray(promptIdeasData)));
  }, []);

  // Filter prompts based on selected category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPrompts(shuffledPrompts);
    } else {
      // Get unique prompts matching the selected category
      setFilteredPrompts(shuffledPrompts.filter(prompt => prompt.category === selectedCategory));
    }
  }, [selectedCategory, shuffledPrompts]);

  const handleSelectPrompt = (prompt: string) => {
    onSelectPrompt(prompt);
    setIsPromptsOpen(false);
  };

  const handleCategoryChange = (category: PromptCategory) => {
    setSelectedCategory(category);
    // Keep the carousel open when changing categories
    // by ensuring isPromptsOpen remains true
    if (!isPromptsOpen) {
      setIsPromptsOpen(true);
    }
  };

  return (
    <Collapsible
      open={isPromptsOpen}
      onOpenChange={setIsPromptsOpen}
      className="w-full border rounded-md overflow-hidden"
    >
      <PromptIdeasHeader isPromptsOpen={isPromptsOpen} />
      
      <CollapsibleContent className="bg-background p-2 pb-0">
        <PromptCarousel 
          filteredPrompts={filteredPrompts} 
          onSelectPrompt={handleSelectPrompt}
          setCarouselApi={setCarouselApi}
        />

        <NavigationControls 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          promptsData={promptIdeasData}
          onSelectPrompt={onSelectPrompt}
          carouselApi={carouselApi}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PromptIdeas;
