import api from './api';
import { USE_MOCKS } from '../config/env';
import { mockCollaborations } from '../mocks/data';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const collaborationService = {
  list: async () => {
    if (USE_MOCKS) {
      await delay(400);
      return mockCollaborations;
    }
    const response = await api.get('/collaborations');
    return response.data;
  }
};
