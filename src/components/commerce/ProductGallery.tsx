import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff, Maximize2, ShieldCheck, Sparkles } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  certificationBadge?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  certificationBadge
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const hasImages = images.length > 0;
  const activeImage = images[selectedIndex] || images[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails on left/bottom */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 lg:max-h-[520px] shrink-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-neutral-100 ${
                selectedIndex === idx
                  ? 'border-orange-600 ring-2 ring-orange-500/20'
                  : 'border-transparent hover:border-neutral-300 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Stage */}
      <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 group">
        {hasImages ? (
          <img
            src={activeImage}
            alt={`${productName} view ${selectedIndex + 1}`}
            className={`w-full h-full object-cover transition-transform duration-500 cursor-zoom-in ${
              isZoomed ? 'scale-150' : 'group-hover:scale-105'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-300 space-y-2">
            <ImageOff className="w-10 h-10" />
            <span className="text-xs font-medium text-neutral-400">No image available</span>
          </div>
        )}

        {/* Certification Badge */}
        {certificationBadge && (
          <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-lg bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold shadow-md flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{certificationBadge} Certified</span>
          </div>
        )}

        {/* Carousel Navigation Arrows */}
        {hasImages && images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 backdrop-blur-md text-neutral-800 hover:bg-white hover:scale-105 shadow-md transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 backdrop-blur-md text-neutral-800 hover:bg-white hover:scale-105 shadow-md transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Zoom Hint */}
        {hasImages && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-neutral-900/60 backdrop-blur-md text-[10px] text-white font-medium flex items-center space-x-1 pointer-events-none">
            <Maximize2 className="w-3 h-3" />
            <span>Click to zoom</span>
          </div>
        )}
      </div>
    </div>
  );
};
