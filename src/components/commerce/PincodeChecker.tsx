import React, { useState } from 'react';
import { MapPin, Check, Clock, AlertCircle } from 'lucide-react';

export const PincodeChecker: React.FC = () => {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<{
    valid: boolean;
    city?: string;
    deliveryTime?: string;
    expressAvailable?: boolean;
    codAvailable?: boolean;
    storePickupAvailable?: boolean;
  } | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincode.trim();
    if (clean.length !== 6 || !/^\d+$/.test(clean)) {
      setResult({ valid: false });
      return;
    }

    // Check pincode regions
    if (clean.startsWith('620') || clean.startsWith('621')) {
      // Trichy & nearby Central Tamil Nadu
      setResult({
        valid: true,
        city: 'Tiruchirappalli & Central TN',
        deliveryTime: 'Same-Day / Tomorrow Morning (within 18 hours)',
        expressAvailable: true,
        codAvailable: true,
        storePickupAvailable: true
      });
    } else if (clean.startsWith('600') || clean.startsWith('641') || clean.startsWith('625') || clean.startsWith('636')) {
      // Chennai, Coimbatore, Madurai, Salem
      setResult({
        valid: true,
        city: 'Tamil Nadu Major Corridor (Express Air/Surface)',
        deliveryTime: 'Within 24 to 36 hours',
        expressAvailable: true,
        codAvailable: true,
        storePickupAvailable: false
      });
    } else if (clean.startsWith('560') || clean.startsWith('500') || clean.startsWith('682') || clean.startsWith('400') || clean.startsWith('110')) {
      // Bangalore, Hyderabad, Kochi, Mumbai, Delhi
      setResult({
        valid: true,
        city: 'Metro Hub (DTDC / BlueDart Air)',
        deliveryTime: '2 to 3 business days',
        expressAvailable: true,
        codAvailable: true,
        storePickupAvailable: false
      });
    } else {
      // All other Indian pincodes
      setResult({
        valid: true,
        city: 'Standard India Pin Network',
        deliveryTime: '3 to 5 business days',
        expressAvailable: true,
        codAvailable: true,
        storePickupAvailable: false
      });
    }
  };

  return (
    <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-3">
      <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-neutral-800">
        <MapPin className="w-4 h-4 text-orange-600" />
        <span>Check Delivery Speed & Store Pickup</span>
      </div>

      <form onSubmit={handleCheck} className="flex space-x-2">
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={e => {
            setPincode(e.target.value);
            setResult(null);
          }}
          placeholder="Enter 6-digit Pincode (e.g. 620018)"
          className="flex-1 px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500 font-mono"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
        >
          Check
        </button>
      </form>

      {result && (
        <div className="text-xs pt-1 animate-in fade-in duration-150">
          {result.valid ? (
            <div className="space-y-1.5 p-2.5 bg-white rounded-xl border border-neutral-200">
              <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>Serviceable: {result.city}</span>
              </div>
              <div className="text-neutral-700 flex items-center space-x-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Estimated Delivery: <strong>{result.deliveryTime}</strong></span>
              </div>
              {result.storePickupAvailable && (
                <div className="text-orange-700 font-semibold text-[11px]">
                  ✓ Free 1-Hour In-Store Pickup available at District 38 Salai Road store!
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-red-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Please enter a valid 6-digit Indian postal pincode.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
