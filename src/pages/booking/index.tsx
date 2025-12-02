import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import { createPatientBooking } from "@/api/booking"
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ProfileSetupPrompt from '@/component/common/modals/profileSetupPrompt';
import { getUserProfile } from '@/api/profile/getUserProfile';
import CloudinaryImage from '@/component/common/UI/CloudinaryImage';
import WheelLoader from '@/component/common/UI/WheelLoader';
import { useMessagesStore } from '@/store/useMessagesStore';

interface BookingData {
    optometrist: string;
    bookingType: 'in-person' | 'virtual';
    appointmentDate: string;
    startTime: string;
    endTime: string;
    reason: string;
}

interface FormErrors {
    bookingType?: string;
    appointmentDate?: string;
    startTime?: string;
    endTime?: string;
    reason?: string;
}

const BookingPage: React.FC = () => {
    const { user } = useAuth();
    const router = useRouter();
    const { optometristId } = router.query;

    const [formData, setFormData] = useState<BookingData>({
        optometrist: '',
        bookingType: 'virtual',
        appointmentDate: '',
        startTime: '',
        endTime: '',
        reason: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [showProfilePrompt, setShowProfilePrompt] = useState<boolean>(false);
    const [doctorProfile, setDoctorProfile] = useState<{
        user?: {
            fullName?: string;
            id?: string;
        };
        profile?: {
            photo?: string;
            about?: string;
        };
    } | null>(null);
    const [loadingDoctor, setLoadingDoctor] = useState<boolean>(true);
    const { show: showMessages } = useMessagesStore();

    // Set optometrist ID and fetch doctor profile when router is ready
    useEffect(() => {
        const fetchDoctorProfile = async () => {
            if (optometristId && typeof optometristId === 'string') {
                setFormData(prev => ({
                    ...prev,
                    optometrist: optometristId
                }));

                // Fetch doctor's profile
                try {
                    setLoadingDoctor(true);
                    const response = await getUserProfile(optometristId);
                    if (response.success && response.data) {
                        setDoctorProfile(response.data);
                    }
                } catch (error) {
                    console.error('Error fetching doctor profile:', error);
                } finally {
                    setLoadingDoctor(false);
                }
            }
        };

        fetchDoctorProfile();
    }, [optometristId]);

    useEffect(() => {
        if (user && !user.hasCompletedProfile) {
            setShowProfilePrompt(true);
        }
    }, [user]);

    // Function to format time for display (e.g., "08:00" -> "8:00 AM")
    const formatTimeForDisplay = (time: string): string => {
        if (!time) return '';

        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

        return `${displayHour}:${minutes} ${ampm}`;
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.appointmentDate) {
            newErrors.appointmentDate = 'Please select an appointment date';
        }

        if (!formData.startTime) {
            newErrors.startTime = 'Please select a start time';
        }

        if (!formData.endTime) {
            newErrors.endTime = 'Please select an end time';
        }

        if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
            newErrors.endTime = 'End time must be after start time';
        }

        if (!formData.reason.trim()) {
            newErrors.reason = 'Please provide a reason for your visit';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Prevent submission if profile is incomplete
        if (user && !user.hasCompletedProfile) {
            setShowProfilePrompt(true);
            toast.error('Profile Incomplete', {
                description: 'Please complete your profile before booking an appointment. This helps us provide better care.',
                duration: 5000,
            });
            return;
        }

        if (!validateForm()) {
            // Get the first error message for better UX
            const firstError = Object.values(errors).find(error => error);
            const errorDescription = firstError
                ? firstError
                : 'Please check all required fields and try again.';

            toast.error('Form Validation Failed', {
                description: errorDescription,
                duration: 4000,
            });
            return;
        }

        setIsSubmitting(true);

        // Show loading toast
        const loadingToast = toast.loading('Creating booking...', {
            description: 'Please wait while we process your appointment request.',
        });

        try {
            // Ensure optometrist ID is set
            if (!formData.optometrist) {
                toast.dismiss(loadingToast);
                toast.error('Doctor Not Selected', {
                    description: 'Please select a doctor to book an appointment with.',
                    duration: 4000,
                });
                setIsSubmitting(false);
                return;
            }

            const response = await createPatientBooking(formData);

            if (response.success) {
                toast.dismiss(loadingToast);
                toast.success('Booking Created Successfully!', {
                    description: `Your appointment request has been sent. You'll receive a confirmation once the doctor accepts.`,
                    duration: 6000,
                });
                setShowSuccessModal(true);

                // Reset form after successful booking
                setFormData({
                    optometrist: formData.optometrist, // Keep the doctor
                    bookingType: 'virtual',
                    appointmentDate: '',
                    startTime: '',
                    endTime: '',
                    reason: ''
                });
            } else {
                toast.dismiss(loadingToast);
                const errorMessage = response.message || 'Failed to create booking. Please try again.';
                toast.error('Booking Failed', {
                    description: errorMessage,
                    duration: 5000,
                });
                console.error('Booking creation failed:', response);
            }
        } catch (error: unknown) {
            console.error('Error creating booking:', error);
            toast.dismiss(loadingToast);
            const errorMessage =
                (error && typeof error === 'object' && 'response' in error &&
                    error.response && typeof error.response === 'object' && 'data' in error.response &&
                    error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
                    ? String(error.response.data.message)
                    : (error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Failed to create booking. Please try again.'));
            toast.error('Booking Error', {
                description: errorMessage,
                duration: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleContinueToFeed = () => {
        setShowSuccessModal(false);
        router.push('/feed');
    };

    const handleCloseProfilePrompt = () => {
        setShowProfilePrompt(false);
    };

    // Generate time slots
    const generateTimeSlots = (): string[] => {
        const slots: string[] = [];
        for (let hour = 8; hour <= 18; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                slots.push(timeString);
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    return (
        <>
            {showProfilePrompt && <ProfileSetupPrompt onClose={handleCloseProfilePrompt} />}
            <main className={`min-h-screen bg-white px-6 py-12 ${showProfilePrompt ? 'pointer-events-none opacity-50' : ''}`}>
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-primary-cyan to-primary-cyan px-8 py-6">
                            <h1 className="text-2xl font-bold text-white mb-2">Book Your Appointment</h1>
                            <p className="text-blue-100">Schedule your visit with our optometrist</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Doctor Bio Card */}
                            {loadingDoctor ? (
                                <div className="flex justify-center py-8">
                                    <WheelLoader />
                                </div>
                            ) : doctorProfile ? (
                                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            {doctorProfile.profile?.photo ? (
                                                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary-cyan ring-offset-2">
                                                    <CloudinaryImage
                                                        src={doctorProfile.profile.photo}
                                                        alt={doctorProfile.user?.fullName || 'Doctor'}
                                                        width={64}
                                                        height={64}
                                                        fallbackSrc="/icons/avatar.png"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-primary-cyan flex items-center justify-center text-white font-semibold text-lg ring-2 ring-primary-cyan ring-offset-2">
                                                    {doctorProfile.user?.fullName?.substring(0, 2).toUpperCase() || 'DR'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-charcoal mb-1">
                                                {doctorProfile.user?.fullName || 'Doctor'}
                                            </h3>
                                            {doctorProfile.profile?.about && (
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {doctorProfile.profile.about}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {/* Booking Type */}
                            <div>
                                <label htmlFor="bookingType" className="block text-sm font-semibold text-charcoal mb-3">
                                    Appointment Type
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${formData.bookingType === 'virtual'
                                        ? 'border-primary-cyan bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="bookingType"
                                            value="virtual"
                                            checked={formData.bookingType === 'virtual'}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div className="flex items-center">
                                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${formData.bookingType === 'virtual'
                                                ? 'border-primary-cyan bg-primary-cyan'
                                                : 'border-gray-300'
                                                }`}>
                                                {formData.bookingType === 'virtual' && (
                                                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-charcoal">Virtual</div>
                                                <div className="text-sm text-grayblue">Online consultation</div>
                                            </div>
                                        </div>
                                    </label>

                                    <label className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${formData.bookingType === 'in-person'
                                        ? 'border-primary-cyan bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="bookingType"
                                            value="in-person"
                                            checked={formData.bookingType === 'in-person'}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div className="flex items-center">
                                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${formData.bookingType === 'in-person'
                                                ? 'border-primary-cyan bg-primary-cyan'
                                                : 'border-gray-300'
                                                }`}>
                                                {formData.bookingType === 'in-person' && (
                                                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-charcoal">In-Person</div>
                                                <div className="text-sm text-grayblue">Visit our clinic</div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Appointment Date */}
                            <div>
                                <label htmlFor="appointmentDate" className="block text-sm font-semibold text-charcoal mb-2">
                                    Appointment Date
                                </label>
                                <input
                                    type="date"
                                    id="appointmentDate"
                                    name="appointmentDate"
                                    value={formData.appointmentDate}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-cyan focus:border-transparent transition-colors ${errors.appointmentDate ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.appointmentDate && (
                                    <p className="mt-1 text-sm text-red-600">{errors.appointmentDate}</p>
                                )}
                            </div>

                            {/* Time Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="startTime" className="block text-sm font-semibold text-charcoal mb-2">
                                        Start Time
                                    </label>
                                    <select
                                        id="startTime"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-cyan focus:border-transparent transition-colors ${errors.startTime ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select start time</option>
                                        {timeSlots.map(time => (
                                            <option key={time} value={time}>
                                                {formatTimeForDisplay(time)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.startTime && (
                                        <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="endTime" className="block text-sm font-semibold text-charcoal mb-2">
                                        End Time
                                    </label>
                                    <select
                                        id="endTime"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-cyan focus:border-transparent transition-colors ${errors.endTime ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select end time</option>
                                        {timeSlots.map(time => (
                                            <option key={time} value={time}>
                                                {formatTimeForDisplay(time)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.endTime && (
                                        <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
                                    )}
                                </div>
                            </div>

                            {/* Reason for Visit */}
                            <div>
                                <label htmlFor="reason" className="block text-sm font-semibold text-charcoal mb-2">
                                    Reason for Visit
                                </label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Please describe your symptoms or reason for the appointment..."
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-cyan focus:border-transparent transition-colors resize-none ${errors.reason ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.reason && (
                                    <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4 flex flex-col gap-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`cursor-pointer w-full py-4 px-6 rounded-full font-semibold text-white transition-all ${isSubmitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-primary-cyan hover:bg-primary-cyan/70 focus:ring-4 focus:ring-blue-200'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Booking Appointment...
                                        </div>
                                    ) : (
                                        <span className='flex items-center justify-center gap-2'>
                                            <Calendar size={18} />
                                            Book Appointment
                                        </span>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="bg-darkgray/10 text-dark w-full py-4 px-6 cursor-pointer rounded-full hover:bg-darkgray/20 transition-colors"
                                    onClick={() => {
                                        if (optometristId && typeof optometristId === 'string') {
                                            showMessages(optometristId);
                                        }
                                    }}
                                >
                                    Message Doctor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="fixed top-0 inset-0 bg-black/50 flex items-center justify-center z-200 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-charcoal mb-2">Booking Confirmed!</h2>
                                <p className="text-grayblue mb-6">
                                    Your appointment has been successfully scheduled for{' '}
                                    <span className="font-semibold">
                                        {new Date(formData.appointmentDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>{' '}
                                    from <span className="font-semibold">{formatTimeForDisplay(formData.startTime)}</span> to{' '}
                                    <span className="font-semibold">{formatTimeForDisplay(formData.endTime)}</span>.
                                </p>
                                <button
                                    onClick={handleContinueToFeed}
                                    className="w-full cursor-pointer bg-primary-cyan hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-blue-200"
                                >
                                    Continue to Feed
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
};

export default BookingPage;