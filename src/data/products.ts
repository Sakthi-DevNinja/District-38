import { Product } from '../types';

export const PRODUCTS: Product[] = [
  // ================= HELMETS =================
  {
    id: 'prod-mt-thunder-4-sv',
    slug: 'mt-thunder-4-sv-helmet',
    name: 'MT Thunder 4 SV Solid Full Face Helmet',
    brand: 'MT Helmets',
    category: 'helmets',
    subcategory: 'Full Face',
    price: 6750,
    originalPrice: 7500,
    discountPercent: 10,
    rating: 4.9,
    reviewCount: 142,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    stockCount: 12,
    thumbnail: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'Latest ECE 22.06 certified aerodynamic full-face helmet with integrated sun visor and HIRP shell technology.',
    description: 'The MT Thunder 4 SV represents the pinnacle of safety and value in full-face helmets. Tested under the stringent new ECE 22.06 European safety protocols, it features High Impact Resistant Polymer (HIRP) shell construction, an internal dropdown drop-down sun visor with smooth single-hand actuation, and an aerodynamic rear spoiler optimized for touring and highway cruising.',
    features: [
      'ECE 22.06 & DOT & ISI triple certification standards',
      'High Impact Resistant Polymer (HIRP) outer shell',
      'Internal dropdown sun visor with anti-scratch UV400 coating',
      'Pinlock 70 Max Vision ready outer visor with 2.2mm thickness',
      'Multi-density EPS impact absorbing liner with channeled airflow',
      'Micrometric quick release metallic retention buckle',
      'Removable, washable hypoallergenic interior padding with emergency quick-release cheek pads'
    ],
    specifications: [
      { label: 'Shell Material', value: 'HIRP (High Impact Resistant Polymer)' },
      { label: 'Weight', value: '1500g ± 50g' },
      { label: 'Safety Certification', value: 'ECE 22.06 / DOT / ISI' },
      { label: 'Closure System', value: 'Micrometric Metal Buckle' },
      { label: 'Visor System', value: 'Pinlock 70 MaxVision Ready, Quick Release Mechanism' },
      { label: 'Warranty', value: '2 Years Manufacturer Warranty' }
    ],
    certifications: ['ECE 22.06', 'DOT', 'ISI'],
    ridingStyles: ['City', 'Touring', 'Performance'],
    availableColors: [
      { name: 'Matt Black', hex: '#1e1e1e' },
      { name: 'Titanium Grey', hex: '#52525b' },
      { name: 'Gloss Pearl White', hex: '#f4f4f5' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    variants: [
      { id: 'v-mt-mb-m', name: 'Matt Black / M', colorName: 'Matt Black', colorHex: '#1e1e1e', size: 'M', sku: 'MT-T4-MB-M', inStock: true, stockCount: 5 },
      { id: 'v-mt-mb-l', name: 'Matt Black / L', colorName: 'Matt Black', colorHex: '#1e1e1e', size: 'L', sku: 'MT-T4-MB-L', inStock: true, stockCount: 4 },
      { id: 'v-mt-mb-xl', name: 'Matt Black / XL', colorName: 'Matt Black', colorHex: '#1e1e1e', size: 'XL', sku: 'MT-T4-MB-XL', inStock: true, stockCount: 3 },
      { id: 'v-mt-gw-l', name: 'Gloss White / L', colorName: 'Gloss Pearl White', colorHex: '#f4f4f5', size: 'L', sku: 'MT-T4-GW-L', inStock: true, stockCount: 2 }
    ],
    material: 'HIRP Thermoplastic & Multi-density EPS',
    weight: '1500g',
    warranty: '2 Years Direct Manufacturer Warranty',
    includedInBox: ['MT Thunder 4 SV Helmet', 'Premium Microfiber Helmet Bag', 'Reflective Safety Stickers', 'User Manual'],
    frequentlyBoughtWith: ['prod-motul-helmet-cleaner', 'prod-rynox-air-gt-gloves']
  },
  {
    id: 'prod-axor-apex-carbon-helmet',
    slug: 'axor-apex-carbon-helmet',
    name: 'Axor Apex Carbon Fiber ECE 22.06 Helmet',
    brand: 'Axor',
    category: 'helmets',
    subcategory: 'Full Face',
    price: 13999,
    originalPrice: 15499,
    discountPercent: 10,
    rating: 4.95,
    reviewCount: 98,
    isFeatured: true,
    isNew: true,
    inStock: true,
    stockCount: 6,
    thumbnail: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'Ultra-lightweight real 3K Carbon Fiber shell engineered for supersport track days and high-velocity highway touring.',
    description: 'The Axor Apex Carbon is forged with aircraft-grade 3K carbon weave for exceptional tensile strength and unmatched lightness. Built for riders who refuse to compromise between featherweight agility and uncompromising collision protection.',
    features: [
      'Genuine 3K Carbon Fiber outer composite shell',
      'ECE 22.06 & DOT approved with ISI certification',
      'Ultra lightweight construction weighing under 1350g',
      'Dual visor system: Optical Class 1 outer visor + internal sun shield',
      'Double D-Ring titanium-alloy retention strap for track approval',
      'Integrated spoiler tuned in wind-tunnel simulations',
      'Bluetooth intercom speaker pockets pre-cut for easy communicator install'
    ],
    specifications: [
      { label: 'Shell', value: '100% 3K Multi-Axis Carbon Fiber' },
      { label: 'Weight', value: '1350g ± 30g' },
      { label: 'Homologation', value: 'ECE 22.06, DOT, ISI' },
      { label: 'Fastener', value: 'Double D-Ring (Track Certified)' },
      { label: 'Visor', value: 'Class 1 Optically Correct, Anti-Fog Ready' }
    ],
    certifications: ['ECE 22.06', 'DOT', 'ISI'],
    ridingStyles: ['Performance', 'Touring'],
    availableColors: [
      { name: 'Raw Gloss Carbon', hex: '#18181b' },
      { name: 'Carbon Stealth Matt', hex: '#27272a' }
    ],
    availableSizes: ['M', 'L', 'XL'],
    variants: [
      { id: 'v-axor-c-m', name: 'Raw Gloss Carbon / M', colorName: 'Raw Gloss Carbon', colorHex: '#18181b', size: 'M', sku: 'AX-APX-C-M', inStock: true, stockCount: 2 },
      { id: 'v-axor-c-l', name: 'Raw Gloss Carbon / L', colorName: 'Raw Gloss Carbon', colorHex: '#18181b', size: 'L', sku: 'AX-APX-C-L', inStock: true, stockCount: 3 },
      { id: 'v-axor-c-xl', name: 'Raw Gloss Carbon / XL', colorName: 'Raw Gloss Carbon', colorHex: '#18181b', size: 'XL', sku: 'AX-APX-C-XL', inStock: true, stockCount: 1 }
    ],
    material: '3K Carbon Fiber Weave & Dual Density EPS',
    weight: '1350g',
    warranty: '3 Years Warranty',
    includedInBox: ['Axor Apex Carbon Helmet', 'Dark Smoke Additional Visor', 'Pinlock Anti-Fog Insert', 'Padded Helmet Rucksack'],
    frequentlyBoughtWith: ['prod-rynox-stealth-air-pro', 'prod-bobo-phone-mount']
  },
  {
    id: 'prod-smk-titan-touring-helmet',
    slug: 'smk-titan-touring-helmet',
    name: 'SMK Titan Composite Fibre Helmet',
    brand: 'SMK',
    category: 'helmets',
    subcategory: 'Full Face',
    price: 9450,
    originalPrice: 10500,
    discountPercent: 10,
    rating: 4.8,
    reviewCount: 64,
    inStock: true,
    stockCount: 8,
    thumbnail: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'Advanced composite fibre dual-visor helmet with acoustic neck roll and dynamic multi-port ventilation.',
    description: 'SMK Titan is engineered for all-day touring comfort. Constructed with premium composite fibre matrix, it delivers remarkable noise reduction, panoramic field of view, and all-weather moisture-wicking comfort lining.',
    features: [
      'Composite Fibre lightweight shell matrix',
      'ECE 22.05 & ISI approved with DOT standard',
      'Extra wide eyeport for 190-degree peripheral visibility',
      'Integrated drop-down internal sun visor',
      'Resil coating visor with Pinlock ready configuration',
      'Breath deflector and chin curtain included'
    ],
    specifications: [
      { label: 'Shell Material', value: 'Premium Composite Fibre' },
      { label: 'Weight', value: '1450g' },
      { label: 'Certifications', value: 'ECE 22.05 / DOT / ISI' }
    ],
    certifications: ['ECE 22.05', 'DOT', 'ISI'],
    ridingStyles: ['Touring', 'City'],
    availableColors: [
      { name: 'Anthracite Matt', hex: '#3f3f46' },
      { name: 'Gloss Arctic White', hex: '#ffffff' }
    ],
    availableSizes: ['M', 'L', 'XL'],
    variants: [
      { id: 'v-smk-am-m', name: 'Anthracite Matt / M', colorName: 'Anthracite Matt', colorHex: '#3f3f46', size: 'M', sku: 'SMK-TIT-AM-M', inStock: true, stockCount: 3 },
      { id: 'v-smk-am-l', name: 'Anthracite Matt / L', colorName: 'Anthracite Matt', colorHex: '#3f3f46', size: 'L', sku: 'SMK-TIT-AM-L', inStock: true, stockCount: 5 }
    ],
    weight: '1450g',
    warranty: '2 Years Manufacturer Warranty'
  },
  {
    id: 'prod-mt-street-open-face',
    slug: 'mt-street-open-face-helmet',
    name: 'MT Street Jet Open Face Helmet',
    brand: 'MT Helmets',
    category: 'helmets',
    subcategory: 'Open Face',
    price: 3450,
    originalPrice: 3850,
    discountPercent: 10,
    rating: 4.7,
    reviewCount: 51,
    inStock: true,
    stockCount: 15,
    thumbnail: 'https://images.unsplash.com/photo-1558981420-87aa9210d99c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558981420-87aa9210d99c?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'Compact, ultra-breathable urban commuter open face helmet with long anti-scratch optical shield.',
    description: 'Designed for daily city rides, cafe runs, and warm weather commutes. Features a long protective visor extending below the chin line, high flow vent scoops, and lightweight shell geometry.',
    features: [
      'Aerodynamic urban shell profile with deep visor coverage',
      'ECE & ISI certified for complete compliance',
      'Quick release micrometric retention strap',
      'High ventilation comfort liner'
    ],
    specifications: [
      { label: 'Weight', value: '1150g' },
      { label: 'Certifications', value: 'ECE 22.05 / ISI' }
    ],
    certifications: ['ECE 22.05', 'ISI'],
    ridingStyles: ['City'],
    availableColors: [
      { name: 'Matt Black', hex: '#18181b' },
      { name: 'Nardo Grey', hex: '#71717a' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 'v-mt-st-m', name: 'Matt Black / M', colorName: 'Matt Black', size: 'M', sku: 'MT-ST-MB-M', inStock: true, stockCount: 8 }
    ],
    weight: '1150g'
  },

  // ================= RIDING GEAR: JACKETS =================
  {
    id: 'prod-rynox-stealth-air-pro',
    slug: 'rynox-stealth-air-pro-riding-jacket',
    name: 'Rynox Stealth Air Pro Mesh Riding Jacket',
    brand: 'Rynox',
    category: 'riding-gear',
    subcategory: 'Jackets',
    price: 11450,
    originalPrice: 12250,
    discountPercent: 7,
    rating: 4.96,
    reviewCount: 184,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    stockCount: 14,
    thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'All-season breathable 3D mesh jacket packed with Knox & Safe-Tech CE Level 2 armor at back, shoulders, elbows, and chest.',
    description: 'The Rynox Stealth Air Pro is the benchmark for hot-weather and long-distance touring safety. Engineered with heavy-duty 600D Cordura chassis and 3D airflow mesh panels, this jacket delivers maximum ventilation without compromising abrasion resistance. Equipped with complete CE Level 2 armor across all impact zones, including integrated chest protector inserts.',
    features: [
      'Safe-Tech CE Level 2 armor at Back, Shoulders, and Elbows',
      'Powertector CE Level 2 Chest Protectors included as standard',
      'Invista Cordura 600D high abrasion impact zones on shoulders & sleeves',
      'Super-breathable 3D Mesh panels across chest, back, and arms',
      'Reflective 3M Scotchlite panels for 360-degree night visibility',
      'Internal waterproof stash pocket and external cargo pockets',
      'Pant connection zipper compatible with all Rynox & touring pants'
    ],
    specifications: [
      { label: 'Chassis Material', value: 'Cordura 600D + High Abrasion Resistant 3D Mesh' },
      { label: 'Back Armour', value: 'Safe-Tech CE Level 2 (EN1621-2:2014)' },
      { label: 'Shoulder & Elbow', value: 'Safe-Tech CE Level 2 (EN1621-1:2012)' },
      { label: 'Chest Armour', value: 'Powertector CE Level 2 Inserts' },
      { label: 'Rain Liner', value: 'External Standalone Rain Jacket included' },
      { label: 'Warranty', value: '1 Year Manufacturer Warranty' }
    ],
    certifications: ['CE Level 2'],
    ridingStyles: ['Touring', 'City', 'Adventure'],
    availableColors: [
      { name: 'Black & Hi-Viz Orange', hex: '#ea580c' },
      { name: 'Stealth Black', hex: '#18181b' },
      { name: 'Olive Green & Black', hex: '#3f4f3e' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    variants: [
      { id: 'v-rynox-s-m', name: 'Stealth Black / M', colorName: 'Stealth Black', colorHex: '#18181b', size: 'M', sku: 'RYN-SAP-SB-M', inStock: true, stockCount: 4 },
      { id: 'v-rynox-s-l', name: 'Stealth Black / L', colorName: 'Stealth Black', colorHex: '#18181b', size: 'L', sku: 'RYN-SAP-SB-L', inStock: true, stockCount: 6 },
      { id: 'v-rynox-s-xl', name: 'Stealth Black / XL', colorName: 'Stealth Black', colorHex: '#18181b', size: 'XL', sku: 'RYN-SAP-SB-XL', inStock: true, stockCount: 3 },
      { id: 'v-rynox-o-l', name: 'Black & Hi-Viz Orange / L', colorName: 'Black & Hi-Viz Orange', colorHex: '#ea580c', size: 'L', sku: 'RYN-SAP-OR-L', inStock: true, stockCount: 3 }
    ],
    material: 'Cordura 600D, 3D Mesh & Safe-Tech CE Level 2 Elastomer',
    weight: '2.1 kg',
    warranty: '1 Year Rynox Guarantee',
    includedInBox: ['Stealth Air Pro Jacket', 'Complete CE Level 2 Armour Set Pre-Installed', 'External Waterproof Rain Jacket Liner', 'Hanger & Cover'],
    frequentlyBoughtWith: ['prod-rynox-air-gt-gloves', 'prod-viaterra-miller-pants']
  },
  {
    id: 'prod-rynox-tornado-pro-4',
    slug: 'rynox-tornado-pro-4-jacket',
    name: 'Rynox Tornado Pro 4 All-Terrain Touring Jacket',
    brand: 'Rynox',
    category: 'riding-gear',
    subcategory: 'Jackets',
    price: 8950,
    originalPrice: 9800,
    discountPercent: 9,
    rating: 4.88,
    reviewCount: 110,
    isFeatured: true,
    inStock: true,
    stockCount: 9,
    thumbnail: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'Durable dual-layer touring jacket with modular rain and thermal liners plus Knox Level 2 armour.',
    description: 'The quintessential jacket for Indian riders tackling Ladakh, coastal highways, and daily city grinds. Comes with Knox CE Level 2 armors, heavy abrasion Cordura shell, and modular multi-climate liners.',
    features: [
      'Knox Microlock CE Level 2 protectors on shoulders and elbows',
      'Safe-Tech CE Level 2 back protector',
      'Heavy-duty 700D woven polyester shell',
      'Includes dual thermal and rain liners',
      'Accordion stretch panels on elbows for fatigue-free reach'
    ],
    specifications: [
      { label: 'Outer Shell', value: '700D Heavy Woven Poly-Cordura' },
      { label: 'Armour Rating', value: 'CE Level 2 Certified' }
    ],
    certifications: ['CE Level 2'],
    ridingStyles: ['Touring', 'Adventure'],
    availableColors: [
      { name: 'Charcoal Grey', hex: '#374151' },
      { name: 'Desert Sand / Black', hex: '#d4b996' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    variants: [
      { id: 'v-tor-cg-m', name: 'Charcoal Grey / M', colorName: 'Charcoal Grey', size: 'M', sku: 'RYN-TP4-CG-M', inStock: true, stockCount: 4 },
      { id: 'v-tor-cg-l', name: 'Charcoal Grey / L', colorName: 'Charcoal Grey', size: 'L', sku: 'RYN-TP4-CG-L', inStock: true, stockCount: 5 }
    ]
  },

  // ================= RIDING GEAR: GLOVES =================
  {
    id: 'prod-rynox-air-gt-gloves',
    slug: 'rynox-air-gt-mesh-gloves',
    name: 'Rynox Air GT 3 Full Leather & Mesh Riding Gloves',
    brand: 'Rynox',
    category: 'riding-gear',
    subcategory: 'Gloves',
    price: 3250,
    originalPrice: 3600,
    discountPercent: 10,
    rating: 4.9,
    reviewCount: 220,
    isBestSeller: true,
    inStock: true,
    stockCount: 20,
    thumbnail: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'Supple goat leather palm, TPU molded knuckle protector, and touchscreen-sensitive index finger.',
    description: 'Combining premium full-grain goat leather on the palm with 3D breathable mesh on the back of the hand. Features carbon-look TPU knuckle protection, Knox SPS scaphoid palm slider, and conductive touch fingertips.',
    features: [
      '100% Full-grain drum-dyed Goat leather on palm for superior throttle feel',
      'Molded TPU ergonomic knuckle armor with air intake vents',
      'Knox SPS (Scaphoid Protection System) patented palm slider to prevent wrist hyperextension',
      'Touchscreen sensitive conductive leather on index finger and thumb',
      'Pre-curved race ergonomic finger profile for reduced throttle fatigue'
    ],
    specifications: [
      { label: 'Palm Material', value: '100% Goat Leather' },
      { label: 'Knuckle Armor', value: 'High-Density TPU Hard Shield' },
      { label: 'Palm Slider', value: 'Knox SPS System' },
      { label: 'Touchscreen Compatible', value: 'Yes (Thumb & Index)' }
    ],
    certifications: ['CE Level 1'],
    ridingStyles: ['City', 'Touring', 'Performance'],
    availableColors: [
      { name: 'All Black', hex: '#18181b' },
      { name: 'Black & High-Viz Orange', hex: '#ea580c' },
      { name: 'Black & White', hex: '#ffffff' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL', '2XL'],
    variants: [
      { id: 'v-agt-bk-m', name: 'All Black / M', colorName: 'All Black', size: 'M', sku: 'RYN-AGT-BK-M', inStock: true, stockCount: 8 },
      { id: 'v-agt-bk-l', name: 'All Black / L', colorName: 'All Black', size: 'L', sku: 'RYN-AGT-BK-L', inStock: true, stockCount: 7 },
      { id: 'v-agt-bk-xl', name: 'All Black / XL', colorName: 'All Black', size: 'XL', sku: 'RYN-AGT-BK-XL', inStock: true, stockCount: 5 }
    ]
  },
  {
    id: 'prod-bbg-carbon-gloves',
    slug: 'bbg-carbon-pro-racing-gloves',
    name: 'BBG Carbon Pro Full Gauntlet Racing Gloves',
    brand: 'BBG',
    category: 'riding-gear',
    subcategory: 'Gloves',
    price: 4850,
    originalPrice: 5500,
    discountPercent: 12,
    rating: 4.82,
    reviewCount: 45,
    inStock: true,
    stockCount: 7,
    thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'Full gauntlet track-spec gloves with genuine carbon knuckle and wrist shields, kangaroo leather palm, and pinky bridge.',
    description: 'Designed for high speed touring and circuit track enthusiasts. Real carbon fiber knuckle and wrist protectors dissipate impact energy while Kevlar thread stitching prevents seam burst under slide.',
    features: [
      'Real Carbon Fiber knuckle, wrist, and finger protectors',
      'Full gauntlet with dual Velcro wrist locking system',
      'Bridge connection between little finger and ring finger to prevent torsion'
    ],
    specifications: [
      { label: 'Leather', value: 'Top Grain Cowhide & Kangaroo Palm' },
      { label: 'Protection', value: '3K Carbon Fiber Armor' }
    ],
    certifications: ['CE Level 2'],
    ridingStyles: ['Performance', 'Touring'],
    availableColors: [{ name: 'Carbon Black', hex: '#18181b' }],
    availableSizes: ['M', 'L', 'XL'],
    variants: [
      { id: 'v-bbg-cb-m', name: 'Carbon Black / M', size: 'M', sku: 'BBG-CP-M', inStock: true, stockCount: 3 },
      { id: 'v-bbg-cb-l', name: 'Carbon Black / L', size: 'L', sku: 'BBG-CP-L', inStock: true, stockCount: 4 }
    ]
  },

  // ================= RIDING GEAR: PANTS =================
  {
    id: 'prod-viaterra-miller-pants',
    slug: 'viaterra-miller-mesh-riding-pants',
    name: 'ViaTerra Miller Urban Mesh Riding Pants',
    brand: 'Viaterra',
    category: 'riding-gear',
    subcategory: 'Pants',
    price: 6999,
    originalPrice: 7999,
    discountPercent: 12,
    rating: 4.85,
    reviewCount: 76,
    isFeatured: true,
    inStock: true,
    stockCount: 11,
    thumbnail: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'Tailored fit breathable riding pants equipped with Sas-Tec CE Level 2 knee and hip armor.',
    description: 'Engineered specifically for South Indian tropical climate and all-day endurance riding. Constructed with 600D Cordura reinforcement at the seat and knees, combined with heavy airflow mesh panels.',
    features: [
      'Sas-Tec CE Level 2 German-engineered Knee & Hip armor included',
      'Dual-position knee armor pocket to dial in exact knee cap placement',
      'Heavy 1000D Cordura reinforcement on seat to eliminate slide wear',
      'YKK zippers throughout and connection zip to riding jackets'
    ],
    specifications: [
      { label: 'Armor', value: 'Sas-Tec CE Level 2 (Knee & Hip)' },
      { label: 'Chassis', value: 'Cordura 600D & Airflow 3D Mesh' }
    ],
    certifications: ['CE Level 2'],
    ridingStyles: ['Touring', 'City', 'Adventure'],
    availableColors: [{ name: 'Stealth Black', hex: '#18181b' }],
    availableSizes: ['30', '32', '34', '36', '38'],
    variants: [
      { id: 'v-vm-32', name: 'Stealth Black / 32', size: '32', sku: 'VT-MIL-32', inStock: true, stockCount: 4 },
      { id: 'v-vm-34', name: 'Stealth Black / 34', size: '34', sku: 'VT-MIL-34', inStock: true, stockCount: 5 },
      { id: 'v-vm-36', name: 'Stealth Black / 36', size: '36', sku: 'VT-MIL-36', inStock: true, stockCount: 2 }
    ]
  },

  // ================= RIDING GEAR: BOOTS =================
  {
    id: 'prod-royal-enfield-cabo-boots',
    slug: 'royal-enfield-cabo-waterproof-riding-boots',
    name: 'Royal Enfield Cabo WP Touring Boots',
    brand: 'Royal Enfield',
    category: 'riding-gear',
    subcategory: 'Boots',
    price: 8500,
    originalPrice: 9500,
    discountPercent: 11,
    rating: 4.87,
    reviewCount: 92,
    isBestSeller: true,
    inStock: true,
    stockCount: 8,
    thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'Full grain waxed leather mid-calf adventure boots with waterproof membrane and reinforced malleolus.',
    description: 'Rugged elegance meets all-weather functionality. Built with full-grain hydrophobic leather, composite ankle discs, reinforced heel & toe box, and anti-slip oil-resistant rubber lug soles.',
    features: [
      'Hydrophobic full-grain leather upper with breathable waterproof liner',
      'Thermoformed reinforced toe cap and heel counter',
      'TPU medial and lateral malleolus ankle protection discs',
      'Vibram-style heavy lug sole for firm grip on slippery footpegs and dirt trails',
      'YKK side zipper with Velcro flap for quick entry'
    ],
    specifications: [
      { label: 'Upper', value: 'Full Grain Waxed Cow Leather' },
      { label: 'Protection', value: 'CE EN 13634:2017 Certified' },
      { label: 'Waterproofing', value: 'Integrated WP Breathable Membrane' }
    ],
    certifications: ['CE Level 2'],
    ridingStyles: ['Touring', 'Adventure', 'City'],
    availableColors: [
      { name: 'Vintage Tobacco Brown', hex: '#78350f' },
      { name: 'Onyx Black', hex: '#18181b' }
    ],
    availableSizes: ['40 (UK 6)', '41 (UK 7)', '42 (UK 8)', '43 (UK 9)', '44 (UK 10)', '45 (UK 11)'],
    variants: [
      { id: 'v-re-tb-42', name: 'Vintage Brown / 42 (UK 8)', colorName: 'Vintage Tobacco Brown', size: '42 (UK 8)', sku: 'RE-CAB-BR-42', inStock: true, stockCount: 3 },
      { id: 'v-re-tb-43', name: 'Vintage Brown / 43 (UK 9)', colorName: 'Vintage Tobacco Brown', size: '43 (UK 9)', sku: 'RE-CAB-BR-43', inStock: true, stockCount: 3 }
    ]
  },

  // ================= BIKE ACCESSORIES =================
  {
    id: 'prod-viaterra-claw-tail-bag',
    slug: 'viaterra-claw-72l-motorcycle-tailbag',
    name: 'ViaTerra Claw 72L All-Weather Motorcycle Tail Bag',
    brand: 'Viaterra',
    category: 'bike-accessories',
    subcategory: 'Luggage',
    price: 4499,
    originalPrice: 4999,
    discountPercent: 10,
    rating: 4.95,
    reviewCount: 340,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    stockCount: 18,
    thumbnail: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'The gold standard 72L horse-shoe shaped tail bag universally compatible with virtually all motorcycles without luggage racks.',
    description: 'The legendary ViaTerra Claw fits securely across the pillion seat and hugs the rear profile of your motorcycle. Offers zero sway at high speeds, 100% waterproof drybag liner, and seamless mounting in under 60 seconds.',
    features: [
      'Universal 3-point mounting system works on Duke, Himalayan, Dominar, Interceptor, R15, and more',
      'Removable 100% waterproof roll-top inner drybag included',
      'Triple stitched 1200D PU coated polyester with automotive seatbelt webbing',
      'Wide U-shaped top opening for effortless access to clothes & gear',
      'External daisy chains and bungee anchor points to lash tents or sleeping bags'
    ],
    specifications: [
      { label: 'Capacity', value: '72 Litres' },
      { label: 'Chassis', value: '1200D Heavy Cordura Polyester' },
      { label: 'Mounting', value: '3-Point Quick Release Webbing' },
      { label: 'Waterproof', value: '100% Seam-Taped Inner Dry Bag Included' }
    ],
    certifications: [],
    ridingStyles: ['Touring', 'Adventure'],
    availableColors: [{ name: 'Stealth Black', hex: '#18181b' }],
    availableSizes: ['72L One Size'],
    variants: [
      { id: 'v-vt-claw-72', name: 'Stealth Black / 72L', size: '72L One Size', sku: 'VT-CLAW-72', inStock: true, stockCount: 18 }
    ],
    weight: '2.4 kg',
    warranty: '1 Year Warranty'
  },
  {
    id: 'prod-bobo-phone-mount',
    slug: 'bobo-claw-grip-aluminum-phone-mount-with-fast-charger',
    name: 'BOBO Claw-Grip Aluminium Mobile Mount with 15W Qi Fast Charger',
    brand: 'Bobo',
    category: 'bike-accessories',
    subcategory: 'Mounts',
    price: 1999,
    originalPrice: 2499,
    discountPercent: 20,
    rating: 4.88,
    reviewCount: 412,
    isBestSeller: true,
    inStock: true,
    stockCount: 30,
    thumbnail: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'Heavy-duty CNC machined aluminium handlebar mobile phone holder with anti-vibration dampers and dual Qi Wireless + USB-C fast charging.',
    description: 'Engineered from aeronautical aluminium alloy to survive the toughest Indian off-road terrain. Features vibration damping silicone claws that cradle any smartphone (4.7 to 7 inches) securely even on bad roads.',
    features: [
      'CNC Machined Aircraft Aluminum body with corrosion resistant anodization',
      'Built-in 15W Qi Wireless Fast Charging + 18W USB-C QuickCharge 3.0 port',
      'IP66 Waterproof on-off power switch with battery discharge protection',
      'Fits handlebars from 22mm to 32mm diameter plus rearview mirror mount included'
    ],
    specifications: [
      { label: 'Material', value: 'CNC T6061 Aluminum' },
      { label: 'Charging Output', value: '15W Wireless Qi / 18W QC3.0 USB-C' },
      { label: 'Waterproof Rating', value: 'IP66' }
    ],
    certifications: [],
    ridingStyles: ['City', 'Touring', 'Adventure'],
    availableColors: [{ name: 'Matte Black', hex: '#18181b' }],
    availableSizes: ['Universal'],
    variants: [
      { id: 'v-bobo-blk', name: 'Matte Black / Universal', size: 'Universal', sku: 'BOBO-BM4-PRO', inStock: true, stockCount: 30 }
    ]
  },
  {
    id: 'prod-sena-50s-communicator',
    slug: 'sena-50s-mesh-intercom-communicator',
    name: 'Sena 50S Mesh 2.0 Intercom Communicator with Harman Kardon Speakers',
    brand: 'Sena',
    category: 'bike-accessories',
    subcategory: 'Lighting & Electronics',
    price: 33999,
    originalPrice: 36999,
    discountPercent: 8,
    rating: 4.98,
    reviewCount: 38,
    isFeatured: true,
    inStock: true,
    stockCount: 4,
    thumbnail: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'World-class motorcycle communication featuring Harman Kardon sound and Mesh 2.0 group talk up to 8 km.',
    description: 'The pinnacle of motorcycle communications. Sound By Harman Kardon brings rich audio fidelity to your helmet while Sena Mesh 2.0 lets you instantly connect with up to 24 riders on private channels or near limitless riders on open mesh.',
    features: [
      'SOUND BY Harman Kardon premium speakers and microphone',
      'Mesh 2.0 One-Click-to-Connect robust multi-rider intercom',
      'Bluetooth 5.0 with multi-device pairing (Phone + GPS + Intercom)',
      'Fast charging: 20 minutes gives 3.5 hours Mesh intercom runtime'
    ],
    specifications: [
      { label: 'Audio', value: 'Sound By Harman Kardon' },
      { label: 'Intercom Range', value: 'Up to 2 km (1.2 mi) rider-to-rider / up to 8 km in mesh group' },
      { label: 'Talk Time', value: 'Bluetooth: 14 hrs / Mesh: 9 hrs' }
    ],
    certifications: [],
    ridingStyles: ['Touring', 'Adventure', 'Performance'],
    availableColors: [{ name: 'Dark Titanium', hex: '#3f3f46' }],
    availableSizes: ['Single Pack'],
    variants: [
      { id: 'v-sena-50s', name: 'Single Pack', size: 'Single Pack', sku: 'SENA-50S-01', inStock: true, stockCount: 4 }
    ]
  },

  // ================= BIKE CARE =================
  {
    id: 'prod-motul-c1-c2-combo',
    slug: 'motul-c1-chain-clean-c2-chain-lube-combo',
    name: 'Motul C1 Chain Clean (400ml) + C2 Chain Lube Road (400ml) Combo with Grunge Brush',
    brand: 'Motul',
    category: 'bike-care',
    subcategory: 'Chain Care',
    price: 1049,
    originalPrice: 1199,
    discountPercent: 12,
    rating: 4.96,
    reviewCount: 512,
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
    stockCount: 40,
    thumbnail: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'The ultimate motorcycle drive chain maintenance package. Powerful chlorine-free degreaser and high-cling synthetic lubricant.',
    description: 'Ensure maximum sprocket longevity and silky smooth throttle response. Motul C1 penetrates and melts stubborn road grime, tar, and old chain paste without harming O-Ring, X-Ring, or Z-Ring rubbers. Motul C2 leaves a non-sticky protective film that resists centrifugal fling at speeds exceeding 200 km/h.',
    features: [
      'Includes 1x Motul C1 Chain Clean 400ml + 1x Motul C2 Chain Lube Road 400ml',
      'Free high-density 3D grunge chain cleaning brush included in this District 38 bundle',
      'Compatible with O-RING, X-RING, Z-RING drive chains',
      'Resists water wash-off and highway dirt fling'
    ],
    specifications: [
      { label: 'Volume', value: '400ml + 400ml' },
      { label: 'Chain Type', value: 'O / X / Z Rings' },
      { label: 'Origin', value: 'Made in France' }
    ],
    certifications: [],
    ridingStyles: ['City', 'Touring', 'Adventure', 'Performance'],
    availableColors: [{ name: 'Default Pack', hex: '#ea580c' }],
    availableSizes: ['400ml + 400ml Combo'],
    variants: [
      { id: 'v-motul-c1c2', name: '400ml Combo Pack', size: '400ml + 400ml Combo', sku: 'MOT-C1C2-BRUSH', inStock: true, stockCount: 40 }
    ]
  },
  {
    id: 'prod-motul-helmet-cleaner',
    slug: 'motul-m1-helmet-and-visor-clean-spray',
    name: 'Motul M1 Helmet & Visor Clean + M2 Helmet Interior Sanitizer (250ml Pack)',
    brand: 'Motul',
    category: 'bike-care',
    subcategory: 'Helmet Cleaners',
    price: 799,
    originalPrice: 899,
    discountPercent: 11,
    rating: 4.89,
    reviewCount: 168,
    inStock: true,
    stockCount: 25,
    thumbnail: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'Neutral non-aggressive spray for instant bug removal and anti-bacterial dermatological interior foam cleaner.',
    description: 'Keeps your helmet looking showroom crisp and smelling fresh after sweaty monsoon or summer tours. Leaves an anti-fog protective film on optical visors without streaking.',
    features: [
      'M1 Cleans exterior shell and visor without leaving streaks or micro-scratches',
      'Dissolves dead bugs and oily traffic grime effortlessly',
      'M2 Interior sanitizer deeply disinfects padding and removes sweat odors',
      'Dermatologically tested formula safe for sensitive facial skin'
    ],
    specifications: [
      { label: 'Volume', value: '250ml + 250ml' },
      { label: 'Application', value: 'Helmet Shell, Visor, Foam Lining' }
    ],
    certifications: [],
    ridingStyles: ['City', 'Touring', 'Performance'],
    availableColors: [{ name: 'Standard Pack', hex: '#ea580c' }],
    availableSizes: ['250ml Duo Pack'],
    variants: [
      { id: 'v-motul-m1m2', name: 'Duo Pack', size: '250ml Duo Pack', sku: 'MOT-M1M2-DUO', inStock: true, stockCount: 25 }
    ]
  }
];

export const FEATURED_PRODUCTS = PRODUCTS.filter(p => p.isFeatured || p.isBestSeller);
