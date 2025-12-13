/**
 * DashboardGrid Component
 * 
 * Responsive grid container for dashboard cards.
 */

import { DashboardGridProps } from './types';

const gridColumnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-5',
};

const gapClasses = {
  sm: 'gap-4',
  md: 'gap-5',
  lg: 'gap-6',
};

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  children,
  columns = 4,
  gap = 'md',
  className = '',
}) => {
  const gridClass = gridColumnClasses[columns];
  const gapClass = gapClasses[gap];

  return (
    <div className={`grid ${gridClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
};

