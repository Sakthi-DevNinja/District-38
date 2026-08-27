export interface StoreLocation {
  name: string;
  tagline: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  address?: {
    street: string;
    line1?: string;
    line2?: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  phone: string;
  whatsapp: string;
  email: string;
  operatingHours: {
    days: string;
    hours: string;
  }[];
  coordinates: {
    lat: number;
    lng: number;
  };
  googleMapsUrl: string;
  mapsLink?: string;
  storeFeatures: string[];
  inStoreServices: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export const DISTRICT_38_STORE: StoreLocation = {
  name: 'District 38 — Trichy Flagship Store',
  tagline: 'Premier Motorcycle Gear & Helmet Experience Center',
  addressLine1: '75/c Alsa Complex, Salai Road',
  addressLine2: 'Next to Reliance Digital, Opposite HP Petrol Bunk',
  landmark: 'Opposite HP Petrol Bunk, Salai Road',
  city: 'Tiruchirappalli (Trichy)',
  state: 'Tamil Nadu',
  pincode: '620018',
  country: 'India',
  address: {
    street: '75/c Alsa Complex, Salai Road, Next to Reliance Digital',
    line1: '75/c Alsa Complex, Salai Road',
    line2: 'Next to Reliance Digital, Opposite HP Petrol Bunk',
    landmark: 'Opposite HP Petrol Bunk, Salai Road',
    city: 'Tiruchirappalli (Trichy)',
    state: 'Tamil Nadu',
    pincode: '620018',
    country: 'India'
  },
  phone: '+91 63697 08558',
  whatsapp: '+91 63697 08558',
  email: 'district38ops@gmail.com',
  operatingHours: [
    { days: 'Monday – Saturday', hours: '10:00 AM – 09:30 PM' },
    { days: 'Sunday', hours: '11:00 AM – 08:30 PM' }
  ],
  coordinates: {
    lat: 10.8288,
    lng: 78.6856
  },
  googleMapsUrl: 'https://maps.google.com/?q=District+38+Alsa+Complex+Salai+Road+Trichy',
  mapsLink: 'https://maps.google.com/?q=District+38+Alsa+Complex+Salai+Road+Trichy',
  storeFeatures: [
    'Laser Head Measurement & Sizing Machine',
    'Interactive Intercom Testing Acoustic Booth',
    'Riding Ergonomics Simulation Bike Rig',
    'Free In-Store Helmet Visor & Pinlock Installation',
    'Same-Day Click & Collect for Online Orders',
    'Ample Dedicated Motorcycle Parking in Front'
  ],
  inStoreServices: [
    {
      title: 'Free Helmet Fitting & Cheek Pad Tuning',
      description: 'Our certified technicians measure your cranial oval profile to guarantee zero pressure points and optimum retention safety.',
      icon: 'ShieldCheck'
    },
    {
      title: 'Gear Trial & Riding Posture Checks',
      description: 'Sit on our in-store motorcycle mock rig while wearing full leathers or touring jackets to test sleeve reach and knee bend angles.',
      icon: 'Compass'
    },
    {
      title: 'Intercom & Pinlock Installation',
      description: 'Complimentary precision installation of Sena/Cardo speakers and Pinlock 70/120 anti-fog lenses for all helmets purchased.',
      icon: 'Wrench'
    },
    {
      title: 'Express Click & Collect Pickup',
      description: 'Order online and collect your packaged gear at the Salai Road counter within 60 minutes with dedicated fast-track checkout.',
      icon: 'PackageCheck'
    }
  ]
};
