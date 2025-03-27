
/**
 * Main service for the OpenAI Responses API integration
 */

// Re-export types
export type { ChatMessage } from './types';

// Import from internal modules
import { getConversationHistory, clearConversationHistory } from './storageService';
import { generateChatResponse, wasLatestResponseNotFound, resetLatestResponseFlag } from './chatService';
import { generateFollowUpQuestions } from './followUpService';
import { VECTOR_STORE_ID } from './types';

/**
 * Reset the conversation by clearing the message history
 */
export const resetConversation = async (): Promise<void> => {
  console.log('Resetting conversation');
  clearConversationHistory();
  resetLatestResponseFlag();
};

// Re-export functions from internal modules
export {
  generateChatResponse,
  generateFollowUpQuestions,
  wasLatestResponseNotFound,
  getConversationHistory
};

/**
 * Reset everything
 */
export const resetEverything = async (): Promise<void> => {
  console.log('Resetting everything');
  resetConversation();
};

/**
 * Get debug information about the current state
 */
export const getDebugInfo = (): { vectorStoreId: string } => {
  return {
    vectorStoreId: VECTOR_STORE_ID
  };
};
