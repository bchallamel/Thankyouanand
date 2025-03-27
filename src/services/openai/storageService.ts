
/**
 * Service for managing conversation storage
 */
import type { ChatMessage } from './types';

/**
 * Store conversation history in localStorage
 */
export const storeConversation = (messages: ChatMessage[]): void => {
  try {
    localStorage.setItem('conversation_history', JSON.stringify(messages));
  } catch (error) {
    console.error('Error storing conversation history:', error);
  }
};

/**
 * Get conversation history from localStorage
 */
export const getConversationHistory = (): ChatMessage[] => {
  try {
    const history = localStorage.getItem('conversation_history');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error retrieving conversation history:', error);
    return [];
  }
};

/**
 * Clear conversation history from localStorage
 */
export const clearConversationHistory = (): void => {
  try {
    localStorage.removeItem('conversation_history');
  } catch (error) {
    console.error('Error clearing conversation history:', error);
  }
};
