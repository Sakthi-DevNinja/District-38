import React from 'react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../data/categories';
import { BRANDS } from '../../data/brands';
import { Shield, Award, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface MegaMenuProps {
  activeMenu: string | null;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ activeMenu, onClose }) => {
  const { navigate, updateShopFilters } = useShop();

  if (!activeMenu) return null;

  const handleSubcategoryClick = (categorySlug: string, subcategoryName: string) => {
    updateShopFilters({ category: categorySlug, subcategory: subcategoryName });
    navigate('/shop');
    onClose();
  };

  const handleBrandClick = (brandSlug: string) => {
    navigate(`/brands/${brandSlug}`);
    onClose();
  };

  if (activeMenu === 'helmets') {
    const helmetCat = CATEGORIES.find(c => c.slug === 'helmets');
    return (
      <div 
        onMouseLeave={onClose}
        className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-neutral-900"
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 grid grid-cols-12 gap-8">
          {/* Col 1: Categories */}
          <div className="col-span-4 border-r border-neutral-100 pr-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Helmet Types
            </div>
            <ul className="space-y-3">
              {helmetCat?.subcategories.map(sub => (
                <li key={sub.slug}>
                  <button
                    onClick={() => handleSubcategoryClick('helmets', sub.name)}
                    className="group flex items-start text-left w-full hover:bg-neutral-50 p-2 rounded-lg transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors">
                        {sub.name}
                      </div>
                      <p className="text-xs text-neutral-500 line-clamp-1">{sub.description}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <button
                onClick={() => { navigate('/helmets'); onClose(); }}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center space-x-1"
              >
                <span>View all helmets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Col 2: Top Brands */}
          <div className="col-span-4 border-r border-neutral-100 pr-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Featured Helmet Makers
            </div>
            <div className="grid grid-cols-2 gap-3">
              {BRANDS.filter(b => b.popularCategories.some(c => c.toLowerCase().includes('helmet'))).slice(0, 4).map(brand => (
                <button
                  key={brand.id}
                  onClick={() => handleBrandClick(brand.slug)}
                  className="text-left p-3 rounded-lg border border-neutral-200/70 hover:border-orange-500/50 hover:bg-orange-50/20 transition-all group"
                >
                  <div className="font-semibold text-sm text-neutral-900 group-hover:text-orange-600">
                    {brand.name}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-normal">{brand.origin}</div>
                </button>
              ))}
            </div>

            <div className="mt-6 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/60">
              <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-900 mb-1">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>ECE 22.06 Certified Guaranteed</span>
              </div>
              <p className="text-[11px] text-neutral-500 font-normal leading-relaxed">
                All helmets sold at District 38 undergo certified batch validation with pinlock and visor anti-shatter testing.
              </p>
            </div>
          </div>

          {/* Col 3: Spotlight Feature */}
          <div className="col-span-4 flex flex-col justify-between">
            <div 
              onClick={() => { navigate('/products/mt-thunder-4-sv-helmet'); onClose(); }}
              className="group cursor-pointer relative overflow-hidden rounded-2xl bg-neutral-950 p-6 text-white h-full flex flex-col justify-end"
            >
              <img 
                src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80" 
                alt="MT Thunder 4 SV"
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative z-10">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-orange-600 text-white mb-2">
                  BEST SELLER
                </span>
                <h4 className="text-lg font-bold text-white mb-1">MT Thunder 4 SV</h4>
                <p className="text-xs text-neutral-300 font-normal mb-3">ECE 22.06 triple homologation with aerodynamic rear spoiler.</p>
                <div className="flex items-center space-x-2 text-xs font-semibold text-orange-400 group-hover:text-orange-300">
                  <span>Explore flagship model</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeMenu === 'riding-gear') {
    const gearCat = CATEGORIES.find(c => c.slug === 'riding-gear');
    return (
      <div 
        onMouseLeave={onClose}
        className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-neutral-900"
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 grid grid-cols-12 gap-8">
          <div className="col-span-4 border-r border-neutral-100 pr-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Riding Apparel
            </div>
            <ul className="space-y-3">
              {gearCat?.subcategories.map(sub => (
                <li key={sub.slug}>
                  <button
                    onClick={() => handleSubcategoryClick('riding-gear', sub.name)}
                    className="group flex items-start text-left w-full hover:bg-neutral-50 p-2 rounded-lg transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors">
                        {sub.name}
                      </div>
                      <p className="text-xs text-neutral-500 font-normal line-clamp-1">{sub.description}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <button
                onClick={() => { navigate('/riding-gear'); onClose(); }}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center space-x-1"
              >
                <span>Browse all riding gear</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="col-span-4 border-r border-neutral-100 pr-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Armor & Safety Standard
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/60">
                <div className="text-xs font-semibold text-neutral-900 mb-1">CE Level 2 Armour</div>
                <p className="text-[11px] text-neutral-500 font-normal">Transmits &lt; 9 kN impact force. Standard across Rynox & Viaterra range.</p>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/60">
                <div className="text-xs font-semibold text-neutral-900 mb-1">3D High Airflow Mesh</div>
                <p className="text-[11px] text-neutral-500 font-normal">Specifically constructed for South India tropical humidity and monsoon touring.</p>
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div 
              onClick={() => { navigate('/products/rynox-stealth-air-pro-riding-jacket'); onClose(); }}
              className="group cursor-pointer relative overflow-hidden rounded-2xl bg-neutral-950 p-6 text-white h-full flex flex-col justify-end"
            >
              <img 
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80" 
                alt="Rynox Stealth Air Pro"
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative z-10">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-orange-600 text-white mb-2">
                  TOP RATED JACKET
                </span>
                <h4 className="text-lg font-bold text-white mb-1">Rynox Stealth Air Pro</h4>
                <p className="text-xs text-neutral-300 font-normal mb-3">Safe-Tech CE Level 2 full armor + rain liner included.</p>
                <div className="flex items-center space-x-2 text-xs font-semibold text-orange-400 group-hover:text-orange-300">
                  <span>View Product</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeMenu === 'accessories') {
    const accCat = CATEGORIES.find(c => c.slug === 'bike-accessories');
    return (
      <div 
        onMouseLeave={onClose}
        className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-neutral-900"
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 grid grid-cols-12 gap-8">
          <div className="col-span-4 border-r border-neutral-100 pr-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Bike Accessories
            </div>
            <ul className="space-y-3">
              {accCat?.subcategories.map(sub => (
                <li key={sub.slug}>
                  <button
                    onClick={() => handleSubcategoryClick('bike-accessories', sub.name)}
                    className="group flex items-start text-left w-full hover:bg-neutral-50 p-2 rounded-lg transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors">
                        {sub.name}
                      </div>
                      <p className="text-xs text-neutral-500 font-normal line-clamp-1">{sub.description}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-4 border-r border-neutral-100 pr-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Touring Essentials
            </div>
            <div className="space-y-2">
              <div 
                onClick={() => { navigate('/products/viaterra-claw-72l-motorcycle-tailbag'); onClose(); }}
                className="p-3 rounded-lg hover:bg-neutral-50 cursor-pointer border border-transparent hover:border-neutral-200 transition-all"
              >
                <div className="text-sm font-semibold text-neutral-900">ViaTerra Claw 72L Tailbag</div>
                <div className="text-xs text-neutral-500 font-normal">Universal zero-rack fit for all motorcycles</div>
              </div>
              <div 
                onClick={() => { navigate('/products/bobo-claw-grip-aluminum-phone-mount-with-fast-charger'); onClose(); }}
                className="p-3 rounded-lg hover:bg-neutral-50 cursor-pointer border border-transparent hover:border-neutral-200 transition-all"
              >
                <div className="text-sm font-semibold text-neutral-900">BOBO Qi Wireless CNC Mount</div>
                <div className="text-xs text-neutral-500 font-normal">Anti-vibration phone charging dock</div>
              </div>
              <div 
                onClick={() => { navigate('/products/sena-50s-mesh-intercom-communicator'); onClose(); }}
                className="p-3 rounded-lg hover:bg-neutral-50 cursor-pointer border border-transparent hover:border-neutral-200 transition-all"
              >
                <div className="text-sm font-semibold text-neutral-900">Sena 50S Harman Kardon</div>
                <div className="text-xs text-neutral-500 font-normal">Mesh 2.0 multi-rider communicators</div>
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div 
              onClick={() => { navigate('/bike-accessories'); onClose(); }}
              className="group cursor-pointer relative overflow-hidden rounded-2xl bg-neutral-950 p-6 text-white h-full flex flex-col justify-end"
            >
              <img 
                src="https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=800&q=80" 
                alt="Touring accessories"
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative z-10">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-neutral-800 text-neutral-200 mb-2">
                  ADVENTURE READY
                </span>
                <h4 className="text-lg font-bold text-white mb-1">Touring & Luggage</h4>
                <p className="text-xs text-neutral-300 font-normal mb-3">Tested on Himalayas, Western Ghats, and coastal highways.</p>
                <div className="flex items-center space-x-2 text-xs font-semibold text-orange-400 group-hover:text-orange-300">
                  <span>Explore Accessories</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeMenu === 'bike-care') {
    const careCat = CATEGORIES.find(c => c.slug === 'bike-care');
    return (
      <div 
        onMouseLeave={onClose}
        className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-neutral-900"
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 grid grid-cols-12 gap-8">
          <div className="col-span-5 border-r border-neutral-100 pr-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Chain & Maintenance Care
            </div>
            <ul className="space-y-3">
              {careCat?.subcategories.map(sub => (
                <li key={sub.slug}>
                  <button
                    onClick={() => handleSubcategoryClick('bike-care', sub.name)}
                    className="group flex items-start text-left w-full hover:bg-neutral-50 p-2 rounded-lg transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors">
                        {sub.name}
                      </div>
                      <p className="text-xs text-neutral-500 font-normal line-clamp-1">{sub.description}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-7">
            <div 
              onClick={() => { navigate('/products/motul-c1-chain-clean-c2-chain-lube-combo'); onClose(); }}
              className="group cursor-pointer relative overflow-hidden rounded-2xl bg-neutral-950 p-6 text-white h-full flex flex-col justify-end"
            >
              <img 
                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80" 
                alt="Motul combo"
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative z-10">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-orange-600 text-white mb-2">
                  TOP COMBO
                </span>
                <h4 className="text-lg font-bold text-white mb-1">Motul C1 Clean + C2 Road Lube + Free Grunge Brush</h4>
                <p className="text-xs text-neutral-300 font-normal mb-3">The essential 500 km chain maintenance bundle for long sprocket life.</p>
                <div className="flex items-center space-x-2 text-xs font-semibold text-orange-400 group-hover:text-orange-300">
                  <span>Get combo for ₹1,049</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
