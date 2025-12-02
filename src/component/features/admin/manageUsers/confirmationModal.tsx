const ConfirmationModal: React.FC<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    type: 'danger' | 'warning';
  }> = ({ isOpen, title, message, onConfirm, onCancel, type }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
          <div className="p-6">
            <h3 className="text-xl font-bold text-charcoal mb-3">{title}</h3>
            <p className="text-grayblue mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="cursor-pointer px-5 py-2.5 rounded-lg border border-gray-300 text-charcoal font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`cursor-pointer px-5 py-2.5 rounded-lg font-medium text-white transition-colors ${
                  type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default ConfirmationModal;