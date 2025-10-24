'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setCredentials } from '@/store/slices/authSlice';
import { useLoginMutation } from '@/store/api/authApi';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      const accessToken = result?.data?.accessToken;
      const user = result?.data?.user;

      if (accessToken && user) {
        dispatch(setCredentials({ user, token: accessToken }));
        router.replace('/dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Login failed. Please try again.';
      setError(msg);
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-end p-6"
      style={{
        backgroundImage: "url('/images/login.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/60" />
      
      {/* Form with glass effect */}
      <div className="relative z-10 flex items-center justify-center w-full max-w-md mr-8 lg:mr-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >

          <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 rounded-xl">
                <span className="text-white font-bold">LF</span>
              </div>
              <h1 className="mt-3 text-2xl font-semibold text-white drop-shadow-lg">Log in</h1>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <Icon icon="mdi:alert-circle" className="text-red-500 mr-2" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1 drop-shadow-md">Email</label>
                <div className="relative">
                  <Icon
                    icon="mdi:email-outline"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    {...register('email')}
                    type="email"
                    className="input-field pl-10"
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1 drop-shadow-md">Password</label>
                <div className="relative">
                  <Icon
                    icon="mdi:lock-outline"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Toggle password"
                  >
                    <Icon icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} />
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center text-sm text-white drop-shadow-md">
                  <input type="checkbox" className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  Stay logged in
                </label>
                <button type="button" className="text-sm text-white hover:text-primary-200 drop-shadow-md">
                  Forgot password?
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary h-11 flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Icon icon="mdi:loading" className="animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Log in'
                )}
              </motion.button>
            </form>

          </div>

          <div className="text-center mt-6 text-xs text-white/80 drop-shadow-md">© 2024 LogiFlow</div>
        </motion.div>
      </div>
    </div>
  );
}
