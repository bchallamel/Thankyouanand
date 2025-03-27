
/**
 * Service for generating follow-up questions
 */
import type { ChatMessage } from './types';
import { FOLLOWUP_MODEL } from './types';
import { makeChatCompletionsRequest } from './apiUtils';
import { wasLatestResponseNotFound } from './chatService';

// Cache for storing recently generated follow-up questions
const followUpQuestionsCache = new Map<string, string[]>();

/**
 * Generate follow-up question suggestions based on conversation history
 */
export const generateFollowUpQuestions = async (
  messages: ChatMessage[]
): Promise<string[]> => {
  try {
    if (messages.length < 2) return []; // Need at least a Q&A pair
    
    // If the latest response was "not found in sources", return empty array
    // so the UI can fallback to showing the initial prompt ideas
    if (wasLatestResponseNotFound()) {
      console.log('Latest response was "not found in sources" - skipping follow-up generation');
      return [];
    }
    
    console.log('Generating follow-up questions using model:', FOLLOWUP_MODEL);
    
    // Create a cache key from the last few messages
    const lastFewMessages = messages.slice(-4);
    const cacheKey = lastFewMessages.map(m => `${m.role.substring(0, 1)}:${m.content.substring(0, 50)}`).join('|');
    
    // Check if we have cached follow-up questions for this conversation state
    if (followUpQuestionsCache.has(cacheKey)) {
      console.log('Using cached follow-up questions');
      return followUpQuestionsCache.get(cacheKey) || [];
    }
    
    // Create a prompt for the follow-up questions
    const systemMessage = {
      role: 'system' as const,
      content: 'Generate exactly 3 specific and detailed follow-up questions based on the conversation history. These should be questions a curious person would ask to deepen their understanding of topics mentioned in the conversation. Ensure the questions are framed to address Brice directly in the first person (as "you" not "Brice"). Format your response as a JSON array of strings, example format: ["Question 1?", "Question 2?", "Question 3?"]'
    };
    
    // Format the message history for the API
    const formattedMessages = [
      systemMessage,
      ...messages.slice(-6) // Use last 6 messages for context (3 turns)
    ];
    
    // Create the request payload
    const requestPayload = {
      model: FOLLOWUP_MODEL,
      messages: formattedMessages,
    };
    
    console.log('Making request for follow-up questions:', JSON.stringify(requestPayload).substring(0, 200) + '...');
    
    // Make the request to OpenAI
    const data = await makeChatCompletionsRequest(requestPayload);
    console.log('Follow-up questions response:', JSON.stringify(data).substring(0, 200) + '...');
    
    // Extract the follow-up questions
    const assistantMessage = data.choices?.[0]?.message?.content;
    
    if (!assistantMessage) {
      console.error('No follow-up questions received in response');
      return getContextAwareDefaultQuestions(messages);
    }
    
    console.log('Raw follow-up response text:', assistantMessage);
    
    try {
      // Try multiple parsing approaches to handle different response formats
      
      // Approach 1: Find JSON array in the response using regex
      const jsonMatch = assistantMessage.match(/\[\s*"[^"]*"\s*(?:,\s*"[^"]*"\s*)*\]/);
      if (jsonMatch) {
        const parsedQuestions = JSON.parse(jsonMatch[0]);
        console.log('Parsed questions from JSON match:', parsedQuestions);
        if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
          // Cache the questions
          followUpQuestionsCache.set(cacheKey, parsedQuestions.slice(0, 3));
          return parsedQuestions.slice(0, 3);
        }
      }
      
      // Approach 2: Extract questions using a more lenient regex
      const questionsRegex = /"([^"]*\?[^"]*)"/g;
      const matches = [...assistantMessage.matchAll(questionsRegex)];
      if (matches.length > 0) {
        const extractedQuestions = matches.map(match => match[1].trim());
        console.log('Extracted questions using regex:', extractedQuestions);
        if (extractedQuestions.length > 0) {
          // Cache the questions
          followUpQuestionsCache.set(cacheKey, extractedQuestions.slice(0, 3));
          return extractedQuestions.slice(0, 3);
        }
      }
      
      // Approach 3: Look for numbered list format
      const numberedListRegex = /\d+\.\s+(.*?\?)/g;
      const numberedMatches = [...assistantMessage.matchAll(numberedListRegex)];
      if (numberedMatches.length > 0) {
        const extractedNumberedQuestions = numberedMatches.map(match => match[1].trim());
        console.log('Extracted questions from numbered list:', extractedNumberedQuestions);
        if (extractedNumberedQuestions.length > 0) {
          // Cache the questions
          followUpQuestionsCache.set(cacheKey, extractedNumberedQuestions.slice(0, 3));
          return extractedNumberedQuestions.slice(0, 3);
        }
      }
      
      // If we still can't parse, use context-aware defaults
      console.log('Unable to parse follow-up questions - using context-aware defaults');
      return getContextAwareDefaultQuestions(messages);
    } catch (parseError) {
      console.error('Error parsing follow-up questions:', parseError);
      return getContextAwareDefaultQuestions(messages);
    }
  } catch (error) {
    console.error('Error generating follow-up questions:', error);
    // Return context-aware default questions on error
    return getContextAwareDefaultQuestions(messages);
  }
};

