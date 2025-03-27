
import { useState, useEffect } from 'react';
import { PromptIdea } from './types';
import PromptCard from './PromptCard';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type PromptCarouselProps = {
  filteredPrompts: PromptIdea[];
  onSelectPrompt: (prompt: string) => void;
  setCarouselApi: (api: any) => void;
};

const PromptCarousel = ({ filteredPrompts, onSelectPrompt, setCarouselApi }: PromptCarouselProps) => {
  return (
    <Carousel className="w-full" setApi={setCarouselApi}>
      <CarouselContent>
        {/* Show message when no prompts match the filter */}
        {filteredPrompts.length === 0 ? (
          <CarouselItem>
            <div className="flex justify-center items-center h-24 text-muted-foreground">
              No prompts found for this category. Try another filter.
            </div>
          </CarouselItem>
        ) : (
          /* Group filtered prompts into sets of 3 */
          Array.from({ length: Math.ceil(filteredPrompts.length / 3) }).map((_, slideIndex) => (
            <CarouselItem key={slideIndex}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-1">
                {filteredPrompts.slice(slideIndex * 3, slideIndex * 3 + 3).map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    id={prompt.id}
                    text={prompt.text}
                    onSelect={onSelectPrompt}
                  />
                ))}
              </div>
            </CarouselItem>
          ))
        )}
      </CarouselContent>
    </Carousel>
  );
};

export default PromptCarousel;
