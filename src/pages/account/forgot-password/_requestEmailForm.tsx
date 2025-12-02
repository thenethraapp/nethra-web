import { useState, memo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { requestPasswordReset } from '@/api/auth/forgot-password';
import type { RequestEmailFormProps } from '@/types/api/auth';
import LogoDark from '@/component/common/UI/LogoDark';

const RequestEmailForm = memo(({ onSuccess }: RequestEmailFormProps) => {
  const [email, setEmail] = useState('');

  const mutation = useMutation({
    mutationFn: (email: string) => requestPasswordReset(email),
    onSuccess: (data) => {
      if (data.success) {
        onSuccess(email);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      mutation.mutate(email);
    }
  };

  // Type-safe error message extraction
  const getErrorMessage = (): string => {
    if (!mutation.error) return 'Something went wrong';

    // Handle different error types
    if (mutation.error instanceof Error) {
      return mutation.error.message;
    }

    // Handle API error responses
    if (typeof mutation.error === 'object' && mutation.error !== null) {
      const errorObj = mutation.error as { message?: string; error?: string };
      return errorObj.message || errorObj.error || 'Something went wrong';
    }

    return 'Something went wrong';
  };

  return (
    <div className='w-full max-w-lg'>
      <div className="flex flex-col items-center justify-center text-center pt-8">
        <LogoDark />
      </div>
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-3xl shadow-md">
        <h2 className="text-2xl font-bold mb-2 text-center">Reset Password</h2>
        <p className="text-gray-600 mb-6 text-center">Enter your email to receive a reset code</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-cyan focus:border-transparent"
              placeholder="your@email.com"
              required
              disabled={mutation.isPending}
            />
          </div>

          {mutation.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {getErrorMessage()}
            </div>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-2 px-4 bg-primary-cyan text-white rounded-lg font-medium hover:bg-primary-cyan/70 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {mutation.isPending ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>
      </div>
    </div>

  );
});

RequestEmailForm.displayName = 'RequestEmailForm';

export default RequestEmailForm;
export { RequestEmailForm };
export type { RequestEmailFormProps };