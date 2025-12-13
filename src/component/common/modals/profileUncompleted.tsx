import React from 'react'
import { AlertCircle } from 'lucide-react'

const ProfileUncompleted = ({ onClose: _onClose, onCompleteProfile }: {
  onClose: () => void,
  onCompleteProfile: () => void
}) => {
  return (
    <section className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]'>
      <div className='bg-white rounded-3xl shadow-xl max-w-md w-full p-6 relative animate-fade-in'>
        <div className='flex justify-center mb-4'>
          <div className='bg-red-100 rounded-full p-3'>
            <AlertCircle className='text-red-600' size={32} />
          </div>
        </div>

        {/* Content */}
        <div className='text-center mb-6'>
          <h2 className='text-lg font-bold text-gray-900 mb-2'>
            Complete Your Profile
          </h2>
          <p className='text-darkgray/70 text-sm'>
            Your profile is incomplete. Please take a moment to complete your profile information to get the most out of your experience.
          </p>
        </div>

        {/* Actions */}
        <div className='flex flex-col gap-3'>
          <button
            onClick={onCompleteProfile}
            className='w-full bg-primary-cyan text-sm hover:bg-primary-cyan/70 cursor-pointer text-white font-medium py-2 px-4 rounded-full transition-all duration-200 ease-in'
          >
            Complete Profile Now
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </section>
  )
}

export default ProfileUncompleted