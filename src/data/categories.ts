import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-helmets',
    name: 'Helmets',
    slug: 'helmets',
    description: 'ECE 22.06, DOT, and ISI certified full-face, modular, open-face, and carbon fiber motorcycle helmets.',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1600&q=80',
    itemCount: 48,
    subcategories: [
      { name: 'Full Face', slug: 'full-face', description: 'Maximum chin and cranial protection with wind-tunnel tested aerodynamics.', itemCount: 28 },
      { name: 'Open Face', slug: 'open-face', description: 'Lightweight urban convenience with wide optical visors.', itemCount: 10 },
      { name: 'Modular / Flip-up', slug: 'modular', description: 'Touring flexibility with dual P/J homologation.', itemCount: 6 },
      { name: 'Off-Road / Dual Sport', slug: 'off-road', description: 'Peak visor sun shields and large goggle ports for dirt trails.', itemCount: 4 }
    ],
    featuredProductId: 'prod-mt-thunder-4-sv',
    guidePreview: {
      title: 'How to Choose Your First ECE 22.06 Helmet',
      excerpt: 'Understand head shapes, crown measurements, and why ECE 22.06 rotational testing matters.',
      guideSlug: 'helmet-sizing-and-ece-22-06-guide'
    }
  },
  {
    id: 'cat-riding-gear',
    name: 'Riding Gear',
    slug: 'riding-gear',
    description: 'CE Level 2 certified abrasion-resistant jackets, pants, gloves, waterproof boots, and all-weather rain suits.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=80',
    itemCount: 86,
    subcategories: [
      { name: 'Jackets', slug: 'riding-jackets', description: 'High-airflow 3D mesh and Cordura textile jackets with Knox/Safe-Tech armor.', itemCount: 32 },
      { name: 'Gloves', slug: 'riding-gloves', description: 'Full gauntlet track and short cuff mesh gloves with Knox scaphoid sliders.', itemCount: 24 },
      { name: 'Pants', slug: 'riding-pants', description: 'Reinforced knee and hip armored touring and urban mesh trousers.', itemCount: 16 },
      { name: 'Boots', slug: 'riding-boots', description: 'Ankle-supported CE certified waterproof and touring riding footwear.', itemCount: 14 }
    ],
    featuredProductId: 'prod-rynox-stealth-air-pro',
    guidePreview: {
      title: 'Riding Armour Levels: CE Level 1 vs Level 2 Explained',
      excerpt: 'Decode transmitted kilonewton force limits and make informed protection choices for highway touring.',
      guideSlug: 'riding-armour-levels-ce-level-1-vs-level-2'
    }
  },
  {
    id: 'cat-bike-accessories',
    name: 'Bike Accessories',
    slug: 'bike-accessories',
    description: 'Touring tail bags, waterproof tank bags, CNC aluminium phone mounts, Bluetooth intercoms, and crash guards.',
    image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1600&q=80',
    itemCount: 64,
    subcategories: [
      { name: 'Luggage & Bags', slug: 'luggage', description: 'Tailbags, saddlebags, and magnetic tank bags designed for long journeys.', itemCount: 26 },
      { name: 'Mounts & Navigation', slug: 'mounts', description: 'Anti-vibration phone holders with Qi wireless and USB-C charging.', itemCount: 14 },
      { name: 'Intercoms & Audio', slug: 'intercoms', description: 'Harman Kardon mesh communicators and Bluetooth helmet speakers.', itemCount: 12 },
      { name: 'Crash Protection', slug: 'protection', description: 'Engine guards, frame sliders, and heavy-duty handguards.', itemCount: 12 }
    ],
    featuredProductId: 'prod-viaterra-claw-tail-bag',
    guidePreview: {
      title: 'The Ultimate Motorcycle Packing Checklist for Ladakh & South India',
      excerpt: 'Weight distribution principles, waterproofing techniques, and essential spares to carry on every ride.',
      guideSlug: 'motorcycle-touring-packing-checklist'
    }
  },
  {
    id: 'cat-bike-care',
    name: 'Bike Care',
    slug: 'bike-care',
    description: 'Specialist chain cleaners, high-cling chain lubricants, visor foams, and ceramic bike wash formulas.',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1600&q=80',
    itemCount: 32,
    subcategories: [
      { name: 'Chain Lubricants', slug: 'chain-lube', description: 'High-speed synthetic lubes that eliminate fling and repel dirt.', itemCount: 12 },
      { name: 'Chain Cleaners', slug: 'chain-cleaner', description: 'O-ring safe degreasers that strip stubborn road tar in minutes.', itemCount: 8 },
      { name: 'Helmet & Visor Care', slug: 'helmet-care', description: 'Streak-free bug removers and sanitizing interior foam sprays.', itemCount: 6 },
      { name: 'Bike Polish & Shampoo', slug: 'bike-wash', description: 'pH balanced shampoos and hydrophobic ceramic detailing coatings.', itemCount: 6 }
    ],
    featuredProductId: 'prod-motul-c1-c2-combo',
    guidePreview: {
      title: 'How to Maintain Your Motorcycle Drive Chain for 30,000+ KMs',
      excerpt: 'The 500-km cleaning cadence, slack check, and lube application protocol every biker must know.',
      guideSlug: 'motorcycle-chain-maintenance-guide'
    }
  }
];
