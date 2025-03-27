
import { MessageSquareText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useChat } from '@/hooks/use-chat';
import { useIsMobile } from '@/hooks/use-mobile';
import PromptIdeas from './PromptIdeas';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import ChatActions from './ChatActions';
import { useEffect, useState } from 'react';

const MainChatInterface = () => {
  const {
    inputValue,
    setInputValue,
    pendingQuestion,
    messages,
    isLoading,
    textareaRef,
    followUpSuggestions,
    isGeneratingFollowUps,
    handleSendMessage,
    handleResetConversation,
    handleSelectPrompt,
    copyMessage,
    copyConversation
  } = useChat();
  
  const isMobile = useIsMobile();
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // Track window height for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectFollowUp = (suggestion: string) => {
    setInputValue(suggestion);
    // Focus on the textarea after selecting a follow-up suggestion
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Updated initial welcome message with the new text
  const initialMessage = {
    role: 'assistant' as const,
    content: "Hi! I'm Brice's AI Avatar. I can chat with you about any topic mentioned in one of my interviews, articles or case studies. What would you like to talk about?"
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquareText className="h-6 w-6 text-primary" />
        <h2 className="text-xl md:text-2xl font-bold">Chat with my AI Avatar</h2>
      </div>
      
      {/* Prompt Ideas Collapsible Menu */}
      <div className="mb-2">
        <PromptIdeas onSelectPrompt={handleSelectPrompt} />
      </div>
      
      <Card className="shadow-lg border-primary/10">
        <CardContent className={`p-3 pb-3 flex flex-col ${messages.length === 0 ? 'gap-0' : 'gap-2'}`}>
          {/* Chat Messages Area - Show initial message when no messages, otherwise show conversation */}
          {messages.length === 0 ? (
            <MessageList 
              messages={[initialMessage]} 
              isLoading={false} 
              pendingQuestion="" 
              copyMessage={copyMessage}
              onSelectFollowUp={handleSelectFollowUp}
              followUpSuggestions={[]}
              isGeneratingFollowUps={false}
            />
          ) : (
            <MessageList 
              messages={messages} 
              isLoading={isLoading} 
              pendingQuestion={pendingQuestion} 
              copyMessage={copyMessage}
              onSelectFollowUp={handleSelectFollowUp}
              followUpSuggestions={followUpSuggestions}
              isGeneratingFollowUps={isGeneratingFollowUps}
            />
          )}
          
          {/* Input Area with Send Button */}
          <div className="mt-1">
            <ChatInput 
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
          
          {/* Action Buttons - Only show when there are messages */}
          {messages.length > 0 && (
            <ChatActions 
              copyConversation={copyConversation}
              resetConversation={handleResetConversation}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MainChatInterface;
