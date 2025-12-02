import React from 'react';
import AnimatedCheck from '../UI/AnimatedCheck';

interface AccountVerifiedProps {
    isVisible: boolean;
    onContinue: () => void;
}

const AccountVerified: React.FC<AccountVerifiedProps> = ({ isVisible, onContinue }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 text-center flex flex-col items-center">
                <AnimatedCheck />
                <h3 className="text-xl font-semibold text-darkgray mt-4 mb-2">
                    Email Verified Successfully!
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                    Your email has been verified. You can now proceed to login to your account.
                </p>
                <button
                    onClick={onContinue}
                    className="w-full bg-primary-cyan text-white py-3 text-sm rounded-lg font-semibold hover:opacity-90 transition cursor-pointer"
                >
                    Continue to Login
                </button>
            </div>
        </div>
    );
};

export default AccountVerified;