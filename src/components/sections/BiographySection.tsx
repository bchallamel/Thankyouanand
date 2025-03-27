
import { useState } from 'react';
import { GraduationCap, Briefcase, Car, Wand2, Shield, Flame, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const portraits = [
  { 
    image: "/lovable-uploads/2c9017be-a209-4e64-b5fb-112f628b1ce1.png", 
    icon: Briefcase,
    alt: "Professional Portrait"
  },
  { 
    image: "/lovable-uploads/8f611333-39b8-4614-9484-89e276caadb0.png", 
    icon: Car,
    alt: "Driving Portrait"
  },
  { 
    image: "/lovable-uploads/eb9bc64c-e5f9-493c-b9db-260e35a7244d.png", 
    icon: Wand2,
    alt: "Creative Portrait"
  },
  { 
    image: "/lovable-uploads/d6d9468a-fe7d-4729-a369-dcb44c3321e3.png", 
    icon: Shield,
    alt: "Leadership Portrait"
  },
  { 
    image: "/lovable-uploads/c742768f-df61-4332-8216-c92050c3b10e.png", 
    icon: Zap,
    alt: "Energy Portrait"
  },
];

const ProfileCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === portraits.length - 1 ? 0 : prevIndex + 1));
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? portraits.length - 1 : prevIndex - 1));
  };

  const selectPortrait = (index: number) => {
    setCurrentIndex(index);
  };

  const currentPortrait = portraits[currentIndex];

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-grow overflow-hidden rounded-t-md">
        <AspectRatio ratio={3/5} className="w-full">
          <img 
            src={currentPortrait.image}
            alt={currentPortrait.alt}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        
        {/* Restyled arrows with semi-transparent black background */}
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-0 bg-black/60 text-white shadow-md hover:bg-black/80 transition-all"
          onClick={goToPrevious}
        >
          <span className="sr-only">Previous</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m15 18-6-6 6-6"/></svg>
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-0 bg-black/60 text-white shadow-md hover:bg-black/80 transition-all"
          onClick={goToNext}
        >
          <span className="sr-only">Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m9 18 6-6-6-6"/></svg>
        </Button>
      </div>
      
      {/* Full black background behind icons with gray for unselected icons */}
      <div className="flex justify-center gap-4 py-3 bg-black">
        {portraits.map((portrait, index) => {
          const Icon = portrait.icon;
          const isSelected = currentIndex === index;
          
          return (
            <button 
              key={index} 
              onClick={() => selectPortrait(index)} 
              className={`cursor-pointer flex flex-col items-center transition-all duration-200`}
            >
              <div className={`rounded-full p-2 ${isSelected ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                <Icon className="h-5 w-5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const BiographySection = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <GraduationCap className="h-7 w-7 text-primary" />
        <h2 className="text-2xl md:text-3xl font-bold">About me</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Image Card with Carousel */}
        <Card className="overflow-hidden h-full">
          <CardContent className="p-0 h-full">
            <ProfileCarousel />
          </CardContent>
        </Card>
        
        {/* Text Card with Light Gray Background - Reduced font size */}
        <div className="col-span-1 md:col-span-2">
          <Card className="h-full bg-muted/30">
            <CardContent className="p-6 flex flex-col justify-center h-full space-y-3">
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                As VP of AI Products and Innovation at Moderna, my mission is to embed technology not just into our tools, but into our culture, amplifying the potential of our people to confidently address complex challenges and deliver the promise of mRNA medicines.
              </p>
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                My career spans roles as Global Transformation Lead at Google Cloud, where I guided AI initiatives for global organizations, consultant at Boston Consulting Group, Marketing leader at L'Oréal, and published author on innovation and creativity.
              </p>
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                For more than a decade, I've taught business transformation at HEC Paris, mentoring future leaders to champion innovative strategies. Having worked across five continents, I bring an adaptive leadership style focused on ambitious objectives with measurable outcomes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BiographySection;
