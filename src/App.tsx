import React, { useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { SearchOverlay } from './components/layout/SearchOverlay';
import { CartDrawer } from './components/layout/CartDrawer';
import { QuickAddModal } from './components/layout/QuickAddModal';
import { SizeGuideModal } from './components/layout/SizeGuideModal';
import { ToastContainer } from './components/layout/ToastContainer';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { WishlistPage } from './pages/WishlistPage';
import { AuthPage } from './pages/AuthPage';
import { AccountPage } from './pages/AccountPage';
import { StorePage } from './pages/StorePage';
import { BrandsPage } from './pages/BrandsPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { OffersPage } from './pages/OffersPage';
import { GuidesPage } from './pages/GuidesPage';
import { GuideDetailPage } from './pages/GuideDetailPage';
import { 
  AboutUsPage, 
  ContactPage, 
  FAQPage, 
  ShippingPolicyPage, 
  ReturnsPolicyPage, 
  PrivacyPolicyPage, 
  TermsPage, 
  NotFoundPage 
} from './pages/SupportPages';

const MainRouter: React.FC = () => {
  const { currentRoute, routeParams } = useShop();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentRoute, routeParams]);

  // Route matching logic
  const renderRoute = () => {
    // 1. Home
    if (currentRoute === '/' || currentRoute === '') {
      return <HomePage />;
    }

    // 2. Specific Category Shops
    const categoryRoutes = [
      'helmets',
      'riding-jackets',
      'riding-pants',
      'gloves',
      'riding-boots',
      'luggage',
      'accessories'
    ];
    if (categoryRoutes.includes(currentRoute.replace('/', ''))) {
      return <ShopPage initialCategory={currentRoute.replace('/', '')} />;
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
    if (currentRoute === '/account/garage') {
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

    // Fallback 404
    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-orange-500 selection:text-white font-sans antialiased">
      {/* 1. Global Navigation Header */}
      <Header />

      {/* 2. Main Routed View */}
      <main className="flex-1 pb-16 md:pb-0">
        {renderRoute()}
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
    <ShopProvider>
      <MainRouter />
    </ShopProvider>
  );
}
