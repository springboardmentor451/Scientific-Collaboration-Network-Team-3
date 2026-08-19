import api from './api';
import { USE_MOCKS } from '../config/env';
import { mockDashboards } from '../mocks/data';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardService = {
  getDashboardData: async (role) => {
    if (USE_MOCKS) {
      await delay(500); // simulate network latency
      return mockDashboards[role] || mockDashboards['Researcher'];
    }
    const response = await api.get(`/dashboards/${role.toLowerCase().replace(' ', '-')}`);
    return response.data;
  }
};
