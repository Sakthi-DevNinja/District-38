import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useTags } from '../hooks/use-tags';
import { usePageMeta } from '../hooks/use-page-meta';
import { COLLECTIONS, tagCounts } from '../lib/collections';

export const CollectionsPage: React.FC = () => {
  const { navigate, resetShopFilters, updateShopFilters } = useShop();
  const tagsQuery = useTags();

  usePageMeta({
    title: 'Curated Collections',
    description: 'Shop District 38\'s curated motorcycle gear collections — ECE 22.06 certified helmets, touring and monsoon-ready riding gear, and more.',
    path: '/collections'
  }, []);

  const counts = tagCounts(tagsQuery.data);
  const collections = COLLECTIONS.filter(c => (counts.get(c.tag) ?? 0) > 0);

  const openCollection = (tag: string) => {
    resetShopFilters();
    updateShopFilters({ tag });
    navigate('/shop');
  };

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
          Gear picked for specific riding: highway touring, the monsoon, the daily commute and certified safety.
        </p>
      </div>

      {tagsQuery.isLoading ? (
        <p className="text-center text-sm text-neutral-400">Loading collections…</p>
      ) : collections.length === 0 ? (
        <div className="text-center space-y-4 py-12">
          <p className="text-sm text-neutral-600">Our collections are being put together. Browse the full catalog in the meantime.</p>
          <button
            onClick={() => navigate('/shop')}
            className="px-5 py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-bold"
          >
            Shop all gear
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {collections.map(col => {
            const count = counts.get(col.tag) ?? 0;
            return (
              <div
                key={col.tag}
                onClick={() => openCollection(col.tag)}
                className="group relative rounded-3xl overflow-hidden bg-neutral-950 text-white h-80 sm:h-96 cursor-pointer border border-neutral-800 shadow-md hover:shadow-2xl transition-all"
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 sm:p-8 flex flex-col justify-between">
                  <div className="self-start px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                    {col.label}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-orange-400 transition-colors flex items-center justify-between">
                      <span>{col.title}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 max-w-lg leading-relaxed">
                      {col.description}
                    </p>
                    <div className="text-xs font-bold text-orange-400 pt-1">
                      Shop {count} {count === 1 ? 'product' : 'products'} →
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
