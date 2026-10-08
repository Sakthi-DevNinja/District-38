import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  HelpCircle,
  CheckCircle, 
  Send, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from 'lucide-react';
import { DISTRICT_38_STORE } from '../data/storeInfo';
import { useShop } from '../context/ShopContext';
import { usePageMeta } from '../hooks/use-page-meta';
import { setStructuredData, setRobotsMeta } from '../lib/seo';

// 1. About Us Page
export const AboutUsPage: React.FC = () => {
  const { navigate } = useShop();

  usePageMeta({
    title: 'About Us',
    description: 'The District 38 story — South India\'s motorcycle riding gear destination, authorised dealer for MT, Axor, Rynox, SMK, ViaTerra, and Motul.',
    path: '/about'
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600">The District 38 Story</span>
        <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight uppercase font-mono">
          Engineered for the Road. Based in Trichy.
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Born out of a genuine passion for motorcycle touring across Tamil Nadu, District 38 is South India’s premier destination for certified riding gear, protective armor, and touring luggage.
        </p>
      </div>

      <div className="rounded-3xl overflow-hidden shadow-lg h-80 sm:h-96">
        <img
          src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80"
          alt="District 38 Flagship"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-neutral-700 leading-relaxed">
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-neutral-950">Our Origin & Mission</h2>
          <p>
            For years, riders in Central and Southern Tamil Nadu had to travel to Bengaluru or Chennai just to try on international certified helmets and CE-rated riding apparel. In 2021, we launched <strong>District 38</strong> on Salai Road in Trichy to change that forever.
          </p>
          <p>
            We curate genuine, factory-backed gear from MT Helmets, Rynox, Axor, SMK, ViaTerra, Motul, and BluArmor. Every helmet we stock meets current ECE 22.06 or DOT standards, and every jacket features genuine CE Level 2 armor.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-neutral-950">The Trichy Experience Hub</h2>
          <p>
            Beyond our pan-India e-commerce platform, our physical retail store at Alsa Complex is designed as a true biker hub. We provide riders with motorcycle posture simulation rigs, laser head circumference measurement, intercom sound pairing, and luggage subframe fitment.
          </p>
          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200/70 text-orange-900 text-xs">
            <strong>Store Guarantee:</strong> 100% genuine products, official manufacturer warranties, and 07-day seamless size exchange with reverse pickup.
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Contact Page
export const ContactPage: React.FC = () => {
  const { showToast } = useShop();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', topic: 'Gear Fitment', message: '' });

  usePageMeta({
    title: 'Contact Us',
    description: `Visit District 38's flagship store at ${DISTRICT_38_STORE.addressLine1}, ${DISTRICT_38_STORE.city}, or reach us at ${DISTRICT_38_STORE.phone}.`,
    path: '/contact'
  }, []);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    showToast('Message submitted! Our Trichy gear specialists will respond within 2 hours.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Get in Touch</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
          Contact District 38 Rider Support
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Have questions about helmet sizing, order dispatch, or store visits? Reach out to our Trichy team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-neutral-950">Store & Dispatch Central</h3>
            
            <div className="space-y-3 text-xs text-neutral-600">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900">District 38 Flagship Store</strong><br />
                  {DISTRICT_38_STORE.address.line1}, {DISTRICT_38_STORE.address.line2}<br />
                  {DISTRICT_38_STORE.address.landmark}<br />
                  {DISTRICT_38_STORE.address.city}, Tamil Nadu {DISTRICT_38_STORE.address.pincode}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-orange-600 shrink-0" />
                <div>
                  <span className="text-neutral-900 font-bold font-mono">{DISTRICT_38_STORE.phone}</span>
                  <span className="text-neutral-400 block text-[11px]">Daily 10:00 AM – 9:30 PM</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-orange-600 shrink-0" />
                <div>
                  <span className="text-neutral-900 font-bold">{DISTRICT_38_STORE.email}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <a
                    href="https://wa.me/916369708558"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    WhatsApp Chat Support (+91 63697 08558)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 bg-white rounded-2xl border border-neutral-200 shadow-xs">
          {isSent ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-neutral-950">Message Sent!</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Thank you for contacting District 38. A gear consultant will follow up via phone or email shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-neutral-950 mb-2">Send an Inquiry</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Anand Kumar"
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rider@example.com"
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Subject / Inquiry Type</label>
                  <select
                    value={formData.topic}
                    onChange={e => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500"
                  >
                    <option value="Gear Fitment">Helmet & Jacket Size Fitment</option>
                    <option value="Order Tracking">Order Dispatch & Courier Status</option>
                    <option value="Store Visit">Trichy Showroom Visit & Stock Inquiry</option>
                    <option value="Bulk/Rider Club">Motorcycle Club Bulk Inquiries</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Message / Riding Queries *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your bike model, head circumference, or gear needs..."
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs tracking-wide uppercase transition-colors shadow-md flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// 3. FAQ Page
export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I know what helmet size will fit my head correctly?',
      a: 'Wrap a flexible tailor measuring tape horizontally around the widest part of your head—about 2.5 cm (1 inch) above your eyebrows and ears. Compare your measurement in centimeters against our size charts. A brand-new motorcycle helmet must feel snug with cheek pressure without painful pinch points on your temple or forehead. Cheek pads soften by 10-15% after 15 hours of riding.'
    },
    {
      q: 'What is the difference between ECE 22.05 and ECE 22.06 helmets?',
      a: 'ECE 22.06 is the newest European safety standard introducing rigorous rotational acceleration impact tests, lower and higher-speed drop tests at multiple angles, visor shatter tests with steel ball bearings fired at 216 km/h, and mandatory testing with all manufacturer accessories attached (such as drop-down sun visors).'
    },
    {
      q: 'Do you offer size exchange if the jacket or helmet does not fit?',
      a: 'Yes! District 38 provides a hassle-free 07-Day Size Exchange guarantee. As long as the item is unused, unworn with original tags, visor films intact, and original box packaging undamaged, we arrange reverse pickup or exchange at our Trichy store.'
    },
    {
      q: 'How fast do you dispatch online orders?',
      a: 'All in-stock items are packaged and dispatched directly from our Trichy Central Hub on the same day if ordered before 3:00 PM. Delivery across Tamil Nadu and South India takes 1–3 business days. North and East India takes 3–5 business days via BlueDart Air / DTDC Express.'
    },
    {
      q: 'Can I pick up my order in person at the Trichy Salai Road Store?',
      a: 'Yes! Select "Trichy Store Pickup (Click & Collect)" during checkout. Your gear will be prepared, sanitized, and ready for you to try on in our store in 1 hour. You can test your riding posture on our simulation rig with our specialists.'
    },
    {
      q: 'Are all products 100% authentic and covered by warranty?',
      a: 'District 38 is an authorized distributor for MT Helmets, Rynox, Axor, SMK, ViaTerra, Motul, and BluArmor. Every item is 100% authentic and covered by standard 1 to 5-year manufacturer warranties with valid GST tax invoices.'
    }
  ];

  usePageMeta({
    title: 'Frequently Asked Questions',
    description: 'Answers to common questions about helmet sizing, ECE certification, shipping, size exchanges, and product authenticity at District 38.',
    path: '/faq'
  }, []);

  useEffect(() => {
    setStructuredData('ld-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a }
      }))
    });
    return () => setStructuredData('ld-faq', null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Frequently Asked Questions</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
          Help & Rider Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Everything you need to know about safety homologations, shipping, sizing, and warranties.
        </p>
      </div>

      <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-2xl bg-white overflow-hidden shadow-xs">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="p-4 sm:p-5">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left font-bold text-neutral-900 text-xs sm:text-sm"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-orange-600 shrink-0 ml-2" /> : <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0 ml-2" />}
              </button>
              {isOpen && (
                <p className="mt-3 text-xs text-neutral-600 leading-relaxed animate-in fade-in-50 duration-200">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 4. Shipping Policy Page
export const ShippingPolicyPage: React.FC = () => {
  usePageMeta({
    title: 'Shipping & Dispatch Policy',
    description: 'Free express shipping on orders above ₹5,000. Same-day dispatch before 3 PM, delivered via BlueDart, DTDC, and Delhivery.',
    path: '/shipping'
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950">Shipping & Dispatch Policy</h1>
      <p>
        At <strong>District 38</strong>, we prioritize the secure, prompt delivery of all motorcycle riding gear. Every helmet and jacket is carefully bubble-wrapped and double-boxed to guarantee it arrives in factory condition.
      </p>

      <h2 className="text-base sm:text-lg font-bold text-neutral-950 pt-3">1. Dispatch Timelines</h2>
      <p>
        - Orders placed before 3:00 PM IST (Monday through Saturday) are dispatched on the <strong>same day</strong> from our fulfillment hub.<br />
        - Orders placed after 3:00 PM or on Sundays/Public Holidays will be dispatched on the next business day.
      </p>

      <h2 className="text-base sm:text-lg font-bold text-neutral-950 pt-3">2. Delivery Charges & Free Shipping</h2>
      <p>
        - Orders over <strong>₹5,000</strong> qualify for <strong>FREE Express Shipping</strong> anywhere across India.<br />
        - For orders under ₹5,000, a flat shipping fee of ₹149 is calculated at checkout.
      </p>

      <h2 className="text-base sm:text-lg font-bold text-neutral-950 pt-3">3. Courier Partners & Tracking</h2>
      <p>
        All consignments are shipped via premium logistics partners including BlueDart Air, DTDC Express, and Delhivery. You will receive an SMS and email with live tracking details as soon as the manifest is scanned.
      </p>
    </div>
  );
};

// 5. Returns & Exchange Policy Page
export const ReturnsPolicyPage: React.FC = () => {
  usePageMeta({
    title: 'Returns & Exchange Policy',
    description: 'District 38\'s 7-day size exchange guarantee — eligibility rules and how to initiate a return or exchange.',
    path: '/returns'
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950">07-Day Size Exchange Guarantee</h1>
      <p>
        We understand that finding the perfect motorcycle helmet or riding jacket fit requires precision. If your item does not fit comfortably, we offer a straightforward <strong>07-Day Size Exchange</strong>.
      </p>

      <h2 className="text-base sm:text-lg font-bold text-neutral-950 pt-3">Exchange Eligibility Rules</h2>
      <ul className="list-disc pl-5 space-y-1.5">
        <li>The item must be in unridden, brand-new condition.</li>
        <li>Original helmet visor protective film must NOT be peeled or removed.</li>
        <li>Original brand tags, manufacturer paperwork, and packaging boxes must be intact.</li>
        <li>Exchange request must be initiated within 7 calendar days of delivery.</li>
      </ul>

      <h2 className="text-base sm:text-lg font-bold text-neutral-950 pt-3">How to Initiate an Exchange</h2>
      <p>
        Contact our Trichy Concierge on WhatsApp at <strong>+91 63697 08558</strong> or email <strong>district38trichy@gmail.com</strong> with your Order ID and the replacement size required. We will arrange a door-to-door courier reverse pickup.
      </p>
    </div>
  );
};

// 6. Privacy Policy Page
export const PrivacyPolicyPage: React.FC = () => {
  usePageMeta({
    title: 'Privacy Policy',
    description: 'How District 38 collects, uses, and protects your personal information.',
    path: '/privacy'
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950">Privacy Policy</h1>
      <p>
        District 38 is committed to protecting your personal privacy. We do not sell, rent, or trade customer contact information to third parties. Customer details are strictly used for payment authorization, courier delivery SMS updates, and customer warranty registration.
      </p>
    </div>
  );
};

// 7. Terms & Conditions Page
export const TermsPage: React.FC = () => {
  usePageMeta({
    title: 'Terms & Conditions',
    description: 'Terms and conditions for purchases made through District 38.',
    path: '/terms'
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950">Terms & Conditions</h1>
      <p>
        All purchases through the District 38 platform are subject to standard consumer terms under the laws of India. Jurisdiction for any disputes rests with the courts of Tiruchirappalli, Tamil Nadu.
      </p>
    </div>
  );
};

// 8. 404 Not Found Page
export const NotFoundPage: React.FC = () => {
  const { navigate } = useShop();

  useEffect(() => {
    document.title = 'Page Not Found | District 38';
    setRobotsMeta('noindex, nofollow');
    return () => setRobotsMeta(null);
  }, []);

  return (
    <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
        <AlertTriangle className="w-8 h-8 text-orange-600" />
      </div>
      <h1 className="text-2xl font-extrabold text-neutral-950">404 - Page Off Route</h1>
      <p className="text-xs text-neutral-500">
        The gear page or route you are looking for has been moved or does not exist.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2.5 rounded-xl bg-neutral-950 text-white font-bold text-xs"
      >
        Return to District 38 Home
      </button>
    </div>
  );
};
