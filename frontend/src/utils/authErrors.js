export function parseAuthError(error) {
  if (!error?.response) {
    return {
      type: 'network',
      message: 'Unable to reach the server. Check your connection and try again.',
    };
  }

  const status = error.response.status;
  const data = error.response.data || {};
  const code = data.code || data.error;
  const detail = Array.isArray(data.detail)
    ? data.detail.map((item) => item.msg || item).join(' ')
    : data.detail || data.message || data.error;

  const text = String(detail || '');

  if (code === 'otp_expired' || /expir/i.test(text) || status === 410) {
    return { type: 'expired', message: text || 'This code has expired. Request a new OTP.' };
  }

  if (code === 'otp_invalid' || status === 400 || status === 401) {
    return { type: 'invalid', message: text || 'That code is incorrect. Please try again.' };
  }

  if (status >= 500) {
    return { type: 'api', message: 'The server had a problem verifying your code. Try again shortly.' };
  }

  return { type: 'api', message: text || 'Something went wrong. Please try again.' };
}
