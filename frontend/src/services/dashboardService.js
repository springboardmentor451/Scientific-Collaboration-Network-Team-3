import api from './api';
import { USE_MOCKS } from '../config/env';
import { mockDashboards } from '../mocks/data';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardService = {
  /**
   * Get global platform stats (used by AdminDashboard).
   * Backend: GET /dashboard/stats → { total_researchers, total_publications, ... }
   */
  getStats: async () => {
    if (USE_MOCKS) {
      await delay(500);
      return {
        total_researchers: 42,
        total_publications: 128,
        total_collaborations: 35,
        total_citations: 1240,
        total_institutions: 12,
        total_conferences: 8,
      };
    }
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  /**
   * Get role-specific dashboard data (used by Researcher/Institution dashboards).
   * Falls back to global stats when real role-specific endpoint is not available.
   */
  getDashboardData: async (role) => {
    if (USE_MOCKS) {
      await delay(500);
      return mockDashboards[role] || mockDashboards['Researcher'];
    }
    // Fallback to the global stats endpoint for all roles
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};
