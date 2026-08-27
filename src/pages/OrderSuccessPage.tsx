import React from 'react';
import { 
  CheckCircle, 
  Package, 
  MapPin, 
  Truck, 
  PhoneCall, 
  ArrowRight, 
  ShoppingBag, 
  Download, 
  Share2,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { DISTRICT_38_STORE } from '../data/storeInfo';

interface OrderSuccessPageProps {
  orderId?: string;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderId }) => {
  const { orders, navigate } = useShop();

  const latestOrder = orders.find(o => o.id === orderId) || orders[0];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* 1. Success Splash Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-in zoom-in-50 duration-300">
          <CheckCircle className="w-10 h-10" />
        </div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold font-mono">
          <span>ORDER #{latestOrder?.id || 'D38-892104'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
          Gear Order Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
          Thank you for choosing District 38. We're prepping your gear at our Trichy hub for safe packaging and prompt dispatch.
        </p>
      </div>

      {/* 2. Order Tracking Timeline Card */}
      <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100 text-xs">
          <div>
            <span className="text-neutral-500 font-medium">Estimated Delivery / Pickup:</span>
            <div className="text-sm font-bold text-neutral-900 mt-0.5 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span>{latestOrder?.estimatedDelivery || 'Within 2 - 3 Business Days'}</span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-neutral-500 font-medium">Courier & Tracking:</span>
            <div className="text-xs font-mono font-bold text-neutral-900 mt-0.5">
              {latestOrder?.courierPartner} • {latestOrder?.trackingNumber}
            </div>
          </div>
        </div>

        {/* Tracking progress steps */}
        <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
          <div className="space-y-1.5">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs font-bold">
              ✓
            </div>
            <div className="font-bold text-neutral-900">Order Placed</div>
          </div>
          <div className="space-y-1.5">
            <div className="w-7 h-7 rounded-full bg-orange-600 text-white flex items-center justify-center mx-auto text-xs font-bold animate-pulse">
              2
            </div>
            <div className="font-bold text-neutral-900">Quality Check</div>
          </div>
          <div className="space-y-1.5 opacity-40">
            <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center mx-auto text-xs font-bold">
              3
            </div>
            <div className="font-medium text-neutral-600">Dispatched</div>
          </div>
          <div className="space-y-1.5 opacity-40">
            <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center mx-auto text-xs font-bold">
              4
            </div>
            <div className="font-medium text-neutral-600">Delivered</div>
          </div>
        </div>
      </div>

      {/* 3. Items Summary */}
      {latestOrder && (
        <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
            Items in this Order ({latestOrder.items.length})
          </h3>
          <div className="divide-y divide-neutral-100">
            {latestOrder.items.map(item => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <img src={item.product.thumbnail} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover bg-neutral-100 border border-neutral-200" />
                  <div>
                    <div className="font-bold text-neutral-900">{item.product.name}</div>
                    <div className="text-[11px] text-neutral-500">
                      Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-neutral-900 font-mono">
                  ₹{item.totalPrice.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-100 flex justify-between text-sm font-black text-neutral-950">
            <span>Total Paid ({latestOrder.paymentMethod})</span>
            <span className="text-orange-600 font-mono">₹{latestOrder.total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}

      {/* 4. Store Contact & Support Box */}
      <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1 text-center sm:text-left">
          <div className="font-bold text-neutral-900">Need immediate help with sizing or delivery?</div>
          <div className="text-neutral-500">Our Trichy Flagship Store team is available daily 10:00 AM – 9:30 PM.</div>
        </div>
        <a
          href={`https://wa.me/916369708558?text=Hi%20District%2038%2C%20I%20have%20an%20inquiry%20about%20Order%20${latestOrder?.id || ''}`}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shrink-0 flex items-center space-x-1.5"
        >
          <span>WhatsApp Trichy Concierge</span>
        </a>
      </div>

      {/* 5. Navigation Buttons */}
      <div className="flex flex-wrap gap-3 justify-center pt-4">
        <button
          onClick={() => navigate('/account/orders')}
          className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors"
        >
          View Order in My Account
        </button>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-bold transition-colors"
        >
          Continue Shopping Gear
        </button>
      </div>
    </div>
  );
};
