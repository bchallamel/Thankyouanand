
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface HeroProps {
  className?: string;
}

const Hero = ({ className }: HeroProps) => {
  return (
    <section
      className={cn(
        'min-h-[10vh] flex flex-col items-center justify-center text-center py-6 px-4 relative',
        className
      )}
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      
      <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-xl mb-6 animate-fade-in">
        <AvatarImage src="/lovable-uploads/84c9bc38-521e-419e-b6f6-e1f6afa0315b.png" alt="Brice Challamel" />
        <AvatarFallback>BC</AvatarFallback>
      </Avatar>
      
      <div className="max-w-2xl mb-4">
        <p className="text-base md:text-lg text-muted-foreground animate-slide-up">
          Let's chat about culture change, AI adoption and the future of work.
        </p>
      </div>
    </section>
  );
};

export default Hero;
