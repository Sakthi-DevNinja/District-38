import { ProductReview } from '../types';

export const PRODUCT_REVIEWS: Record<string, ProductReview[]> = {
  'prod-mt-thunder-4-sv': [
    {
      id: 'rev-1',
      author: 'Vigneshwaran K.',
      rating: 5,
      date: '12 August 2026',
      title: 'Top notch ECE 22.06 protection! Visited Trichy store for sizing.',
      comment: 'Bought this from District 38 Trichy store. The staff helped me measure my head size (58cm - Medium) and swapped cheek pads for a perfect snug fit. Zero buffeting even at 120 km/h on Chennai-Trichy highway on my Duke 390. Dropdown sun visor works like butter.',
      verifiedPurchase: true,
      bikeModel: 'KTM Duke 390',
      helpfulCount: 24
    },
    {
      id: 'rev-2',
      author: 'Rahul Subramanian',
      rating: 5,
      date: '28 July 2026',
      title: 'Pinlock MaxVision is a lifesaver in monsoon fog',
      comment: 'Rode to Kodaikanal in heavy rains with this helmet. Visor stayed 100% fog-free. The aerodynamic spoiler genuinely reduces neck strain on long 8-hour highway rides.',
      verifiedPurchase: true,
      bikeModel: 'Royal Enfield Himalayan 450',
      helpfulCount: 16
    }
  ],
  'prod-rynox-stealth-air-pro': [
    {
      id: 'rev-3',
      author: 'Praveen Chander',
      rating: 5,
      date: '04 August 2026',
      title: 'Best airflow jacket for South Indian climate with CE Level 2 armor',
      comment: 'The 3D mesh panels are incredible in humid weather. You feel cool air circulating directly across your chest and back while having Safe-Tech Level 2 back and chest armor giving complete confidence. Fits perfectly with my riding pants.',
      verifiedPurchase: true,
      bikeModel: 'Yamaha R15 V4',
      helpfulCount: 31
    }
  ],
  'prod-viaterra-claw-tail-bag': [
    {
      id: 'rev-4',
      author: 'Deepak Mohan',
      rating: 5,
      date: '19 July 2026',
      title: 'The only tailbag you will ever need for Ladakh / Spiti',
      comment: 'Carried 8 days worth of clothes, shoes, and camera gear in this 72L claw. Zero sway on tight corners. The included yellow drybag kept everything bone dry through massive river crossings.',
      verifiedPurchase: true,
      bikeModel: 'BMW G310 GS',
      helpfulCount: 19
    }
  ],
  'prod-motul-c1-c2-combo': [
    {
      id: 'rev-5',
      author: 'Muthukumar S.',
      rating: 5,
      date: '02 August 2026',
      title: 'Essential maintenance kit for every rider',
      comment: 'C1 dissolves road tar and grime in seconds. C2 lube has almost zero fling when left to settle for 20 minutes before riding. Fast delivery from Trichy hub to Coimbatore in 24 hours!',
      verifiedPurchase: true,
      bikeModel: 'TVS Apache RR310',
      helpfulCount: 42
    }
  ]
};

export const REVIEWS = Object.entries(PRODUCT_REVIEWS).flatMap(([productId, revs]) =>
  revs.map(r => ({ ...r, productId }))
);
