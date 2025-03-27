
import { Button } from '@/components/ui/button';

type PromptCardProps = {
  text: string;
  id: string;
  onSelect: (prompt: string) => void;
};

const PromptCard = ({ text, id, onSelect }: PromptCardProps) => {
  return (
    <Button
      key={id}
      variant="outline"
      className="justify-start h-auto py-3 px-3 text-xs text-left whitespace-normal bg-card hover:bg-accent border-primary/20 shadow-sm hover:shadow-md transition-all text-foreground items-start"
      onClick={() => onSelect(text)}
    >
      {text}
    </Button>
  );
};

export default PromptCard;
