/**
 * ModernSidebar Component
 * 
 * Main sidebar component with navigation items.
 * Handles state management for expanded/collapsed items.
 * Matches admin dashboard design.
 */

import { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import Logo from '@/component/common/UI/Logo';
import { SidebarItem, NavigationItem } from './SidebarItem';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Calendar,
  FileText,
  DollarSign,
  ShoppingCart,
  X,
} from 'lucide-react';
import { FaStarOfLife } from 'react-icons/fa6';
import { ImProfile } from 'react-icons/im';
import { HiLogout } from 'react-icons/hi';

interface ModernSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onLogout: () => void;
  userData?: {
    user?: {
      role?: string;
    };
  } | null;
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
  onLogout,
  userData,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Get user role from userData or fallback to context
  const userRole = userData?.user?.role || user?.role || 'patient';

  // Menu items configuration based on role
  const getMenuItemsByRole = (role: string): NavigationItem[] => {
    switch (role) {
      case 'optometrist':
        return [
          { id: 'overview', label: 'Overview', icon: User, type: 'link' },
          { id: 'patient_records', label: 'Patient Records', icon: FileText, type: 'link' },
          { id: 'bookings', label: 'Bookings', icon: Calendar, type: 'link' },
          { id: 'profile', label: 'Profile', icon: ImProfile, type: 'link' },
        ];

      case 'patient':
        return [
          { id: 'ai_agent', label: 'Nethra Super Agent', icon: FaStarOfLife, type: 'link' },
          { id: 'bookings', label: 'Bookings', icon: Calendar, type: 'link' },
          { id: 'medical_history', label: 'Medical History', icon: FileText, type: 'link' },
          { id: 'payment_settings', label: 'Payment Settings', icon: DollarSign, type: 'link' },
          { id: 'shopping', label: 'Shopping History', icon: ShoppingCart, type: 'link' },
        ];

      default:
        return [
          { id: 'overview', label: 'Overview', icon: User, type: 'link' },
          { id: 'bookings', label: 'Bookings', icon: Calendar, type: 'link' },
        ];
    }
  };

  const menuItems = getMenuItemsByRole(userRole);
  const footerItems: NavigationItem[] = [
    {
      id: 'logout',
      label: 'Logout',
      icon: HiLogout,
      type: 'link',
      action: onLogout,
    },
  ];

  // Determine active item based on current tab
  const getActiveItemId = useMemo(() => {
    return activeTab;
  }, [activeTab]);

  const handleToggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleNavigate = (path: string) => {
    // For Pages Router, we'll use setActiveTab instead
    const tabFromPath = path.split('/').pop() || path;
    setActiveTab(tabFromPath);
    setIsMobileOpen(false);
  };

  const handleItemClick = (item: NavigationItem) => {
    if (item.action) {
      item.action();
    } else if (item.id) {
      setActiveTab(item.id);
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full bg-primary-blue text-white transition-all duration-300 ease-in-out z-50 w-72
          flex flex-col
          hidden lg:flex
        `}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-center border-b border-white/20 px-4">
          <div onClick={() => router.push('/')} className="cursor-pointer">
            <Logo width={80} height={46} />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6 space-y-2 sidebar-scrollbar">
          {menuItems.map((item) => {
            const isActive = getActiveItemId === item.id;
            const isExpanded = expandedItems.has(item.id);

            return (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={isActive}
                isExpanded={isExpanded}
                onToggleExpand={() => handleToggleExpand(item.id)}
                onNavigate={handleNavigate}
                onClick={handleItemClick}
              />
            );
          })}
        </nav>

        {/* Footer Items (Logout) */}
        <div className="border-t border-white/20 py-4 px-4">
          {footerItems.map((item) => {
            const isActive = getActiveItemId === item.id;

            return (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={isActive}
                isExpanded={false}
                onToggleExpand={() => { }}
                onNavigate={handleNavigate}
                onClick={handleItemClick}
              />
            );
          })}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          lg:hidden fixed left-0 top-0 h-full bg-primary-blue text-white transition-transform duration-300 ease-in-out z-50 w-72
          flex flex-col
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile Header */}
        <div className="h-20 flex items-center justify-between border-b border-white/20 px-4">
          <div onClick={() => router.push('/')} className="cursor-pointer">
            <Logo width={80} height={46} />
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="text-white hover:text-white/80 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6 space-y-2 sidebar-scrollbar">
          {menuItems.map((item) => {
            const isActive = getActiveItemId === item.id;
            const isExpanded = expandedItems.has(item.id);

            return (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={isActive}
                isExpanded={isExpanded}
                onToggleExpand={() => handleToggleExpand(item.id)}
                onNavigate={handleNavigate}
                onClick={handleItemClick}
              />
            );
          })}
        </nav>

        {/* Footer Items (Logout) */}
        <div className="border-t border-white/20 py-4 px-4">
          {footerItems.map((item) => {
            const isActive = getActiveItemId === item.id;

            return (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={isActive}
                isExpanded={false}
                onToggleExpand={() => { }}
                onNavigate={handleNavigate}
                onClick={handleItemClick}
              />
            );
          })}
        </div>
      </aside>
    </>
  );
};

