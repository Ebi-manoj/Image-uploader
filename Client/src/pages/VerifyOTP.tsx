import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { toast } from 'sonner';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '../components/ui/input-otp';
import { otpSchema, type OTPFormData } from '../validations/otpValidation';
import { useNavigate } from 'react-router-dom';
import { getOTPDetails } from '../utils/otp';
import { verifyOtpApi } from '../api/auth';
import { handleApiError } from '../utils/handleApiError';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState<'signup' | 'reset_password' | ''>('');

  useEffect(() => {
    const otpDetails = getOTPDetails();
    if (!otpDetails) {
      navigate('/signup', { replace: true });
      return;
    }
    const { email, otpExpiry, purpose } = otpDetails;
    const expiryTime = new Date(otpExpiry).getTime();
    const now = Date.now();
    const timeLeftMs = expiryTime - now;
    if (timeLeftMs <= 0) {
      setTimeLeft(0);
    } else {
      setTimeLeft(Math.floor(timeLeftMs / 1000));
    }
    setEmail(email);
    setPurpose(purpose);
  }, [navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit = async (data: OTPFormData) => {
    try {
      await verifyOtpApi({ email, otp: data.otp });
      if (purpose === 'signup') {
        toast.success('Signup successful! Please login.');
        navigate('/login', { replace: true });
      } else {
        toast.success('OTP Verified Successfully!');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const resendOTP = async () => {
    setIsResending(true);

    setTimeLeft(0);
    setIsResending(false);
    toast.success('OTP Resent Successfully!');
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const expired = timeLeft <= 0;

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-xl backdrop-blur">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Verify your OTP
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter the 6-digit code we sent to your email
          </p>

          {!expired ? (
            <p className="mt-4 text-sm font-medium text-slate-900">
              {minutes}:{seconds < 10 ? '0' : ''}
              {seconds}
            </p>
          ) : (
            <p className="mt-4 text-sm font-medium text-red-500">OTP Expired</p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              onChange={val => setValue('otp', val, { shouldValidate: true })}
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {errors.otp && (
            <p className="text-center text-xs text-red-500">
              {errors.otp.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || expired}
            className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-pink-500 via-purple-500 to-orange-400 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          <p>
            Didn’t get the code?{' '}
            <button
              type="button"
              disabled={!expired || isResending}
              onClick={resendOTP}
              className="cursor-pointer font-medium text-slate-900 underline hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResending ? 'Resending...' : 'Resend'}
            </button>
          </p>
          <p className="mt-2 text-xs text-slate-400">
            We’ve sent a code to{' '}
            <span className="font-medium text-slate-600">{email}</span>. Check
            your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}
