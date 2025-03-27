
import { PromptCategory } from './CategoryFilter';

export interface PromptIdea {
  text: string;
  category: PromptCategory;
  id: string;
}

export const promptIdeasData: PromptIdea[] = [
  { text: "What are the main stages of creative problem solving?", category: "creativity", id: "p1" },
  { text: "How can change become enjoyable, and why does it matter?", category: "creativity", id: "p2" },
  { text: "Tell me more about your cow analogy to change management!", category: "change", id: "p3" },
  { text: "What makes chess a good example of AI Adoption?", category: "technology", id: "p4" },
  { text: "Why do you think that everyone will become a team of 5?", category: "future-of-work", id: "p5" },
  { text: "How do you define and enforce AI Governance at Moderna?", category: "technology", id: "p7" },
  { text: "Will AI become a utility like electricity or tap water?", category: "future-of-work", id: "p8" },
  { text: "Who are Moderna's Generative AI Champions Team?", category: "innovation", id: "p9" },
  { text: "What's the meaning of \"Don't be Fred\"?", category: "change", id: "p10" },
  { text: "What are the 5 superpowers of AI granted to any user?", category: "future-of-work", id: "p11" },
  { text: "Is it unethical to send a condolence message written with AI?", category: "innovation", id: "p12" },
  { text: "What's the ROI of AI at Moderna and how is it calculated?", category: "technology", id: "p13" },
  { text: "How did you come to publish a card game and a book on creative thinking?", category: "personal-stories", id: "p14" },
  { text: "How do you know when culture change has succeeded?", category: "change", id: "p15" },
  { text: "How are Kondratiev waves different from traditional innovation?", category: "innovation", id: "p16" },
  { text: "Why do we always feel overwhelmed by the pace of change?", category: "future-of-work", id: "p17" },
  { text: "What are the different types of curiosity in your card game?", category: "creativity", id: "p18" },
  { text: "What did you learn from living in five different continents?", category: "personal-stories", id: "p19" },
  { text: "How do you leverage AI for Parent Teacher Conferences?", category: "personal-stories", id: "p20" }
];
