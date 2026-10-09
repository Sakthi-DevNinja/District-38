import React from 'react';
import { DISTRICT_38_STORE } from '../../data/storeInfo';

// After a new release, an open tab can still ask for the old page files,
// which no longer exist. A single reload fetches the new ones.
const CHUNK_ERROR = /dynamically imported module|Importing a module script failed|Loading chunk|error loading dynamically/i;
const RELOAD_KEY = 'd38_chunk_reload_at';

function reloadOnceForNewRelease(error: Error): boolean {
  if (!CHUNK_ERROR.test(error.message)) return false;
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
    if (Date.now() - last < 30_000) return false; // already tried; show the fallback
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    return false;
  }
  window.location.reload();
  return true;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** 'page' keeps the header and footer around it; 'app' is the last resort. */
  variant: 'page' | 'app';
}

interface ErrorBoundaryState {
  error: Error | null;
}

// Shows a way back instead of a blank page when something on a page breaks.
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (reloadOnceForNewRelease(error)) return;
    console.error('Page crashed:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    const whatsapp = `https://wa.me/${DISTRICT_38_STORE.whatsapp.replace(/\D/g, '')}`;
    const fullScreen = this.props.variant === 'app';

    return (
      <div
        role="alert"
        className={`${fullScreen ? 'min-h-screen' : 'py-24'} flex items-center justify-center px-4 bg-white`}
      >
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-xl font-bold text-neutral-900">Something went wrong on this page</h1>
          <p className="text-sm text-neutral-500">
            Please reload the page. Your cart is saved. If it keeps happening, message us on WhatsApp and we will help you
            place your order.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-neutral-950 text-white font-bold text-xs"
            >
              Reload page
            </button>
            <a href="/" className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-800 font-bold text-xs">
              Go to home page
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </div>
    );
  }
}
