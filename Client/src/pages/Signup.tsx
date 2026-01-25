import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import {
  signupSchema,
  type SignupFormData,
} from '../validations/signupValidation';
import { signupApi } from '../api/auth';
import { setOTPDetails } from '../utils/otp';

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: SignupFormData) => {
    try {
      const res = await signupApi(data);
      setOTPDetails({ ...res, purpose: 'REGISTRATION' });
      navigate('/verify-otp', { replace: true });
    } catch (error) {}
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-xl backdrop-blur">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl p-1 font-bold tracking-tight bg-linear-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">
            Image Uploader
          </h1>
          <p className="mt-2 text-sm text-slate-600">Create your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              className={cn(
                'w-full rounded-lg px-3 py-2.5 text-sm',
                'bg-slate-50 ring-1 ring-slate-200',
                'focus:ring-2 focus:ring-pink-500 focus:outline-none',
                errors.email && 'ring-red-500 focus:ring-red-500',
              )}
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* Phone */}
          <div>
            <input
              type="tel"
              placeholder="Phone number"
              className={cn(
                'w-full rounded-lg px-3 py-2.5 text-sm',
                'bg-slate-50 ring-1 ring-slate-200',
                'focus:ring-2 focus:ring-pink-500 focus:outline-none',
                errors.phone && 'ring-red-500 focus:ring-red-500',
              )}
              {...register('phone')}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className={cn(
                'w-full rounded-lg px-3 py-2.5 text-sm',
                'bg-slate-50 ring-1 ring-slate-200',
                'focus:ring-2 focus:ring-pink-500 focus:outline-none',
                errors.password && 'ring-red-500 focus:ring-red-500',
              )}
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              placeholder="Confirm password"
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
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-pink-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
