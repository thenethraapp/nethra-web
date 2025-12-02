import { AlertCircle, X } from 'lucide-react';
import { useRouter } from 'next/router';

const ProfileSetupPrompt = ({
  onClose,
}: {
  onClose: () => void,
}) => {

  const router = useRouter();

  return (
    <section
      className='fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-3xl shadow-xl max-w-md w-full p-6 relative animate-fade-in'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors'
          aria-label="Close"
        >
          <X className='w-5 h-5 text-gray-500' />
        </button>

        <div className='flex justify-center mb-4'>
          <div className='bg-red-100 rounded-full p-3'>
            <AlertCircle className='text-red-600' size={32} />
          </div>
        </div>

        {/* Content */}
        <div className='text-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Help Your Doctor Understand You Better
          </h2>
          <p className='text-gray-600'>
            Completing your profile ensures your doctor has information about your medical history, and any ongoing conditions.<br />
          </p>
        </div>

        {/* Action */}
        <div className='flex flex-col gap-3'>
          <button
            onClick={() => {
              // Store that user came from booking page
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('fromBooking', 'true');
              }
              router.push('/profile/setup');
            }}
            className='w-full bg-primary-cyan hover:bg-primary-cyan/70 cursor-pointer text-white font-medium py-3 px-4 rounded-full transition-colors'
          >
            Proceed to Complete Profile
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

export default ProfileSetupPrompt;