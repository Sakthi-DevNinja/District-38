import React from 'react';
import { Sparkles, ArrowRight, CloudRain, Flame, Compass, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { usePageMeta } from '../hooks/use-page-meta';

export const CollectionsPage: React.FC = () => {
  const { navigate, updateShopFilters } = useShop();

  usePageMeta({
    title: 'Curated Collections',
    description: 'Shop District 38\'s curated motorcycle gear collections — ECE 22.06 certified helmets, monsoon-ready riding gear, and more.',
    path: '/collections'
  }, []);

  const collections = [
    {
      id: 'ece-2206',
      title: 'ECE 22.06 Safety Certified',
      desc: 'Helmets passing strict high-velocity rotational acceleration tests.',
      tag: 'Maximum Impact Protection',
      count: 4,
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
      action: () => {
        updateShopFilters({ certifications: ['ECE 22.06'] });
        navigate('/shop');
      }
    },
    {
      id: 'touring-expedition',
      title: 'Highway Touring & Ladakh Ready',
      desc: 'Large capacity waterproof tail bags, Pinlock anti-fog visors, and thermal liners.',
      tag: 'Long Haul Touring',
      count: 6,
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
      action: () => {
        updateShopFilters({ ridingStyles: ['Touring'] });
        navigate('/shop');
      }
    },
    {
      id: 'monsoon-ready',
      title: 'Monsoon Proof Gear Kit',
      desc: '100% waterproof dry bags, anti-fog inserts, and chain maintenance packs.',
      tag: 'All-Weather Riding',
      count: 5,
      image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80',
      action: () => {
        updateShopFilters({ searchQuery: 'Waterproof' });
        navigate('/shop');
      }
    },
    {
      id: 'city-commuter',
      title: 'Urban Commuter Essentials',
      desc: 'High ventilation mesh jackets, quick phone chargers, and lightweight gloves.',
      tag: 'Daily Commute',
      count: 5,
      image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=600&q=80',
      action: () => {
        updateShopFilters({ ridingStyles: ['City'] });
        navigate('/shop');
      }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
          Curated Rider Kits
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
          Curated Motorcycle Collections
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
          Hand-selected gear configurations assembled for specific highway, track, monsoon, and adventure riding requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {collections.map(col => (
          <div
            key={col.id}
            onClick={col.action}
            className="group relative rounded-3xl overflow-hidden bg-neutral-950 text-white h-80 sm:h-96 cursor-pointer border border-neutral-800 shadow-md hover:shadow-2xl transition-all"
          >
            <img
              src={col.image}
              alt={col.title}
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 sm:p-8 flex flex-col justify-between">
              <div className="self-start px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                {col.tag}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-orange-400 transition-colors flex items-center justify-between">
                  <span>{col.title}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-lg leading-relaxed">
                  {col.desc}
                </p>
                <div className="text-xs font-bold text-orange-400 pt-1">
                  Explore Curated Kit ({col.count} items) →
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
