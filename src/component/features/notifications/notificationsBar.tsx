import { useState, useEffect } from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';

const NotificationsBar = () => {
  const { toggleNotificationVisibility, isVisible, hide } = useNotificationStore();
  const [showReadAll, setShowReadAll] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      toggleNotificationVisibility();
    }, 300); // Match this with animation duration
  };

  if (!isVisible) return null;

  return (
    <section 
      className={`bg-black/30 fixed w-screen h-screen top-0 left-0 z-[950] transition-opacity duration-100 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <section 
        className={`fixed top-16 right-4 bg-white rounded-2xl shadow-2xl z-[1000] h-[80vh] w-[90%] max-w-2xl pb-6 transition-all duration-200 ease-out ${
          isAnimating 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 -translate-y-4 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='p-6 flex justify-between items-center border-b border-darkgray/10'>
          <h3 className='text-base md:text-lg font-semibold text-darkgray'>Notifications</h3>
          <div className="relative">
            <button 
              onClick={() => setShowReadAll(!showReadAll)} 
              className="hover:bg-black/5 cursor-pointer p-1 rounded-lg transition-colors duration-200"
            >
              <MoreHorizIcon />
            </button>
            {showReadAll && (
              <button 
                className="absolute top-7 right-2 bg-white hover:bg-gray-100 hover:border-white transition-all duration-300 ease-in-out border border-gray-100 shadow-xl px-4 py-3 rounded-lg w-[150px] text-sm cursor-pointer animate-in fade-in slide-in-from-top-2 duration-200" 
                onClick={() => setShowReadAll(!showReadAll)}
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        <button 
          onClick={handleClose} 
          className="absolute -top-8 left-0 text-xs cursor-pointer px-2 py-1 text-white hover:text-red-500 font-extrabold transition-all duration-300 ease-in-out rounded-full"
        >
          <CloseIcon />
        </button>
      </section>
    </section>
  );
};

export default NotificationsBar;