
import { Filter } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type PromptCategory = 'all' | 'creativity' | 'innovation' | 'change' | 'technology' | 'future-of-work' | 'personal-stories';

export const categoryLabels: Record<PromptCategory, string> = {
  'all': 'All Topics',
  'creativity': 'Creativity',
  'innovation': 'Innovation',
  'change': 'Change',
  'technology': 'Technology',
  'future-of-work': 'Future of Work',
  'personal-stories': 'Personal Stories'
};

type CategoryFilterProps = {
  selectedCategory: PromptCategory;
  onCategoryChange: (category: PromptCategory) => void;
};

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const isMobile = useIsMobile();
  
  const handleValueChange = (value: string) => {
    onCategoryChange(value as PromptCategory);
  };

  return (
    <Select value={selectedCategory} onValueChange={handleValueChange}>
      <SelectTrigger 
        className={`bg-background border-input border flex items-center justify-center text-sm 
          outline-none ring-0 focus:outline-none focus:ring-0 active:outline-none 
          ${
          isMobile 
            ? 'w-10 h-10 min-w-10 rounded-full p-0' 
            : 'h-10 min-w-[140px] max-w-[200px] rounded-full justify-between px-3'
        }`}
      >
        <div className={`flex items-center gap-1.5 ${isMobile ? '' : 'truncate'}`}>
          <Filter className="h-4 w-4 flex-shrink-0" />
          {!isMobile && <span className="truncate">{categoryLabels[selectedCategory]}</span>}
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(categoryLabels).map(([value, label]) => (
          <SelectItem key={value} value={value}>{label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoryFilter;
