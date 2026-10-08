import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/categories';
import { BRANDS } from '../data/brands';
import { RidingGalleryCarousel } from '../components/media/RidingGalleryCarousel';
import { VideoPlayerSection } from '../components/media/VideoPlayerSection';
import { RidingStyle } from '../types';
import { usePageMeta } from '../hooks/use-page-meta';

export const HomePage: React.FC = () => {
  const { navigate, updateShopFilters } = useShop();

  usePageMeta({
    title: 'District 38 — Motorcycle Gear, Helmets & Riding Accessories',
    description: 'Shop ECE 22.06 certified helmets, CE Level 2 riding jackets, gloves, and touring accessories from authorised brands like MT, Axor, Rynox, and SMK.',
    path: '/'
  }, []);

  // This homepage is deliberately catalog-free: no product API calls, no
  // ProductCard/ProductGrid — every section below is editorial (categories,
  // brand directory, guides), not live product data.

  const handleStyleSelect = (style: RidingStyle) => {
    updateShopFilters({ ridingStyles: [style] });
    navigate('/shop');
  };

  const trustPoints = [
    { icon: ShieldCheck, title: 'Authorised Dealer', desc: '100% genuine gear, direct warranty' },
    { icon: Truck, title: 'Free Express Shipping', desc: 'On all orders above ₹5,000' },
    { icon: CreditCard, title: 'Secure Checkout', desc: 'UPI, cards, net banking & wallets' }
  ];

  return (
    <div className="pb-16">
      {/* 1. Hero — the full-image riding gallery carousel itself */}
      <RidingGalleryCarousel />

      {/* 2. Trust Strip — a dark, full-bleed ribbon bridging the hero into
          the page body, instead of a plain divided bar. */}
      <section className="w-full bg-neutral-950 border-b border-neutral-800">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y divide-neutral-800 sm:divide-y-0 sm:divide-x sm:divide-neutral-800">
            {trustPoints.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center justify-center gap-3 py-4 sm:py-5 sm:px-6">
                  <Icon className="w-4 h-4 text-orange-500 shrink-0" />
                  <div className="text-center sm:text-left">
                    <span className="text-xs sm:text-sm font-bold text-white">{item.title}</span>
                    <span className="hidden sm:inline text-[11px] text-neutral-400 ml-2">{item.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="space-y-12 sm:space-y-16 pt-12 sm:pt-16">
        {/* 3. Shop by Category */}
        <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col items-center text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Riding Gear Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 mt-1 tracking-tight">
              Shop by Category
            </h2>
            <button
              onClick={() => navigate('/shop')}
              className="text-xs font-bold text-neutral-700 hover:text-orange-600 flex items-center space-x-1 mt-3 transition-colors group"
            >
              <span>View All Gear</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Bento grid: one large hero tile + three supporting tiles,
              tiled edge-to-edge with no leftover whitespace at any
              breakpoint (mobile: 2-col grid summing to full rows;
              desktop: 4-col x 2-row grid summing to a full 4x2 block). */}
          <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3 sm:gap-4 lg:h-[600px]">
            {CATEGORIES.map((category, idx) => (
              <div
                key={category.id}
                onClick={() => navigate(`/${category.slug}`)}
                className={`group relative overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 cursor-pointer aspect-[4/3] lg:aspect-auto lg:h-full ${
                  idx === 0 ? 'col-span-2 lg:col-span-2 lg:row-span-2' :
                  idx === 1 ? 'col-span-1 lg:col-span-2' :
                  idx === 3 ? 'col-span-2 lg:col-span-1' :
                  'col-span-1 lg:col-span-1'
                }`}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white">
                  <div className={`font-extrabold leading-tight ${idx === 0 ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg'}`}>
                    {category.name}
                  </div>
                  <div className="text-xs text-neutral-300 mt-1">{category.itemCount} items</div>
                  {idx === 0 && (
                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-orange-400 group-hover:gap-2 transition-all">
                      <span>Shop Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Interactive Video Film Showcase */}
        <VideoPlayerSection />

        {/* 5. Shop by Riding Style */}
        <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col items-center text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Riding Discipline
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 mt-1 tracking-tight">
              Gear Selected by Riding Discipline
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
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
                className="group relative rounded-lg overflow-hidden border border-neutral-200 bg-neutral-900 text-white h-72 cursor-pointer hover:border-neutral-900 transition-colors"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-5 flex flex-col justify-between">
                  <div className="self-start px-2 py-0.5 rounded-sm bg-black/60 text-[10px] font-bold uppercase tracking-wider">
                    {item.tag}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-orange-400 transition-colors flex items-center justify-between">
                      <span>{item.title}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1 leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Shop by Brand */}
        <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col items-center text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Authorised Dealership
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 mt-1 tracking-tight">
              Shop by Brand
            </h2>
            <button
              onClick={() => navigate('/brands')}
              className="text-xs font-bold text-neutral-700 hover:text-orange-600 flex items-center space-x-1 mt-3 transition-colors group"
            >
              <span>All Brands</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {BRANDS.map(b => (
              <button
                key={b.id}
                onClick={() => navigate(`/brands/${b.slug}`)}
                className="p-4 rounded-lg border border-neutral-200 hover:border-neutral-900 bg-white text-center transition-colors group"
              >
                <div className="text-sm font-extrabold text-neutral-900 group-hover:text-orange-600 tracking-tight">
                  {b.name}
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">{b.origin}</div>
                <div className="text-[11px] text-neutral-500 mt-2 font-medium">{b.productCount} products</div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
