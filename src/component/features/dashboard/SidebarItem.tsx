/**
 * SidebarItem Component
 * 
 * Individual navigation item component with support for
 * links and dropdowns. Handles active states and interactions.
 */

import React from 'react';
import { HiChevronDown, HiChevronRight } from 'react-icons/hi';

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  path?: string;
  type?: 'link' | 'dropdown';
  subItems?: Array<{
    id: string;
    label: string;
    path: string;
    badge?: number | string;
  }>;
  badge?: number | string;
  action?: () => void;
}

interface SidebarItemProps {
  item: NavigationItem;
  isActive: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onNavigate: (path: string) => void;
  onClick?: (item: NavigationItem) => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isActive,
  isExpanded,
  onToggleExpand,
  onNavigate,
  onClick,
}) => {
  const Icon = item.icon;
  const isDropdown = item.type === 'dropdown' && item.subItems;
  const isLogout = item.id === 'logout';

  const handleClick = () => {
    if (item.action) {
      item.action();
      return;
    }

    if (isDropdown) {
      onToggleExpand();
    } else if (item.path) {
      onNavigate(item.path);
    } else if (onClick) {
      onClick(item);
    }
  };

  const handleSubItemClick = (path: string) => {
    onNavigate(path);
  };

  return (
    <div className="w-full pl-4">
      {/* Main Item */}
      <button
        onClick={handleClick}
        className={`
          w-full flex items-center justify-between px-4 py-3
          transition-all duration-200 group rounded-l-full
          ${isActive
            ? 'bg-white/20 text-white shadow-md '
            : 'text-white/90 hover:bg-white/10 hover:text-white '
          }
          ${isLogout ? 'hover:bg-red-500/20 hover:text-red-200' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <Icon
              size={20}
              className={isActive ? 'text-primary-cyan' : 'text-white/80 group-hover:text-white'}
            />
          )}
          <div className="flex items-center gap-2 relative">
            <span className="font-medium text-sm">{item.label}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {item.badge && item.id !== 'waitlist' ? (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-cyan text-white">
              {item.badge}
            </span>
          ) : null}
          {isDropdown && (
            isExpanded ? (
              <HiChevronDown size={16} className={isActive ? 'text-white' : 'text-white/70'} />
            ) : (
              <HiChevronRight size={16} className={isActive ? 'text-white' : 'text-white/70'} />
            )
          )}
        </div>
      </button>

      {/* Dropdown Items */}
      {isDropdown && isExpanded && item.subItems && (
        <div className="mt-2 ml-4 space-y-1 border-l-2 border-white/20 pl-4">
          {item.subItems.map((subItem) => (
            <button
              key={subItem.id}
              onClick={() => handleSubItemClick(subItem.path)}
              className={`
                w-full text-left px-4 py-2.5 rounded-l-full text-sm
                transition-all duration-200
                text-white/80 hover:bg-white/10 hover:text-white
              `}
            >
              <div className="flex items-center justify-between">
                <span>{subItem.label}</span>
                {subItem.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-cyan text-white">
                    {subItem.badge}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

