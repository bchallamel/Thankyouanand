
import { RefreshCcw, ClipboardCopy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ChatActionsProps = {
  copyConversation: () => void;
  resetConversation: () => void;
};

const ChatActions = ({ copyConversation, resetConversation }: ChatActionsProps) => {
  return (
    <div className="mt-4 mb-4 flex flex-col md:flex-row justify-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={copyConversation}
              className="text-xs text-muted-foreground hover:text-foreground w-full md:w-auto h-8 rounded-full bg-background border border-input"
            >
              <ClipboardCopy className="h-3 w-3 mr-1" />
              Copy Conversation
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy entire conversation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={resetConversation}
              className="text-xs text-muted-foreground hover:text-foreground w-full md:w-auto h-8 rounded-full bg-background border border-input"
            >
              <RefreshCcw className="h-3 w-3 mr-1" />
              Reset Conversation
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset conversation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ChatActions;
