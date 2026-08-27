import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  Compass
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BrandLogo } from '../components/layout/BrandLogo';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const { login, register, navigate, showToast, isAuthenticated } = useShop();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bikeModel, setBikeModel] = useState('');

  if (isAuthenticated) {
    navigate('/account');
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter your email and password.', 'error');
      return;
    }
    const success = login(email.trim(), password);
    if (success) {
      showToast('Welcome back to District 38!', 'success');
      navigate('/account');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      showToast('Please fill in all required registration fields.', 'error');
      return;
    }
    const success = register({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+91 98765 00000',
      bikeModel: bikeModel.trim() || 'Motorcycle Enthusiast'
    });

    if (success) {
      showToast('Rider account created! 100 Rider Points credited.', 'success');
      navigate('/account');
    }
  };

  const handleDemoLogin = (riderName: string, riderEmail: string, bike: string) => {
    register({
      name: riderName,
      email: riderEmail,
      phone: '+91 98765 43210',
      bikeModel: bike
    });
    showToast(`Logged in as ${riderName}!`, 'success');
    navigate('/account');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
        {/* Left Side: Brand & Rider Benefits */}
        <div className="md:col-span-5 bg-neutral-950 text-white p-8 sm:p-10 flex flex-col justify-between h-full space-y-8">
          <div>
            <div className="mb-6">
              <BrandLogo size="md" variant="dark" />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-snug">
              Unlock the District 38 Rider Club
            </h2>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Create your profile to access custom bike gear compatibility, order dispatch tracking, and Trichy store perks.
            </p>

            <div className="space-y-3.5 mt-6 text-xs text-neutral-300">
              <div className="flex items-start space-x-2.5">
                <CheckCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Save your bike model for custom luggage fitment</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Earn 100 Rider Points instantly on signup</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>1-Click tracking for live DTDC & BlueDart courier</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Invites to District 38 Kolli Hills & Yercaud group rides</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Logins for Testing */}
          <div className="pt-6 border-t border-neutral-800 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Quick 1-Click Demo Login
            </div>
            <div className="space-y-1.5">
              <button
                onClick={() => handleDemoLogin('Anand Kumar', 'anand.rider@gmail.com', 'Royal Enfield Himalayan 450')}
                className="w-full text-left p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-200 border border-neutral-800 transition-colors flex items-center justify-between"
              >
                <span>Anand (Himalayan 450)</span>
                <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
              </button>
              <button
                onClick={() => handleDemoLogin('Priya Sundaram', 'priya.moto@gmail.com', 'KTM 390 Duke')}
                className="w-full text-left p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-200 border border-neutral-800 transition-colors flex items-center justify-between"
              >
                <span>Priya (KTM 390 Duke)</span>
                <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:col-span-7 p-6 sm:p-10 space-y-6">
          {/* Mode Switcher */}
          <div className="flex p-1 bg-neutral-100 rounded-xl">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Create Rider Account
            </button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Rider Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="rider@example.com"
                    className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-neutral-700">Password</label>
                  <button
                    type="button"
                    onClick={() => showToast('Password reset link sent to demo account email.', 'info')}
                    className="text-[11px] text-orange-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs tracking-wide uppercase transition-colors shadow-md"
              >
                Sign In to District 38
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Anand Kumar"
                    className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="rider@example.com"
                      className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500"
                    />
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Mobile Phone *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500 font-mono"
                    />
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Primary Motorcycle Model (Optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={bikeModel}
                    onChange={e => setBikeModel(e.target.value)}
                    placeholder="e.g. Royal Enfield Himalayan 450, Duke 390, Speed 400"
                    className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                  <Compass className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Create Password *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs tracking-wide uppercase transition-colors shadow-md"
              >
                Create Account & Claim 100 Points
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
