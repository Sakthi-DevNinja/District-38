import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Truck,
  CreditCard,
  ArrowRight, 
  Check, 
  Instagram, 
  Youtube, 
  Facebook 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { DISTRICT_38_STORE } from '../../data/storeInfo';
import { BrandLogo } from './BrandLogo';
import { useCategoryTree } from '../../hooks/use-category-tree';

export const Footer: React.FC = () => {
  const { navigate, showToast } = useShop();
  const { tree } = useCategoryTree();
  // Top-level categories first, then subcategories, capped to keep the column short.
  const footerCategories = [...tree, ...tree.flatMap(c => c.children)].slice(0, 6);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid rider email address', 'warning');
      return;
    }
    setIsSubscribed(true);
    showToast('Subscribed to District 38 ride drops and VIP deals!', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-800 text-xs w-full">
      {/* 1. Global Trust Bar — inline icon + text ribbon, matching the
          homepage's trust strip presentation. */}
      <div className="border-b border-neutral-800/80 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y divide-neutral-800/80 sm:divide-y-0 sm:divide-x sm:divide-neutral-800/80">
          <div className="flex items-center justify-center gap-3 py-4 sm:py-5 sm:px-6">
            <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />
            <div className="text-center sm:text-left">
              <span className="text-xs sm:text-sm font-bold text-white">100% Genuine Gear</span>
              <span className="hidden sm:inline text-[11px] text-neutral-400 ml-2">Authorised dealer for MT, Axor, Rynox, SMK & Motul</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 py-4 sm:py-5 sm:px-6">
            <Truck className="w-4 h-4 text-orange-500 shrink-0" />
            <div className="text-center sm:text-left">
              <span className="text-xs sm:text-sm font-bold text-white">Free Express Shipping</span>
              <span className="hidden sm:inline text-[11px] text-neutral-400 ml-2">On orders above ₹5,000, across India</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 py-4 sm:py-5 sm:px-6">
            <CreditCard className="w-4 h-4 text-orange-500 shrink-0" />
            <div className="text-center sm:text-left">
              <span className="text-xs sm:text-sm font-bold text-white">Secure Checkout</span>
              <span className="hidden sm:inline text-[11px] text-neutral-400 ml-2">UPI, cards, net banking & wallets</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Columns */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Column 1: Store Bio */}
          <div className="md:col-span-4 space-y-4">
            <button onClick={() => navigate('/')} className="text-left focus:outline-none group">
              <BrandLogo size="lg" variant="dark" />
            </button>
            <p className="text-neutral-400 leading-relaxed text-xs">
              District 38 is South India’s premier motorcycle riding gear destination. Operating a state-of-the-art physical experience store in Trichy with nationwide digital fulfillment.
            </p>

            <div className="pt-2 space-y-2 text-neutral-300">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-xs">
                  75/c Alsa Complex, Salai Road (Next to Reliance Digital, Opp HP Petrol Bunk), Trichy, TN 620018
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <a href={`tel:${DISTRICT_38_STORE.phone}`} className="hover:text-white transition-colors">
                  +91 63697 08558
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <a href={`mailto:${DISTRICT_38_STORE.email}`} className="hover:text-white transition-colors">
                  {DISTRICT_38_STORE.email}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Shop Gear */}
          <div className="md:col-span-2 space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs">
              Shop Gear
            </div>
            <ul className="space-y-2">
              {footerCategories.map(category => (
                <li key={category.id}>
                  <button onClick={() => navigate(`/${category.slug}`)} className="hover:text-white transition-colors">
                    {category.name}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => navigate('/offers')} className="text-orange-400 hover:text-orange-300 font-semibold">
                  Deals & Clearance
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Info */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs">
              Rider Services
            </div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/account/orders')} className="hover:text-white transition-colors">
                  Track Order & Dispatch
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shipping')} className="hover:text-white transition-colors">
                  Shipping & Delivery Info
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/returns')} className="hover:text-white transition-colors">
                  Returns, Refunds & Cancellation
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/store')} className="hover:text-white transition-colors">
                  Flagship Store & Sizing Studio
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/guides')} className="hover:text-white transition-colors">
                  Riding & Armor Guides
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/brands')} className="hover:text-white transition-colors">
                  Authorized Brand Partners
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
                  About District 38
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs">
              Stay Connected
            </div>
            <p className="text-neutral-400 text-xs">
              Get notified when new ECE 22.06 helmet drops, monsoon gear, and weekend ride meets go live.
            </p>

            {isSubscribed ? (
              <div className="p-3 rounded-md bg-neutral-900 border border-neutral-800 text-emerald-400 flex items-center space-x-2 text-xs">
                <Check className="w-4 h-4" />
                <span>You're on the District 38 Rider List!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your rider email"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-md text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs tracking-wide transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>GET RIDING DROPS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="pt-2">
              <div className="text-[11px] text-neutral-500 mb-2">Follow District 38:</div>
              <div className="flex space-x-3 text-neutral-400">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-neutral-900 hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-neutral-900 hover:text-white transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-neutral-900 hover:text-white transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright & Legal */}
      <div className="border-t border-neutral-900 py-6 px-4 sm:px-6 lg:px-8 xl:px-12 bg-black">
        <div className="w-full max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © 2026 District 38 Motorcycle Gear. All rights reserved. Trichy, Tamil Nadu.
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <button onClick={() => navigate('/privacy')} className="hover:text-neutral-300 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => navigate('/terms')} className="hover:text-neutral-300 transition-colors">
              Terms of Service
            </button>
            <button onClick={() => navigate('/shipping')} className="hover:text-neutral-300 transition-colors">
              Shipping Guidelines
            </button>
            <button onClick={() => navigate('/returns')} className="hover:text-neutral-300 transition-colors">
              Refund & Exchange Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
