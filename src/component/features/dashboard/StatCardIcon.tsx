/**
 * StatCardIcon Component
 * 
 * Icon container for stat cards with optional spinning border.
 */

import { StatCardIconProps } from './types';

export const StatCardIcon: React.FC<StatCardIconProps> = ({
  icon: Icon,
  variant = 'secondary',
  hasSpinningBorder = false,
}) => {
  const baseClasses = 'w-12 h-12 rounded-full flex items-center justify-center';
  
  const variantClasses = variant === 'primary'
    ? 'bg-white/10 backdrop-blur-sm border border-white/20'
    : 'bg-primary-cyan/10 border border-primary-cyan/20';

  const iconColor = variant === 'primary' ? 'text-white' : 'text-primary-cyan';
  const borderClass = hasSpinningBorder ? 'spinning-cyan-border' : '';

  // Safety check for undefined icon
  if (!Icon) {
    return (
      <div className={`${baseClasses} ${variantClasses} ${borderClass}`}>
        <div className={`w-6 h-6 ${iconColor}`} />
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${variantClasses} ${borderClass}`}>
      <Icon size={24} className={iconColor} />
    </div>
  );
};

