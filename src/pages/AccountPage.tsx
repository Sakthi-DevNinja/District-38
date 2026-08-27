import React, { useState } from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  Bike, 
  LogOut, 
  Plus, 
  Trash2, 
  Truck, 
  Clock, 
  Calendar, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Address } from '../types';

interface AccountPageProps {
  initialTab?: 'dashboard' | 'orders' | 'addresses' | 'profile';
}

export const AccountPage: React.FC<AccountPageProps> = ({ initialTab = 'dashboard' }) => {
  const { 
    currentUser, 
    orders, 
    logout, 
    navigate, 
    showToast 
  } = useShop();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'addresses' | 'profile'>(initialTab);

  // Address form modal state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('Tamil Nadu');
  const [newPincode, setNewPincode] = useState('');

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newCity.trim() || !newPincode.trim()) {
      showToast('Please fill in street, city, and pincode.', 'error');
      return;
    }

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      name: currentUser.name,
      phone: currentUser.phone,
      street: newStreet.trim(),
      city: newCity.trim(),
      state: newState,
      pincode: newPincode.trim(),
      isDefault: currentUser.addresses.length === 0
    };

    currentUser.addresses.push(newAddr);
    setIsAddingAddress(false);
    setNewStreet('');
    setNewCity('');
    setNewPincode('');
    showToast('New shipping address saved!', 'success');
  };

  const handleDeleteAddress = (id: string) => {
    currentUser.addresses = currentUser.addresses.filter(a => a.id !== id);
    showToast('Address removed.', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Rider Header Profile Bar */}
      <div className="bg-neutral-950 text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-600 text-white font-black text-xl flex items-center justify-center font-mono shadow-md">
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{currentUser.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Verified Rider
              </span>
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">{currentUser.email} • {currentUser.phone}</div>
            <div className="text-xs text-orange-400 font-semibold mt-1 flex items-center space-x-1.5">
              <Bike className="w-3.5 h-3.5" />
              <span>Garage: {currentUser.bikeModel || 'Royal Enfield Himalayan'}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-left">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Rider Points</div>
            <div className="text-lg font-black text-orange-400 font-mono">{currentUser.riderPoints} Pts</div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-red-600/20 hover:text-red-400 text-neutral-300 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Tabs Navigation */}
      <div className="flex space-x-2 border-b border-neutral-200 overflow-x-auto pb-1">
        {[
          { id: 'dashboard', label: 'Dashboard Overview', icon: User },
          { id: 'orders', label: `My Orders (${orders.length})`, icon: Package },
          { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
          { id: 'profile', label: 'My Garage & Specs', icon: Bike }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-neutral-200 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Gear Orders</div>
                <div className="text-2xl font-black text-neutral-950 font-mono">{orders.length}</div>
                <div className="text-xs text-neutral-500">Tracked with DTDC / BlueDart</div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-neutral-200 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">Reward Balance</div>
                <div className="text-2xl font-black text-orange-600 font-mono">{currentUser.riderPoints} Points</div>
                <div className="text-xs text-neutral-500">Worth ₹{currentUser.riderPoints} off on your next gear order</div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-neutral-200 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">Store Privileges</div>
                <div className="text-sm font-bold text-neutral-900">Priority Laser Fitting</div>
                <div className="text-xs text-neutral-500">Free in-store trial at Trichy Salai Road</div>
              </div>
            </div>

            {/* Recent Orders Preview */}
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

              {orders.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-xs">
                  No orders placed yet. Explore the shop to gear up for your next highway tour.
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {orders.slice(0, 2).map(order => (
                    <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-neutral-900 font-mono">{order.id}</div>
                        <div className="text-neutral-500 text-[11px]">{order.items.length} items • {new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-neutral-900 font-mono">₹{order.total.toLocaleString('en-IN')}</div>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 capitalize">
                          {order.status}
                        </span>
                      </div>
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
            {orders.length === 0 ? (
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
              orders.map(order => (
                <div key={order.id} className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100 text-xs">
                    <div>
                      <span className="font-bold text-neutral-950 font-mono text-sm">ORDER {order.id}</span>
                      <div className="text-neutral-400 text-[11px] mt-0.5">Placed on {new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 capitalize">
                        {order.status}
                      </span>
                      <span className="text-base font-black text-neutral-950 font-mono">
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Tracking Bar */}
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-orange-600 shrink-0" />
                      <span className="text-neutral-700">
                        {order.courierPartner} • Tracking: <strong className="font-mono">{order.trackingNumber}</strong>
                      </span>
                    </div>
                    <span className="text-neutral-500 font-medium text-[11px] hidden sm:inline">
                      {order.estimatedDelivery}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-neutral-100">
                    {order.items.map(item => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <img src={item.product.thumbnail} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover bg-neutral-100 border border-neutral-200" />
                          <div>
                            <div className="font-bold text-neutral-900">{item.product.name}</div>
                            <div className="text-[11px] text-neutral-400">
                              Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                            </div>
                          </div>
                        </div>
                        <span className="font-bold text-neutral-900 font-mono">
                          ₹{item.totalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs text-neutral-500">
                    <div>
                      Delivery Address: {order.shippingAddress.street}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
                    </div>
                    <button
                      onClick={() => navigate(`/products/${order.items[0]?.product.slug}`)}
                      className="text-orange-600 font-bold hover:underline"
                    >
                      Buy Again →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-950">Saved Shipping Addresses</h3>
              <button
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Add Address Form */}
            {isAddingAddress && (
              <form onSubmit={handleAddAddressSubmit} className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-4 text-xs">
                <h4 className="font-bold text-neutral-900">New Address Details</h4>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Street Address / House / Flat *</label>
                  <input
                    type="text"
                    required
                    value={newStreet}
                    onChange={e => setNewStreet(e.target.value)}
                    placeholder="e.g. 24, Main Road, Thillai Nagar"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-neutral-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={e => setNewCity(e.target.value)}
                      placeholder="Tiruchirappalli"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={newState}
                      onChange={e => setNewState(e.target.value)}
                      placeholder="Tamil Nadu"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-700 mb-1">6-Digit Pincode *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={newPincode}
                      onChange={e => setNewPincode(e.target.value)}
                      placeholder="620018"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* Address Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentUser.addresses.map(addr => (
                <div key={addr.id} className="p-5 bg-white rounded-2xl border border-neutral-200 relative flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 text-xs">{addr.name}</span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-700">
                          Default Address
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                      {addr.street}<br />
                      {addr.city}, {addr.state} – {addr.pincode}<br />
                      Phone: {addr.phone}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-neutral-100 flex justify-between items-center text-xs">
                    <span className="text-emerald-700 font-medium text-[11px]">Direct Courier Serviceable</span>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-neutral-400 hover:text-red-600 p-1"
                      title="Delete Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Garage & Profile Tab */}
        {activeTab === 'profile' && (
          <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm max-w-2xl space-y-6 text-xs">
            <h3 className="text-base font-bold text-neutral-950">Rider Garage & Sizing Profile</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Rider Full Name</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.name}
                  className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-600"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Registered Email</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-600"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Registered Motorcycle</label>
                <input
                  type="text"
                  defaultValue={currentUser.bikeModel || 'Royal Enfield Himalayan 450'}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200/80 text-orange-900 space-y-1">
                <div className="font-bold flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span>Trichy VIP Store Sizing Pass</span>
                </div>
                <div className="text-[11px] text-orange-800">
                  Present your Rider Email at the Salai Road store for free laser head measurement and posture testing on our simulator.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
