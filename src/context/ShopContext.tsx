import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Product,
  CartItem,
  Order,
  OrderListItem,
  UserProfile,
  FilterState,
  DeliveryAddress
} from '../types';
import { adaptListItem } from '../lib/product-adapter';
import * as authApi from '../lib/api/auth';
import * as wishlistApi from '../lib/api/wishlist';
import * as cartApi from '../lib/api/cart';
import { getProductBySlug } from '../lib/api/catalog';
import * as checkoutApi from '../lib/api/checkout';
import * as ordersApi from '../lib/api/orders';
import { CartResponse, CheckoutResult, WishlistItem as ApiWishlistItem } from '../lib/api/types';
import { getCustomerToken, setCustomerToken, clearCustomerToken, ApiError } from '../lib/api/client';
import { setReturnTo } from '../lib/return-to';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface ShopContextType {
  // Navigation & Routing
  currentRoute: string;
  routeParams: Record<string, string>;
  navigate: (route: string, params?: Record<string, string>) => void;

  // Cart — for a signed-in customer VEYONN is authoritative and every
  // mutation is a real API call. A visitor who isn't signed in gets a guest
  // cart kept in this browser (the backend cart needs a customer JWT); it is
  // added to the real cart on sign-in, where the server re-checks price and
  // stock. Checkout still requires an account.
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartCurrency: string;
  cartLoading: boolean;
  addToCart: (productId: string, quantity?: number, variantId?: string, display?: GuestLineDisplay) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number, variantId?: string | null) => Promise<void>;
  removeFromCart: (productId: string, variantId?: string | null) => Promise<void>;
  clearCart: () => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist — VEYONN is authoritative; requires authentication.
  wishlist: ApiWishlistItem[];
  wishlistCount: number;
  wishlistLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  moveToCartFromWishlist: (productId: string) => Promise<void>;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  recentSearches: string[];
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;

  // Mobile Nav Drawer
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;

  // Quick Add Modal & Size Guide Modal
  quickAddProduct: Product | null;
  openQuickAdd: (product: Product) => void;
  closeQuickAdd: () => void;
  isSizeGuideOpen: boolean;
  sizeGuideCategory: string;
  openSizeGuide: (category: string) => void;
  closeSizeGuide: () => void;

  // User & Auth — real VEYONN customer auth only. Never an admin/Pilot JWT.
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (input: { email: string; password: string; firstName: string; lastName: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;

  // Checkout — a real VEYONN Sales Order + Razorpay payment init.
  submitCheckout: (address: DeliveryAddress) => Promise<CheckoutResult>;

  // Orders — the customer's own real WEBSITE orders.
  orders: OrderListItem[];
  ordersLoading: boolean;
  refreshOrders: () => Promise<void>;
  fetchOrder: (id: string) => Promise<Order | null>;

  // Recently Viewed (local-only browsing convenience — never presented as
  // synced/backend data)
  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;

  // Filters & Shop State
  shopFilters: FilterState;
  updateShopFilters: (filters: Partial<FilterState>) => void;
  resetShopFilters: () => void;

  // UI Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
}

const DEFAULT_FILTERS: FilterState = {
  category: undefined,
  subcategory: undefined,
  brand: [],
  priceRange: [0, 50000],
  sizes: [],
  colors: [],
  certifications: [],
  ridingStyles: [],
  inStockOnly: false,
  onSaleOnly: false,
  searchQuery: '',
  sortBy: 'newest'
};

const EMPTY_CART: CartResponse = { items: [], subtotal: 0, currency: 'INR' };

function mapCart(response: CartResponse): CartItem[] {
  return response.items
    .filter((line) => line.product !== null)
    .map((line) => ({
      productId: line.productId,
      variantId: line.variantId,
      variantName: line.variantName,
      product: adaptListItem(line.product!),
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      totalPrice: line.lineTotal
    }));
}

function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}

// What a guest-cart line needs to be shown before the visitor signs in.
export interface GuestLineDisplay {
  product: Product;
  variantName: string | null;
  unitPrice: number;
}

interface GuestLine extends GuestLineDisplay {
  productId: string;
  variantId: string | null;
  quantity: number;
}

const GUEST_CART_KEY = 'd38_guest_cart';

