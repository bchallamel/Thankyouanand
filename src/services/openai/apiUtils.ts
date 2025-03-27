
/**
 * Utilities for interacting with the OpenAI API
 */
import { supabase } from '@/integrations/supabase/client';
import type { ChatMessage } from './types';
import { VECTOR_STORE_ID, MAIN_CHAT_MODEL } from './types';

/**
 * Create a payload for the OpenAI Responses API
 */
export const createResponsesApiPayload = (messages: ChatMessage[]) => {
  return {
    model: MAIN_CHAT_MODEL,
    input: messages,
    tools: [
      {
        type: "file_search",
        vector_store_ids: [VECTOR_STORE_ID]
      }
    ],
    tool_choice: "auto" // Explicitly set to auto to ensure file search is used
  };
};

/**
 * Make a request to the OpenAI API through our secure Edge Function proxy
 */
export const makeOpenAIRequest = async (endpoint: string, payload: any): Promise<any> => {
  try {
    console.log(`Making request to OpenAI ${endpoint} via Edge Function`);
    
    const { data, error } = await supabase.functions.invoke('my-gpt-proxy', {
      method: 'POST',
      body: {
        endpoint,
        payload
      }
    });
    
    if (error) {
      console.error('Error from Edge Function:', error);
      throw new Error(error.message || 'Failed to get response from server');
    }
    
    return data;
  } catch (error) {
    console.error(`Error in makeOpenAIRequest for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Make a request to the OpenAI Responses API
 */
export const makeResponsesApiRequest = async (payload: any): Promise<any> => {
  return makeOpenAIRequest('responses', payload);
};

/**
 * Make a request to the OpenAI Chat Completions API
 */
export const makeChatCompletionsRequest = async (payload: any): Promise<any> => {
  return makeOpenAIRequest('chat/completions', payload);
};
