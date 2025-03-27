
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type MetaTagsProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
};

const RouteMetaTags = ({
  title,
  description,
  image,
  url,
  type = 'website'
}: MetaTagsProps) => {
  const location = useLocation();
  const baseUrl = 'https://challamel.ai';
  const currentUrl = url || `${baseUrl}${location.pathname}`;
  
  useEffect(() => {
    // Update meta tags dynamically
    if (title) {
      document.title = `${title} | Brice Challamel`;
      updateMetaTag('meta[property="og:title"]', 'content', title);
      updateMetaTag('meta[name="twitter:title"]', 'content', title);
    }
    
    if (description) {
      updateMetaTag('meta[name="description"]', 'content', description);
      updateMetaTag('meta[property="og:description"]', 'content', description);
      updateMetaTag('meta[name="twitter:description"]', 'content', description);
    }
    
    if (image) {
      const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
      updateMetaTag('meta[property="og:image"]', 'content', fullImageUrl);
      updateMetaTag('meta[name="twitter:image"]', 'content', fullImageUrl);
    }
    
    updateMetaTag('meta[property="og:url"]', 'content', currentUrl);
    updateMetaTag('meta[name="twitter:url"]', 'content', currentUrl);
    updateMetaTag('meta[property="og:type"]', 'content', type);
    updateMetaTag('link[rel="canonical"]', 'href', currentUrl);
    
    // Reset to default meta tags when component unmounts
    return () => {
      const defaultTitle = 'Brice Challamel | AI Avatar';
      const defaultDescription = 'Chat with Brice Challamel about culture change, technology adoption, AI innovation, and the future of work';
      const defaultImage = '/lovable-uploads/5064cbc2-e776-41ec-b0a7-62d97b22d9ad.png';
      
      document.title = defaultTitle;
      updateMetaTag('meta[property="og:title"]', 'content', defaultTitle);
      updateMetaTag('meta[name="twitter:title"]', 'content', defaultTitle);
      updateMetaTag('meta[name="description"]', 'content', defaultDescription);
      updateMetaTag('meta[property="og:description"]', 'content', defaultDescription);
      updateMetaTag('meta[name="twitter:description"]', 'content', defaultDescription);
      updateMetaTag('meta[property="og:image"]', 'content', defaultImage);
      updateMetaTag('meta[name="twitter:image"]', 'content', defaultImage);
      updateMetaTag('meta[property="og:url"]', 'content', baseUrl);
      updateMetaTag('meta[name="twitter:url"]', 'content', baseUrl);
      updateMetaTag('meta[property="og:type"]', 'content', 'website');
      updateMetaTag('link[rel="canonical"]', 'href', baseUrl);
    };
  }, [title, description, image, currentUrl, type]);
  
  // Helper function to update meta tags
  const updateMetaTag = (selector: string, attribute: string, content: string) => {
    const element = document.querySelector(selector);
    if (element) {
      element.setAttribute(attribute, content);
    }
  };
  
  // This component doesn't render anything
  return null;
};

export default RouteMetaTags;
