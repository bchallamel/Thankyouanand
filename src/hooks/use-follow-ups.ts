
import { useState, useRef } from 'react';
import { generateFollowUpQuestions, ChatMessage } from '@/services/openai';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function useFollowUps() {
  const [followUpSuggestions, setFollowUpSuggestions] = useState<string[]>([]);
  const [isGeneratingFollowUps, setIsGeneratingFollowUps] = useState(false);
  const [followUpRetries, setFollowUpRetries] = useState(0);
  const { toast } = useToast();
  
  // Keep track of the last successful follow-up questions
  const lastSuccessfulFollowUps = useRef<string[]>([]);

  // Helper function to generate follow-ups
  const generateFollowUpsForLastMessage = async (messageList: Message[]) => {
    if (messageList.length < 2) return;
    
    setIsGeneratingFollowUps(true);
    console.log('Generating follow-ups for last message');
    
    try {
      // Convert messages to ChatMessage format
      const chatMessages: ChatMessage[] = messageList.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));
      
      const suggestions = await generateFollowUpQuestions(chatMessages);
      console.log('Generated follow-up suggestions:', suggestions);
      
      if (suggestions.length > 0) {
        // Store these as the last successful follow-ups
        lastSuccessfulFollowUps.current = [...suggestions];
        setFollowUpSuggestions(suggestions);
      } else {
        // Use last successful follow-ups if available, otherwise use fallbacks
        setFollowUpSuggestions(
          lastSuccessfulFollowUps.current.length > 0 
            ? lastSuccessfulFollowUps.current 
            : [
                "Could you elaborate more on that?",
                "What's your perspective on this topic?",
                "Can you provide some examples?"
              ]
        );
      }
    } catch (error) {
      console.error('Error generating follow-up suggestions:', error);
      
      // If we have previous successful follow-ups, use them
      if (lastSuccessfulFollowUps.current.length > 0) {
        setFollowUpSuggestions(lastSuccessfulFollowUps.current);
      } else {
        // Otherwise use fallback suggestions
        setFollowUpSuggestions([
          "Could you elaborate more on that?",
          "What's your perspective on this topic?",
          "Can you provide some examples?"
        ]);
      }
      
      // Try again if we've hit rate limits and haven't tried too many times
      if (error instanceof Error && 
          error.message.includes('rate_limit') && 
          followUpRetries < 2) {
        setTimeout(() => {
          setFollowUpRetries(prev => prev + 1);
          generateFollowUpsForLastMessage(messageList);
        }, 5000); // Wait 5 seconds before retrying
      }
    } finally {
      setIsGeneratingFollowUps(false);
      setFollowUpRetries(0); // Reset retry counter after success or max retries
    }
  };

  return {
    followUpSuggestions,
    setFollowUpSuggestions,
    isGeneratingFollowUps,
    setIsGeneratingFollowUps,
    generateFollowUpsForLastMessage,
    setFollowUpRetries
  };
}
