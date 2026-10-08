import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useShop } from '../../context/ShopContext';

interface GallerySlide {
  type: 'photo' | 'poster';
  image: string;
  kicker: string;
  headline: string;
  copy?: string;
  primaryCta?: { label: string; route: string };
  secondaryCta?: { label: string; route: string };
}

// PLACEHOLDER CONTENT — swap every `image` below for the customer's own
// riding photography and branding posters as soon as they're provided.
// Keep the `type` field: 'poster' slides get the bold typographic overlay
// treatment (for branding-poster-style imagery), 'photo' slides get a
// minimal caption (for candid riding shots). Nothing else in this file
// needs to change to drop in real assets.
const SLIDES: GallerySlide[] = [
  {
    type: 'poster',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=2400&q=80',
    kicker: 'District 38',
    headline: 'Authorised Dealer for MT Helmets, Axor, Rynox & More',
    copy: 'Genuine stock, fitted and checked in-store before it ships to you.',
    primaryCta: { label: 'Shop All Gear', route: '/shop' },
    secondaryCta: { label: 'Visit Our Store', route: '/contact' }
  },
  {
    type: 'photo',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=2400&q=80',
    kicker: 'Riding Gear',
    headline: 'Jackets, Gloves & Boots for Every Season',
    primaryCta: { label: 'Shop Riding Gear', route: '/riding-gear' }
  },
  {
    type: 'poster',
    image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=2400&q=80',
    kicker: 'Accessories',
    headline: 'Luggage, Mounts & Crash Protection for Touring',
    copy: 'Picked for highway miles, not just the display shelf.',
    primaryCta: { label: 'Shop Accessories', route: '/bike-accessories' }
  },
  {
    type: 'photo',
    image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=2400&q=80',
    kicker: 'Helmets',
    headline: 'ECE 22.06 Certified Helmets, Fitted Right',
    primaryCta: { label: 'Shop Helmets', route: '/helmets' }
  }
];

const SLIDE_DURATION_MS = 5500;

export const RidingGalleryCarousel: React.FC = () => {
  const { navigate } = useShop();
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((idx: number) => {
    setActive(((idx % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, isPaused]);

  const slide = SLIDES[active];

  return (
    <section
      className="relative w-full h-[85vh] min-h-[520px] max-h-[860px] overflow-hidden bg-neutral-950 text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides with a Ken-Burns slow-zoom on the active one — a small
          detail that keeps a full-bleed static photo from feeling like a
          plain, ordinary slideshow. */}
      {SLIDES.map((s, idx) => (
        <img
          key={idx}
          src={s.image}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            idx === active ? 'opacity-100' : 'opacity-0'
          } ${idx === active ? 'animate-[kenburns_6.5s_ease-out_forwards]' : ''}`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-neutral-950/10" />
      {slide.type === 'poster' && (
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-950/20 to-transparent" />
      )}

      {/* Logo watermark — transparent, no background chip. A fixed,
          moderately-wide box (not the full 3:1 ratio) so it doesn't eat
          too much space; object-cover crops the outer edges slightly
          rather than shrinking the whole mark down to fit. */}
      <img
        src="/brand/logodt38.webp"
        alt="District 38"
        className="absolute top-6 sm:top-8 right-4 sm:right-8 w-14 h-9 sm:w-16 sm:h-10 object-cover z-20"
      />

      {/* Content */}
      {slide.type === 'poster' ? (
        <div className="relative z-10 h-full flex items-center px-6 sm:px-12 lg:px-20">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-orange-400 mb-4">
              <span className="w-1.5 h-1.5 bg-orange-500" />
              {slide.kicker}
            </div>
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.02] uppercase">
              {slide.headline}
            </h2>
            {slide.copy && (
              <p className="text-sm sm:text-base text-neutral-300 mt-5 max-w-md leading-relaxed">
                {slide.copy}
              </p>
            )}
            {(slide.primaryCta || slide.secondaryCta) && (
              <div className="flex flex-wrap gap-3 mt-8">
                {slide.primaryCta && (
                  <button
                    onClick={() => navigate(slide.primaryCta!.route)}
                    className="px-6 py-3 rounded-md bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm tracking-wide uppercase transition-colors"
                  >
                    {slide.primaryCta.label}
                  </button>
                )}
                {slide.secondaryCta && (
                  <button
                    onClick={() => navigate(slide.secondaryCta!.route)}
                    className="px-6 py-3 rounded-md border border-white/25 hover:border-white/50 hover:bg-white/5 text-white font-bold text-xs sm:text-sm tracking-wide uppercase transition-colors"
                  >
                    {slide.secondaryCta.label}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="relative z-10 h-full flex flex-col justify-end px-6 sm:px-12 lg:px-20 pb-16 sm:pb-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-orange-400 mb-2">
            {slide.kicker}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {slide.headline}
          </h2>
          {slide.primaryCta && (
            <div className="mt-5">
              <button
                onClick={() => navigate(slide.primaryCta!.route)}
                className="px-6 py-3 rounded-md bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm tracking-wide uppercase transition-colors"
              >
                {slide.primaryCta.label}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Prev / Next */}
      <button
        onClick={() => goTo(active - 1)}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button
        onClick={() => goTo(active + 1)}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <style>{`
        @keyframes kenburns {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
      `}</style>
    </section>
  );
};
