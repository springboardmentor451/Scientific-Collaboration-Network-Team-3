import api from './api';
import { USE_MOCKS } from '../config/env';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const reportService = {
  exportReport: async (type, format) => {
    if (USE_MOCKS) {
      await delay(1000);
      return { success: true, url: `/mock-download-url/${type}.${format}` };
    }
    const response = await api.post('/reports/export', { type, format });
    return response.data;
  }
};
