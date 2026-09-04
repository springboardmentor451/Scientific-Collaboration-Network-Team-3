import api from './api';
import { USE_MOCKS } from '../config/env';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockSystemUsers = [
  { id: 1, username: 'Dr. Aris Thorne', email: 'aris.thorne@iqc.edu', role: 'Researcher', is_active: true },
  { id: 2, username: 'Prof. Elena Rostova', email: 'e.rostova@iqc.edu', role: 'Institution Admin', is_active: true },
  { id: 3, username: 'Dr. James Chen', email: 'j.chen@globalresearch.org', role: 'Reviewer', is_active: true },
  { id: 4, username: 'SysAdmin', email: 'admin@scna.org', role: 'System Admin', is_active: true },
];

/**
 * Map backend user (is_active) to frontend-friendly shape (active).
 */
function mapUser(u) {
  return {
    ...u,
    name: u.name || u.username || u.email,
    active: u.is_active ?? u.active ?? true,
  };
}

export const userService = {
  list: async () => {
    if (USE_MOCKS) {
      await delay(400);
      return mockSystemUsers.map(mapUser);
    }
    const response = await api.get('/users');
    return (response.data || []).map(mapUser);
  },

  toggleActive: async (id, isActive) => {
    if (USE_MOCKS) {
      await delay(300);
      return { success: true };
    }
    // Backend: PATCH /users/:id  { is_active: bool }
    const response = await api.patch(`/users/${id}`, { is_active: isActive });
    return response.data;
  },

  updateRole: async (id, role) => {
    if (USE_MOCKS) {
      await delay(300);
      return { success: true };
    }
    const response = await api.patch(`/users/${id}`, { role });
    return response.data;
  },
};
