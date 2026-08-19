import api from './api';
import { USE_MOCKS } from '../config/env';
import { mockPublications } from '../mocks/data';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const publicationService = {
  list: async () => {
    if (USE_MOCKS) {
      await delay(400);
      return mockPublications;
    }
    const response = await api.get('/publications');
    return response.data;
  },
  create: async (data) => {
    if (USE_MOCKS) {
      await delay(500);
      return { id: `pub_${Date.now()}`, ...data };
    }
    const response = await api.post('/publications', data);
    return response.data;
  },
  update: async (id, data) => {
    if (USE_MOCKS) {
      await delay(500);
      return { id, ...data };
    }
    const response = await api.put(`/publications/${id}`, data);
    return response.data;
  },
  uploadFile: async (id, file) => {
    if (USE_MOCKS) {
      await delay(800);
      return { success: true, url: 'mock-url' };
    }
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/publications/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};
