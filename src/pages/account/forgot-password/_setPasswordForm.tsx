import { useState, memo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { setNewPassword } from '@/api/auth/forgot-password';
import type { SetPasswordFormProps } from '@/types/api/auth';
import LogoDark from '@/component/common/UI/LogoDark';

const SetPasswordForm = memo(({ email, otp, onSuccess, onBack }: SetPasswordFormProps) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: (newPassword: string) => setNewPassword(email, otp, newPassword),
    onSuccess: (data) => {
      if (data.success) {
        onSuccess();
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    mutation.mutate(password);
  };

  return (
    <div className='w-full max-w-lg'>
      <div className="flex flex-col items-center justify-center text-center pt-8">
        <LogoDark />
      </div>
      <div className="w-full mx-auto p-6 bg-white rounded-3xl shadow-md">
        <h2 className="text-2xl font-bold mb-2 text-center">Set New Password?</h2>
        <p className="text-gray-600 mb-6 text-center">Choose a strong password</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Min. 8 characters"
              required
              disabled={mutation.isPending}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Re-enter password"
              required
              disabled={mutation.isPending}
            />
          </div>

          {(error || mutation.isError) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error || mutation.data?.message || 'Failed to reset password'}
            </div>
          )}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-2 px-4 bg-primary-cyan text-white rounded-lg font-medium hover:bg-primary-cyan/70 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {mutation.isPending ? 'Resetting...' : 'Reset Password'}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full py-2 px-4 text-gray-700 rounded-lg cursor-pointer font-medium hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
});

SetPasswordForm.displayName = 'SetPasswordForm';

export default SetPasswordForm;
export { SetPasswordForm };
export type { SetPasswordFormProps };