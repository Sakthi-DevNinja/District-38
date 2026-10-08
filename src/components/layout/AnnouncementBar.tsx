import React, { useState } from 'react';
import { Sparkles, ChevronRight, X, Truck, ShieldCheck, MapPin } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { navigate } = useShop();

  const messages = [
    {
      text: 'FREE EXPRESS SHIPPING ON ORDERS OVER ₹5,000',
      badge: 'OFFER',
      action: () => navigate('/offers'),
      icon: Truck
    },
    {
      text: 'FLAGSHIP STORE OPEN TODAY UNTIL 9:30 PM — FREE HELMET LASER SIZING & TRIAL',
      badge: 'VISIT STORE',
      action: () => navigate('/contact'),
      icon: MapPin
    },
    {
      text: 'ALL HELMETS CERTIFIED ECE 22.06 / DOT / ISI — 100% GENUINE GUARANTEE',
      badge: 'SAFETY FIRST',
      action: () => navigate('/helmets'),
      icon: ShieldCheck
    }
  ];

  if (!isVisible) return null;

  const current = messages[currentSlide];
  const Icon = current.icon;

  return (
    <div className="bg-[#111114] text-neutral-300 text-xs py-2 px-4 border-b border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden sm:flex items-center space-x-2 text-neutral-400">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="font-medium tracking-wide">Flagship Store Open Today</span>
        </div>

        <div className="flex-1 flex items-center justify-center space-x-3 text-center truncate">
          <button 
            onClick={current.action}
            className="group flex items-center space-x-2 text-white hover:text-orange-400 transition-colors font-medium tracking-wide truncate focus:outline-none text-xs"
          >
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-600/20 text-orange-400 border border-orange-500/30">
              {current.badge}
            </span>
            <span className="truncate">{current.text}</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex space-x-1">
            {messages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  currentSlide === idx ? 'bg-orange-500 w-3' : 'bg-neutral-600 hover:bg-neutral-400'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss announcement"
            className="text-neutral-500 hover:text-neutral-300 p-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
