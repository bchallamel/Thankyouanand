
import { Book } from 'lucide-react';
import ContentSection from '@/components/sections/ContentSection';
import ContentCard from '@/components/ui/ContentCard';
import CompactContentCard from '@/components/ui/CompactContentCard';
import { articlesData } from '@/data/articlesData';

// Podcast data
const podcastsData = [
  {
    id: 1,
    title: "Beyond the Prompt",
    description: "Catalyzing an AI-Driven Culture Transformation with Moderna's Head of AI, Brice Challamel",
    image: "https://i.ytimg.com/vi/6dbPbjO1jWI/maxresdefault.jpg",
    category: "Beyond the Prompt",
    date: "Feb 8, 2025",
    link: "https://youtu.be/6dbPbjO1jWI?si=2G1kj21aehYLqEm1",
    external: true
  },
  {
    id: 2,
    title: "AI:ROI Conference",
    description: "Brice Challamel discusses AI implementation strategies and the \"Shepherd analogy\" to change management.",
    image: "/lovable-uploads/64af8bef-41a2-4dce-bfd8-5d2d364919e1.png",
    category: "AI:ROI Conference",
    date: "Nov 19, 2024",
    link: "https://vimeo.com/1031310614",
    external: true
  },
  {
    id: 3,
    title: "The AI Interviews",
    description: "Insights on AI adoption and its impact on enterprise transformation with Brice Challamel.",
    image: "https://i.ytimg.com/vi/yGCbRQERX1Q/maxresdefault.jpg",
    category: "The AI Interviews",
    date: "Dec 5, 2024",
    link: "https://youtu.be/yGCbRQERX1Q?si=9DndJu4LISeGnIdU",
    external: true
  },
  {
    id: 4,
    title: "How AI is Transforming Drug Discovery",
    description: "Exploring AI applications in drug discovery and personalized medicine with Moderna's VP of AI, Brice Challamel",
    image: "/lovable-uploads/d4177d34-4868-4dd0-8380-8f4fd8f1690c.png",
    category: "AI-Curious",
    date: "Feb 27, 2025",
    link: "https://share.snipd.com/episode/f6869a8c-942b-4353-b060-1472fdafccda",
    external: true
  }
];

// Create an array of featured podcasts, specifically excluding the AI-Curious one
// but including the other three podcasts in chronological order
const featuredPodcasts = podcastsData
  .filter(podcast => podcast.category !== "AI-Curious")
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 2);

// Books/publications data
const manuscriptsData = [
  {
    id: 1,
    title: "AI First: The Playbook for a Future-Proof Business and Brand",
    description: "The Playbook for a Future-Proof Business and Brand",
    image: "/lovable-uploads/7cce3c4c-103b-4e3d-8cb5-58d649c60979.png",
    category: "Harvard Business Review Press",
    date: "2023",
    link: "https://a.co/d/alKxgxh",
    external: true
  },
  {
    id: 2,
    title: "Moderna: Democratizing Artificial Intelligence",
    description: "Harvard Business School Case on Moderna's digital transformation journey",
    image: "/lovable-uploads/7ab26702-7223-4693-887a-9f58906ce0fe.png",
    category: "Harvard Business School",
    date: "2024",
    link: "https://www.hbs.edu/faculty/Pages/item.aspx?num=66910",
    external: true
  },
  {
    id: 3,
    title: "Le Matin du 8e jour",
    description: "Du créateur individuel à l'innovation collective",
    image: "/lovable-uploads/ac206d9e-5c90-40d0-85f0-5304b1207fa9.png",
    category: "Dunod",
    date: "2023",
    link: "https://a.co/d/g0FAcUm",
    external: true
  },
  {
    id: 4,
    title: "Multipliez vos idées",
    description: "Efficacité professionnelle - 2e édition, préface de Luc de Brabandere",
    image: "/lovable-uploads/0f88e9b9-a8de-430c-acf4-3340f3a91a95.png",
    category: "Dunod",
    date: "2022",
    link: "https://a.co/d/6LVq7Dr",
    external: true
  }
];

const KnowledgeSources = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <Book className="h-7 w-7 text-primary" />
        <h2 className="text-2xl md:text-3xl font-bold">Knowledge Sources</h2>
      </div>
      
      <ContentSection
        title="Featured Podcasts"
        description="Listen to in-depth conversations exploring AI transformation and innovation."
        viewAllLink="/podcasts"
        className="mb-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredPodcasts.map((podcast, index) => (
            <ContentCard
              key={podcast.id}
              title={podcast.title}
              description={podcast.description}
              category={podcast.category}
              image={podcast.image}
              date={podcast.date}
              link={podcast.link}
              external={podcast.external}
              className={`animate-scale-up stagger-${index + 1}`}
            />
          ))}
        </div>
      </ContentSection>
      
      {/* Two columns layout for Articles and Publications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <ContentSection
          title="Articles"
          description="Thought leadership and industry insights."
          viewAllLink="/articles"
        >
          <div className="grid grid-cols-1 gap-4">
            {articlesData.slice(0, 2).map((article, index) => (
              <CompactContentCard
                key={article.id}
                title={article.title}
                description={article.description}
                category={article.category}
                image={article.image}
                date={article.date}
                link={article.link}
                external={article.external}
                className={`animate-scale-up stagger-${index + 1}`}
              />
            ))}
          </div>
        </ContentSection>
        
        <ContentSection
          title="Publications"
          description="Explore published works and research."
          viewAllLink="/manuscripts"
        >
          <div className="grid grid-cols-1 gap-4">
            {manuscriptsData.slice(0, 2).map((manuscript, index) => (
              <CompactContentCard
                key={manuscript.id}
                title={manuscript.title}
                description={manuscript.description}
                category={manuscript.category}
                image={manuscript.image}
                date={manuscript.date}
                link={manuscript.link}
                external={manuscript.external}
                className={`animate-scale-up stagger-${index + 1}`}
              />
            ))}
          </div>
        </ContentSection>
      </div>
    </div>
  );
};

export default KnowledgeSources;
