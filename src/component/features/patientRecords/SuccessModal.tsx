import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onNewRecord: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  onNewRecord 
}) => {
  if (!isOpen) return null;

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    onClose();
  };

  const handleNewRecord = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    onNewRecord();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      aria-describedby="success-modal-description"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Success Icon */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 flex flex-col items-center">
          <div className="bg-green-100 rounded-full p-3 mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" aria-hidden="true" />
          </div>
          <h2 
            id="success-modal-title" 
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            Record Submitted Successfully!
          </h2>
          <p 
            id="success-modal-description" 
            className="text-center text-gray-600"
          >
            The patient record has been saved and is now available in your records list.
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label="View records list"
          >
            View Records
          </button>
          <button
            type="button"
            onClick={handleNewRecord}
            className="flex-1 px-4 py-3 bg-primary-blue text-white rounded-lg hover:brightness-110 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Create new record"
          >
            New Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;