/**
 * Generate context-aware default questions based on the last assistant message
 */
export const getContextAwareDefaultQuestions = (messages: ChatMessage[]): string[] => {
  try {
    // Extract topics from the last assistant message
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
    
    if (!lastAssistantMessage) {
      return [
        "What would you like to know about my approach to this topic?",
        "Do you have any specific questions about my experience?",
        "What aspect of my work interests you the most?"
      ];
    }
    
    // Extract potential keywords from the last assistant message
    const content = lastAssistantMessage.content;
    const keywords = extractKeywords(content);
    
    if (keywords.length >= 3) {
      // Create questions based on the top keywords
      return [
        `Could you tell me more about your approach to ${keywords[0]}?`,
        `What's your perspective on the relationship between ${keywords[0]} and ${keywords[1]}?`,
        `How did you integrate ${keywords[2]} into your work?`
      ];
    }
    
    // If we can't extract enough keywords, return some generic but still somewhat relevant questions
    if (content.includes("AI") || content.includes("artificial intelligence")) {
      return [
        "How did you approach AI implementation at Moderna?",
        "What challenges did you face when implementing AI solutions?",
        "How does your AI approach compare to other implementation strategies?"
      ];
    } else if (content.includes("leadership") || content.includes("team")) {
      return [
        "What leadership qualities do you find most important?",
        "How did your teams adapt to these kinds of changes?",
        "What metrics did you use to measure success in this area?"
      ];
    } else if (content.includes("transformation") || content.includes("change")) {
      return [
        "What were your key factors for successful transformation?",
        "How did you overcome resistance to change?",
        "What role did culture play in your transformation process?"
      ];
    }
    
    // Default fallback
    return [
      "Could you elaborate on your main points?",
      "What are the practical applications you've seen?",
      "How does this relate to your current work?"
    ];
  } catch (error) {
    console.error('Error generating context-aware default questions:', error);
    return [
      "What else would you like to share about this topic?",
      "Can you tell me more about your experience in this area?",
      "How did this approach work in your specific context?"
    ];
  }
};

/**
 * Extract potential keywords from text content
 */
export const extractKeywords = (text: string): string[] => {
  const stopWords = new Set([
    "a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "from", "by", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "can", "could", "shall", "should", "will", "would", "may", "might", "must", "that", "which", "who", "whom", "whose",
    "this", "these", "those", "am", "its", "it's", "they", "them", "their", "of", "in", "with"
  ]);
  
  // Extract sentences and potential noun phrases
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).map(s => s.trim());
  const words = text.split(/\s+/);
  
  // Get potential keywords (longer words that aren't stop words)
  const potentialKeywords = words
    .filter(word => word.length > 4)
    .filter(word => !stopWords.has(word.toLowerCase()))
    .filter(word => /^[a-zA-Z][a-zA-Z\s]*$/.test(word)) // Only alphabetic words
    .map(word => word.replace(/[^\w\s]/g, '')) // Remove punctuation
    .filter(word => word.length > 0);
  
  // Count occurrences
  const keywordCounts = new Map<string, number>();
  potentialKeywords.forEach(word => {
    const key = word.toLowerCase();
    keywordCounts.set(key, (keywordCounts.get(key) || 0) + 1);
  });
  
  // Extract important phrases from sentences (simple heuristic)
  const potentialPhrases: string[] = [];
  sentences.forEach(sentence => {
    if (sentence.includes(":")) {
      // Extract the part after a colon as it often contains key concepts
      const afterColon = sentence.split(":")[1].trim();
      if (afterColon.length > 0 && afterColon.length < 30) {
        potentialPhrases.push(afterColon);
      }
    }
  });
  
  // Combine individual keywords and phrases, giving priority to phrases
  return [
    ...potentialPhrases.slice(0, 2),
    ...Array.from(keywordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word)
  ].slice(0, 5);
};
