import api from './api';
import { USE_MOCKS } from '../config/env';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockAuditLogs = [
  { id: 'log_1', actor: 'Dr. Aris Thorne', action: 'Created Publication', entity: 'pub_2', timestamp: '2023-09-28T14:32:00Z', module: 'Publications' },
  { id: 'log_2', actor: 'SysAdmin', action: 'Role Update', entity: 'usr_3', timestamp: '2023-09-27T09:15:00Z', module: 'Users' }
];

export const auditService = {
  list: async () => {
    if (USE_MOCKS) {
      await delay(300);
      return mockAuditLogs;
    }
    const response = await api.get('/audit');
    return response.data;
  }
};
