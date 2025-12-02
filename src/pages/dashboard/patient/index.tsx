import { useState } from 'react';
import Overview from './_overview';
import { Menu } from 'lucide-react';
import EditProfile from './_editProfile';
import Help from '@/component/features/dashboard/help';
import { useAuth } from '@/context/AuthContext';
import Messages from '@/component/features/messages/Messages';
import SideBar from '../../../component/features/dashboard/sideBar';
import PaymentSettings from '@/component/features/dashboard/paymentSettings';
import AIAgent from './_aiAgent';
import PatientBookings from './_bookings';

const PatientDashboard = () => {

    const { logout } = useAuth();

    const [activeTab, setActiveTab] = useState('ai_agent');
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const [userData, setUserData] = useState(null);

    const renderContent = () => {
        switch (activeTab) {
            case 'ai_agent':
                return <AIAgent />;

            case 'bookings':
                return <PatientBookings />;

            case 'payment_settings':
                return <PaymentSettings />;

            case 'messages':
                return <Messages />;

            case 'profile':
                return <EditProfile />;

            case 'help':
                return <Help />;

            default:
                return <Overview
                />;
        }
    };


    return (
        <>
            <div className="min-h-screen -mt-[100px]">
                {/* Sidebar - Pass userData to SideBar */}
                <SideBar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setIsMobileOpen}
                    onLogout={logout}
                    userData={userData}
                />

                <div className="lg:ml-80 ">
                    <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="text-grayblue hover:text-charcoal"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-lg font-semibold text-charcoal capitalize">
                            {activeTab}
                        </h1>
                        <div></div>
                    </div>

                    <div className="p-6 bg-gray-50">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </>
    )
}

export default PatientDashboard;