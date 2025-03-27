
/**
 * Configuration for OpenAI API key handling
 */
import { supabase } from "@/integrations/supabase/client";

/**
 * @deprecated - This function is being phased out for security reasons
 * Use the Edge Function proxy instead
 */
export const getOpenAIApiKey = async (): Promise<string> => {
  console.warn('getOpenAIApiKey is deprecated for security reasons. Use Edge Function proxy instead.');
  // For backward compatibility, we'll return a placeholder
  return "api-key-access-restricted";
};

/**
 * Get authorization headers for OpenAI API requests
 * @deprecated - This function is being phased out for security reasons
 * Use the Edge Function proxy instead
 */
export const getOpenAIHeaders = async () => {
  console.warn('getOpenAIHeaders is deprecated for security reasons. Use Edge Function proxy instead.');
  
  // We're not returning the API key anymore, just an authorization token
  const { data: authData } = await supabase.auth.getSession();
  const session = authData?.session;
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token || ''}`,
  };
};

/**
 * @deprecated - This function is being phased out.
 * Use the dedicated Edge Function for each API instead
 */
export const makeSecureApiRequest = async (endpoint: string, payload: any): Promise<any> => {
  console.warn('makeSecureApiRequest is deprecated. Use the my-gpt-proxy Edge Function instead.');
  
  try {
    // Redirect to our new Edge Function
    const { data, error } = await supabase.functions.invoke('my-gpt-proxy', {
      method: 'POST',
      body: {
        endpoint,
        payload
      }
    });

    if (error) {
      console.error('Error from edge function:', error);
      throw new Error(error.message || 'Failed to get response from server');
    }

    return data;
  } catch (error) {
    console.error('Error in makeSecureApiRequest:', error);
    throw error;
  }
};
