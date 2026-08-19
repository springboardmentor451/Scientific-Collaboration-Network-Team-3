import api from './api';
import { USE_MOCKS } from '../config/env';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockSystemUsers = [
  { id: 'usr_1', name: 'Dr. Aris Thorne', role: 'Researcher', active: true },
  { id: 'usr_2', name: 'Prof. Elena Rostova', role: 'Institution Admin', active: true },
  { id: 'usr_3', name: 'Dr. James Chen', role: 'Reviewer', active: true },
  { id: 'usr_4', name: 'SysAdmin', role: 'System Admin', active: true }
];

export const userService = {
  list: async () => {
    if (USE_MOCKS) {
      await delay(400);
      return mockSystemUsers;
    }
    const response = await api.get('/users');
    return response.data;
  },
  toggleActive: async (id, isActive) => {
    if (USE_MOCKS) {
      await delay(300);
      return { success: true };
    }
    const response = await api.patch(`/users/${id}`, { active: isActive });
    return response.data;
  }
};
