
import React from 'react';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';

type FollowUpSuggestionsProps = {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  isLoading?: boolean;
};

const FollowUpSuggestions = ({ 
  suggestions, 
  onSelectSuggestion, 
  isLoading = false 
}: FollowUpSuggestionsProps) => {
  console.log('FollowUpSuggestions component rendered with:', { 
    suggestionsCount: suggestions.length, 
    isLoading,
    suggestions
  });
  
  // Always render the component when loading
  // Only hide when there are no suggestions and we're not loading
  if (suggestions.length === 0 && !isLoading) {
    console.log('Not showing follow-up suggestions: empty and not loading');
    return null;
  }
  
  return (
    <div className="mt-3 mb-2 border-t border-primary/10 pt-2">
      <p className="text-sm text-muted-foreground mb-2">
        {isLoading ? 'Generating follow-up questions...' : 'Prompt ideas to follow-up:'}
      </p>
      
      {isLoading ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <LoaderCircle className="h-3 w-3 animate-spin" />
          <span>Thinking of good follow-ups...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {suggestions.map((suggestion, index) => (
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
      )}
    </div>
  );
};

export default FollowUpSuggestions;
