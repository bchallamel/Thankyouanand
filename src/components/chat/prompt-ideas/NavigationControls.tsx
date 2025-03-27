
import { useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import CategoryFilter, { PromptCategory } from './CategoryFilter';
import RandomPromptButton from './RandomPromptButton';
import { 
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious 
} from "@/components/ui/carousel";
import { PromptIdea } from './types';

type NavigationControlsProps = {
  selectedCategory: PromptCategory;
  onCategoryChange: (category: PromptCategory) => void;
  promptsData: PromptIdea[];
  onSelectPrompt: (prompt: string) => void;
  carouselApi: any;
};

const NavigationControls = ({ 
  selectedCategory, 
  onCategoryChange, 
  promptsData, 
  onSelectPrompt,
  carouselApi
}: NavigationControlsProps) => {
  const isMobile = useIsMobile();
  // Use a dummy ref to create a valid carousel that doesn't actually display content
  const dummyRef = useRef(null);
  
  return (
    <div className="flex justify-between items-center w-full px-6 py-1">
      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onCategoryChange={onCategoryChange} 
      />
      
      {/* Wrap navigation buttons in a minimal Carousel for context */}
      <Carousel>
        <CarouselContent className="hidden">
          {/* Hidden content to make the carousel valid */}
          <div ref={dummyRef}></div>
        </CarouselContent>
        <div className="flex items-center space-x-4">
          <CarouselPrevious 
            onClick={() => carouselApi?.scrollPrev()} 
            className="relative static left-0 right-auto translate-y-0 h-10 w-10 rounded-full p-0 flex items-center justify-center"
            disabled={!carouselApi?.canScrollPrev} 
          />
          <CarouselNext 
            onClick={() => carouselApi?.scrollNext()} 
            className="relative static right-0 left-auto translate-y-0 h-10 w-10 rounded-full p-0 flex items-center justify-center"
            disabled={!carouselApi?.canScrollNext} 
          />
        </div>
      </Carousel>
      
      <RandomPromptButton 
        promptsData={promptsData}
        selectedCategory={selectedCategory}
        onSelectPrompt={onSelectPrompt}
      />
    </div>
  );
};

export default NavigationControls;
