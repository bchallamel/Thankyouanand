
import { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  generateChatResponse, 
  resetConversation 
} from '@/services/openai';
import { useMessageState } from './use-message-state';
import { convertToChatMessages, copyToClipboard, formatConversationForCopy } from '@/utils/chatUtils';

export function useChat() {
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const {
    inputValue,
    setInputValue,
    pendingQuestion,
    setPendingQuestion,
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    followUpSuggestions,
    setFollowUpSuggestions,
    isGeneratingFollowUps,
    setIsGeneratingFollowUps,
    generateFollowUpsForLastMessage
  } = useMessageState();

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      role: 'user' as const,
      content: inputValue
    };
    setMessages(prev => [...prev, userMessage]);
    setPendingQuestion(inputValue);
    setInputValue('');
    setIsLoading(true);
    // Clear follow-up suggestions when sending a new message
    setFollowUpSuggestions([]);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // Convert the messages to the format expected by OpenAI service
      const chatMessages = convertToChatMessages(messages);
      
      // Add the most recent user message
      chatMessages.push({
        role: 'user' as const,
        content: userMessage.content
      });

      // Call the OpenAI API
      const responseContent = await generateChatResponse(chatMessages);
      
      // Add the assistant's response to the messages
      const assistantMessage = {
        role: 'assistant' as const,
        content: responseContent
      };
      
      // Update messages with the new assistant response
      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);
      setPendingQuestion('');
      
      // Generate follow-up questions after getting a response
      setIsGeneratingFollowUps(true);
      try {
        // Create updated message array including the new response
        const updatedChatMessages = convertToChatMessages(updatedMessages);
        
        console.log('Generating follow-up suggestions for updated conversation');
        generateFollowUpsForLastMessage(updatedMessages);
      } catch (followUpError) {
        console.error('Error generating follow-up suggestions:', followUpError);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Revert the pending state
      setMessages(prev => prev.filter(msg => msg.content !== userMessage.content));
      setPendingQuestion('');
      
      toast({
        title: "Error",
        description: error instanceof Error 
          ? `Failed to get a response: ${error.message}` 
          : "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConversation = async () => {
    try {
      await resetConversation();
      setMessages([]);
      setInputValue('');
      setFollowUpSuggestions([]);
    } catch (error) {
      console.error('Error resetting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to reset conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setInputValue(prompt);
    
    // Focus the textarea after selection
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  const copyMessage = (content: string) => {
    copyToClipboard(
      content, 
      'message',
      (title, description) => {
        toast({ title, description, duration: 3000 });
      },
      (title, description) => {
        toast({ title, description, variant: "destructive", duration: 3000 });
      }
    );
  };

  const copyConversation = () => {
    if (messages.length === 0) return;
    
    const conversationText = formatConversationForCopy(messages);
    
    copyToClipboard(
      conversationText, 
      'conversation',
      (title, description) => {
        toast({ title, description, duration: 3000 });
      },
      (title, description) => {
        toast({ title, description, variant: "destructive", duration: 3000 });
      }
    );
  };

  return {
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
  };
}
