import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchResult {
  id: string;
  query: string;
  result: string;
  timestamp: number;
}

interface PastSearchesState {
  searches: SearchResult[];
}

const initialState: PastSearchesState = {
  searches: [],
};

const pastSearchesSlice = createSlice({
  name: 'pastSearches',
  initialState,
  reducers: {
    addSearch: (state: PastSearchesState, action: PayloadAction<SearchResult>) => {
      state.searches.unshift(action.payload);
      // Keep only the last 50 searches
      if (state.searches.length > 50) {
        state.searches.pop();
      }
    },
    clearSearches: (state: PastSearchesState) => {
      state.searches = [];
    },
  },
});

export const { addSearch, clearSearches } = pastSearchesSlice.actions;
export default pastSearchesSlice.reducer; 