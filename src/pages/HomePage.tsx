import React, { useState, useRef } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles, 
  MapPin, 
  Star, 
  ChevronRight, 
  CheckCircle2, 
  Zap, 
  Flame, 
  Compass, 
  BookOpen, 
  PhoneCall, 
  ExternalLink,
  Play,
  Film
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useProducts } from '../hooks/use-products';
import { adaptListItem } from '../lib/product-adapter';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { BRANDS } from '../data/brands';
import { RIDING_GUIDES } from '../data/guides';
import { DISTRICT_38_STORE } from '../data/storeInfo';
import { ProductGrid } from '../components/commerce/ProductGrid';
import { VideoPlayerSection } from '../components/media/VideoPlayerSection';
import { RidingStyle } from '../types';

export const HomePage: React.FC = () => {
  const { navigate, updateShopFilters, openQuickAdd } = useShop();
  const [activeTab, setActiveTab] = useState<'all' | 'helmets' | 'jackets' | 'luggage'>('all');
  const [heroCardMode, setHeroCardMode] = useState<'product' | 'video'>('video');

  // Real VEYONN catalog — the category banner grid and brand strip further
  // below are left as static editorial content for this phase (see the
  // Phase 1 report: neither category images/item-counts nor brand
  // logos/banners exist on the real public API), but the actual product
  // sections (Featured/Best Sellers tabs, hero spotlight) use real data.
  const allProductsQuery = useProducts({ limit: 100 });
  const allProducts = (allProductsQuery.data?.items ?? []).map(adaptListItem);

  // Filter products for tabs. The helmets/jackets/luggage tabs match real
  // products only once a real category by that slugified name exists —
  // today only "Helmets" is seeded, so the other two tabs will show
  // nothing until an admin creates matching categories in Pilot (an
  // honest reflection of the real catalog, not a bug).
  const tabProducts = allProducts.filter(p => {
    if (activeTab === 'all') return p.isFeatured || p.isBestSeller;
    if (activeTab === 'helmets') return p.category === 'helmets';
    if (activeTab === 'jackets') return p.category === 'riding-gear';
    if (activeTab === 'luggage') return p.category === 'bike-accessories';
    return true;
  }).slice(0, 8);

  const heroSpotlightProduct = allProducts.find(p => p.isFeatured) ?? allProducts[0];

  // The "Product Spotlight" editorial section further below has fixed,
  // hand-written copy and a hand-authored spec table describing one
  // specific product (the MT Thunder 4 SV) — pairing that fixed text with
  // a different REAL product would misrepresent it, so this section keeps
  // using this repo's own static demo data instead (genuinely editorial
  // content, not commerce data — see the Phase 1 report).
  const spotlightProduct = PRODUCTS[0];

  const handleStyleSelect = (style: RidingStyle) => {
    updateShopFilters({ ridingStyles: [style] });
    navigate('/shop');
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Section (Clean, intentional motorcycle commerce hero) */}
      <section className="relative overflow-hidden bg-neutral-950 text-white rounded-2xl mx-3 sm:mx-6 lg:mx-8 xl:mx-12 mt-3 sm:mt-6 border border-neutral-800">
        <div className="relative w-full max-w-[1920px] mx-auto px-6 sm:px-10 xl:px-14 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* Top location tag */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-white/10 text-xs font-semibold text-orange-400">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>Trichy Flagship Experience Center & Nationwide Delivery</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Motorcycle Helmets, Riding Gear & Touring Equipment
            </h1>

            {/* Sub-copy */}
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl font-normal leading-relaxed">
              District 38 is an authorised destination for ECE 22.06 certified helmets, mesh jackets, riding gloves, and luggage. Visit our physical sizing studio in Trichy or shop online with express shipping across India.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => navigate('/helmets')}
                className="px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase transition-colors flex items-center space-x-2"
              >
                <span>Shop Helmets</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-sm transition-colors flex items-center space-x-2"
              >
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>Visit Trichy Store</span>
              </button>
            </div>

            {/* Micro Trust Points */}
            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-neutral-800 text-xs text-neutral-400">
              <div>
                <div className="font-semibold text-white text-sm">Authorised Dealer</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">100% Genuine Gear & Direct Warranty</div>
              </div>
              <div>
                <div className="font-semibold text-white text-sm">7-Day Sizing Exchange</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Hassle-free size swaps on unworn gear</div>
              </div>
              <div>
                <div className="font-semibold text-white text-sm">Free Express Shipping</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">On all orders above ₹2,999</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-md rounded-xl bg-neutral-900 p-4 sm:p-5 border border-neutral-800">
              {/* Top Mode Selector Tabs */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-1 p-1 rounded-lg bg-neutral-950 border border-neutral-800">
                  <button
                    onClick={() => setHeroCardMode('video')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                      heroCardMode === 'video'
                        ? 'bg-orange-600 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Store Film</span>
                  </button>
                  <button
                    onClick={() => setHeroCardMode('product')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                      heroCardMode === 'product'
                        ? 'bg-orange-600 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Featured Gear</span>
                  </button>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-neutral-400 border border-neutral-800">
                  {heroCardMode === 'video' ? 'Inside Store' : 'ECE 22.06'}
                </span>
              </div>

              {heroCardMode === 'video' ? (
                /* Video Player Hero View */
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black border border-neutral-800">
                    <video
                      src="/district35intro.mp4"
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <div>
                        <div className="text-xs font-semibold">District 38 Trichy</div>
                        <div className="text-[11px] text-neutral-300">Salai Road Experience Store</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-xs text-neutral-400">
                      75/c Alsa Complex, Salai Road
                    </div>
                    <button
                      onClick={() => {
                        const el = document.getElementById('district38-video-container');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center space-x-1 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Play with Audio</span>
                    </button>
                  </div>
                </div>
              ) : heroSpotlightProduct ? (
                /* Product Spotlight Hero View */
                <div className="space-y-3">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800">
                    {heroSpotlightProduct.thumbnail ? (
                      <img
                        src={heroSpotlightProduct.thumbnail}
                        alt={heroSpotlightProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-700 text-xs">
                        No image available
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider">
                      {heroSpotlightProduct.brand} • ECE 22.06
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-white leading-snug">
                      {heroSpotlightProduct.name}
                    </h3>
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-base font-bold text-white">
                        ₹{heroSpotlightProduct.price.toLocaleString('en-IN')}
                      </div>
                      <button
                        onClick={() => navigate(`/products/${heroSpotlightProduct.slug}`)}
                        className="px-3.5 py-1.5 rounded-md bg-white text-neutral-950 font-semibold text-xs hover:bg-neutral-200 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-square rounded-lg flex items-center justify-center bg-neutral-950 border border-neutral-800 text-neutral-500 text-xs">
                  No products available yet
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Video Film Showcase */}
      <VideoPlayerSection />

      {/* 3. Shop by Category Grid */}
      <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
              Riding Gear Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 mt-1 tracking-tight">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-xs font-semibold text-neutral-700 hover:text-orange-600 flex items-center space-x-1 mt-2 sm:mt-0 transition-colors group"
          >
            <span>View All Gear</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map(category => (
            <div
              key={category.id}
              onClick={() => navigate(`/${category.slug}`)}
              className="group relative flex flex-col rounded-xl overflow-hidden border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="aspect-square w-full overflow-hidden bg-neutral-100 relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <div className="text-xs sm:text-sm font-bold leading-tight">{category.name}</div>
                  <div className="text-[10px] text-neutral-300 mt-0.5">{category.itemCount} items</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Product Spotlight (Editorial, clean specifications) */}
      <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-10 lg:p-12 border border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Product Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative max-w-sm w-full aspect-square rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                <img
                  src={spotlightProduct.images[0]}
                  alt={spotlightProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-semibold bg-emerald-700 text-white">
                  ECE 22.06 Certified
                </div>
              </div>
            </div>

            {/* Right Details & Specs */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                  Featured Full Face Helmet
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                  {spotlightProduct.name}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 font-normal mt-2 leading-relaxed max-w-xl">
                  Constructed with a high-impact resistant polymer (HIRP) shell, the MT Thunder 4 SV is engineered for highway touring and daily city riding. Features an integrated drop-down sun visor, optical Class 1 Pinlock-ready shield, and quick-release emergency cheek pads.
                </p>
              </div>

              {/* Clean Specification Table / Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-neutral-800 text-xs">
                <div>
                  <div className="text-neutral-400 text-[11px]">Certification</div>
                  <div className="font-semibold text-white mt-0.5">ECE 22.06 & DOT</div>
                </div>
                <div>
                  <div className="text-neutral-400 text-[11px]">Visor System</div>
                  <div className="font-semibold text-white mt-0.5">Pinlock 120 Ready</div>
                </div>
                <div>
                  <div className="text-neutral-400 text-[11px]">Sun Visor</div>
                  <div className="font-semibold text-white mt-0.5">Internal Drop-down</div>
                </div>
                <div>
                  <div className="text-neutral-400 text-[11px]">Fastener</div>
                  <div className="font-semibold text-white mt-0.5">Micrometric Metal</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Price (inclusive of all taxes)</div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    ₹{spotlightProduct.price.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => openQuickAdd(spotlightProduct)}
                    className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors"
                  >
                    Select Size & Buy
                  </button>
                  <button
                    onClick={() => navigate(`/products/${spotlightProduct.slug}`)}
                    className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Best Sellers & New Arrivals Tabs */}
      <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
              Popular Gear
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 mt-1 tracking-tight">
              Best Sellers & New Arrivals
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg self-start md:self-auto overflow-x-auto max-w-full">
            {[
              { id: 'all', label: 'All Popular' },
              { id: 'helmets', label: 'Helmets' },
              { id: 'jackets', label: 'Riding Apparel' },
              { id: 'luggage', label: 'Touring Luggage' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shrink-0 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <ProductGrid products={tabProducts} isLoading={allProductsQuery.isLoading} error={allProductsQuery.error} />
      </section>

      {/* 6. Shop by Riding Style */}
      <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
            Riding Discipline
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 mt-1 tracking-tight">
            Gear Selected by Riding Discipline
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-normal">
            Find the right armor, ventilation, and luggage for your motorcycle and route.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              style: 'Touring' as RidingStyle,
              title: 'Highway Touring',
              desc: 'High ventilation helmets, Pinlock inserts, tail bags, and saddlebags.',
              img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
              tag: 'Long Distance'
            },
            {
              style: 'City' as RidingStyle,
              title: 'Urban Commuting',
              desc: 'Lightweight breathable mesh jackets, gloves, and helmet communicators.',
              img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
              tag: 'Daily Riding'
            },
            {
              style: 'Adventure' as RidingStyle,
              title: 'Adventure & Off-Road',
              desc: 'Dual-sport helmets with peak visors, waterproof dry bags, and knee armor.',
              img: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80',
              tag: 'All Terrain'
            },
            {
              style: 'Performance' as RidingStyle,
              title: 'Track & Sport',
              desc: 'Full-face spoiler helmets, CE Level 2 back protectors, and gauntlet gloves.',
              img: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=600&q=80',
              tag: 'Track & Street'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleStyleSelect(item.style)}
              className="group relative rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 text-white h-72 cursor-pointer hover:border-neutral-400 transition-colors"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-5 flex flex-col justify-between">
                <div className="self-start px-2 py-0.5 rounded bg-white/20 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider">
                  {item.tag}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-orange-400 transition-colors flex items-center justify-between">
                    <span>{item.title}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed line-clamp-2 font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Physical Retail Store Spotlight (District 38 Trichy Experience) */}
      <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-orange-100 text-orange-800 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                <span>Trichy Store & Sizing Rig</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
                Try Before You Ride. Visit Our Experience Store.
              </h2>

              <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed">
                Test helmets on our physical motorcycle posture rig to check aerodynamic sightlines and neck comfort before purchasing. Get free head shape sizing, intercom sound testing, and expert advice on jacket fitment.
              </p>

              <div className="space-y-2.5 text-xs text-neutral-700">
                <div className="flex items-start space-x-2.5">
                  <div className="p-1 rounded bg-neutral-900 text-white shrink-0 mt-0.5">
                    <MapPin className="w-3 h-3" />
                  </div>
                  <div>
                    <strong className="font-semibold text-neutral-900">Address:</strong> 75/c Alsa Complex, Salai Road, Next to Reliance Digital, Opposite HP Petrol Bunk, Trichy – 620018
                  </div>
                </div>

                <div className="flex items-center space-x-2.5">
                  <div className="p-1 rounded bg-neutral-900 text-white shrink-0">
                    <PhoneCall className="w-3 h-3" />
                  </div>
                  <div>
                    <strong className="font-semibold text-neutral-900">Phone:</strong> +91 63697 08558 (Mon - Sun: 10:00 AM – 9:30 PM)
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={DISTRICT_38_STORE.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors flex items-center space-x-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span>Google Maps Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => navigate('/contact')}
                  className="px-4 py-2.5 rounded-lg bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 font-semibold text-xs transition-colors"
                >
                  Store Details & Hours
                </button>
              </div>
            </div>

            {/* Store Images Layout */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-3">
              <img
                src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80"
                alt="District 38 store floor"
                className="rounded-xl h-48 w-full object-cover border border-neutral-200"
              />
              <img
                src="https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=600&q=80"
                alt="Helmet displays"
                className="rounded-xl h-48 w-full object-cover border border-neutral-200"
              />
              <div className="col-span-2 p-3.5 rounded-xl bg-neutral-900 text-white flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold">Free Helmet Sizing & Consultation</div>
                  <div className="text-[11px] font-normal text-neutral-400">Walk-ins welcome every day from 10 AM to 9:30 PM.</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-orange-600 text-[10px] font-semibold uppercase tracking-wider">
                  Open Today
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Editorial Guides & Safety Articles */}
      <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
              Rider Education
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 mt-1 tracking-tight">
              Safety & Sizing Guides
            </h2>
          </div>
          <button
            onClick={() => navigate('/guides')}
            className="text-xs font-semibold text-neutral-700 hover:text-orange-600 flex items-center space-x-1 mt-2 sm:mt-0 transition-colors"
          >
            <span>All Articles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {RIDING_GUIDES.slice(0, 3).map(guide => (
            <div
              key={guide.id}
              onClick={() => navigate(`/guides/${guide.slug}`)}
              className="group rounded-xl border border-neutral-200 bg-white overflow-hidden hover:border-neutral-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-neutral-100 relative">
                  <img
                    src={guide.coverImage}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-neutral-900/80 backdrop-blur-md text-white text-[10px] font-semibold">
                    {guide.category}
                  </span>
                </div>
                <div className="p-4">
                  <div className="text-[11px] text-neutral-400 font-normal mb-1 flex items-center space-x-1.5">
                    <span>{guide.readTime}</span>
                    <span>•</span>
                    <span>{guide.publishedDate}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-neutral-600 font-normal mt-1.5 line-clamp-2 leading-relaxed">
                    {guide.summary}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center text-xs font-semibold text-orange-600 space-x-1">
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Authorized Brand Wall */}
      <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Authorised Dealership
          </span>
          <h3 className="text-base sm:text-lg font-bold text-neutral-900 mt-1">
            Authorised Dealer for Leading Motorcycle Gear Brands
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {BRANDS.map(b => (
            <button
              key={b.id}
              onClick={() => navigate(`/brands/${b.slug}`)}
              className="p-3 rounded-lg border border-neutral-200 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-center transition-colors group"
            >
              <div className="text-xs font-semibold text-neutral-900 group-hover:text-orange-600">
                {b.name}
              </div>
              <div className="text-[10px] text-neutral-400 font-normal mt-0.5">{b.origin}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
