
import { Linkedin, TwitterIcon, BookOpen, Camera } from 'lucide-react';

const FooterSection = () => {
  return (
    <footer className="bg-muted py-6 mt-4">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-xl font-medium mb-3">Follow me</h3>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-6">
          <a 
            href="https://www.linkedin.com/in/bricechallamel/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Linkedin className="h-5 w-5" />
            <span>LinkedIn</span>
          </a>
          <a 
            href="https://x.com/Challamel" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <TwitterIcon className="h-5 w-5" />
            <span>Twitter</span>
          </a>
          <a 
            href="https://1x.com/bricechallamel" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Camera className="h-5 w-5" />
            <span>1X</span>
          </a>
          <a 
            href="https://www.amazon.com/stores/Brice-Challamel/author/B004MZR1VK" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <BookOpen className="h-5 w-5" />
            <span>Amazon</span>
          </a>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Brice Challamel. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
