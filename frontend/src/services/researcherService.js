import api from './api';
import { USE_MOCKS } from '../config/env';
import { mockResearchers } from '../mocks/data';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const researcherService = {
  getAll: async () => {
    if (USE_MOCKS) {
      await delay(300);
      return mockResearchers;
    }
    const response = await api.get('/researchers');
    return response.data;
  },
  getById: async (id) => {
    if (USE_MOCKS) {
      await delay(300);
      return mockResearchers.find(r => r.id === id);
    }
    const response = await api.get(`/researchers/${id}`);
    return response.data;
  }
};
