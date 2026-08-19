const PENDING_KEY = 'scna_otp_pending';
export const OTP_TTL_MS = 5 * 60 * 1000;

export function setOtpPending({ identifier, role }) {
  const payload = {
    identifier,
    role,
    startedAt: Date.now(),
    expiresAt: Date.now() + OTP_TTL_MS,
  };
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(payload));
  return payload;
}

export function getOtpPending() {
  const raw = sessionStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    sessionStorage.removeItem(PENDING_KEY);
    return null;
  }
}

export function refreshOtpPending() {
  const current = getOtpPending();
  if (!current?.identifier) return null;
  return setOtpPending({ identifier: current.identifier, role: current.role });
}

export function clearOtpPending() {
  sessionStorage.removeItem(PENDING_KEY);
}

export function hasOtpPending() {
  return Boolean(getOtpPending()?.identifier);
}
