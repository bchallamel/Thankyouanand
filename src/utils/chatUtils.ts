
import type { ChatMessage } from '@/services/openai';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

// Convert our internal Message format to OpenAI's ChatMessage format
export const convertToChatMessages = (messages: Message[]): ChatMessage[] => {
  return messages.map(msg => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content
  }));
};

// Helper function to copy text to clipboard
export const copyToClipboard = (
  text: string, 
  type: 'message' | 'conversation',
  onSuccess: (title: string, description: string) => void,
  onError: (title: string, description: string) => void
) => {
  navigator.clipboard.writeText(text).then(
    () => {
      onSuccess(
        "Copied!", 
        type === 'message' ? "Message copied to clipboard" : "Conversation copied to clipboard"
      );
    },
    (err) => {
      console.error('Failed to copy text: ', err);
      onError(
        "Copy failed",
        "Could not copy to clipboard"
      );
    }
  );
};

// Format conversation for copying
export const formatConversationForCopy = (messages: Message[]): string => {
  if (messages.length === 0) return '';
  
  return messages.map(message => 
    `${message.role === 'user' ? 'You' : 'Brice'}: ${message.content}`
  ).join('\n\n');
};
