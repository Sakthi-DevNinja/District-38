const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

let loading: Promise<boolean> | null = null;

// Loaded on demand from checkout instead of in index.html, so the widget's
// script never blocks rendering on the rest of the site.
export function loadRazorpay(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (typeof window.Razorpay === 'function') return Promise.resolve(true);
  if (loading) return loading;

  loading = new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve(typeof window.Razorpay === 'function');
    script.onerror = () => {
      script.remove();
      loading = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });
  return loading;
}
