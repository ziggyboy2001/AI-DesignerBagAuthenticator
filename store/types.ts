import { SearchResult } from './pastSearchesSlice';

export interface RootState {
  pastSearches: {
    searches: SearchResult[];
  };
} 