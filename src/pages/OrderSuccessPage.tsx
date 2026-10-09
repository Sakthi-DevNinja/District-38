import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  MapPin,
  Calendar
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useNoIndex } from '../hooks/use-noindex';
import { Order } from '../types';

interface OrderSuccessPageProps {
  orderId?: string;
}

const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Draft',
  PENDING_APPROVAL: 'Pending Approval',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CONFIRMED: 'Confirmed',
  IN_PROGRESS: 'In Progress',
  PARTIALLY_DELIVERED: 'Partially Delivered',
  FULLY_DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed'
};

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderId }) => {
  const { fetchOrder, navigate } = useShop();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useNoIndex('Order Confirmation');

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }
    fetchOrder(orderId).then((result) => {
      setOrder(result);
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-sm text-neutral-400">Confirming your order…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="text-xl font-bold text-neutral-900">Order not found</h1>
        <p className="text-sm text-neutral-500">We couldn't load this order. Check My Orders for your order history.</p>
        <button
          onClick={() => navigate('/account/orders')}
          className="inline-flex items-center px-5 py-2.5 rounded-xl bg-neutral-950 text-white font-bold text-xs"
        >
          View My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* 1. Success Splash Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-in zoom-in-50 duration-300">
          <CheckCircle className="w-10 h-10" />
        </div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold font-mono">
          <span>ORDER {order.orderNumber}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
          Gear Order Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
          Thank you for choosing District 38. Your order is now a confirmed Sales Order in our system.
        </p>
      </div>

      {/* 2. Order Status Card */}
      <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100 text-xs">
          <div>
            <span className="text-neutral-500 font-medium">Order Placed:</span>
            <div className="text-sm font-bold text-neutral-900 mt-0.5 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-neutral-500 font-medium">Order Status:</span>
            <div className="text-xs font-bold text-neutral-900 mt-0.5">
              {STATUS_LABEL[order.documentStatus] ?? order.documentStatus}
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-neutral-500 font-medium">Payment:</span>
            <div className="text-xs font-bold mt-0.5">
              <span className={order.payment.status === 'PAID' ? 'text-emerald-600' : 'text-orange-600'}>
                {order.payment.status}
              </span>
            </div>
          </div>
        </div>

        {order.deliveryAddress && (
          <div className="flex items-start gap-2 text-xs text-neutral-600">
            <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <span>
              {order.deliveryAddress.contactName && (
                <span className="block font-semibold text-neutral-800">
                  {order.deliveryAddress.contactName}{order.deliveryAddress.phone ? ` · ${order.deliveryAddress.phone}` : ''}
                </span>
              )}
              {order.deliveryAddress.line1}
              {order.deliveryAddress.line2 ? `, ${order.deliveryAddress.line2}` : ''}, {order.deliveryAddress.city}, {order.deliveryAddress.stateProvince} — {order.deliveryAddress.postalCode}
            </span>
          </div>
        )}
      </div>

      {/* 3. Items Summary */}
      <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
          Items in this Order ({order.lines.length})
        </h3>
        <div className="divide-y divide-neutral-100">
          {order.lines.map((line, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-neutral-900">{line.productName}</div>
                {line.variantName && <div className="text-xs text-neutral-500">Size: {line.variantName}</div>}
                <div className="text-[11px] text-neutral-500">Qty: {line.orderedQuantity}</div>
              </div>
              <div className="font-bold text-neutral-900 font-mono">
                ₹{Number(line.lineTotal).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-neutral-100 flex justify-between text-sm font-black text-neutral-950">
          <span>Order Total</span>
          <span className="text-orange-600 font-mono">₹{Number(order.total).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* 4. Navigation Buttons */}
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
