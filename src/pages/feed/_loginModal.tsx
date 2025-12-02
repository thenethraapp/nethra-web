// _loginModal.tsx
import React, { memo } from "react";
import { X } from "lucide-react";
import { LoginModalProps } from "@/types/domain/feed";

const LoginModal = memo<LoginModalProps>(({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 top-0 z-100 bg-black/50 transition-opacity"
      onClick={onClose}
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-4xl shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X size={20} />
          </button>

          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-cyan"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Login Required
              </h2>
              <p className="text-gray-600">
                You need to be logged in to view optometrist profiles and
                connect with healthcare professionals.
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={onLogin}
                className="w-full bg-primary-cyan text-white cursor-pointer px-6 py-3 rounded-full hover:bg-primary-cyan/70 transition-colors font-medium"
                type="button"
              >
                Proceed to Login
              </button>

              <button
                onClick={onClose}
                className="w-full bg-gray-100 cursor-pointer text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition-colors font-medium"
                type="button"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

LoginModal.displayName = "LoginModal";

export default LoginModal;
