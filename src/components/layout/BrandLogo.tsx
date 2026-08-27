import React, { useState } from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'auto',
  showText = true,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const iconSizeClasses = {
    sm: 'w-7 h-7 rounded-md',
    md: 'w-8 h-8 sm:w-9 sm:h-9 rounded-lg',
    lg: 'w-10 h-10 sm:w-11 sm:h-11 rounded-xl',
    xl: 'w-13 h-13 sm:w-14 sm:h-14 rounded-2xl',
  };

  const textSizeClasses = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };

  const subtextSizeClasses = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-[10px]',
    xl: 'text-[11px]',
  };

  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center space-x-2.5 sm:space-x-3 select-none flex-nowrap ${className}`}>
      {/* Official District 38 Logo from /logodt38.webp */}
      <div 
        className={`${iconSizeClasses[size]} shrink-0 flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 relative overflow-hidden bg-neutral-950`}
      >
        {!imageError ? (
          <img
            src="/logodt38.webp"
            alt="District 38 Official Logo"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center font-extrabold tracking-tighter"
            style={{ backgroundColor: '#FFE600' }}
          >
            <span className="text-neutral-950 font-bold text-xs">38</span>
          </div>
        )}
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="shrink-0 whitespace-nowrap">
          <div className={`font-extrabold tracking-tight uppercase leading-none ${textSizeClasses[size]} ${
            isDark ? 'text-white' : 'text-neutral-950 group-hover:text-amber-500'
          } transition-colors`}>
            DISTRICT 38
          </div>
          <div className={`uppercase tracking-widest font-semibold mt-1 leading-none ${subtextSizeClasses[size]} ${
            isDark ? 'text-neutral-400' : 'text-neutral-400 hidden sm:block'
          }`}>
            Trichy • Motor Gear
          </div>
        </div>
      )}
    </div>
  );
};

