export const PRODUCT_CATEGORIES = [
  "Crochet Flowers & Bouquets",
  "Crochet Bags & Purses",
  "Crochet Plushies & Toys",
  "Crochet Keychains",
  "Crochet Accessories",
  "Crochet Home Decor",
  "Crochet Clothing",
  "Customized Gifts",
  "Seasonal Collections",
] as const;

export const YARN_PALETTE = [
  { name: "Powder Pink", hex: "#F7C6D9", group: "Pink" },
  { name: "Baby Pink", hex: "#FADCE8", group: "Pink" },
  { name: "Berry Rose", hex: "#E58EB2", group: "Pink" },
  { name: "Powder Blue", hex: "#BFE3F5", group: "Blue" },
  { name: "Sky Whisper", hex: "#8FC9E8", group: "Blue" },
  { name: "Soft Lavender", hex: "#E7DDF7", group: "Lavender" },
  { name: "Lilac Mist", hex: "#C8B3EA", group: "Lavender" },
  { name: "Vanilla Cream", hex: "#FFF8ED", group: "Neutral" },
  { name: "Butter Yellow", hex: "#FFF0B8", group: "Yellow" },
  { name: "Honeycomb", hex: "#FAD97F", group: "Yellow" },
  { name: "Mint Sorbet", hex: "#CBEFD9", group: "Green" },
  { name: "Pistachio", hex: "#A5D9BA", group: "Green" },
  { name: "Peach Gelato", hex: "#FAD2BE", group: "Peach" },
  { name: "Dark Cocoa", hex: "#59434A", group: "Neutral" },
] as const;

export const PREORDER_STATUSES = [
  "Pre-Order Received",
  "Design Confirmation",
  "Awaiting Advance Payment",
  "Yarn & Material Preparation",
  "In Production",
  "Quality Check",
  "Ready to Dispatch",
  "Shipped",
  "Delivered",
] as const;

export const EMBROIDERY_STATUSES = [
  "Booking received",
  "Design reviewed",
  "Price confirmed",
  "Pickup scheduled",
  "Garment picked up",
  "Garment received and inspected",
  "Embroidery started",
  "Work completed",
  "Quality check",
  "Ready for delivery",
  "Out for delivery",
  "Successfully delivered",
] as const;

export const GARMENT_TYPES = [
  "T-shirts",
  "Shirts",
  "Kurtis",
  "Sarees",
  "Dupattas",
  "Dresses",
  "Jackets",
  "Jeans",
  "Baby Clothes",
  "Other garments",
] as const;

export const EMBROIDERY_PLACEMENTS = [
  "Left Chest Pocket",
  "Center Front",
  "Back Panel",
  "Sleeves / Cuffs",
  "Collar / Neckline",
  "Saree Pallu / Border",
  "Dupatta Corners & Border",
  "Pocket / Hem Accent",
] as const;

export const EMBROIDERY_TYPES = [
  "Floral Hand Embroidery",
  "French Knot & Bullion Rose",
  "Satin Stitch Monogram / Name",
  "Minimalist Line Art",
  "Zardozi & Pearl Accent",
  "Cross-Stitch / Folk Motif",
  "Cartoon / Kawaii Character",
] as const;

export const DESIGN_SIZES = [
  "Tiny Motif (2–3 in)",
  "Small Accent (4–5 in)",
  "Medium Statement (6–8 in)",
  "Large Showcase (9–12 in)",
  "Border / All-over",
] as const;

export const PICKUP_SLOTS = [
  "Morning (9:00 AM – 12:00 PM)",
  "Afternoon (12:00 PM – 4:00 PM)",
  "Evening (4:00 PM – 7:00 PM)",
] as const;

export const COUPONS: Record<
  string,
  { type: "percent" | "shipping"; value: number; label: string }
> = {
  STITCH10: { type: "percent", value: 10, label: "10% off handmade favorites" },
  PASTEL15: { type: "percent", value: 15, label: "15% off cotton-candy celebration" },
  FREESHIP: { type: "shipping", value: 100, label: "Free insured shipping" },
};

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
