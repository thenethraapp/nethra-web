import { useState } from 'react';
import { RequestEmailForm } from './_requestEmailForm';
import { VerifyOTPForm } from './_verifyOTPForm';
import { SetPasswordForm } from './_setPasswordForm';
import { SuccessMessage } from './_successMessage';
import type { Step } from '@/types/api/auth';
import { useRouter } from 'next/router';

const ForgotPassword = () => {
    const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');

  const handleEmailSuccess = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep('otp');
  };

  const handleOTPSuccess = (submittedOTP: string) => {
    setOTP(submittedOTP);
    setStep('password');
  };

  const handlePasswordSuccess = () => {
    setStep('success');
  };

  const handleBackToLogin = () => {
    // Navigate to login page
    router.replace('/account/login');
  };

  return (
    <main className="-mt-[60px] min-h-screen flex items-start justify-center bg-gray-50 p-4 pt-16">
      {step === 'email' && <RequestEmailForm onSuccess={handleEmailSuccess} />}
      
      {step === 'otp' && (
        <VerifyOTPForm
          email={email}
          onSuccess={handleOTPSuccess}
          onBack={() => setStep('email')}
        />
      )}
      
      {step === 'password' && (
        <SetPasswordForm
          email={email}
          otp={otp}
          onSuccess={handlePasswordSuccess}
          onBack={() => setStep('otp')}
        />
      )}
      
      {step === 'success' && <SuccessMessage onBackToLogin={handleBackToLogin} />}
    </main>
  );
};

export default ForgotPassword;