
/**
 * Converts a HEX color value to HSL string.
 * Assumes hex is in #RRGGBB format.
 * Returns HSL string like "H S% L%" or null if conversion fails.
 */
export function hexToHsl(hex: string): string | null {
  hex = hex.replace(/^#/, '');
  if (!/^[0-9A-F]{6}$/i.test(hex)) {
    // Invalid hex string
    return null;
  }

  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0; // Should not happen
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}

/**
 * Converts an HSL string "H S% L%" to a HEX color string.
 * Returns HEX string like #RRGGBB.
 */
export function hslStringToHex(hslString: string): string {
  const parts = hslString.match(/(\d+)\s*(\d+)%\s*(\d+)%/);
  if (!parts) return '#000000'; // Default to black if parse fails

  let h = parseInt(parts[1]);
  let s = parseInt(parts[2]);
  let l = parseInt(parts[3]);

  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}
