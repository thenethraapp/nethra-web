import { MessageCircle } from 'lucide-react';

const NoMessages = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white p-6">
            <div className="w-20 h-20 rounded-full bg-vividblue/10 flex items-center justify-center mb-4">
                <MessageCircle className="w-10 h-10 text-vividblue" />
            </div>
            <h2 className="text-2xl font-semibold text-charcoal mb-2">
                No conversation selected
            </h2>
            <p className="text-grayblue text-center max-w-xs">
                Select a conversation from the list or start a new one to begin messaging.
            </p>
        </div>
    );
};

export default NoMessages;