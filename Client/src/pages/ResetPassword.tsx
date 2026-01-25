import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '../validations/resetPasswordValidation';
import { resetPasswordApi } from '../api/auth';
import { getOTPDetails } from '../utils/otp';
import { handleApiError } from '../utils/handleApiError';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export default function ResetPassword() {
  const [verificationToken, setVerificationToken] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const otpDetails = getOTPDetails();
    const state = location.state as { verificationToken?: string } | null;
    
    if (!otpDetails || otpDetails.purpose !== 'FORGOT_PASSWORD' || !state?.verificationToken) {
      navigate('/forgot-password', { replace: true });
      return;
    }
    setVerificationToken(state.verificationToken);
  }, [navigate, location]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      if (!verificationToken) {
        toast.error('Session expired. Please try again.');
        navigate('/forgot-password', { replace: true });
        return;
      }

      await resetPasswordApi(verificationToken, data.newPassword);
      toast.success('Password reset successfully! Please login.');
      navigate('/login', { replace: true });
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-xl backdrop-blur">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl p-1 font-bold tracking-tight bg-linear-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">
            Image Uploader
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Create a new password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* New Password */}
          <div>
            <input
              type="password"
              placeholder="New Password"
              className={cn(
                'w-full rounded-lg px-3 py-2.5 text-sm',
                'bg-slate-50 ring-1 ring-slate-200',
                'focus:ring-2 focus:ring-pink-500 focus:outline-none',
                errors.newPassword && 'ring-red-500 focus:ring-red-500',
              )}
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              className={cn(
                'w-full rounded-lg px-3 py-2.5 text-sm',
                'bg-slate-50 ring-1 ring-slate-200',
                'focus:ring-2 focus:ring-pink-500 focus:outline-none',
                errors.confirmPassword && 'ring-red-500 focus:ring-red-500',
              )}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-pink-500 via-purple-500 to-orange-400 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
