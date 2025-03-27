
interface Article {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  link: string;
  external: boolean;
}

export const articlesData: Article[] = [
  {
    id: 1,
    title: "Consulting to AI Leadership: My Journey Working in Tech",
    description: "Reflections on the transition from management consulting to leading AI initiatives in the technology sector.",
    image: "/lovable-uploads/d336f5da-c3b8-44e6-bfbb-3ac86d25bcee.png",
    category: "BCG Careers",
    date: "Mar 6, 2024",
    link: "https://careers.bcg.com/global/en/blogarticle/my-journey-from-consulting-to-working-in-tech",
    external: true
  },
  {
    id: 2,
    title: "Integrating ChatGPT, AI, and GenAI Company-wide",
    description: "A conversation with Brice Challamel, Vice President, AI Products & Platforms at Moderna on implementing AI and ChatGPT across the organization.",
    image: "/lovable-uploads/f3d2e38a-a894-481e-ae89-f74fa5f66303.png",
    category: "Pharmaceutical Executive",
    date: "Mar 27, 2023",
    link: "https://www.pharmexec.com/view/moderna-implementing-ai-chatgpt",
    external: true
  }
];
