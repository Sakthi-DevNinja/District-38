import React, { useState } from 'react';
import {
  User,
  Package,
  LogOut,
  ChevronDown,
  MapPin,
  Calendar,
  Truck,
  ExternalLink
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useNoIndex } from '../hooks/use-noindex';
import { Order, OrderDelivery } from '../types';
import { PayNowButton, canPayNow } from '../components/commerce/PayNowButton';

interface AccountPageProps {
  initialTab?: 'dashboard' | 'orders' | 'addresses' | 'profile';
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

// The parcels sent for an order, with the courier's tracking when the store has added it.
const ParcelTracking: React.FC<{ deliveries: OrderDelivery[] }> = ({ deliveries }) => {
  if (deliveries.length === 0) return null;
  return (
    <div className="space-y-2">
      {deliveries.map(parcel => (
        <div key={parcel.deliveryNumber} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2">
            <Truck className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-neutral-900">
                Shipped{parcel.dispatchedAt ? ` on ${new Date(parcel.dispatchedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}
                {parcel.courierName ? ` via ${parcel.courierName}` : ''}
              </div>
              {parcel.trackingNumber ? (
                <div className="text-neutral-600">Tracking no. <span className="font-mono font-semibold text-neutral-900">{parcel.trackingNumber}</span></div>
              ) : (
                <div className="text-neutral-500">Tracking details will appear here once the courier picks it up.</div>
              )}
            </div>
          </div>
          {parcel.trackingUrl && (
            <a
              href={parcel.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-950 text-white font-bold hover:bg-neutral-800 shrink-0"
            >
              Track parcel <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export const AccountPage: React.FC<AccountPageProps> = ({ initialTab = 'dashboard' }) => {
  const {
    currentUser,
    orders,
    ordersLoading,
    fetchOrder,
    logout,
    navigate,
    authLoading
  } = useShop();

  useNoIndex('My Account');

  // The old Addresses/Garage tabs had no backing VEYONN capability (no
  // customer address-book API, no rider/bike profile field) — see the API
  // Gap Report. Both now fall back to the Dashboard tab rather than
  // showing a page with nothing real to display.
  const normalizedInitialTab = initialTab === 'dashboard' || initialTab === 'orders' ? initialTab : 'dashboard';
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders'>(normalizedInitialTab);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Record<string, Order>>({});
  const [loadingDetailId, setLoadingDetailId] = useState<string | null>(null);

  if (authLoading) return null;

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleToggleOrder = async (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }
    setExpandedOrderId(orderId);
    if (!orderDetails[orderId]) {
      setLoadingDetailId(orderId);
      const detail = await fetchOrder(orderId);
      if (detail) {
        setOrderDetails(prev => ({ ...prev, [orderId]: detail }));
      }
      setLoadingDetailId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Rider Header Profile Bar */}
      <div className="bg-neutral-950 text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-600 text-white font-black text-xl flex items-center justify-center font-mono shadow-md">
            {currentUser.displayName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{currentUser.displayName}</h1>
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">{currentUser.email}</div>
          </div>
        </div>

        <button
          onClick={() => { logout(); navigate('/'); }}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-red-600/20 hover:text-red-400 text-neutral-300 transition-colors shrink-0"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Tabs Navigation */}
      <div className="flex space-x-2 border-b border-neutral-200 overflow-x-auto pb-1">
        {[
          { id: 'dashboard' as const, label: 'Dashboard Overview', icon: User },
          { id: 'orders' as const, label: `My Orders (${orders.length})`, icon: Package }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}
      <div>
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-neutral-200 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Gear Orders</div>
                <div className="text-2xl font-black text-neutral-950 font-mono">{orders.length}</div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-neutral-200 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">Account Created</div>
                <div className="text-sm font-bold text-neutral-900">
                  {new Date(currentUser.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-neutral-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-neutral-950">Recent Order Activity</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-orange-600 hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              {ordersLoading ? (
                <div className="text-center py-8 text-neutral-400 text-xs">Loading orders…</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-xs">
                  No orders placed yet. Explore the shop to gear up for your next highway tour.
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {orders.slice(0, 3).map(order => (
                    <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-neutral-900 font-mono">{order.orderNumber}</div>
                        <div className="text-neutral-500 text-[11px]">{new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
                      </div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {STATUS_LABEL[order.documentStatus] ?? order.documentStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {ordersLoading && orders.length === 0 ? (
              <div className="text-center py-12 text-neutral-400 text-xs">Loading orders…</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200 p-8 space-y-3">
                <Package className="w-12 h-12 text-neutral-300 mx-auto" />
                <h3 className="text-base font-bold text-neutral-900">No Orders Found</h3>
                <p className="text-xs text-neutral-500">You haven't purchased any items yet.</p>
                <button
                  onClick={() => navigate('/shop')}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs"
                >
                  Shop Helmets & Riding Gear
                </button>
              </div>
            ) : (
              orders.map(order => {
                const isExpanded = expandedOrderId === order.id;
                const detail = orderDetails[order.id];
                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
                    <button
                      onClick={() => handleToggleOrder(order.id)}
                      className="w-full p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-left"
                    >
                      <div>
                        <span className="font-bold text-neutral-950 font-mono text-sm">{order.orderNumber}</span>
                        <div className="text-neutral-400 text-[11px] mt-0.5 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {(order.deliveries?.length ?? 0) > 0 && order.documentStatus !== 'FULLY_DELIVERED' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 flex items-center gap-1">
                            <Truck className="w-3 h-3" /> Shipped
                          </span>
                        )}
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          {STATUS_LABEL[order.documentStatus] ?? order.documentStatus}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-6 border-t border-neutral-100 pt-4 space-y-4">
                        {loadingDetailId === order.id ? (
                          <div className="text-center py-6 text-neutral-400 text-xs">Loading order details…</div>
                        ) : detail ? (
                          <>
                            {detail.deliveryAddress && (
                              <div className="flex items-start gap-2 text-xs text-neutral-600">
                                <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                                <span>
                                  {detail.deliveryAddress.contactName && (
                                    <span className="block font-semibold text-neutral-800">
                                      {detail.deliveryAddress.contactName}{detail.deliveryAddress.phone ? ` · ${detail.deliveryAddress.phone}` : ''}
                                    </span>
                                  )}
                                  {detail.deliveryAddress.line1}
                                  {detail.deliveryAddress.line2 ? `, ${detail.deliveryAddress.line2}` : ''}, {detail.deliveryAddress.city}, {detail.deliveryAddress.stateProvince} — {detail.deliveryAddress.postalCode}
                                </span>
                              </div>
                            )}

                            <div className="divide-y divide-neutral-100">
                              {detail.lines.map((line, idx) => (
                                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                                  <div>
                                    <div className="font-bold text-neutral-900">{line.productName}</div>
                                    {line.variantName && <div className="text-xs text-neutral-500">Size: {line.variantName}</div>}
                                    <div className="text-[11px] text-neutral-400">Qty: {line.orderedQuantity}</div>
                                  </div>
                                  <span className="font-bold text-neutral-900 font-mono">
                                    ₹{Number(line.lineTotal).toLocaleString('en-IN')}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <ParcelTracking deliveries={detail.deliveries ?? []} />

                            {canPayNow(detail) && (
                              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <p className="text-xs text-orange-900">
                                  We have not received the payment for this order yet. Pay now to confirm it.
                                </p>
                                <PayNowButton
                                  order={detail}
                                  onPaid={(salesOrderId) => navigate('/order-success', { orderId: salesOrderId })}
                                />
                              </div>
                            )}

                            <div className="pt-2 flex justify-between items-center text-xs">
                              <span className="text-neutral-500">
                                Payment: <span className={detail.payment.status === 'PAID' ? 'text-emerald-600 font-semibold' : 'text-orange-600 font-semibold'}>{detail.payment.status}</span>
                              </span>
                              <span className="font-black text-neutral-950 font-mono">
                                ₹{Number(detail.total).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-6 text-neutral-400 text-xs">Could not load order details.</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
