export interface News {
  title: string;
  link: string;
  source: string;
  image?: string;
  publishedAt?: number;
  author?: string;
}

export interface NewsFilters {
  source?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

export interface NewsAnalysis {
  keyWords: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  topics: string[];
}