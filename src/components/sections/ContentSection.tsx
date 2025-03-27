
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ContentSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  viewAllLink?: string;
  className?: string;
}

const ContentSection = ({
  title,
  description,
  children,
  viewAllLink,
  className,
}: ContentSectionProps) => {
  return (
    <section className={cn('page-section', className)}>
      <div className="mb-4 md:mb-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-1 text-left">
              {title}
            </h2>
            {description && (
              <p className="text-base text-muted-foreground max-w-3xl text-left">
                {description}
              </p>
            )}
          </div>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="hidden md:flex items-center text-sm font-medium text-primary hover:underline group"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
      <div>{children}</div>
      {viewAllLink && (
        <div className="mt-4 md:hidden text-center">
          <Link
            to={viewAllLink}
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default ContentSection;
