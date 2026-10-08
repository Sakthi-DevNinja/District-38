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

  // The real logo file (public/brand/logodt38.webp) is a wide 3:1
  // wordmark lockup (150×50). Fixed, moderately-wide boxes here keep it
  // from eating too much horizontal space — object-cover below lets the
  // outer edges crop slightly rather than shrinking the whole mark down
  // to fit, and there's no background chip since the logo itself is
  // transparent.
  const iconSizeClasses = {
    sm: 'w-9 h-6 rounded-md',
    md: 'w-11 h-7 sm:w-12 sm:h-8 rounded-lg',
    lg: 'w-14 h-9 sm:w-16 sm:h-10 rounded-xl',
    xl: 'w-16 h-10 sm:w-20 sm:h-12 rounded-2xl',
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
      {/* Official District 38 Logo from /brand/logodt38.webp — transparent,
          no background chip. */}
      <div
        className={`${iconSizeClasses[size]} shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 relative overflow-hidden`}
      >
        {!imageError ? (
          <img
            src="/brand/logodt38.webp"
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
            Motor Gear
          </div>
        </div>
      )}
    </div>
  );
};

