
import { useState, useEffect } from 'react';
import { getConversationHistory } from '@/services/openai';
import { Message } from '@/utils/chatUtils';
import { useFollowUps } from './use-follow-ups';

export function useMessageState() {
  const [inputValue, setInputValue] = useState('');
  const [pendingQuestion, setPendingQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const followUpsManager = useFollowUps();

  // Load messages from localStorage on component mount
  useEffect(() => {
    try {
      const storedMessages = getConversationHistory();
      if (storedMessages.length > 0) {
        // Filter out any 'system' role messages and convert to Message type
        const filteredMessages = storedMessages
          .filter(msg => msg.role === 'user' || msg.role === 'assistant')
          .map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          }));
        
        setMessages(filteredMessages);
        
        // Generate follow-up suggestions for the last assistant message
        const lastAssistantMessage = filteredMessages
          .filter(msg => msg.role === 'assistant')
          .pop();
          
        if (lastAssistantMessage) {
          followUpsManager.generateFollowUpsForLastMessage(filteredMessages);
        }
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
      // Don't propagate the error to prevent app crash
    }
  }, []);

  return {
    inputValue,
    setInputValue,
    pendingQuestion,
    setPendingQuestion,
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    ...followUpsManager
  };
}
