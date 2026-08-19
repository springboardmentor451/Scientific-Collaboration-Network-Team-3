import api from './api';
import { USE_MOCKS } from '../config/env';
import { mockConferences } from '../mocks/data';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const conferenceService = {
  list: async () => {
    if (USE_MOCKS) {
      await delay(300);
      return mockConferences;
    }
    const response = await api.get('/conferences');
    return response.data;
  }
};
