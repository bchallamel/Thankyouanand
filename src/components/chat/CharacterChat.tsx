
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, SendIcon, X, ChevronDown, ChevronUp, LightbulbIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type Message = {
  role: 'user' | 'character';
  content: string;
};

const initialMessages = [
  {
    role: 'character' as const,
    content: "Hello! I'm Brice's digital twin. Ask me anything about AI transformation, leadership, or innovation. I'll respond as if I were Brice himself!"
  }
];

// Example prompts that users can click on
const promptIdeas = [
  "Draft a presentation for Brice to introduce him as a public speaker for Conference X and give me 3 good conversation starters with him for that event.",
  "My company Y has a patchy AI adoption. How would Brice inspire users and leaders to press forward and help adoption surge?",
  "What makes a great community of AI champions and how can I make progress through the different maturity stages of such a community?"
];

const CharacterChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isPromptsOpen, setIsPromptsOpen] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      role: 'user' as const,
      content: inputValue
    };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate character response (in a real app, this would call an API)
    setTimeout(() => {
      const responses = [
        "When I led AI transformation at Moderna, my first priority was building cross-functional teams that could bridge the gap between technical capabilities and business needs.",
        "One thing I've learned about AI adoption is that it's 20% about technology and 80% about culture and change management.",
        "If you're measuring AI ROI, look beyond cost savings to value creation metrics like time-to-insight and decision quality improvements.",
        "The most successful AI implementations I've seen start with clear problem statements tied to strategic business objectives."
      ];
      
      const characterMessage = {
        role: 'character' as const,
        content: responses[Math.floor(Math.random() * responses.length)]
      };
      
      setMessages(prev => [...prev, characterMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectPrompt = (prompt: string) => {
    setInputValue(prompt);
    setIsPromptsOpen(false); // Close the prompts menu after selection
  };

  useEffect(() => {
    // Only show the character chat after a brief delay
    const timer = setTimeout(() => {
      const characterButton = document.getElementById('character-chat-button');
      if (characterButton) {
        characterButton.classList.remove('translate-x-full');
        characterButton.classList.add('translate-x-0');
      }
    }, 1500); // Reduced delay for better visibility
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {!isOpen ? (
        <Button 
          id="character-chat-button"
          onClick={toggleChat} 
          className="rounded-full p-3 h-12 w-12 shadow-lg bg-secondary hover:bg-secondary/90 transition-transform duration-500 ease-in-out"
        >
          <Bot className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-[350px] max-h-[500px] flex flex-col shadow-xl">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b">
            <CardTitle className="text-lg">Chat with Brice</CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-4 overflow-y-auto flex-grow max-h-[360px]">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary/20'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-3 py-2 bg-secondary/20">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="p-3 border-t flex-col space-y-3">
            <div className="flex w-full gap-2">
              <Input
                placeholder="Ask Brice anything..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-grow"
              />
              <Button size="icon" onClick={handleSendMessage} disabled={isLoading}>
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Prompt Ideas Collapsible Menu */}
            <Collapsible
              open={isPromptsOpen}
              onOpenChange={setIsPromptsOpen}
              className="w-full border rounded-md"
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex w-full justify-between items-center p-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <LightbulbIcon className="h-4 w-4" />
                    <span>Prompt Ideas</span>
                  </div>
                  {isPromptsOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-2">
                <div className="flex flex-col space-y-2 mt-2">
                  {promptIdeas.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="justify-start h-auto py-2 px-2 text-xs text-left break-normal hover:bg-secondary/10"
                      onClick={() => handleSelectPrompt(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CharacterChat;
