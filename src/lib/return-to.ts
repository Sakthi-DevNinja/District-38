// Where to send a visitor after they sign in or create an account (e.g. back to
// checkout, or to the product they were adding). Kept for this browser tab only;
// storage can be unavailable (private mode), in which case sign-in simply lands
// on the account page as before.
const KEY = 'd38_return_to';

export function setReturnTo(path: string): void {
  try {
    if (path && path !== '/login' && path !== '/register') sessionStorage.setItem(KEY, path);
  } catch {
    // storage unavailable: fall back to the default landing page
  }
}

export function takeReturnTo(): string | null {
  try {
    const path = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return path;
  } catch {
    return null;
  }
}
