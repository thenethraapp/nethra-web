/**
 * GridCard Component
 * 
 * Container card for dashboard content sections.
 */

import { GridCardProps } from './types';

const colSpanClasses: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
};

export const GridCard: React.FC<GridCardProps> = ({
  height = 'h-[250px]',
  colSpan,
  className = '',
  children,
}) => {
  const colSpanClass = colSpan ? colSpanClasses[colSpan] || '' : '';

  return (
    <div
      className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-200 ${height} ${colSpanClass} ${className}`}
    >
      {children}
    </div>
  );
};

