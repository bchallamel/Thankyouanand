
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AnimatedLinkProps {
  children: React.ReactNode;
  to: string;
  active?: boolean;
  className?: string;
}

const AnimatedLink = ({ children, to, active, className }: AnimatedLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        'relative px-1 py-2 text-base font-medium transition-colors duration-200',
        active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
        className
      )}
    >
      {children}
      <span
        className={cn(
          'absolute bottom-0 left-0 h-[2px] w-0 bg-foreground transition-all duration-300',
          active ? 'w-full' : 'group-hover:w-full'
        )}
      />
    </Link>
  );
};

export default AnimatedLink;
