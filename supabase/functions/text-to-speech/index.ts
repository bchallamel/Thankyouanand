
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voiceId, voiceSettings } = await req.json();
    
    if (!text) {
      throw new Error('Text content is required');
    }

    // Get the Eleven Labs API key from environment variables
    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    
    if (!elevenLabsApiKey) {
      console.error('ELEVENLABS_API_KEY is not set in environment variables');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Use the specified voice ID or default to the one provided by the user
    const voice = voiceId || 'DvFda1rsV3AtCHHcmSgM'; // User's specified voice ID
    
    // Default voice settings with updated parameters as requested
    const defaultSettings = {
      model_id: 'eleven_turbo_v2_5',
      voice_settings: {
        stability: 0.3,
        similarity_boost: 0.9,
        style: 0,
        use_speaker_boost: true,
        speaking_rate: 0.95
      }
    };

    // Use provided voice settings or defaults
    const settings = voiceSettings || defaultSettings;

    // Generate a unique identifier for this request
    const requestId = crypto.randomUUID();
    console.log('Request ID for tracking:', requestId);

    // Make request to Eleven Labs API with custom voice settings
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: settings.model_id || defaultSettings.model_id,
        voice_settings: {
          stability: settings.voice_settings?.stability || defaultSettings.voice_settings.stability,
          similarity_boost: settings.voice_settings?.similarity_boost || defaultSettings.voice_settings.similarity_boost,
          style: settings.voice_settings?.style || defaultSettings.voice_settings.style,
          use_speaker_boost: settings.voice_settings?.use_speaker_boost || defaultSettings.voice_settings.use_speaker_boost,
          speaking_rate: settings.voice_settings?.speaking_rate || defaultSettings.voice_settings.speaking_rate
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from Eleven Labs API:', errorText);
      throw new Error(`Failed to generate speech: ${response.status}`);
    }

    // Log all headers for debugging
    console.log(`[${requestId}] All response headers:`, Object.fromEntries([...response.headers.entries()]));
    
    // Attempt to get history item ID from headers
    const historyItemId = response.headers.get('history_item_id') || response.headers.get('x-history-item-id');
    console.log(`[${requestId}] History item ID from headers:`, historyItemId);

    // Get the audio data as array buffer
    const audioBuffer = await response.arrayBuffer();
    
    // Convert array buffer to base64
    const uint8Array = new Uint8Array(audioBuffer);
    const binary = Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join('');
    const base64Audio = btoa(binary);
    
    // Use a more reliable approach: always fetch the history directly after generating audio
    console.log(`[${requestId}] Fetching latest history item directly...`);
    
    try {
      // Wait a short moment to ensure the TTS request is registered in history
      // ElevenLabs sometimes has a small delay before a new item appears in history
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Make a request to the history endpoint to get history items
      const historyResponse = await fetch('https://api.elevenlabs.io/v1/history?page_size=5', {
        headers: {
          'xi-api-key': elevenLabsApiKey,
        },
      });
      
      if (!historyResponse.ok) {
        throw new Error(`Failed to fetch history: ${historyResponse.status}`);
      }
      
      const historyData = await historyResponse.json();
      console.log(`[${requestId}] History API response status:`, historyResponse.status);
      console.log(`[${requestId}] History items count:`, historyData.history?.length || 0);
      
      // Look for a matching history item based on text content
      // This is more reliable than using timestamps for matching
      let finalHistoryId = null;
      
      if (historyData.history && historyData.history.length > 0) {
        // First, try to find an exact text match in recent history items
        const matchingItem = historyData.history.find(item => {
          // Normalize both texts for comparison (remove whitespace, lowercase)
          const normalizedItemText = item.text.replace(/\s+/g, '').toLowerCase();
          const normalizedRequestText = text.replace(/\s+/g, '').toLowerCase();
          return normalizedItemText.includes(normalizedRequestText) || 
                 normalizedRequestText.includes(normalizedItemText);
        });
        
        if (matchingItem) {
          finalHistoryId = matchingItem.history_item_id;
          console.log(`[${requestId}] Found matching history item by content:`, finalHistoryId);
        } else {
          // If no match by content, just use the most recent item
          // Sort by creation date (most recent first)
          historyData.history.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          finalHistoryId = historyData.history[0].history_item_id;
          console.log(`[${requestId}] Using most recent history item:`, finalHistoryId);
        }
      } else {
        console.log(`[${requestId}] No history items found`);
      }
      
      // Return the base64 encoded audio and the history item ID
      return new Response(
        JSON.stringify({ 
          audioContent: base64Audio,
          historyItemId: finalHistoryId || historyItemId
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
      
    } catch (historyError) {
      console.error(`[${requestId}] Error fetching history:`, historyError);
      
      // Even if history fetch fails, still return the audio with whatever history ID we have
      return new Response(
        JSON.stringify({ 
          audioContent: base64Audio,
          historyItemId: historyItemId,
          historyError: historyError.message
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Error in text-to-speech function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
