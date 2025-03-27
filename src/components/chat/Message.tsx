import { Copy, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';
import FollowUpSuggestions from './FollowUpSuggestions';
import InitialPromptSuggestions from './InitialPromptSuggestions';
import { useIsMobile } from '@/hooks/use-mobile';
import AudioPlayer from './AudioPlayer';
import { useState } from 'react';

type MessageProps = {
  content: string;
  role: 'user' | 'assistant';
  copyMessage: (content: string) => void;
  isLastAssistantMessage?: boolean;
  onSelectFollowUp?: (suggestion: string) => void;
  followUpSuggestions?: string[];
  isGeneratingFollowUps?: boolean;
  showInitialPrompts?: boolean;
};

const Message = ({ 
  content, 
  role, 
  copyMessage, 
  isLastAssistantMessage = false,
  onSelectFollowUp,
  followUpSuggestions = [],
  isGeneratingFollowUps = false,
  showInitialPrompts = false
}: MessageProps) => {
  const isMobile = useIsMobile();
  const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState(false);
  
  console.log('Message rendering:', {
    isLastAssistantMessage,
    followUpSuggestionsCount: followUpSuggestions.length,
    isGeneratingFollowUps,
    showInitialPrompts,
    isMobile
  });

  // Custom components for ReactMarkdown - adjusted for mobile with increased font size
  const markdownComponents = {
    h1: ({ node, ...props }: any) => (
      <h1 className={`font-medium text-foreground mt-6 mb-3 ${isMobile ? 'text-xl' : 'text-xl'}`} {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 className={`font-medium text-foreground mt-5 mb-2 ${isMobile ? 'text-lg' : 'text-lg'}`} {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 className={`font-medium text-foreground mt-4 mb-2 ${isMobile ? 'text-base' : 'text-base'}`} {...props} />
    ),
    h4: ({ node, ...props }: any) => (
      <h4 className={`font-medium text-foreground mt-3 mb-1 ${isMobile ? 'text-base' : 'text-base'}`} {...props} />
    ),
    p: ({ node, ...props }: any) => (
      <p className={`my-3 ${isMobile ? 'text-sm' : 'text-sm'} text-foreground`} {...props} />
    ),
    ul: ({ node, ...props }: any) => (
      <ul className={`list-disc pl-6 my-3 ${isMobile ? 'text-sm' : 'text-sm'}`} {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol className={`list-decimal pl-6 my-3 ${isMobile ? 'text-sm' : 'text-sm'}`} {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li className={`my-1 ${isMobile ? 'text-sm' : 'text-sm'}`} {...props} />
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      if (inline) {
        return <code className={`bg-muted px-1 py-0.5 rounded font-mono ${isMobile ? 'text-xs' : 'text-xs'}`} {...props}>{children}</code>
      }
      return (
        <pre className="bg-muted p-4 rounded-md overflow-x-auto my-4">
          <code className={`font-mono ${isMobile ? 'text-xs' : 'text-xs'}`} {...props}>{children}</code>
        </pre>
      )
    },
    strong: ({ node, ...props }: any) => {
      const text = props.children?.toString() || '';
      // Check if this looks like a section title (all caps, ends with ":" and not too long)
      if (text === text.toUpperCase() && text.endsWith(':') && text.length < 30) {
        return <Badge variant="outline" className={`font-semibold block mt-5 mb-2 px-2 py-1 ${isMobile ? 'text-sm' : 'text-sm'}`}>{props.children}</Badge>;
      }
      return <strong className="font-semibold" {...props} />;
    },
    blockquote: ({ node, ...props }: any) => (
      <blockquote className={`border-l-4 border-primary/20 pl-4 italic text-muted-foreground my-4 ${isMobile ? 'text-sm' : 'text-sm'}`} {...props} />
    ),
    table: ({ node, ...props }: any) => (
      <div className="overflow-x-auto my-6">
        <table className={`min-w-full border-collapse ${isMobile ? 'text-sm' : 'text-sm'}`} {...props} />
      </div>
    ),
    th: ({ node, ...props }: any) => (
      <th className={`border border-border px-4 py-2 bg-muted font-medium ${isMobile ? 'text-sm' : 'text-sm'}`} {...props} />
    ),
    td: ({ node, ...props }: any) => (
      <td className={`border border-border px-4 py-2 ${isMobile ? 'text-sm' : 'text-sm'}`} {...props} />
    )
  };

  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={cn(
          `max-w-[85%] rounded-lg px-4 py-3 group relative ${isMobile ? 'text-sm' : 'text-sm'}`,
          role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted border border-border/40'
        )}
      >
        {role === 'user' ? (
          <div className="whitespace-pre-wrap">{content}</div>
        ) : (
          <>
            {/* Audio player dialog */}
            {isAudioPlayerOpen && role === 'assistant' && (
              <div className="mb-3">
                <AudioPlayer text={content} autoPlay={false} />
              </div>
            )}
            
            <div className="prose dark:prose-invert max-w-none leading-relaxed">
              <ReactMarkdown components={markdownComponents}>
                {content}
              </ReactMarkdown>
            </div>
            
            {/* Show follow-up suggestions if available and not showing initial prompts */}
            {isLastAssistantMessage && onSelectFollowUp && !showInitialPrompts && (
              <FollowUpSuggestions 
                suggestions={followUpSuggestions} 
                onSelectSuggestion={onSelectFollowUp}
                isLoading={isGeneratingFollowUps}
              />
            )}
            
            {/* Show initial prompt suggestions if this response is "not found in sources" */}
            {isLastAssistantMessage && onSelectFollowUp && showInitialPrompts && (
              <InitialPromptSuggestions onSelectSuggestion={onSelectFollowUp} />
            )}
          </>
        )}
        
        {role === 'assistant' && (
          <div className="absolute -top-3 -right-3 flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsAudioPlayerOpen(!isAudioPlayerOpen)}
                    className="h-6 w-6 bg-background shadow"
                  >
                    <Headphones className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Listen to message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copyMessage(content)}
                    className="h-6 w-6 bg-background shadow"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
