import { useState, useMemo } from 'react';
import type { Idea } from '../types/ideas';

export interface UseIdeasFilterOptions {
  ideas: Idea[];
}

export interface IdeasFilterHook {
  filteredIdeas: Idea[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  topicFilter: string;
  setTopicFilter: (topic: string) => void;
  availableTopics: string[];
}

export const useIdeasFilter = ({ ideas }: UseIdeasFilterOptions): IdeasFilterHook => {
  const [searchTerm, setSearchTerm] = useState('');
  const [topicFilter, setTopicFilter] = useState('');

  const availableTopics = useMemo(() => {
    const topics = ideas.map(idea => idea.topic);
    return Array.from(new Set(topics)).sort();
  }, [ideas]);

  const filteredIdeas = useMemo(() => {
    return ideas.filter(idea => {
      const matchesSearch = searchTerm === '' || 
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTopic = topicFilter === '' || idea.topic === topicFilter;
      
      return matchesSearch && matchesTopic;
    });
  }, [ideas, searchTerm, topicFilter]);

  return {
    filteredIdeas,
    searchTerm,
    setSearchTerm,
    topicFilter,
    setTopicFilter,
    availableTopics,
  };
};