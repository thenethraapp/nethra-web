import { useState, memo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { verifyPasswordResetOTP } from '@/api/auth/forgot-password';
import type { VerifyOTPFormProps } from '@/types/api/auth';
import LogoDark from '@/component/common/UI/LogoDark';

const VerifyOTPForm = memo(({ email, onSuccess, onBack }: VerifyOTPFormProps) => {
  const [otp, setOTP] = useState('');

  const mutation = useMutation({
    mutationFn: (otp: string) => verifyPasswordResetOTP(email, otp),
    onSuccess: (data) => {
      if (data.success) {
        onSuccess(otp);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim()) {
      mutation.mutate(otp);
    }
  };

  // Type-safe error message extraction
  const getErrorMessage = (): string => {
    if (!mutation.error) return 'Invalid code';

    // Handle different error types
    if (mutation.error instanceof Error) {
      return mutation.error.message;
    }

    // Handle API error responses
    if (typeof mutation.error === 'object' && mutation.error !== null) {
      const errorObj = mutation.error as { message?: string; error?: string };
      return errorObj.message || errorObj.error || 'Invalid code';
    }

    return 'Invalid code';
  };

  return (
    <div className='w-full max-w-lg'>
      <div className="flex flex-col items-center justify-center text-center pt-8">
        <LogoDark />
      </div>
      <div className="w-full mx-auto p-6 bg-white rounded-3xl shadow-md">
        <h2 className="text-2xl font-bold mb-2 text-center">Verify Code</h2>
        <p className="text-gray-600 mb-6 text-center">Enter the code sent to {email}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter code"
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
            {mutation.isPending ? 'Verifying...' : 'Verify Code'}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full py-2 px-4 text-gray-700 rounded-lg font-medium hover:bg-gray-300 cursor-pointer transition-colors"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
});

VerifyOTPForm.displayName = 'VerifyOTPForm';

export default VerifyOTPForm;
export { VerifyOTPForm };
export type { VerifyOTPFormProps };