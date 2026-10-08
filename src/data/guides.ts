import { RidingGuide } from '../types';

export const RIDING_GUIDES: RidingGuide[] = [
  {
    id: 'guide-helmet-sizing-ece-22-06',
    slug: 'helmet-sizing-and-ece-22-06-guide',
    title: 'Complete Helmet Sizing & ECE 22.06 Buying Guide',
    category: 'Helmet Guides',
    readTime: '6 min read',
    publishDate: 'August 2026',
    author: 'District 38 Technical Team',
    authorRole: 'Certified Helmet Fitting Specialists',
    coverImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Understand exact crown measurements, head shape profiles (Intermediate Oval vs Round), and why the new ECE 22.06 standard changes motorcycle cranial safety.',
    content: [
      {
        heading: 'Why ECE 22.06 is the Biggest Safety Leap in 20 Years',
        paragraphs: [
          'Until recently, the older ECE 22.05 standard tested impacts at just one designated speed and a fixed angle. The new ECE 22.06 protocol tests at 18 distinct impact points across high, medium, and low speeds, plus crucial rotational brain acceleration tests.',
          'When purchasing a helmet today, choosing an ECE 22.06 homologated model guarantees superior energy absorption across all collision scenarios.'
        ],
        callout: {
          type: 'spec',
          text: 'Key difference: ECE 22.06 tests helmet visors with steel pellets fired at 60 m/s (216 km/h) to ensure anti-shatter optical protection.'
        }
      },
      {
        heading: 'Step 1: Measuring Your Exact Head Circumference',
        paragraphs: [
          'Take a flexible cloth tailor tape and wrap it horizontally around the widest part of your head—approximately 2.5 cm (1 inch) above your eyebrows, resting just above the ears.',
          'Keep the tape snug but not uncomfortably tight. Record the measurement in centimetres. If you fall between sizes (e.g. 58.5 cm), always size down for full-face helmets, as internal EPS cheek pads break in by 10-15% within the first 15 hours of riding.'
        ]
      },
      {
        heading: 'Step 2: Checking the "Roll-Off" & Snugness Test',
        paragraphs: [
          'Fasten the chin strap securely (you should only be able to slide two fingers between strap and neck). Grasp the back of the helmet shell with both hands and attempt to roll it forward off your head.',
          'A properly fitted helmet will pull your forehead skin slightly without sliding freely. Your cheeks should experience a gentle "chipmunk" squeeze against the cheek pads without painful pressure points.'
        ],
        callout: {
          type: 'tip',
          text: 'District 38 Pro Tip: Visit our physical store for free laser-assisted head profiling and custom pad adjustments.'
        }
      }
    ],
    relatedProductIds: ['prod-mt-thunder-4-sv', 'prod-axor-apex-carbon-helmet', 'prod-smk-titan-touring-helmet'],
    tags: ['Helmets', 'Safety', 'ECE 22.06', 'Fitting', 'Beginner Guide']
  },
  {
    id: 'guide-armour-levels-explained',
    slug: 'riding-armour-levels-ce-level-1-vs-level-2',
    title: 'Riding Jacket Armour Levels: CE Level 1 vs Level 2 Explained',
    category: 'Riding Gear',
    readTime: '5 min read',
    publishDate: 'July 2026',
    author: 'Suresh Kumar',
    authorRole: 'Head of Gear Operations, District 38',
    coverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Demystifying EN 1621 European impact standards. Learn how transmitted kilonewton forces affect bone fracture thresholds during highway crashes.',
    content: [
      {
        heading: 'The Engineering Behind CE EN 1621 Testing',
        paragraphs: [
          'Motorcycle protectors undergo laboratory drop-tower tests where a 5 kg striker is dropped from 1 metre with 50 Joules of kinetic energy onto the armour placed over a load cell.',
          'The load cell measures how much force passes through the armour to your body, expressed in kiloNewtons (kN).'
        ],
        callout: {
          type: 'spec',
          text: 'CE Level 1 allows up to 35 kN maximum transmitted force (average ≤ 18 kN). CE Level 2 cuts transmitted force in half, allowing only ≤ 9 kN.'
        }
      },
      {
        heading: 'Why You Should Insist on CE Level 2 for Highway Touring',
        paragraphs: [
          'Human ribs and collarbones begin cracking at forces around 4 to 6 kN. At highway touring speeds (80-120 km/h), standard Level 1 armour absorbs only enough energy for low-velocity urban slides.',
          'For any rider doing long highway stretches across Tamil Nadu (such as Trichy-Chennai NH45 or Trichy-Madurai), upgrading your back and chest to CE Level 2 is non-negotiable.'
        ]
      }
    ],
    relatedProductIds: ['prod-rynox-stealth-air-pro', 'prod-rynox-tornado-pro-4', 'prod-viaterra-miller-pants'],
    tags: ['Jackets', 'Armour', 'CE Level 2', 'Touring']
  },
  {
    id: 'guide-chain-maintenance',
    slug: 'motorcycle-chain-maintenance-guide',
    title: 'How to Maintain Your Motorcycle Drive Chain for 30,000+ KMs',
    category: 'Maintenance',
    readTime: '4 min read',
    publishDate: 'June 2026',
    author: 'M. Arun',
    authorRole: 'Chief Technician, District 38',
    coverImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'The proven 500-km cleaning routine, safe degreasing methods, correct chain slack tolerances, and avoiding dangerous engine-running cleaning mistakes.',
    content: [
      {
        heading: 'The 500-Kilometre Golden Rule',
        paragraphs: [
          'Your motorcycle chain spins over 1,500 revolutions every single minute at 100 km/h. Road grime, sand, and dust turn old sticky lube into an abrasive grinding paste that destroys rubber O-rings and rapidly wears down sprocket teeth.',
          'Clean and lubricate your chain every 500 km under normal dry highway conditions, and every 300 km during wet monsoon conditions.'
        ]
      },
      {
        heading: 'Crucial Rule: NEVER Clean a Running Chain in Gear',
        paragraphs: [
          'Never put the bike on the center stand with the engine running in first gear while holding a brush or rag. Hundreds of riders suffer severe finger amputations each year from this mistake.',
          'Always keep the engine switched off and rotate the rear wheel manually by hand while spraying.'
        ],
        callout: {
          type: 'warning',
          text: 'Safety Warning: Always keep ignition OFF and keys in your pocket when working near the rear sprocket and chain.'
        }
      }
    ],
    relatedProductIds: ['prod-motul-c1-c2-combo', 'prod-bobo-phone-mount'],
    tags: ['Maintenance', 'Chain Care', 'Motul', 'Safety']
  },
  {
    id: 'guide-touring-packing',
    slug: 'motorcycle-touring-packing-checklist',
    title: 'The Ultimate Motorcycle Touring Packing & Weight Checklist',
    category: 'Touring',
    readTime: '7 min read',
    publishDate: 'May 2026',
    author: 'Karthik Raja',
    authorRole: 'Endurance Rider & District 38 Ambassador',
    coverImage: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Mastering center of gravity, waterproof layering, essential toolkits, and how horseshoe tailbags eliminate dangerous luggage sway on winding ghat roads.',
    content: [
      {
        heading: 'Center of Gravity & Weight Distribution',
        paragraphs: [
          'Luggage mounted high and far back behind the rear axle causes front-end lightness, headshake, and sluggish corner entry on ghat roads.',
          'Keep the heaviest items (toolkits, puncture kits, chain lube, spares) low and close to the pillion seat area. Reserve top bags for lightweight clothing and sleeping gear.'
        ]
      }
    ],
    relatedProductIds: ['prod-viaterra-claw-tail-bag', 'prod-royal-enfield-cabo-boots', 'prod-sena-50s-communicator'],
    tags: ['Touring', 'Luggage', 'Checklist', 'ViaTerra']
  }
];

export const GUIDES = RIDING_GUIDES;
