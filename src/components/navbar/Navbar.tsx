
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedLink from '../ui/AnimatedLink';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if scrolled past threshold to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Podcasts', path: '/podcasts' },
    { name: 'Articles', path: '/articles' },
    { name: 'Publications', path: '/manuscripts' },
  ];
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header 
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'py-3 glass shadow-sm' : 'py-5 bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="font-bold text-xl md:text-2xl tracking-tight hover:opacity-80 transition-opacity duration-200"
          >
            Brice Challamel
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <AnimatedLink
                key={link.path}
                to={link.path}
                active={isActive(link.path)}
              >
                {link.name}
              </AnimatedLink>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <div 
        className={cn(
          'fixed inset-0 z-40 glass md:hidden transform transition-transform duration-300 ease-in-out',
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        )}
        style={{ paddingTop: '4rem' }}
      >
        <nav className="flex flex-col items-center justify-center h-full space-y-8">
          {navLinks.map((link, index) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-xl font-medium transition-all duration-300 py-2 px-4 rounded-md',
                isActive(link.path) 
                  ? 'text-foreground font-semibold' 
                  : 'text-muted-foreground hover:text-foreground',
                `animate-fade-in stagger-${index + 1}`
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Spacer to prevent content from hiding under the navbar */}
      <div className={cn('w-full', isScrolled ? 'h-16' : 'h-20')} />
    </>
  );
};

export default Navbar;
