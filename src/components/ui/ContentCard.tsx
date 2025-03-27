
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface ContentCardProps {
  title: string;
  description: string;
  category?: string;
  image?: string;
  date?: string;
  link: string;
  className?: string;
  external?: boolean;
}

const ContentCard = ({
  title,
  description,
  category,
  image,
  date,
  link,
  className,
  external = false,
}: ContentCardProps) => {
  const CardContent = () => (
    <div
      className={cn(
        'glass-card rounded-lg overflow-hidden card-hover h-full flex flex-col',
        className
      )}
    >
      {image && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
          />
          {category && (
            <span className="absolute top-3 left-3 text-xs font-medium py-1 px-2 bg-black/70 text-white rounded-md">
              {category}
            </span>
          )}
        </div>
      )}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-medium text-lg mb-2 transition-colors group-hover:text-foreground flex items-start gap-1">
          {title}
          {external && <ExternalLink className="h-4 w-4 flex-shrink-0 mt-1" />}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
          {description}
        </p>
        {date && (
          <div className="text-xs text-muted-foreground mt-auto">
            {date}
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

export default ContentCard;
