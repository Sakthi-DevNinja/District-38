import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown,
  MapPin,
  Flame,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { MegaMenu } from './MegaMenu';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { 
    currentRoute, 
    navigate, 
    cartCount, 
    wishlistCount, 
    setIsCartOpen, 
    setIsSearchOpen,
    setIsMobileNavOpen,
    currentUser,
    isAuthenticated,
    logout
  } = useShop();

  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleMobileMenuClick = () => {
    if (onOpenMobileMenu) {
      onOpenMobileMenu();
    } else {
      setIsMobileNavOpen(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', route: '/' },
    { label: 'Shop', route: '/shop' },
    { label: 'Helmets', route: '/helmets', megaKey: 'helmets' },
    { label: 'Riding Gear', route: '/riding-gear', megaKey: 'riding-gear' },
    { label: 'Accessories', route: '/bike-accessories', megaKey: 'accessories' },
    { label: 'Bike Care', route: '/bike-care', megaKey: 'bike-care' },
    { label: 'Brands', route: '/brands' },
    { label: 'Collections', route: '/collections' },
    { label: 'Offers', route: '/offers', highlight: true }
  ];

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200/80 py-3' 
          : 'bg-white border-b border-neutral-100 py-4'
      }`}
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-4 flex-nowrap">
        {/* Left: Mobile Menu Trigger & Logo */}
        <div className="flex items-center space-x-3 sm:space-x-4 shrink-0 flex-nowrap">
          <button
            onClick={handleMobileMenuClick}
            aria-label="Open mobile menu"
            className="lg:hidden p-2 rounded-lg text-neutral-800 hover:bg-neutral-100 transition-colors shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button 
            onClick={() => navigate('/')}
            className="group text-left focus:outline-none shrink-0 whitespace-nowrap"
            aria-label="District 38 Home"
          >
            <BrandLogo size="md" variant="auto" />
          </button>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 shrink-0 flex-nowrap whitespace-nowrap">
          {navLinks.map(link => {
            const isActive = currentRoute === link.route || (link.route !== '/' && currentRoute.startsWith(link.route));
            
            return (
              <div
                key={link.route}
                onMouseEnter={() => link.megaKey ? setActiveMegaMenu(link.megaKey) : setActiveMegaMenu(null)}
                className="relative py-2 shrink-0 whitespace-nowrap"
              >
                <button
                  onClick={() => {
                    setActiveMegaMenu(null);
                    navigate(link.route);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all flex items-center space-x-1 whitespace-nowrap shrink-0 select-none ${
                    link.highlight
                      ? 'text-orange-600 hover:bg-orange-50 font-bold'
                      : isActive
                      ? 'text-neutral-950 bg-neutral-100 font-bold'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
                  }`}
                >
                  {link.highlight && <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20 mr-0.5 shrink-0" />}
                  <span className="whitespace-nowrap">{link.label}</span>
                  {link.megaKey && (
                    <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform shrink-0 ${activeMegaMenu === link.megaKey ? 'rotate-180 text-neutral-900' : ''}`} />
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        {/* Right Actions: Search, Account, Wishlist, Cart */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0 flex-nowrap">
          {/* Quick Store Link */}
          <button
            onClick={() => navigate('/contact')}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200/80 transition-colors whitespace-nowrap shrink-0 select-none"
          >
            <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            <span className="whitespace-nowrap">Trichy Store</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search gear"
            className="p-2 rounded-md text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors shrink-0"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Account Trigger */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setIsAccountMenuOpen(!isAccountMenuOpen);
                } else {
                  navigate('/login');
                }
              }}
              aria-label="User Account"
              className="p-2 rounded-md text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors relative shrink-0"
            >
              <User className="w-4 h-4" />
              {isAuthenticated && (
                <span className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white shrink-0" />
              )}
            </button>

            {/* Account Dropdown */}
            {isAccountMenuOpen && isAuthenticated && (
              <div 
                onMouseLeave={() => setIsAccountMenuOpen(false)}
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50 text-neutral-900 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-4 py-2 border-b border-neutral-100">
                  <div className="text-xs font-bold text-neutral-900 truncate">{currentUser?.name}</div>
                  <div className="text-[11px] text-neutral-500 truncate">{currentUser?.email}</div>
                  <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-50 text-orange-700 whitespace-nowrap">
                    {currentUser?.riderPoints || 0} Rider Points
                  </div>
                </div>

                <button
                  onClick={() => { navigate('/account'); setIsAccountMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 font-medium whitespace-nowrap"
                >
                  Account Dashboard
                </button>
                <button
                  onClick={() => { navigate('/account/orders'); setIsAccountMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 font-medium whitespace-nowrap"
                >
                  My Orders & Tracking
                </button>
                <button
                  onClick={() => { navigate('/account/addresses'); setIsAccountMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 font-medium whitespace-nowrap"
                >
                  Saved Addresses
                </button>
                <button
                  onClick={() => { navigate('/account/profile'); setIsAccountMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 font-medium whitespace-nowrap"
                >
                  My Garage & Profile
                </button>

                <div className="border-t border-neutral-100 mt-1 pt-1">
                  <button
                    onClick={() => { logout(); setIsAccountMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium whitespace-nowrap"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Wishlist Trigger */}
          <button
            onClick={() => navigate('/wishlist')}
            aria-label="Wishlist"
            className="p-2 rounded-md text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors relative shrink-0"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-neutral-900 text-white text-[10px] font-bold whitespace-nowrap shrink-0">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping Cart"
            className="p-2 rounded-md text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors relative shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-orange-600 text-white text-[10px] font-bold animate-in zoom-in whitespace-nowrap shrink-0">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Global Mega Menu Container */}
      <div onMouseLeave={() => setActiveMegaMenu(null)}>
        <MegaMenu activeMenu={activeMegaMenu} onClose={() => setActiveMegaMenu(null)} />
      </div>
    </header>
  );
};
