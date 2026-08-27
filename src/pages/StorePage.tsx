import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Navigation, 
  ShieldCheck, 
  Ruler, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Car
} from 'lucide-react';
import { DISTRICT_38_STORE } from '../data/storeInfo';
import { useShop } from '../context/ShopContext';

export const StorePage: React.FC = () => {
  const { openSizeGuide } = useShop();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. Hero Header */}
      <div className="bg-neutral-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-neutral-800 relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-orange-600/20 text-orange-400 border border-orange-500/30 text-xs font-bold font-mono">
            <span>TRICHY FLAGSHIP EXPERIENCE STORE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-mono uppercase">
            District 38 Sizing Studio & Retail Hub
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
            Step inside South India’s most comprehensive motorcycle riding gear showroom. Try on premium ECE 22.06 certified helmets, test riding postures on our simulation rig, and get laser head measurements from experienced motorcycle gear specialists.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={DISTRICT_38_STORE.mapsLink}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center space-x-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Live Google Maps Directions</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={`tel:${DISTRICT_38_STORE.phone}`}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition-colors flex items-center space-x-2"
            >
              <Phone className="w-4 h-4 text-orange-400" />
              <span>Call Store: +91 63697 08558</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Store Key Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Address */}
        <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-neutral-950">Store Address</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            {DISTRICT_38_STORE.address.line1}<br />
            {DISTRICT_38_STORE.address.line2}<br />
            {DISTRICT_38_STORE.address.landmark}<br />
            {DISTRICT_38_STORE.address.city}, {DISTRICT_38_STORE.address.state} – {DISTRICT_38_STORE.address.pincode}
          </p>
          <div className="pt-2 text-xs font-semibold text-orange-600">
            Next to Reliance Digital • Opp HP Petrol Bunk
          </div>
        </div>

        {/* Operating Hours */}
        <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-neutral-950">Store Hours</h3>
          <div className="space-y-1.5 text-xs text-neutral-600">
            <div className="flex justify-between font-medium">
              <span>Monday – Saturday:</span>
              <span className="font-bold text-neutral-900">10:00 AM – 9:30 PM</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Sunday:</span>
              <span className="font-bold text-neutral-900">10:30 AM – 9:00 PM</span>
            </div>
            <div className="pt-2 text-[11px] text-emerald-700 font-semibold">
              Open 7 days a week. Walk-in riders welcome.
            </div>
          </div>
        </div>

        {/* In-Store Sizing Services */}
        <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Ruler className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-neutral-950">Free In-Store Sizing</h3>
          <ul className="space-y-1.5 text-xs text-neutral-600">
            <li>✓ Laser crown & head circumference sizing</li>
            <li>✓ Motorcycle posture simulation cockpit</li>
            <li>✓ Intercom helmet pairing & audio test</li>
            <li>✓ Tail bag and pannier bike mounting test</li>
          </ul>
        </div>
      </div>

      {/* 3. Photo Gallery of the Store */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-950">Inside District 38 Trichy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'ECE 22.06 Helmet Wall',
              desc: 'Full selection of MT, Axor, and SMK graphics in all sizes.',
              img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80'
            },
            {
              title: 'Riding Apparel Lounge',
              desc: 'Try Rynox CE Level 2 jackets with chest and back armor.',
              img: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=600&q=80'
            },
            {
              title: 'Luggage & Rig Mounting Area',
              desc: 'Test ViaTerra Claw & tank bags on sample subframes.',
              img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80'
            },
            {
              title: 'Bike Care & Lube Bar',
              desc: 'Motul chain maintenance, helmet sprays, and visor care.',
              img: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80'
            }
          ].map((item, idx) => (
            <div key={idx} className="group rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-xs">
              <div className="h-48 overflow-hidden bg-neutral-100">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4 space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-neutral-950">{item.title}</h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Contact & WhatsApp Concierge CTA */}
      <div className="bg-neutral-50 rounded-3xl border border-neutral-200/80 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-bold text-neutral-950">Planning a ride to District 38 Trichy?</h3>
          <p className="text-xs text-neutral-600 max-w-xl">
            We provide free rider helmet storage and drinking water for touring groups. Contact our staff in advance for group discounts or bulk luggage inquiries.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://wa.me/916369708558?text=Hi%20District%2038%2C%20I%20am%20visiting%20the%20Trichy%20store%20today"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center space-x-2 shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
