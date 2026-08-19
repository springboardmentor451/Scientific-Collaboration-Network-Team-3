import api from './api';
import { USE_MOCKS } from '../config/env';
import { mockCitations } from '../mocks/data';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const citationService = {
  list: async () => {
    if (USE_MOCKS) {
      await delay(200);
      return mockCitations;
    }
    const response = await api.get('/citations');
    return response.data;
  }
};
