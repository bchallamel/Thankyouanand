
import { FileText } from 'lucide-react';
import ContentSection from '@/components/sections/ContentSection';
import CompactContentCard from '@/components/ui/CompactContentCard';
import { articlesData } from '@/data/articlesData';

const ArticlesSection = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <FileText className="h-7 w-7 text-primary" />
        <h2 className="text-2xl md:text-3xl font-bold">Articles</h2>
      </div>
      
      <ContentSection
        title="Recent Articles"
        description="Thought leadership and industry insights on AI transformation and innovation."
        viewAllLink="/articles"
        className="mb-16"
      >
        <div className="grid grid-cols-1 gap-4">
          {articlesData.map((article, index) => (
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
    </div>
  );
};

export default ArticlesSection;
