
import { LightbulbIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CollapsibleTrigger } from '@/components/ui/collapsible';

type PromptIdeasHeaderProps = {
  isPromptsOpen: boolean;
};

const PromptIdeasHeader = ({ isPromptsOpen }: PromptIdeasHeaderProps) => {
  return (
    <CollapsibleTrigger asChild>
      <Button 
        variant="outline" 
        className="flex w-full justify-between items-center p-2 text-sm bg-muted/30"
      >
        <div className="flex items-center gap-2">
          <LightbulbIcon className="h-4 w-4 text-primary" />
          <span>Prompt ideas to get started!</span>
        </div>
        {isPromptsOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
    </CollapsibleTrigger>
  );
};

export default PromptIdeasHeader;
