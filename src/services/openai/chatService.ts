
/**
 * Service for generating chat responses
 */
import type { ChatMessage } from './types';
import { getSystemMessage, NOT_IN_SOURCES_RESPONSE } from './types';
import { createResponsesApiPayload, makeResponsesApiRequest } from './apiUtils';
import { storeConversation } from './storageService';

// Flag to track if the latest response was a "not found in sources" response
let isLatestResponseNotFound = false;

/**
 * Generate a chat response using the Responses API with vector store search
 */
export const generateChatResponse = async (
  messages: ChatMessage[]
): Promise<string> => {
  try {
    console.log('Generating chat response using Responses API');
    
    // Add system message at the beginning
    const systemMessage = getSystemMessage();
    
    // Format messages for the API - including our system message at the beginning
    const formattedMessages = [
      systemMessage,
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];
    
    // Create the request payload
    const requestPayload = createResponsesApiPayload(formattedMessages);
    console.log('Making request to Responses API with payload:', JSON.stringify(requestPayload).substring(0, 200) + '...');
    
    // Make the request to the Responses API
    const data = await makeResponsesApiRequest(requestPayload);
    console.log('Response received from chat API:', JSON.stringify(data).substring(0, 200) + '...');
    
    // Extract the assistant's response from the correct location in the API response
    const assistantMessage = data.output?.find(item => item.type === 'message')?.content?.[0]?.text;
    
    if (!assistantMessage) {
      throw new Error('No response content received from OpenAI');
    }
    
    // Check if the response matches our "not found in sources" response
    isLatestResponseNotFound = assistantMessage.trim() === NOT_IN_SOURCES_RESPONSE.trim();
    console.log('Is latest response not found in sources?', isLatestResponseNotFound);
    
    // Store the conversation in local storage if needed
    storeConversation([...messages, { role: 'assistant', content: assistantMessage }]);
    
    return assistantMessage;
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
};

/**
 * Check if the latest response was a "not found in sources" response
 */
export const wasLatestResponseNotFound = (): boolean => {
  return isLatestResponseNotFound;
};

/**
 * Reset the "not found" flag
 */
export const resetLatestResponseFlag = (): void => {
  isLatestResponseNotFound = false;
};
