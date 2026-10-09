// Responsive sizes for Unsplash placeholder images: the browser picks the
// smallest width that fills the slot, so a phone does not download a
// 2400px photo. Non-Unsplash URLs are returned unchanged.
const WIDTHS = [480, 800, 1200, 1600, 2400];

export function responsiveImage(url: string, sizes: string): { src: string; srcSet?: string; sizes?: string } {
  if (!url.includes('images.unsplash.com')) return { src: url };
  const at = (width: number) => {
    const u = new URL(url);
    u.searchParams.set('w', String(width));
    return u.toString();
  };
  return {
    src: at(1200),
    srcSet: WIDTHS.map((w) => `${at(w)} ${w}w`).join(', '),
    sizes
  };
}
