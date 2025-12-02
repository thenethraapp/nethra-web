import Image from 'next/image'
import React, { useState } from 'react'
import Map from '../../../public/images/modals/map.png'
import Spinner from '../UI/Spinner'
import AnimatedCheck from '../UI/AnimatedCheck'

interface LocationPermissionProps {
    setAccessLocation: (access: boolean) => void;
    onClose?: () => void;
    onPermissionDecided?: () => void;
}

const LocationPermission: React.FC<LocationPermissionProps> = ({ 
    setAccessLocation, 
    onClose,
    onPermissionDecided 
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

    const handleAllowAccess = async () => {
        setIsProcessing(true);
        
        try {
    
            setPermissionGranted(true);
            setAccessLocation(true);
            
            // Show success animation
            setShowSuccess(true);
            
            // Close modal and proceed with registration after animation
            setTimeout(() => {
                onClose?.();
                onPermissionDecided?.();
            }, 2500);

        } finally {
            setIsProcessing(false);
        }
    };

    const handleDenyAccess = () => {
        setPermissionGranted(false);
        setAccessLocation(false);
        onClose?.();
        onPermissionDecided?.();
    };

    return (
        <section className='fixed z-[100] top-0 left-0 w-full h-screen'>
            <div className='w-full h-full bg-black/50 flex items-center justify-center px-6'>
                <div className='bg-white rounded-3xl overflow-hidden w-full h-full max-h-[600px] max-w-[400px] relative'>
                    <Image
                        src={Map}
                        alt="Location map background"
                        width={0}
                        height={0}
                        className="w-full h-full object-cover object-top"
                        priority
                    />
                    
                    {/* Content Overlay */}
                    <div className='px-8 pt-24 pb-12 rounded-t-[190px] text-center flex flex-col items-center justify-center absolute bottom-0 z-10 bg-white shadow-2xl shadow-black w-full'>
                        
                        <h2 className='text-lg font-bold mb-6'>Find the Right Eye Care Near You</h2>
                        
                        <p className='mb-8 text-charcoal/60 text-sm leading-relaxed'>
                            We use your location to connect you with trusted optometrists nearby. 
                            You can manage this in your settings anytime.
                        </p>

                        {/* Conditional Rendering based on state */}
                        {showSuccess ? (
                            // Success State - Show Animated Check
                            <div className="flex flex-col items-center justify-center py-4">
                                <AnimatedCheck size={70} />
                                <p className="text-green-600 font-medium mt-4 text-sm">
                                    Location access granted!
                                </p>
                            </div>
                        ) : (
                            // Default State - Show Buttons
                            <div className="flex flex-col gap-3 w-full">
                                <button 
                                    onClick={handleAllowAccess}
                                    disabled={isProcessing}
                                    className='w-full py-3 px-4 cursor-pointer bg-vividblue hover:bg-vividblue/90 disabled:hover:bg-vividblue rounded-xl text-white text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed'
                                >
                                    {isProcessing ? (
                                        <>
                                            <Spinner />
                                            <span>Requesting Access...</span>
                                        </>
                                    ) : (
                                        'Allow Access'
                                    )}
                                </button>
                                
                                <button 
                                    onClick={handleDenyAccess}
                                    disabled={isProcessing}
                                    className='w-full py-3 px-4 cursor-pointer bg-vividblue/5 hover:bg-vividblue/10 disabled:hover:bg-vividblue/5 rounded-xl text-black/70 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    Deny Access
                                </button>
                            </div>
                        )}

                        {/* Error State */}
                        {permissionGranted === false && !isProcessing && (
                            <p className="text-red-500 text-xs mt-4">
                                Location access was denied. You can still continue without location services.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LocationPermission