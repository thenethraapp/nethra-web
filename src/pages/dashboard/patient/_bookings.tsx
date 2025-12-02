import React, { useState, useEffect } from 'react';
import { getPatientBookings } from '@/api/booking/patient/get-patient-bookings';
import { toast } from 'react-toastify';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';

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

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response: BookingsResponse = await getPatientBookings();

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
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Found</h3>
                        <p className="text-gray-600">
                            {filter === 'all' 
                                ? "You haven't booked any appointments yet."
                                : `You don't have any ${filter} appointments.`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            Dr. {booking.optometrist.fullName}
                                        </h3>
                                        <p className="text-sm text-gray-600">{booking.optometrist.email}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusBadgeColor(booking.status)}`}>
                                        {getStatusIcon(booking.status)}
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {formatDate(booking.appointmentDate)}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {formatTimeForDisplay(booking.startTime)} - {formatTimeForDisplay(booking.endTime)}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        {booking.bookingType === 'virtual' ? (
                                            <MapPin className="w-4 h-4 mr-2" />
                                        ) : (
                                            <MapPin className="w-4 h-4 mr-2" />
                                        )}
                                        {booking.bookingType === 'virtual' ? 'Virtual Consultation' : 'In-Person Visit'}
                                    </div>
                                </div>

                                {booking.reason && (
                                    <div className="mb-4 p-3 bg-gray-50 rounded-md">
                                        <p className="text-xs font-medium text-gray-700 mb-1">Reason:</p>
                                        <p className="text-sm text-gray-600">{booking.reason}</p>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBookingTypeColor(booking.bookingType)}`}>
                                        {booking.bookingType.charAt(0).toUpperCase() + booking.bookingType.slice(1)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(booking.createdAt).toLocaleDateString()}
                                    </span>
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

