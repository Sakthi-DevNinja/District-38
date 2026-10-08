import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useNoIndex } from '../hooks/use-noindex';
import { BrandLogo } from '../components/layout/BrandLogo';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const { login, register, navigate, isAuthenticated } = useShop();

  useNoIndex(initialMode === 'register' ? 'Create Account' : 'Sign In');

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  if (isAuthenticated) {
    navigate('/account');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!email.trim() || !password.trim()) {
      setFormError('Please enter your email and password.');
      return;
    }
    setIsSubmitting(true);
    const result = await login(email.trim(), password);
    setIsSubmitting(false);
    if (result.success) {
      navigate('/account');
    } else {
      setFormError(result.error ?? 'Invalid email or password.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      setFormError('Please fill in all required registration fields.');
      return;
    }
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters.');
      return;
    }
    setIsSubmitting(true);
    const result = await register({
      email: email.trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim()
    });
    setIsSubmitting(false);
    if (result.success) {
      navigate('/account');
    } else {
      setFormError(result.error ?? 'Could not create your account.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
        {/* Left Side: Brand & Benefits */}
        <div className="md:col-span-5 bg-neutral-950 text-white p-8 sm:p-10 flex flex-col justify-between h-full space-y-8">
          <div>
            <div className="mb-6">
              <BrandLogo size="md" variant="dark" />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-snug">
              Your District 38 Account
            </h2>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Create an account to track your orders, save gear to your wishlist, and check out faster.
            </p>

            <div className="space-y-3.5 mt-6 text-xs text-neutral-300">
              <div className="flex items-start space-x-2.5">
                <CheckCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Save helmets and gear to your wishlist</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Track every order from checkout to delivery</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Faster checkout on your next order</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-800 flex items-center space-x-2 text-xs text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Your details are protected with secure, encrypted authentication.</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:col-span-7 p-6 sm:p-10 space-y-6">
          {/* Mode Switcher */}
          <div className="flex p-1 bg-neutral-100 rounded-xl">
            <button
              onClick={() => { setMode('login'); setFormError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setFormError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {formError}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Email Address</label>
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
                <label className="block font-bold text-neutral-700 mb-1">Password</label>
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
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-400 text-white font-bold text-xs tracking-wide uppercase transition-colors shadow-md"
              >
                {isSubmitting ? 'Signing In…' : 'Sign In to District 38'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">First Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="Anand"
                      className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500"
                    />
                    <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Kumar"
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

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
                <label className="block font-bold text-neutral-700 mb-1">Create Password *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-400 text-white font-bold text-xs tracking-wide uppercase transition-colors shadow-md"
              >
                {isSubmitting ? 'Creating Account…' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
