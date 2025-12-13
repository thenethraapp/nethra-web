/**
 * StatCard Component
 * 
 * Reusable stat card component for displaying metrics with icons and growth indicators.
 */

import { StatCardProps } from './types';
import { GrowthIndicator } from './GrowthIndicator';
import { StatCardIcon } from './StatCardIcon';

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  growthPercentage,
  growthChange,
  variant = 'secondary',
  loading = false,
  hasSpinningBorder = false,
  currency = '',
}) => {
  const isPrimary = variant === 'primary';
  
  const cardClasses = isPrimary
    ? 'bg-primary-blue rounded-2xl p-5 shadow-lg border border-primary-blue/20 h-[200px] flex flex-col justify-between text-white relative overflow-hidden'
    : 'bg-white rounded-2xl p-5 shadow-lg border border-gray-200 h-[200px] flex flex-col justify-between relative overflow-hidden';

  const titleColor = isPrimary ? 'text-white/80' : 'text-gray-600';
  const valueColor = isPrimary ? 'text-white' : 'text-gray-800';
  const decorativeBg1 = isPrimary ? 'bg-white/5' : 'bg-primary-cyan/5';
  const decorativeBg2 = isPrimary ? 'bg-primary-cyan/10' : 'bg-primary-blue/5';

  const displayValue = currency
    ? `${currency}${typeof value === 'number' ? value.toLocaleString() : value}`
    : typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <div className={cardClasses}>
      {/* Decorative background elements */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${decorativeBg1} rounded-full -mr-16 -mt-16`}></div>
      <div className={`absolute bottom-0 left-0 w-24 h-24 ${decorativeBg2} rounded-full -ml-12 -mb-12`}></div>

      <div className="relative z-10 flex-1 flex flex-col justify-between">
        {/* Top Section */}
        <div className="flex items-start justify-between">
          <StatCardIcon
            icon={icon}
            variant={variant}
            hasSpinningBorder={hasSpinningBorder}
          />

          {growthPercentage && growthChange && (
            <GrowthIndicator
              percentage={growthPercentage}
              change={growthChange}
              variant={isPrimary ? 'light' : 'dark'}
            />
          )}
        </div>

        {/* Bottom Section - Main Metric */}
        <div>
          <p className={`text-sm font-medium ${titleColor} mb-2`}>{title}</p>
          {loading ? (
            <div className={`text-3xl font-bold ${valueColor}`}>...</div>
          ) : (
            <div className={`text-3xl font-bold tracking-tight ${valueColor}`}>
              {displayValue}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

