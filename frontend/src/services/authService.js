import api from './api';
import { USE_MOCKS } from '../config/env';
import { mockUsers } from '../mocks/users';
import { OTP_TTL_MS } from '../utils/otpSession';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const MOCK_OTP_CODE = '123456';

const mockOtpState = {
  expiresAt: 0,
};

function mockHttpError(status, payload) {
  const error = new Error(payload.detail || 'Request failed');
  error.response = { status, data: payload };
  return error;
}

export const authService = {
  login: async (credentials) => {
    if (USE_MOCKS) {
      await delay(600);
      mockOtpState.expiresAt = Date.now() + OTP_TTL_MS;
      return { otp_required: true };
    }
    const response = await api.post('/auth/login', {
      identifier: credentials.identifier || credentials.email,
      email: credentials.email,
      password: credentials.password,
      role: credentials.role,
    });
    return response.data;
  },
  verifyOtp: async ({ identifier, otp, role }) => {
    if (USE_MOCKS) {
      await delay(500);
      if (!identifier) {
        throw mockHttpError(400, { code: 'otp_invalid', detail: 'Missing login identifier.' });
      }
      if (Date.now() > mockOtpState.expiresAt) {
        throw mockHttpError(400, { code: 'otp_expired', detail: 'This code has expired. Request a new OTP.' });
      }
      if (String(otp) !== MOCK_OTP_CODE) {
        throw mockHttpError(401, { code: 'otp_invalid', detail: 'That code is incorrect. Please try again.' });
      }
      const mockUser = mockUsers[role] || mockUsers.Researcher;
      return {
        access_token: mockUser.token,
        token_type: 'bearer',
        user: mockUser,
      };
    }
    const response = await api.post('/auth/verify-otp', { identifier, otp });
    return response.data;
  },
  resendOtp: async ({ identifier }) => {
    if (USE_MOCKS) {
      await delay(400);
      mockOtpState.expiresAt = Date.now() + OTP_TTL_MS;
      return { otp_required: true };
    }
    const response = await api.post('/auth/resend-otp', { identifier });
    return response.data;
  },
  register: async (data) => {
    if (USE_MOCKS) {
      await delay(800);
      return { success: true, token: 'mock-token' };
    }
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};
