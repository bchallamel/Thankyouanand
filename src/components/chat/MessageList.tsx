
import { useRef, useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Message from './Message';
import LoadingIndicator from './LoadingIndicator';
import { wasLatestResponseNotFound } from '@/services/openai';
import { useIsMobile } from '@/hooks/use-mobile';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type MessageListProps = {
  messages: Message[];
  isLoading: boolean;
  pendingQuestion: string;
  copyMessage: (content: string) => void;
  onSelectFollowUp: (suggestion: string) => void;
  followUpSuggestions: string[];
  isGeneratingFollowUps: boolean;
};

const MessageList = ({ 
  messages, 
  isLoading, 
  pendingQuestion, 
  copyMessage,
  onSelectFollowUp,
  followUpSuggestions,
  isGeneratingFollowUps
}: MessageListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [previouslyLoading, setPreviouslyLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const isMobile = useIsMobile();

  // Check if the latest response was a "not found in sources" response
  const isNotFoundResponse = wasLatestResponseNotFound();

  // Update viewport height on resize
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to the most recent user question when loading completes
  useEffect(() => {
    if (previouslyLoading && !isLoading) {
      // Find the most recent user message
      const recentUserMessageIndex = messages.map(msg => msg.role).lastIndexOf('user');
      
      if (recentUserMessageIndex >= 0) {
        // Find the DOM element for this message
        const userMessageElement = document.getElementById(`user-message-${recentUserMessageIndex}`);
        
        if (userMessageElement && scrollAreaRef.current) {
          // Important: Only scroll within the ScrollArea component, not the whole page
          setTimeout(() => {
            userMessageElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
            
            // Prevent the main page from scrolling by resetting its scroll position
            window.scrollTo({
              top: window.scrollY,
              behavior: 'auto'
            });
          }, 100);
        }
      }
    }
    setPreviouslyLoading(isLoading);
  }, [isLoading, previouslyLoading, messages]);

  // Track message count changes
  useEffect(() => {
    if (messages.length > lastMessageCount) {
      setLastMessageCount(messages.length);
    }
  }, [messages.length, lastMessageCount]);

  // Check scroll position
  useEffect(() => {
    const checkScrollPosition = () => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          const { scrollTop, scrollHeight, clientHeight } = viewport as HTMLElement;
          // Show button if we're not at the bottom
          const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
          setShowScrollButton(!isAtBottom && messages.length > 0);
        }
      }
    };

    // Add scroll event listener to viewport
    const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.addEventListener('scroll', checkScrollPosition);
    }

    return () => {
      if (viewport) {
        viewport.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, [messages.length]);

  // Calculate a dynamic height based on content and viewport
  const calculateFixedHeight = () => {
    // For initial message, we want a very compact display
    if (messages.length === 0 || (messages.length === 1 && messages[0].role === 'assistant')) {
      // For mobile devices
      if (isMobile) {
        return "min-h-[60px] max-h-[45vh]";
      }
      
      // For desktop devices - more compact initial message
      return "min-h-[60px] max-h-[55vh]";
    }
    
    // For conversations with multiple messages
    if (isMobile) {
      return "min-h-[200px] max-h-[45vh]";
    }
    
    // For desktop devices with conversations
    return "min-h-[300px] max-h-[55vh]";
  };

  // Use a dynamic height based on content
  const heightClass = calculateFixedHeight();

  // Find the index of the last assistant message for follow-up suggestions
  const lastAssistantMessageIndex = messages
    .map((message, index) => ({ role: message.role, index }))
    .filter(item => item.role === 'assistant')
    .pop()?.index;

  return (
    <div className="relative">
      <ScrollArea 
        className={`flex-grow pr-4 -mr-4 overflow-y-auto ${heightClass}`} 
        ref={scrollAreaRef}
      >
        <div className={`space-y-4 ${messages.length <= 1 ? 'py-2' : 'py-3'}`}>
          {messages.map((message, index) => {
            const isLastAssistantMsg = index === lastAssistantMessageIndex;
            const isUserMessage = message.role === 'user';
            
            return (
              <div 
                key={index} 
                id={isUserMessage ? `user-message-${index}` : undefined}
              >
                <Message 
                  role={message.role}
                  content={message.content}
                  copyMessage={copyMessage}
                  isLastAssistantMessage={isLastAssistantMsg}
                  onSelectFollowUp={isLastAssistantMsg ? onSelectFollowUp : undefined}
                  followUpSuggestions={isLastAssistantMsg && !isNotFoundResponse ? followUpSuggestions : []}
                  isGeneratingFollowUps={isLastAssistantMsg && isGeneratingFollowUps && !isLoading && !isNotFoundResponse}
                  showInitialPrompts={isLastAssistantMsg && isNotFoundResponse}
                />
              </div>
            );
          })}
          {isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} style={{ marginTop: messages.length <= 1 ? '0' : '10px' }} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageList;
