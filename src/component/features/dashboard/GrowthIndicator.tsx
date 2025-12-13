/**
 * GrowthIndicator Component
 * 
 * Displays growth percentage and change indicator.
 * Shows up arrow (green) for positive growth, down arrow (red) for negative growth.
 */

import { HiArrowUp, HiArrowDown } from 'react-icons/hi';
import { GrowthIndicatorProps } from './types';

export const GrowthIndicator: React.FC<GrowthIndicatorProps> = ({
  percentage,
  change,
  variant = 'dark',
}) => {
  const textColor = variant === 'light' ? 'text-white/70' : 'text-gray-500';
  
  // Determine if growth is positive or negative
  const isPositive = !percentage.startsWith('-');
  const isNegative = percentage.startsWith('-');
  
  // Set colors based on growth direction
  const percentageColor = isPositive
    ? variant === 'light'
      ? 'text-primary-cyan'
      : 'text-green-600'
    : variant === 'light'
    ? 'text-red-300'
    : 'text-red-600';

  const ArrowIcon = isPositive ? HiArrowUp : HiArrowDown;

  return (
    <div className="text-right">
      <div className={`flex items-center gap-1 ${percentageColor} mb-1`}>
        <ArrowIcon size={14} />
        <span className="text-sm font-semibold">{percentage}</span>
      </div>
      <p className={`text-xs ${textColor}`}>{change}</p>
    </div>
  );
};

