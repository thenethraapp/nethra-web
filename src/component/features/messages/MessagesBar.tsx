import { useState, useEffect } from 'react';
import { useMessagesStore } from '@/store/useMessagesStore';
import Messages from './Messages';
import { ChevronDown, X } from 'lucide-react';

const MessagesBar = () => {
    const { isVisible, hide } = useMessagesStore();
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true);
        }
    }, [isVisible]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            hide();
        }, 300);
    };

    if (!isVisible) return null;

    return (
        <>
            <style jsx global>{`
                @keyframes slideUpFromBottom {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
            
            {/* Backdrop */}
            <section
                className={`fixed inset-0 bg-black/30 z-[950] transition-opacity duration-300 ${
                    isAnimating ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={handleClose}
            >
                {/* Mobile: Full width, slides from bottom */}
                <section
                    className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl overflow-hidden shadow-2xl z-[1000] h-[90vh] flex flex-col transition-transform duration-500 ease-out ${
                        isAnimating ? 'translate-y-0' : 'translate-y-full'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-charcoal">Messages</h2>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Close messages"
                        >
                            <ChevronDown className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <Messages />
                    </div>
                </section>

                {/* Desktop: Side panel, slides from right */}
                <section
                    className={`hidden lg:block fixed top-16 right-4 bg-white rounded-2xl shadow-2xl z-[1000] h-[85vh] w-[90%] max-w-5xl transition-all duration-300 ease-out ${
                        isAnimating
                            ? 'opacity-100 translate-x-0 scale-100'
                            : 'opacity-0 translate-x-4 scale-95'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Desktop Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-charcoal">Messages</h2>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Close messages"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                    <div className="h-[calc(85vh-73px)] overflow-hidden">
                        <Messages />
                    </div>
                </section>
            </section>
        </>
    );
};

export default MessagesBar;