import { MessageCircle, ArrowLeft } from 'lucide-react';

interface MessagingPolicyProps {
  onBackToList?: () => void;
}

const MessagingPolicy: React.FC<MessagingPolicyProps> = ({ onBackToList }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full px-8 relative">
      {/* Back button - visible on mobile only */}
      {onBackToList && (
        <button
          onClick={onBackToList}
          className="lg:hidden absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
      )}
      <div className="max-w-xl w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full icon-bg flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-primary-cyan" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-medium text-darkgray mb-8">
            Messaging Policy
          </h2>
        </div>

        <div className="bg-cyan-light rounded-lg px-8 py-6 bg-primary-cyan/5 border border-primary-cyan/30">
          <p className="text-darkgray/70 leading-relaxed text-sm">
            For your safety and privacy, all communication between doctors and patients must take place within the platform. Sharing personal contact information (such as phone numbers, email addresses, or social media profiles) outside of the platform before a formal doctor-patient relationship is established is not permitted and may result in restricted access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessagingPolicy;