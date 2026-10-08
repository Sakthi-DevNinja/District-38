import React from 'react';
import { BookOpen, Clock, ArrowRight, HelpCircle } from 'lucide-react';
import { GUIDES } from '../data/guides';
import { useShop } from '../context/ShopContext';
import { usePageMeta } from '../hooks/use-page-meta';

export const GuidesPage: React.FC = () => {
  const { navigate } = useShop();

  usePageMeta({
    title: 'Motorcycle Gear Buying & Safety Guides',
    description: 'Technical guides on ECE helmet homologation, CE armor ratings, helmet sizing, and touring gear setup from the District 38 team.',
    path: '/guides'
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
          Rider Knowledge & Safety Engineering
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
          Motorcycle Gear Buying & Safety Guides
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
          Deep-dive technical guides prepared by the District 38 team on ECE homologations, CE armor ratings, Pinlock anti-fog installation, and highway luggage setup.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {GUIDES.map(guide => (
          <div
            key={guide.id}
            onClick={() => navigate(`/guides/${guide.slug}`)}
            className="group bg-white rounded-3xl border border-neutral-200 hover:border-orange-500 hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="h-56 overflow-hidden bg-neutral-100 relative">
                <img
                  src={guide.coverImage}
                  alt={guide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                  {guide.category}
                </span>
              </div>

              <div className="p-6 space-y-2">
                <div className="flex items-center space-x-2 text-xs text-neutral-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{guide.readTime}</span>
                  <span>•</span>
                  <span>By {guide.author}</span>
                </div>

                <h3 className="text-xl font-bold text-neutral-950 group-hover:text-orange-600 transition-colors leading-snug">
                  {guide.title}
                </h3>

                <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
                  {guide.excerpt}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-orange-600">
              <span>Read Full Technical Guide</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
