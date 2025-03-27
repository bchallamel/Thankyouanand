
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface CompactContentCardProps {
  title: string;
  description: string; // Still in props, but not displayed
  category?: string;
  image?: string;
  date?: string;
  link: string;
  className?: string;
  external?: boolean;
}

const CompactContentCard = ({
  title,
  category,
  image,
  date,
  link,
  className,
  external = false,
}: CompactContentCardProps) => {
  const CardContent = () => (
    <div
      className={cn(
        'glass-card rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex h-[120px]',
        className
      )}
    >
      {image && (
        <div className="w-[100px] flex-shrink-0 relative">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full absolute inset-0"
          />
        </div>
      )}
      <div className="flex-grow p-4 flex flex-col justify-between">
        <div>
          {category && (
            <span className="text-xs font-medium text-primary/80 mb-1 block">
              {category}
            </span>
          )}
          <h3 className="font-medium text-sm text-foreground pr-6 relative group-hover:text-primary transition-colors">
            {title}
            {external && (
              <ExternalLink className="h-3.5 w-3.5 absolute right-0 top-0.5 text-muted-foreground/70" />
            )}
          </h3>
        </div>
        {date && (
          <div className="mt-2 pt-1 border-t border-border/30">
            <span className="text-xs text-muted-foreground/70">{date}</span>
          </div>
        )}
      </div>
    </div>
  );

  if (external) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block group">
        <CardContent />
      </a>
    );
  }

  return (
    <Link to={link} className="block group">
      <CardContent />
    </Link>
  );
};

export default CompactContentCard;
