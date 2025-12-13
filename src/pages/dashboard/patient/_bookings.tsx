import React, { useState, useEffect, useCallback } from 'react';
import { getPatientBookings } from '@/api/booking/patient/get-patient-bookings';
import { toast } from 'sonner';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, Clock as ClockIcon, MessageSquare, Plus } from 'lucide-react';
import { useMessagesStore } from '@/store/useMessagesStore';
import { useMutation } from '@tanstack/react-query';
import { createConversation } from '@/api/messaging/conversations/createConversation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Optometrist {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
}

interface Booking {
    _id: string;
    optometrist: Optometrist;
    bookingType: 'in-person' | 'virtual';
    appointmentDate: string;
    startTime: string;
    endTime: string;
    status: 'pending' | 'accepted' | 'declined' | 'completed';
    reason: string;
    createdAt: string;
    updatedAt: string;
}

interface BookingsResponse {
    success: boolean;
    data?: Booking[];
    message?: string;
}

const PatientBookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined' | 'completed'>('all');
    const { show: showMessages } = useMessagesStore();
    const { user } = useAuth();

    // Mutation to create conversation and open messaging
    const createConversationMutation = useMutation({
        mutationFn: (optometristId: string) => createConversation({
            otherUserId: optometristId,
            otherUserType: 'optometrist',
            metadata: {}
        }),
        onSuccess: (data) => {
            showMessages(data.conversation.participants.find(p => p.userId !== user?.id)?.userId || '');
            toast.success('Opening conversation...');
        },
        onError: (error: Error) => {
            toast.error('Failed to open conversation');
            console.error('Error creating conversation:', error);
        }
    });

    const handleMessageClick = async (optometristId: string) => {
        try {
            await createConversationMutation.mutateAsync(optometristId);
        } catch {
            // Error handled in mutation
        }
    };

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            const response: BookingsResponse = await getPatientBookings();

            console.log('📋 Bookings response:', response);

            if (response.success && response.data) {
                console.log(`✅ Loaded ${response.data.length} bookings`);
                setBookings(response.data);
            } else {
                console.error('❌ Failed to fetch bookings:', response.message);
                toast.error(response.message || 'Failed to fetch bookings');
            }
        } catch (error) {
            console.error('❌ Error fetching bookings:', error);
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // Refresh bookings when component becomes visible (e.g., after navigation)
    useEffect(() => {
        const handleFocus = () => {
            fetchBookings();
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [fetchBookings]);

    const formatTimeForDisplay = (time: string): string => {
        if (!time) return '';

        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

        return `${displayHour}:${minutes} ${ampm}`;
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadgeColor = (status: string): string => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'declined':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'accepted':
                return <CheckCircle className="w-4 h-4" />;
            case 'declined':
                return <XCircle className="w-4 h-4" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4" />;
            case 'pending':
            default:
                return <ClockIcon className="w-4 h-4" />;
        }
    };

    const getBookingTypeColor = (type: string): string => {
        return type === 'virtual' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
    };

    const getFilterCount = (filterKey: string): number => {
        if (filterKey === 'all') return bookings.length;
        return bookings.filter(b => b.status === filterKey).length;
    };

    const filteredBookings = filter === 'all'
        ? bookings
        : bookings.filter(booking => booking.status === filter);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-cyan"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="w-full mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
                    <p className="text-gray-600">View and manage your booked appointments</p>
                </div>

                {/* Filter Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8">
                            {[
                                { key: 'all', label: 'All Appointments' },
                                { key: 'pending', label: 'Pending' },
                                { key: 'accepted', label: 'Accepted' },
                                { key: 'declined', label: 'Declined' },
                                { key: 'completed', label: 'Completed' }
                            ].map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setFilter(key as typeof filter)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${filter === key
                                        ? 'border-blue-500 text-vividblue'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {label} ({getFilterCount(key)})
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Bookings Grid */}
                {filteredBookings.length === 0 ? (
                    filter === 'all' ? (
                        // Standby Widget - No appointments at all
                        <div className="rounded-xl p-8 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-20 h-20 bg-primary-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Calendar className="w-10 h-10 text-primary-cyan" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Appointments Yet</h3>
                                <p className="text-gray-600 mb-6">
                                    Ready to book an appointment? Browse our network of qualified optometrists near you and schedule your eye care visit.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Link
                                        href="/booking"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-cyan text-white rounded-lg font-medium hover:bg-primary-cyan/90 transition-colors shadow-md hover:shadow-lg"
                                    >
                                        <Plus size={20} />
                                        Book Appointment
                                    </Link>
                                    <Link
                                        href="/feed"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary-cyan border-2 border-primary-cyan rounded-lg font-medium hover:bg-primary-cyan/5 transition-colors"
                                    >
                                        <User size={20} />
                                        Find Optometrist
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Filtered empty state
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No {filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments</h3>
                            <p className="text-gray-600">
                                You {"don't"} have any {filter} appointments.
                            </p>
                        </div>
                    )
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                            >
                                {/* Status Header Bar */}
                                <div className={`h-1 ${booking.status === 'accepted' ? 'bg-green-500' : booking.status === 'pending' ? 'bg-yellow-500' : booking.status === 'declined' ? 'bg-red-500' : 'bg-blue-500'}`} />

                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                Dr. {booking.optometrist.fullName}
                                            </h3>
                                            <p className="text-sm text-gray-500">{booking.optometrist.email}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap ${getStatusBadgeColor(booking.status)}`}>
                                            {getStatusIcon(booking.status)}
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    </div>

                                    {/* Appointment Details Card */}
                                    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-lg p-4 mb-4 border border-gray-100">
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <Calendar className="w-4 h-4 text-primary-cyan" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-500 mb-0.5">Date</p>
                                                    <p className="text-sm font-semibold text-gray-900">{formatDate(booking.appointmentDate)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <Clock className="w-4 h-4 text-primary-cyan" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-500 mb-0.5">Time</p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {formatTimeForDisplay(booking.startTime)} - {formatTimeForDisplay(booking.endTime)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <MapPin className="w-4 h-4 text-primary-cyan" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-500 mb-0.5">Type</p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {booking.bookingType === 'virtual' ? 'Virtual Consultation' : 'In-Person Visit'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reason */}
                                    {booking.reason && (
                                        <div className="mb-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                                            <p className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-primary-cyan rounded-full"></span>
                                                Reason for Visit
                                            </p>
                                            <p className="text-sm text-gray-700 leading-relaxed">{booking.reason}</p>
                                        </div>
                                    )}

                                    {/* Footer Actions */}
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getBookingTypeColor(booking.bookingType)}`}>
                                            {booking.bookingType.charAt(0).toUpperCase() + booking.bookingType.slice(1)}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {/* Message Icon - Only show for accepted bookings */}
                                            {booking.status === 'accepted' && (
                                                <button
                                                    onClick={() => handleMessageClick(booking.optometrist._id)}
                                                    disabled={createConversationMutation.isPending}
                                                    className="p-2 text-primary-cyan hover:bg-primary-cyan/10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
                                                    title="Message doctor"
                                                    aria-label="Message doctor"
                                                >
                                                    <MessageSquare size={18} />
                                                </button>
                                            )}
                                            <span className="text-xs text-gray-400">
                                                {new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientBookings;