function loadGuestCart(): GuestLine[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveGuestCart(lines: GuestLine[]): void {
  try {
    if (lines.length) localStorage.setItem(GUEST_CART_KEY, JSON.stringify(lines));
    else localStorage.removeItem(GUEST_CART_KEY);
  } catch {
    // storage unavailable (private mode): the guest cart lasts for this page only
  }
}

const sameLine = (line: { productId: string; variantId: string | null }, productId: string, variantId?: string | null) =>
  line.productId === productId && (line.variantId ?? null) === (variantId ?? null);

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation — real path-based routing via the History API (switched
  // from hash-based routing now that no production deployment exists yet
  // to have live deep links broken by the switch). Requires the eventual
  // host to serve index.html for any unmatched path (SPA fallback) —
  // see public/_redirects (Netlify) and vercel.json (Vercel); a custom
  // server needs an equivalent catch-all. Vite's own dev server does this
  // automatically, so `npm run dev` needs no extra config.
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string, params: Record<string, string> = {}) => {
    setRouteParams(params);
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toasts (declared early — auth/cart/wishlist helpers below use it)
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => dismissToast(id), 4000);
  };

  // ─── Auth (real VEYONN customer auth) ──────────────────────────────────
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ─── Cart (real VEYONN cart) ────────────────────────────────────────────
  const [cartResponse, setCartResponse] = useState<CartResponse>(EMPTY_CART);
  const [cartLoading, setCartLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [guestCart, setGuestCartState] = useState<GuestLine[]>(() => loadGuestCart());
  const setGuestCart = (lines: GuestLine[]) => {
    setGuestCartState(lines);
    saveGuestCart(lines);
  };

  // Moves the guest cart into the customer's real cart right after sign-in.
  // Each line goes through the server, which re-checks price and stock; a
  // line it refuses is reported instead of silently dropped.
  const mergeGuestCart = async () => {
    const lines = loadGuestCart();
    if (lines.length === 0) return;
    let failed = 0;
    for (const line of lines) {
      try {
        await cartApi.addCartItem(line.productId, line.quantity, line.variantId ?? undefined);
      } catch {
        failed++;
      }
    }
    setGuestCart([]);
    if (failed > 0) showToast(`${failed} item(s) from your cart could not be added — please check your cart.`, 'warning');
  };

  // ─── Wishlist (real VEYONN wishlist) ────────────────────────────────────
  const [wishlist, setWishlist] = useState<ApiWishlistItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // ─── Orders (real VEYONN customer orders) ──────────────────────────────
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    setCartLoading(true);
    try {
      const response = await cartApi.getCart();
      setCartResponse(response);
    } catch (err) {
      showToast(errorMessage(err, 'Could not load your cart.'), 'error');
    } finally {
      setCartLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshWishlist = useCallback(async () => {
    setWishlistLoading(true);
    try {
      const items = await wishlistApi.getWishlist();
      setWishlist(items);
    } catch (err) {
      showToast(errorMessage(err, 'Could not load your wishlist.'), 'error');
    } finally {
      setWishlistLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const page = await ordersApi.listOrders();
      setOrders(page.items);
    } catch (err) {
      showToast(errorMessage(err, 'Could not load your orders.'), 'error');
    } finally {
      setOrdersLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On mount: if a token is already stored (returning session), verify it
  // and hydrate the customer's real cart/wishlist/orders. An expired or
  // invalid token is discarded silently rather than shown as an error.
  useEffect(() => {
    const token = getCustomerToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }
    authApi
      .getProfile()
      .then((profile) => {
        setCurrentUser(profile);
        refreshCart();
        refreshWishlist();
        refreshOrders();
      })
      .catch(() => {
        clearCustomerToken();
      })
      .finally(() => setAuthLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = await authApi.login({ email, password });
      setCustomerToken(token.accessToken);
      const profile = await authApi.getProfile();
      setCurrentUser(profile);
      showToast(`Welcome back, ${profile.displayName}!`, 'success');
      await mergeGuestCart();
      refreshCart();
      refreshWishlist();
      refreshOrders();
      return { success: true };
    } catch (err) {
      const message = errorMessage(err, 'Invalid email or password.');
      showToast(message, 'error');
      return { success: false, error: message };
    }
  };

  const register = async (input: { email: string; password: string; firstName: string; lastName: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = await authApi.register(input);
      setCustomerToken(token.accessToken);
      const profile = await authApi.getProfile();
      setCurrentUser(profile);
      showToast(`Welcome to District 38, ${profile.displayName}!`, 'success');
      await mergeGuestCart();
      refreshCart();
      refreshWishlist();
      refreshOrders();
      return { success: true };
    } catch (err) {
      const message = errorMessage(err, 'Could not create your account.');
      showToast(message, 'error');
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      if (getCustomerToken()) {
        await authApi.logout();
      }
    } catch {
      // Logout is enforced client-side regardless (stateless tokens) —
      // a failed network call here must never block signing out.
    }
    clearCustomerToken();
    setCurrentUser(null);
    setCartResponse(EMPTY_CART);
    setWishlist([]);
    setOrders([]);
    showToast('You have been logged out.', 'info');
  };

  const requireAuth = (action: string): boolean => {
    if (!currentUser) {
      showToast(`Please sign in to ${action}.`, 'info');
      setReturnTo(currentRoute);
      navigate('/login');
      return false;
    }
    return true;
  };

  // ─── Cart Mutations ─────────────────────────────────────────────────────
  const addToCart = async (productId: string, quantity = 1, variantId?: string, display?: GuestLineDisplay) => {
    if (!currentUser) {
      // Without what to show for the line (e.g. moving from the wishlist,
      // which needs an account anyway) fall back to asking for sign-in.
      if (!display) {
        requireAuth('add items to your cart');
        return;
      }
      const existing = guestCart.find((l) => sameLine(l, productId, variantId));
      setGuestCart(
        existing
          ? guestCart.map((l) => (sameLine(l, productId, variantId) ? { ...l, quantity: l.quantity + quantity } : l))
          : [...guestCart, { productId, variantId: variantId ?? null, quantity, ...display }]
      );
      showToast('Added to cart', 'success');
      setIsCartOpen(true);
      return;
    }
    setCartLoading(true);
    try {
      const response = await cartApi.addCartItem(productId, quantity, variantId);
      setCartResponse(response);
      showToast('Added to cart', 'success');
      setIsCartOpen(true);
    } catch (err) {
      showToast(errorMessage(err, 'Could not add this item to your cart.'), 'error');
    } finally {
      setCartLoading(false);
    }
  };

  const updateCartQuantity = async (productId: string, quantity: number, variantId?: string | null) => {
    if (quantity <= 0) {
      await removeFromCart(productId, variantId);
      return;
    }
    if (!currentUser) {
      setGuestCart(guestCart.map((l) => (sameLine(l, productId, variantId) ? { ...l, quantity } : l)));
      return;
    }
    setCartLoading(true);
    try {
      const response = await cartApi.updateCartItemQuantity(productId, quantity, variantId);
      setCartResponse(response);
    } catch (err) {
      showToast(errorMessage(err, 'Could not update quantity.'), 'error');
    } finally {
      setCartLoading(false);
    }
  };

  const removeFromCart = async (productId: string, variantId?: string | null) => {
    if (!currentUser) {
      setGuestCart(guestCart.filter((l) => !sameLine(l, productId, variantId)));
      showToast('Item removed from cart', 'info');
      return;
    }
    setCartLoading(true);
    try {
      const response = await cartApi.removeCartItem(productId, variantId);
      setCartResponse(response);
      showToast('Item removed from cart', 'info');
    } catch (err) {
      showToast(errorMessage(err, 'Could not remove this item.'), 'error');
    } finally {
      setCartLoading(false);
    }
  };

  const clearCart = async () => {
    if (!currentUser) {
      setGuestCart([]);
      return;
    }
    setCartLoading(true);
    try {
      const response = await cartApi.clearCart();
      setCartResponse(response);
    } catch (err) {
      showToast(errorMessage(err, 'Could not clear your cart.'), 'error');
    } finally {
      setCartLoading(false);
    }
  };

  const cart: CartItem[] = currentUser
    ? mapCart(cartResponse)
    : guestCart.map((l) => ({
        productId: l.productId,
        variantId: l.variantId,
        variantName: l.variantName,
        product: l.product,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        totalPrice: l.unitPrice * l.quantity
      }));
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = currentUser ? cartResponse.subtotal : cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const cartCurrency = cartResponse.currency;

  // ─── Wishlist Mutations ─────────────────────────────────────────────────
  const wishlistCount = wishlist.length;
  const isInWishlist = (productId: string) => wishlist.some((w) => w.productId === productId);

  const toggleWishlist = async (productId: string) => {
    if (!requireAuth('save items to your wishlist')) return;
    const alreadySaved = isInWishlist(productId);
    setWishlistLoading(true);
    try {
      if (alreadySaved) {
        await wishlistApi.removeWishlistItem(productId);
        setWishlist((prev) => prev.filter((w) => w.productId !== productId));
        showToast('Removed from your wishlist', 'info');
      } else {
        await wishlistApi.addWishlistItem(productId);
        showToast('Saved to your wishlist', 'success');
        refreshWishlist();
      }
    } catch (err) {
      showToast(errorMessage(err, 'Could not update your wishlist.'), 'error');
    } finally {
      setWishlistLoading(false);
    }
  };

  // Wishlist items don't carry variants, so a product sold in sizes is sent
  // to its page to pick one instead of being added without a size.
  const moveToCartFromWishlist = async (productId: string) => {
    const item = wishlist.find((w) => w.productId === productId);
    if (item?.product) {
      try {
        const detail = await getProductBySlug(item.product.slug);
        if (detail.variants.length > 0) {
          showToast('Choose a size to add this to your cart.', 'info');
          navigate(`/products/${item.product.slug}`);
          return;
        }
      } catch (err) {
        showToast(errorMessage(err, 'Could not load this product.'), 'error');
        return;
      }
    }
    await addToCart(productId, 1);
    try {
      await wishlistApi.removeWishlistItem(productId);
      setWishlist((prev) => prev.filter((w) => w.productId !== productId));
    } catch (err) {
      showToast(errorMessage(err, 'Added to cart, but could not remove it from your wishlist.'), 'warning');
    }
  };

  // ─── Checkout ───────────────────────────────────────────────────────────
  const submitCheckout = async (address: DeliveryAddress): Promise<CheckoutResult> => {
    const result = await checkoutApi.checkout({
      deliveryContactName: address.contactName,
      deliveryPhone: address.phone,
      deliveryAddressLine1: address.line1,
      deliveryAddressLine2: address.line2,
      deliveryCity: address.city,
      deliveryStateProvince: address.stateProvince,
      deliveryPostalCode: address.postalCode,
      deliveryCountryCode: address.countryCode
    });
    // The real Sales Order empties the cart server-side, and this is a
    // new order in the customer's own history — resync both rather than
    // assume, so the UI can never drift from VEYONN's own state.
    refreshCart();
    refreshOrders();
    return result;
  };

  const fetchOrder = async (id: string): Promise<Order | null> => {
    try {
      const detail = await ordersApi.getOrder(id);
      return {
        id: detail.id,
        orderNumber: detail.orderNumber,
        documentStatus: detail.documentStatus,
        salesChannel: detail.salesChannel,
        createdAt: detail.createdAt,
        total: detail.total,
        lines: detail.lines,
        deliveryAddress: detail.deliveryAddress
          ? {
              contactName: detail.deliveryAddress.contactName ?? '',
              phone: detail.deliveryAddress.phone ?? '',
              line1: detail.deliveryAddress.line1,
              line2: detail.deliveryAddress.line2 ?? undefined,
              city: detail.deliveryAddress.city,
              stateProvince: detail.deliveryAddress.stateProvince,
              postalCode: detail.deliveryAddress.postalCode,
              countryCode: detail.deliveryAddress.countryCode
            }
          : null,
        payment: detail.payment,
        // Older backends did not send deliveries.
        deliveries: detail.deliveries ?? []
      };
    } catch (err) {
      showToast(errorMessage(err, 'Could not load this order.'), 'error');
      return null;
    }
  };

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('d38_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('d38_recent_searches', JSON.stringify(recentSearches));
    } catch {
      // Ignore storage failures.
    }
  }, [recentSearches]);

  const addRecentSearch = (term: string) => {
    if (!term.trim()) return;
    setRecentSearches(prev => [term.trim(), ...prev.filter(t => t.toLowerCase() !== term.trim().toLowerCase())].slice(0, 8));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('d38_recent_searches');
  };

  // Modals
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideCategory, setSizeGuideCategory] = useState('helmets');

  const openQuickAdd = (product: Product) => setQuickAddProduct(product);
  const closeQuickAdd = () => setQuickAddProduct(null);

  const openSizeGuide = (category: string) => {
    setSizeGuideCategory(category);
    setIsSizeGuideOpen(true);
  };
  const closeSizeGuide = () => setIsSizeGuideOpen(false);

  // Recently Viewed — a local-only browsing convenience (never presented
  // as backend-synced data; VEYONN has no such capability).
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('d38_recent_products');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('d38_recent_products', JSON.stringify(recentlyViewed));
    } catch {
      // Ignore storage failures.
    }
  }, [recentlyViewed]);

  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewed(prev => [productId, ...prev.filter(id => id !== productId)].slice(0, 10));
  };

  // Filters State
  const [shopFilters, setShopFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const updateShopFilters = (partial: Partial<FilterState>) => {
    setShopFilters(prev => ({ ...prev, ...partial }));
  };

  const resetShopFilters = () => {
    setShopFilters(DEFAULT_FILTERS);
  };

  return (
    <ShopContext.Provider
      value={{
        currentRoute,
        routeParams,
        navigate,
        cart,
        cartCount,
        cartSubtotal,
        cartCurrency,
        cartLoading,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        wishlistCount,
        wishlistLoading,
        isInWishlist,
        toggleWishlist,
        moveToCartFromWishlist,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        isMobileNavOpen,
        setIsMobileNavOpen,
        quickAddProduct,
        openQuickAdd,
        closeQuickAdd,
        isSizeGuideOpen,
        sizeGuideCategory,
        openSizeGuide,
        closeSizeGuide,
        currentUser,
        isAuthenticated: !!currentUser,
        authLoading,
        login,
        register,
        logout,
        submitCheckout,
        orders,
        ordersLoading,
        refreshOrders,
        fetchOrder,
        recentlyViewed,
        addRecentlyViewed,
        shopFilters,
        updateShopFilters,
        resetShopFilters,
        toasts,
        showToast,
        dismissToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
