import React from 'react';
import { 
  Home, 
  Compass, 
  Search, 
  Heart, 
  ShoppingBag, 
  X, 
  ChevronRight, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  User, 
  Flame,
  FileText,
  HelpCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../data/categories';
import { DISTRICT_38_STORE } from '../../data/storeInfo';
import { BrandLogo } from './BrandLogo';

interface MobileNavProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen: propIsOpen, onClose: propOnClose }) => {
  const { 
    currentRoute, 
    navigate, 
    cartCount, 
    wishlistCount, 
    setIsCartOpen, 
    setIsSearchOpen,
    isMobileNavOpen,
    setIsMobileNavOpen,
    isAuthenticated,
    currentUser,
    logout
  } = useShop();

  const isDrawerOpen = propIsOpen !== undefined ? propIsOpen : isMobileNavOpen;
  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      setIsMobileNavOpen(false);
    }
  };

  const bottomItems = [
    { label: 'Home', icon: Home, route: '/' },
    { label: 'Shop', icon: Compass, route: '/shop' },
    { 
      label: 'Search', 
      icon: Search, 
      action: () => setIsSearchOpen(true) 
    },
    { 
      label: 'Wishlist', 
      icon: Heart, 
      route: '/wishlist',
      badge: wishlistCount 
    },
    { 
      label: 'Cart', 
      icon: ShoppingBag, 
      action: () => setIsCartOpen(true),
      badge: cartCount 
    }
  ];

  return (
    <>
      {/* 1. Mobile Bottom Sticky Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-5 gap-1">
          {bottomItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = item.route && (currentRoute === item.route || (item.route !== '/' && currentRoute.startsWith(item.route)));

            return (
              <button
                key={idx}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else if (item.route) {
                    navigate(item.route);
                  }
                }}
                className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors relative whitespace-nowrap shrink-0 ${
                  isActive ? 'text-orange-600' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <div className="relative shrink-0">
                  <Icon className="w-5 h-5" />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-orange-600 text-white text-[10px] font-bold whitespace-nowrap">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[10px] font-medium tracking-tight mt-0.5 whitespace-nowrap select-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Mobile Drawer Menu */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            onClick={handleClose} 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs" 
          />

          {/* Drawer Content */}
          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <button onClick={() => { navigate('/'); handleClose(); }} className="text-left focus:outline-none">
                <BrandLogo size="sm" />
              </button>
              <button
                onClick={handleClose}
                aria-label="Close menu"
                className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Account Quick Card */}
              {isAuthenticated ? (
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="text-xs font-bold text-neutral-900">{currentUser?.name}</div>
                  <div className="text-[11px] text-neutral-500">{currentUser?.email}</div>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => { navigate('/account'); handleClose(); }}
                      className="px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-900 text-white"
                    >
                      Account
                    </button>
                    <button
                      onClick={() => { logout(); handleClose(); }}
                      className="px-2.5 py-1 text-xs font-medium rounded-md text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-neutral-950 text-white rounded-xl">
                  <div className="text-xs font-bold">Rider Membership</div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Sign in to track orders, save bike specs & earn points.</p>
                  <button
                    onClick={() => { navigate('/login'); handleClose(); }}
                    className="mt-2.5 w-full py-1.5 rounded-lg bg-orange-600 text-white text-xs font-bold tracking-wide"
                  >
                    Sign In / Register
                  </button>
                </div>
              )}

              {/* Main Nav Categories */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 px-1">
                  Explore Gear
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => { navigate('/shop'); handleClose(); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                  >
                    <span>All Products</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => { navigate('/helmets'); handleClose(); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                  >
                    <span>Helmets (ECE 22.06)</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => { navigate('/riding-gear'); handleClose(); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                  >
                    <span>Riding Apparel</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => { navigate('/bike-accessories'); handleClose(); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                  >
                    <span>Bike Accessories</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => { navigate('/bike-care'); handleClose(); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                  >
                    <span>Bike Care & Lubricants</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>
              </div>

              {/* Brands & Collections */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 px-1">
                  Discover
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => { navigate('/brands'); handleClose(); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    <span>Official Brands Directory</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => { navigate('/collections'); handleClose(); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    <span>Curated Collections</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => { navigate('/offers'); handleClose(); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-bold text-orange-600 hover:bg-orange-50"
                  >
                    <span className="flex items-center space-x-1.5">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span>Promotions & Deals</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-orange-400" />
                  </button>
                  <button
                    onClick={() => { navigate('/guides'); handleClose(); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    <span>Riding & Sizing Guides</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>
              </div>

              {/* Physical Store & Help */}
              <div className="pt-2 border-t border-neutral-100 space-y-2">
                <button
                  onClick={() => { navigate('/contact'); handleClose(); }}
                  className="w-full flex items-center space-x-2.5 p-2.5 rounded-lg text-xs font-semibold text-neutral-900 bg-neutral-50 hover:bg-neutral-100"
                >
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <div className="text-left">
                    <div>Trichy Retail Store</div>
                    <div className="text-[10px] text-neutral-500 font-normal">75/c Alsa Complex, Salai Road</div>
                  </div>
                </button>
                
                <a
                  href={`tel:${DISTRICT_38_STORE.phone}`}
                  className="w-full flex items-center space-x-2.5 p-2.5 rounded-lg text-xs font-semibold text-neutral-900 hover:bg-neutral-50"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span>Call Store: {DISTRICT_38_STORE.phone}</span>
                </a>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50 text-[11px] text-neutral-500 flex justify-between items-center">
              <span>District 38 © 2026</span>
              <button onClick={() => { navigate('/faq'); handleClose(); }} className="underline hover:text-neutral-800">
                FAQ & Help
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
