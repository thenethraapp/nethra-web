import React, { useState, useEffect } from 'react';
import { getAllOptometristBookings } from '@/api/booking';
import { acceptBooking } from '@/api/booking';
import { declineBooking } from '@/api/booking';
import { toast } from 'react-toastify';
import WheelLoader from '@/component/common/UI/WheelLoader';

interface Patient {
    _id: string;
    email: string;
    phone: string;
    username: string;
}

interface Booking {
    _id: string;
    patient: Patient;
    optometrist: string;
    bookingType: 'in-person' | 'virtual';
    appointmentDate: string;
    startTime: string;
    endTime: string;
    status: 'pending' | 'accepted' | 'declined';
    reason: string;
    createdAt: string;
    updatedAt: string;
}

interface BookingsResponse {
    success: boolean;
    data: Booking[];
    message?: string;
}

const Bookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [actionLoading, setActionLoading] = useState<string>('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await getAllOptometristBookings();

            if (response.success && response.data) {
                setBookings(response.data);
            } else {
                toast.error(response.message || 'Failed to fetch bookings');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

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
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'declined':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getBookingTypeColor = (type: string): string => {
        switch (type) {
            case 'in-person':
                return 'bg-blue-100 text-blue-800';
            case 'virtual':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleAcceptBooking = async (bookingId: string) => {
        try {
            setActionLoading(`accept-${bookingId}`);
            const response = await acceptBooking(bookingId);

            if (response.success) {
                toast.success('Booking accepted successfully!');
                await fetchBookings(); // Refresh bookings
                setSelectedBooking(null);
            } else {
                toast.error(response.message || 'Failed to accept booking');
            }
        } catch (error) {
            console.error('Error accepting booking:', error);
            toast.error('Failed to accept booking');
        } finally {
            setActionLoading('');
        }
    };

    const handleDeclineBooking = async (bookingId: string) => {
        try {
            setActionLoading(`decline-${bookingId}`);
            const response = await declineBooking(bookingId);

            if (response.success) {
                toast.success('Booking declined successfully!');
                await fetchBookings(); // Refresh bookings
                setSelectedBooking(null);
            } else {
                toast.error(response.message || 'Failed to decline booking');
            }
        } catch (error) {
            console.error('Error declining booking:', error);
            toast.error('Failed to decline booking');
        } finally {
            setActionLoading('');
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        return booking.status === filter;
    });

    const getFilterCount = (status: string): number => {
        if (status === 'all') return bookings.length;
        return bookings.filter(booking => booking.status === status).length;
    };

    if (loading) {
        return (
            <WheelLoader />
        );
    }

    return (
        <div className="min-h-screen">
            <div className="w-full mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Bookings</h1>
                    <p className="text-gray-600">Manage your patient appointments</p>
                </div>

                {/* Filter Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8">
                            {[
                                { key: 'all', label: 'All Bookings' },
                                { key: 'pending', label: 'Pending' },
                                { key: 'accepted', label: 'Accepted' },
                                { key: 'declined', label: 'Declined' }
                            ].map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setFilter(key as 'all' | 'pending' | 'accepted' | 'declined')}
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
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1h4z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                        <p className="text-gray-600">
                            {filter === 'all'
                                ? "You don't have any bookings yet."
                                : `No ${filter} bookings found.`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => setSelectedBooking(booking)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            {booking.patient.username}
                                        </h3>
                                        <p className="text-sm text-gray-600">{booking.patient.email}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(booking.status)}`}>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1-1H4a1 1 0 01-1-1V8a1 1 0 011-1h4z" />
                                        </svg>
                                        {formatDate(booking.appointmentDate)}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {formatTimeForDisplay(booking.startTime)} - {formatTimeForDisplay(booking.endTime)}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBookingTypeColor(booking.bookingType)}`}>
                                        {booking.bookingType.charAt(0).toUpperCase() + booking.bookingType.slice(1)}
                                    </span>
                                    <button className="cursor-pointer text-vividblue text-sm font-medium hover:text-blue-700">
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Booking Details Modal */}
                {selectedBooking && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Details</h2>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(selectedBooking.status)}`}>
                                            {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedBooking(null)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Patient Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Patient Information</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Name:</span>
                                            <span className="font-medium text-gray-900">{selectedBooking.patient.username}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-medium text-gray-900">{selectedBooking.patient.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phone:</span>
                                            <span className="font-medium text-gray-900">{selectedBooking.patient.phone}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment Details */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Appointment Details</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Type:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBookingTypeColor(selectedBooking.bookingType)}`}>
                                                {selectedBooking.bookingType.charAt(0).toUpperCase() + selectedBooking.bookingType.slice(1)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Date:</span>
                                            <span className="font-medium text-gray-900">{formatDate(selectedBooking.appointmentDate)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Time:</span>
                                            <span className="font-medium text-gray-900">
                                                {formatTimeForDisplay(selectedBooking.startTime)} - {formatTimeForDisplay(selectedBooking.endTime)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Created:</span>
                                            <span className="font-medium text-gray-900">
                                                {new Date(selectedBooking.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Reason for Visit */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Reason for Visit</h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700">{selectedBooking.reason}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {selectedBooking.status === 'pending' && (
                                    <div className="flex space-x-4 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={() => handleDeclineBooking(selectedBooking._id)}
                                            disabled={actionLoading.includes(selectedBooking._id)}
                                            className="cursor-pointer flex-1 bg-red-800 hover:bg-red-800/70 disabled:bg-red-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                                        >
                                            {actionLoading === `decline-${selectedBooking._id}` ? (
                                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                'Decline'
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleAcceptBooking(selectedBooking._id)}
                                            disabled={actionLoading.includes(selectedBooking._id)}
                                            className="cursor-pointer flex-1 bg-deepteal hover:bg-deepteal/70 disabled:bg-deepteal/30 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                                        >
                                            {actionLoading === `accept-${selectedBooking._id}` ? (
                                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                'Accept'
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookings;