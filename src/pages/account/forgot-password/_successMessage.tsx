import { memo } from 'react';
import type { SuccessMessageProps } from '@/types/api/auth';

const SuccessMessage = memo(({ onBackToLogin }: SuccessMessageProps) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Password Reset Successful</h2>
      <p className="text-gray-600 mb-6">You can now log in with your new password</p>
      
      <button
        onClick={onBackToLogin}
        className="w-full py-2 px-4 bg-primary-cyan cursor-pointer text-white rounded-lg font-medium hover:bg-primary-cyan/70 transition-colors"
      >
        Back to Login
      </button>
    </div>
  );
});

SuccessMessage.displayName = 'SuccessMessage';

export default SuccessMessage;
export { SuccessMessage };
export type { SuccessMessageProps };