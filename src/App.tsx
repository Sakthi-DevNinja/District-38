import React, { useEffect, Suspense, lazy } from 'react';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { ShopProvider, useShop } from './context/ShopContext';
import { setStructuredData } from './lib/seo';
import { DISTRICT_38_STORE } from './data/storeInfo';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { SearchOverlay } from './components/layout/SearchOverlay';
import { CartDrawer } from './components/layout/CartDrawer';
import { QuickAddModal } from './components/layout/QuickAddModal';
import { SizeGuideModal } from './components/layout/SizeGuideModal';
import { ToastContainer } from './components/layout/ToastContainer';

// HomePage is the most common landing page — loaded eagerly, bundled with
// the app shell, so the first paint never waits on an extra chunk fetch.
import { HomePage } from './pages/HomePage';

// Every other route is route-based code-split: each is its own JS chunk,
// fetched only when actually navigated to, instead of one ~470KB bundle
// shipped up front regardless of which single page a visitor lands on
// (a real Core Web Vitals cost — bigger initial JS = worse LCP/INP,
// especially on mobile).
const ShopPage = lazy(() => import('./pages/ShopPage').then(m => ({ default: m.ShopPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage').then(m => ({ default: m.OrderSuccessPage })));
const WishlistPage = lazy(() => import('./pages/WishlistPage').then(m => ({ default: m.WishlistPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then(m => ({ default: m.AccountPage })));
const StorePage = lazy(() => import('./pages/StorePage').then(m => ({ default: m.StorePage })));
const BrandsPage = lazy(() => import('./pages/BrandsPage').then(m => ({ default: m.BrandsPage })));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage').then(m => ({ default: m.CollectionsPage })));
const OffersPage = lazy(() => import('./pages/OffersPage').then(m => ({ default: m.OffersPage })));
const GuidesPage = lazy(() => import('./pages/GuidesPage').then(m => ({ default: m.GuidesPage })));
const GuideDetailPage = lazy(() => import('./pages/GuideDetailPage').then(m => ({ default: m.GuideDetailPage })));
const AboutUsPage = lazy(() => import('./pages/SupportPages').then(m => ({ default: m.AboutUsPage })));
const ContactPage = lazy(() => import('./pages/SupportPages').then(m => ({ default: m.ContactPage })));
const FAQPage = lazy(() => import('./pages/SupportPages').then(m => ({ default: m.FAQPage })));
const ShippingPolicyPage = lazy(() => import('./pages/PolicyPages').then(m => ({ default: m.ShippingPolicyPage })));
const ReturnsPolicyPage = lazy(() => import('./pages/PolicyPages').then(m => ({ default: m.ReturnsPolicyPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PolicyPages').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('./pages/PolicyPages').then(m => ({ default: m.TermsPage })));
const NotFoundPage = lazy(() => import('./pages/SupportPages').then(m => ({ default: m.NotFoundPage })));

const MainRouter: React.FC = () => {
  const { currentRoute, routeParams } = useShop();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentRoute, routeParams]);

  // Sitewide Organization + LocalBusiness structured data — injected once,
  // built entirely from real store data (never fabricated). Per-page
  // structured data (Product, FAQPage, BreadcrumbList) is set by the
  // individual pages that render it.
  useEffect(() => {
    setStructuredData('ld-organization', {
      '@context': 'https://schema.org',
      '@type': 'SportingGoodsStore',
      name: 'District 38',
      url: window.location.origin,
      logo: `${window.location.origin}/brand/logodt38.webp`,
      telephone: DISTRICT_38_STORE.phone,
      email: DISTRICT_38_STORE.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: DISTRICT_38_STORE.addressLine1,
        addressLocality: DISTRICT_38_STORE.city,
        addressRegion: DISTRICT_38_STORE.state,
        postalCode: DISTRICT_38_STORE.pincode,
        addressCountry: 'IN'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: DISTRICT_38_STORE.coordinates.lat,
        longitude: DISTRICT_38_STORE.coordinates.lng
      },
      openingHoursSpecification: DISTRICT_38_STORE.operatingHours.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.days,
        opens: h.hours.split('–')[0]?.trim(),
        closes: h.hours.split('–')[1]?.trim()
      }))
    });
    return () => setStructuredData('ld-organization', null);
  }, []);

  // Route matching logic
  const renderRoute = () => {
    // 1. Home
    if (currentRoute === '/' || currentRoute === '') {
      return <HomePage />;
    }

    // 3. General Shop
    if (currentRoute === '/shop') {
      return <ShopPage />;
    }

    // 4. Product Detail Page: /products/:slug
    if (currentRoute.startsWith('/products/')) {
      const slug = currentRoute.replace('/products/', '');
      return <ProductDetailPage slug={slug} />;
    }

    // 5. Cart
    if (currentRoute === '/cart') {
      return <CartPage />;
    }

    // 6. Checkout
    if (currentRoute === '/checkout') {
      return <CheckoutPage />;
    }

    // 7. Order Success
    if (currentRoute.startsWith('/order-success')) {
      return <OrderSuccessPage orderId={routeParams.orderId} />;
    }

    // 8. Wishlist
    if (currentRoute === '/wishlist') {
      return <WishlistPage />;
    }

    // 9. Auth Routes
    if (currentRoute === '/login') {
      return <AuthPage initialMode="login" />;
    }
    if (currentRoute === '/register') {
      return <AuthPage initialMode="register" />;
    }

    // 10. Account Routes
    if (currentRoute === '/account') {
      return <AccountPage initialTab="dashboard" />;
    }
    if (currentRoute === '/account/orders') {
      return <AccountPage initialTab="orders" />;
    }
    if (currentRoute === '/account/addresses') {
      return <AccountPage initialTab="addresses" />;
    }
    if (currentRoute === '/account/garage' || currentRoute === '/account/profile') {
      return <AccountPage initialTab="profile" />;
    }

    // 11. Flagship Store
    if (currentRoute === '/store' || currentRoute === '/flagship') {
      return <StorePage />;
    }

    // 12. Brands Directory & Brand View
    if (currentRoute === '/brands') {
      return <BrandsPage />;
    }
    if (currentRoute.startsWith('/brands/')) {
      const brandSlug = currentRoute.replace('/brands/', '');
      return <BrandsPage brandSlug={brandSlug} />;
    }

    // 13. Curated Collections
    if (currentRoute === '/collections') {
      return <CollectionsPage />;
    }

    // 14. Offers & Clearance
    if (currentRoute === '/offers') {
      return <OffersPage />;
    }

    // 15. Technical Buying Guides
    if (currentRoute === '/guides') {
      return <GuidesPage />;
    }
    if (currentRoute.startsWith('/guides/')) {
      const guideSlug = currentRoute.replace('/guides/', '');
      return <GuideDetailPage slug={guideSlug} />;
    }

    // 16. Support & Static Pages
    if (currentRoute === '/about') {
      return <AboutUsPage />;
    }
    if (currentRoute === '/contact') {
      return <ContactPage />;
    }
    if (currentRoute === '/faq') {
      return <FAQPage />;
    }
    if (currentRoute === '/shipping') {
      return <ShippingPolicyPage />;
    }
    if (currentRoute === '/returns') {
      return <ReturnsPolicyPage />;
    }
    if (currentRoute === '/privacy') {
      return <PrivacyPolicyPage />;
    }
    if (currentRoute === '/terms') {
      return <TermsPage />;
    }

    // 17. Category Shops (catch-all) — VEYONN categories are admin-managed
    // in Pilot, so their slugs are open-ended (see slugifyCategoryName).
    // Rather than keep a hardcoded whitelist that drifts out of sync with
    // real/future categories (a category link would 404 the moment an
    // admin renamed or added one), treat any single-segment path that
    // didn't match a named route above as a category slug and let
    // ShopPage itself resolve it — ShopPage shows the not-found state for
    // a slug that matches no category.
    const singleSegment = currentRoute.startsWith('/') && !currentRoute.slice(1).includes('/') && currentRoute.length > 1;
    if (singleSegment) {
      return <ShopPage initialCategory={currentRoute.replace('/', '')} />;
    }

    // Fallback 404
    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-orange-500 selection:text-white font-sans antialiased">
      {/* 1. Global Navigation Header */}
      <Header />

      {/* 2. Main Routed View */}
      <main className="flex-1 pb-16 md:pb-0">
        {/* Keyed by route, so moving to another page clears a crashed one. */}
        <ErrorBoundary key={currentRoute} variant="page">
          <Suspense fallback={<div className="w-full py-24 text-center text-sm text-neutral-400">Loading…</div>}>
            {renderRoute()}
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* 3. Global Footer */}
      <Footer />

      {/* 4. Mobile Bottom Navigation Dock */}
      <MobileNav />

      {/* 5. Global Modals and Overlay Drawers */}
      <SearchOverlay />
      <CartDrawer />
      <QuickAddModal />
      <SizeGuideModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary variant="app">
      <ShopProvider>
        <MainRouter />
      </ShopProvider>
    </ErrorBoundary>
  );
}
