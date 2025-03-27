
import React from 'react';
import { Button } from '@/components/ui/button';
import { LightbulbIcon } from 'lucide-react';

// Initial prompt ideas to show when information is not found
const initialPromptIdeas = [
  "Tell me more about your cow analogy to change management!",
  "What are the 5 superpowers of AI, and what's a good example of each?",
  "Why do you think that everyone will become a team of 5 in the future?"
];

type InitialPromptSuggestionsProps = {
  onSelectSuggestion: (suggestion: string) => void;
};

const InitialPromptSuggestions = ({ onSelectSuggestion }: InitialPromptSuggestionsProps) => {
  return (
    <div className="mt-3 mb-2 border-t border-primary/10 pt-3">
      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
        <LightbulbIcon className="h-4 w-4 text-primary" />
        <span>Here are some topics we can explore instead:</span>
      </p>
      
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        {initialPromptIdeas.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="justify-start items-start h-auto py-3 px-3 text-xs text-left whitespace-normal align-top bg-card hover:bg-accent border-primary/20 shadow-sm hover:shadow-md transition-all text-foreground"
            onClick={() => onSelectSuggestion(suggestion)}
          >
            <span className="align-top">{suggestion}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default InitialPromptSuggestions;
