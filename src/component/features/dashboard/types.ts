/**
 * Dashboard Component Types
 * 
 * Type definitions for dashboard-related components.
 */

import { ReactNode } from 'react';

export interface GrowthIndicatorProps {
  percentage: string;
  change: string;
  variant?: 'light' | 'dark';
}

export interface StatCardIconProps {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  variant?: 'primary' | 'secondary';
  hasSpinningBorder?: boolean;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  growthPercentage?: string;
  growthChange?: string;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  hasSpinningBorder?: boolean;
  currency?: string;
}

export interface DashboardGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 4 | 5;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface GridCardProps {
  height?: string;
  colSpan?: number;
  className?: string;
  children?: ReactNode;
}

export interface DashboardHeaderProps {
  userName?: string;
  userRole?: string;
  activeTab?: string;
  onMenuToggle?: () => void;
  isSidebarCollapsed?: boolean;
}

