'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { useUpdateUserMutation, useUpdatePasswordMutation, useGetProfileQuery } from '@/store/api/authApi';
import { setCredentials } from '@/store/slices/authSlice';
import { UserRole } from '@/types';
import { useToast } from '@/hooks/useToast';

// Profile update schema
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

// Password reset schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();

  // Fetch user profile if not available
  const { data: profileData, isLoading: isLoadingProfile } = useGetProfileQuery(undefined, {
    skip: !!user, // Skip if user data already exists
  });

  // Update user state if profile was fetched
  useEffect(() => {
    if (profileData?.data && token && !user) {
      console.log('Updating user from profile data:', profileData.data);
      dispatch(setCredentials({ user: profileData.data, token }));
    }
  }, [profileData, token, user, dispatch]);  

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    setValue: setProfileValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Populate form fields when user data is available
  useEffect(() => {
    if (user) {
      console.log('Populating form with user data:', user);
      setProfileValue('firstName', (user as any)?.user?.firstName || '');
      setProfileValue('lastName', (user as any)?.user?.lastName || '');
      setProfileValue('email', (user as any)?.user?.email || '');
      setProfileValue('phone', (user as any)?.user?.phone || '');
    }
  }, [user, setProfileValue]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      if (!user?.id) {
        toast.error('User ID not found');
        return;
      }

      const result = await updateUser({
        id: (user as any)?.user?.id,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
        },
      }).unwrap();

      // Update the user state in Redux
      if (result.data && token) {
        dispatch(setCredentials({ user: result.data, token }));
      }

      toast.api.updated('Profile');
    } catch (error: any) {
      toast.api.error('update profile', error);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();
      
      toast.success('Password updated successfully!');
      resetPasswordForm();
    } catch (error: any) {
      toast.api.error('update password', error);
    }
  };

  // Show loading state while fetching profile
  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'profile'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon icon="mdi:account" className="w-5 h-5 inline mr-2" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'password'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon icon="mdi:lock-reset" className="w-5 h-5 inline mr-2" />
              Reset Password
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
              {/* Profile Avatar Section */}
              <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                <div className="relative">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-3xl font-bold text-primary-700">
                    {(user as any)?.user?.firstName?.[0]?.toUpperCase() || (user as any)?.user?.email?.[0]?.toUpperCase() || 'A'}
                    {(user as any)?.user?.lastName?.[0]?.toUpperCase() || (user as any)?.user?.email?.[1]?.toUpperCase() || 'D'}
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full border-2 border-gray-200 hover:border-primary-500 transition-colors"
                    title="Change avatar"
                  >
                    <Icon icon="mdi:camera" className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {(user as any)?.user?.firstName && (user as any)?.user?.lastName 
                      ? `${(user as any).user.firstName} ${(user as any).user.lastName}` 
                      : (user as any)?.user?.email?.split('@')[0] || 'User'
                    }
                  </h3>
                  <p className="text-sm text-gray-600">{(user as any)?.user?.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      (user as any)?.user?.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' :
                      (user as any)?.user?.role === UserRole.OPERATIONS ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {(user as any)?.user?.role || 'USER'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    {...registerProfile('firstName')}
                    type="text"
                    className="input-field"
                    placeholder="Enter your first name"
                  />
                  {profileErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.firstName.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    {...registerProfile('lastName')}
                    type="text"
                    className="input-field"
                    placeholder="Enter your last name"
                  />
                  {profileErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.lastName.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    {...registerProfile('email')}
                    type="email"
                    placeholder="Enter your email"
                    disabled
                    className="input-field bg-gray-50 cursor-not-allowed"
                  />
                  {profileErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    {...registerProfile('phone')}
                    type="tel"
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                  {profileErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.phone.message}</p>
                  )}
                </div>

                {/* Role (Disabled) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={(user as any)?.user?.role || 'N/A'}
                    disabled
                    className="input-field bg-gray-50 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">Contact administrator to change role</p>
                </div>

                {/* Status (Disabled) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Status
                  </label>
                  <input
                    type="text"
                    value={user?.status || 'active'}
                    disabled
                    className="input-field bg-gray-50 cursor-not-allowed capitalize"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isUpdating}
                  className="btn-primary disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <Icon icon="mdi:loading" className="animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:content-save" className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
              <div className="max-w-md space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password *
                  </label>
                  <input
                    {...registerPassword('currentPassword')}
                    type="password"
                    className="input-field"
                    placeholder="Enter your current password"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password *
                  </label>
                  <input
                    {...registerPassword('newPassword')}
                    type="password"
                    className="input-field"
                    placeholder="Enter your new password"
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters long</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    {...registerPassword('confirmPassword')}
                    type="password"
                    className="input-field"
                    placeholder="Confirm your new password"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="btn-primary disabled:opacity-50"
                >
                  {isUpdatingPassword ? (
                    <>
                      <Icon icon="mdi:loading" className="animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:lock-reset" className="w-4 h-4 mr-2" />
                      Update Password
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
