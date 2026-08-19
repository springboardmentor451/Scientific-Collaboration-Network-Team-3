import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import { useAuth } from '../../hooks/useAuth';
import { authService, MOCK_OTP_CODE } from '../../services/authService';
import { getOtpPending, refreshOtpPending } from '../../utils/otpSession';
import { parseAuthError } from '../../utils/authErrors';
import { USE_MOCKS } from '../../config/env';

const OTP_LENGTH = 6;

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function OTPVerification() {
  const navigate = useNavigate();
  const { completeLogin } = useAuth();
  const [pending, setPending] = useState(() => getOtpPending());
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [lang, setLang] = useState('EN');
  const [carouselIndex, setCarouselIndex] = useState(1);
  const [error, setError] = useState('');
  const [info, setInfo] = useState(
    USE_MOCKS ? `Demo code: ${MOCK_OTP_CODE}` : 'Enter the 6-digit code sent to your email.'
  );
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [now, setNow] = useState(Date.now());
  const inputRefs = useRef([]);

  const remainingMs = (pending?.expiresAt || 0) - now;
  const expired = remainingMs <= 0;
  const canResend = expired && !resending && !submitting;

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (expired) {
      setError((current) => current || 'This code has expired. Request a new OTP.');
    }
  }, [expired]);

  const identifierLabel = useMemo(() => pending?.identifier || '', [pending]);

  const focusIndex = (index) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const applyDigits = (nextDigits) => {
    setDigits(nextDigits);
    return nextDigits.join('');
  };

  const handleChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...digits];
      next[index] = '';
      applyDigits(next);
      return;
    }

    const chars = cleaned.split('').slice(0, OTP_LENGTH - index);
    const next = [...digits];
    chars.forEach((char, offset) => {
      next[index + offset] = char;
    });
    const code = applyDigits(next);
    const nextFocus = Math.min(index + chars.length, OTP_LENGTH - 1);
    focusIndex(nextFocus);
    if (code.length === OTP_LENGTH && !expired) {
      submitCode(code);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = '';
      applyDigits(next);
      focusIndex(index - 1);
    }
    if (event.key === 'ArrowLeft' && index > 0) focusIndex(index - 1);
    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) focusIndex(index + 1);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((char, i) => {
      next[i] = char;
    });
    const code = applyDigits(next);
    focusIndex(Math.min(pasted.length, OTP_LENGTH - 1));
    if (code.length === OTP_LENGTH && !expired) {
      submitCode(code);
    }
  };

  const submitCode = async (code) => {
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const result = await authService.verifyOtp({
        identifier: pending.identifier,
        otp: code,
        role: pending.role,
      });
      const ok = completeLogin(result);
      if (!ok) {
        setError('Verification succeeded but no JWT was returned.');
        return;
      }
      navigate('/', { replace: true });
    } catch (err) {
      const parsed = parseAuthError(err);
      setError(parsed.message);
      setDigits(Array(OTP_LENGTH).fill(''));
      focusIndex(0);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const code = digits.join('');
    if (code.length !== OTP_LENGTH) {
      setError('Enter the full 6-digit code.');
      return;
    }
    if (expired) {
      setError('This code has expired. Request a new OTP.');
      return;
    }
    submitCode(code);
  };

  const handleResend = async () => {
    if (!canResend) return;
    setError('');
    setResending(true);
    try {
      await authService.resendOtp({ identifier: pending.identifier });
      const nextPending = refreshOtpPending();
      setPending(nextPending);
      setNow(Date.now());
      setDigits(Array(OTP_LENGTH).fill(''));
      setInfo(USE_MOCKS ? `A new demo code was issued: ${MOCK_OTP_CODE}` : 'A new code was sent.');
      focusIndex(0);
    } catch (err) {
      const parsed = parseAuthError(err);
      setError(parsed.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      lang={lang}
      setLang={setLang}
      carouselIndex={carouselIndex}
      onPrev={() => setCarouselIndex((prev) => (prev === 1 ? 5 : prev - 1))}
      onNext={() => setCarouselIndex((prev) => (prev % 5) + 1)}
    >
      <div className="scna-login-card">
        <h2 className="scna-card-title">Verify your identity</h2>
        <p className="scna-otp-subtitle">
          We sent a 6-digit code to <strong>{identifierLabel}</strong>
        </p>

        <form className="scna-login-form" onSubmit={handleSubmit}>
          {error && <div className="scna-auth-alert" role="alert">{error}</div>}
          {info && !error && <div className="scna-auth-info">{info}</div>}

          <div className="scna-otp-row" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                className="scna-otp-box"
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                autoFocus={index === 0}
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                aria-label={`Digit ${index + 1}`}
                disabled={submitting}
              />
            ))}
          </div>

          <div className="scna-otp-meta">
            <span className={expired ? 'scna-otp-timer expired' : 'scna-otp-timer'}>
              {expired ? 'Code expired' : `Expires in ${formatCountdown(remainingMs)}`}
            </span>
            <button
              type="button"
              className="scna-otp-resend"
              onClick={handleResend}
              disabled={!canResend}
            >
              {resending ? 'Sending…' : 'Resend OTP'}
            </button>
          </div>

          <button type="submit" className="scna-submit-btn" disabled={submitting || expired}>
            {submitting ? 'Verifying…' : 'Verify and continue'}
          </button>

          <Link to="/login" className="scna-otp-back">
            Back to login
          </Link>

          <div className="scna-security-note">
            JWT is issued only after this code is verified.
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
