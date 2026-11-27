import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "public", "images", "products");
const galleryDir = path.join(process.cwd(), "public", "images", "gallery");
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(galleryDir, { recursive: true });

const PRODUCTS = [
  {
    slug: "cotton-candy-tulip-bouquet",
    title: "Cotton Candy Tulip Bouquet",
    bg1: "#FADCE8",
    bg2: "#BFE3F5",
    accent: "#F7C6D9",
    motif: "bouquet",
  },
  {
    slug: "blueberry-cloud-tote",
    title: "Blueberry Cloud Tote",
    bg1: "#BFE3F5",
    bg2: "#E7DDF7",
    accent: "#FFF0B8",
    motif: "bag",
  },
  {
    slug: "strawberry-milk-bunny-plushie",
    title: "Strawberry Milk Bunny",
    bg1: "#FADCE8",
    bg2: "#FFF0B8",
    accent: "#F7C6D9",
    motif: "plushie",
  },
  {
    slug: "daisy-puff-keychain-duo",
    title: "Daisy Puff Keychain Duo",
    bg1: "#FFF0B8",
    bg2: "#BFE3F5",
    accent: "#F7C6D9",
    motif: "keychain",
  },
  {
    slug: "lavender-dream-scrunchie-set",
    title: "Lavender Dream Scrunchie Set",
    bg1: "#E7DDF7",
    bg2: "#FADCE8",
    accent: "#BFE3F5",
    motif: "accessory",
  },
  {
    slug: "vanilla-scallop-coaster-quartet",
    title: "Vanilla Scallop Coasters",
    bg1: "#FFF8ED",
    bg2: "#BFE3F5",
    accent: "#F7C6D9",
    motif: "homedecor",
  },
  {
    slug: "pastel-granny-square-cardigan",
    title: "Pastel Granny Cardigan",
    bg1: "#BFE3F5",
    bg2: "#FADCE8",
    accent: "#FFF0B8",
    motif: "clothing",
  },
  {
    slug: "sweetheart-memory-gift-hamper",
    title: "Sweetheart Memory Hamper",
    bg1: "#FADCE8",
    bg2: "#E7DDF7",
    accent: "#FFF0B8",
    motif: "gift",
  },
  {
    slug: "winter-candy-cane-ornament-box",
    title: "Winter Candy Ornament Box",
    bg1: "#BFE3F5",
    bg2: "#FFF0B8",
    accent: "#F7C6D9",
    motif: "seasonal",
  },
  {
    slug: "buttercup-sunflower-pot",
    title: "Buttercup Sunflower Pot",
    bg1: "#FFF0B8",
    bg2: "#FADCE8",
    accent: "#BFE3F5",
    motif: "bouquet",
  },
  {
    slug: "macaron-pearl-crossbody-bag",
    title: "Macaron Pearl Crossbody",
    bg1: "#E7DDF7",
    bg2: "#BFE3F5",
    accent: "#F7C6D9",
    motif: "bag",
  },
  {
    slug: "sleepy-bear-amigurumi",
    title: "Sleepy Bear Amigurumi",
    bg1: "#FFF0B8",
    bg2: "#E7DDF7",
    accent: "#F7C6D9",
    motif: "plushie",
  },
];

function drawMotif(motif, variant, accent, bg1, bg2) {
  if (motif === "bouquet") {
    return `
      <g transform="translate(200,205) ${variant === 2 ? "scale(1.14) rotate(-6)" : variant === 3 ? "scale(0.95) rotate(6)" : ""}">
        <path d="M-45 25 L0 120 L45 25 Z" fill="#FFF8ED" stroke="#59434A" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M-28 55 Q0 72 28 55" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
        <circle cx="-28" cy="-22" r="24" fill="${accent}" stroke="#59434A" stroke-width="3"/>
        <circle cx="28" cy="-18" r="22" fill="#BFE3F5" stroke="#59434A" stroke-width="3"/>
        <circle cx="0" cy="-42" r="26" fill="#FFF0B8" stroke="#59434A" stroke-width="3"/>
        <circle cx="0" cy="4" r="22" fill="#E7DDF7" stroke="#59434A" stroke-width="3"/>
        <path d="M-28 -22 Q-18 -34 -8 -22 M28 -18 Q18 -30 8 -18 M0 -42 Q0 -55 10 -44" stroke="#59434A" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="M-12 72 Q0 62 12 72" stroke="#59434A" stroke-width="3" fill="none"/>
      </g>`;
  }
  if (motif === "bag") {
    return `
      <g transform="translate(200,210) ${variant === 2 ? "scale(1.12)" : variant === 3 ? "rotate(5)" : ""}">
        <path d="M-42 -28 C-42 -82 42 -82 42 -28" fill="none" stroke="#59434A" stroke-width="8" stroke-linecap="round"/>
        <path d="M-42 -28 C-42 -82 42 -82 42 -28" fill="none" stroke="${accent}" stroke-width="4" stroke-dasharray="6 5" stroke-linecap="round"/>
        <rect x="-72" y="-32" width="144" height="114" rx="28" fill="#FFF8ED" stroke="#59434A" stroke-width="3.5"/>
        <rect x="-56" y="-16" width="50" height="50" rx="14" fill="${bg1}" stroke="#59434A" stroke-width="2.5"/>
        <rect x="6" y="-16" width="50" height="50" rx="14" fill="${bg2}" stroke="#59434A" stroke-width="2.5"/>
        <circle cx="-31" cy="9" r="10" fill="${accent}" stroke="#59434A" stroke-width="2"/>
        <circle cx="31" cy="9" r="10" fill="#FFF0B8" stroke="#59434A" stroke-width="2"/>
        <path d="M-55 54 Q0 66 55 54" stroke="#59434A" stroke-width="2.5" stroke-dasharray="4 4" fill="none"/>
      </g>`;
  }
  if (motif === "plushie") {
    return `
      <g transform="translate(200,210) ${variant === 2 ? "scale(1.14)" : variant === 3 ? "rotate(-6)" : ""}">
        <ellipse cx="-32" cy="-64" rx="16" ry="38" transform="rotate(-12 -32 -64)" fill="#FFF8ED" stroke="#59434A" stroke-width="3.5"/>
        <ellipse cx="32" cy="-64" rx="16" ry="38" transform="rotate(12 32 -64)" fill="#FFF8ED" stroke="#59434A" stroke-width="3.5"/>
        <ellipse cx="-32" cy="-62" rx="8" ry="22" transform="rotate(-12 -32 -62)" fill="${accent}"/>
        <ellipse cx="32" cy="-62" rx="8" ry="22" transform="rotate(12 32 -62)" fill="${accent}"/>
        <circle cx="0" cy="-14" r="52" fill="#FFF8ED" stroke="#59434A" stroke-width="3.5"/>
        <ellipse cx="0" cy="56" rx="44" ry="42" fill="${bg1}" stroke="#59434A" stroke-width="3.5"/>
        <circle cx="-18" cy="-18" r="5" fill="#59434A"/>
        <circle cx="18" cy="-18" r="5" fill="#59434A"/>
        <ellipse cx="-26" cy="-6" rx="8" ry="5" fill="#F7C6D9"/>
        <ellipse cx="26" cy="-6" rx="8" ry="5" fill="#F7C6D9"/>
        <path d="M-6 -6 Q0 2 6 -6" fill="none" stroke="#59434A" stroke-width="3" stroke-linecap="round"/>
        <circle cx="0" cy="46" r="14" fill="#FFF0B8" stroke="#59434A" stroke-width="2.5"/>
      </g>`;
  }
  if (motif === "keychain") {
    return `
      <g transform="translate(200,205) ${variant === 2 ? "scale(1.15)" : variant === 3 ? "rotate(8)" : ""}">
        <circle cx="0" cy="-76" r="20" fill="none" stroke="#59434A" stroke-width="5"/>
        <line x1="0" y1="-56" x2="0" y2="-30" stroke="#59434A" stroke-width="4" stroke-dasharray="4 3"/>
        <g transform="translate(0,18)">
          <circle cx="0" cy="-34" r="22" fill="#FFF8ED" stroke="#59434A" stroke-width="3"/>
          <circle cx="32" cy="-10" r="22" fill="#FFF8ED" stroke="#59434A" stroke-width="3"/>
          <circle cx="20" cy="28" r="22" fill="#FFF8ED" stroke="#59434A" stroke-width="3"/>
          <circle cx="-20" cy="28" r="22" fill="#FFF8ED" stroke="#59434A" stroke-width="3"/>
          <circle cx="-32" cy="-10" r="22" fill="#FFF8ED" stroke="#59434A" stroke-width="3"/>
          <circle cx="0" cy="0" r="22" fill="${accent}" stroke="#59434A" stroke-width="3"/>
          <circle cx="-6" cy="-3" r="3" fill="#59434A"/>
          <circle cx="6" cy="-3" r="3" fill="#59434A"/>
          <path d="M-4 4 Q0 9 4 4" fill="none" stroke="#59434A" stroke-width="2.5" stroke-linecap="round"/>
        </g>
      </g>`;
  }
  if (motif === "clothing") {
    return `
      <g transform="translate(200,205) ${variant === 2 ? "scale(1.1)" : variant === 3 ? "rotate(-4)" : ""}">
        <path d="M-85 -35 L-35 -68 L0 -42 L35 -68 L85 -35 L68 14 L46 6 L46 78 L-46 78 L-46 6 L-68 14 Z" fill="#FFF8ED" stroke="#59434A" stroke-width="3.5" stroke-linejoin="round"/>
        <rect x="-34" y="-22" width="28" height="28" rx="6" fill="${bg1}" stroke="#59434A" stroke-width="2"/>
        <rect x="6" y="-22" width="28" height="28" rx="6" fill="${bg2}" stroke="#59434A" stroke-width="2"/>
        <rect x="-34" y="16" width="28" height="28" rx="6" fill="${accent}" stroke="#59434A" stroke-width="2"/>
        <rect x="6" y="16" width="28" height="28" rx="6" fill="#FFF0B8" stroke="#59434A" stroke-width="2"/>
        <circle cx="0" cy="-12" r="4" fill="#59434A"/>
        <circle cx="0" cy="14" r="4" fill="#59434A"/>
        <circle cx="0" cy="40" r="4" fill="#59434A"/>
      </g>`;
  }
  return `
    <g transform="translate(200,205) ${variant === 2 ? "scale(1.14)" : variant === 3 ? "rotate(6)" : ""}">
      <circle cx="0" cy="0" r="68" fill="#FFF8ED" stroke="#59434A" stroke-width="3.5"/>
      <circle cx="0" cy="0" r="52" fill="${bg1}" stroke="#59434A" stroke-width="2.5" stroke-dasharray="7 5"/>
      <circle cx="0" cy="0" r="28" fill="${accent}" stroke="#59434A" stroke-width="2.5"/>
      <path d="M-40 -10 Q0 -48 40 -10 M-40 12 Q0 48 40 12" fill="none" stroke="#59434A" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="0" cy="0" r="10" fill="#FFF0B8" stroke="#59434A" stroke-width="2"/>
    </g>`;
}

for (const item of PRODUCTS) {
  for (const variant of [1, 2, 3]) {
    const label =
      variant === 1
        ? "Studio Portrait"
        : variant === 2
        ? "Close-Up Stitch"
        : "Pastel Styling";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${item.bg1}"/>
      <stop offset="100%" stop-color="${item.bg2}"/>
    </linearGradient>
    <pattern id="knit" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M0 10 Q5 4 10 10 T20 10" fill="none" stroke="#59434A" stroke-opacity="0.06" stroke-width="1.5"/>
    </pattern>
  </defs>
  <rect width="400" height="400" rx="36" fill="url(#g)"/>
  <rect width="400" height="400" rx="36" fill="url(#knit)"/>
  <circle cx="68" cy="70" r="18" fill="#FFF8ED" fill-opacity="0.65"/>
  <circle cx="332" cy="84" r="12" fill="#FFF0B8" fill-opacity="0.8"/>
  <path d="M40 330 Q140 295 220 335 T365 315" fill="none" stroke="#59434A" stroke-opacity="0.22" stroke-width="2.5" stroke-dasharray="6 6"/>
  ${drawMotif(item.motif, variant, item.accent, item.bg1, item.bg2)}
  <rect x="24" y="340" width="150" height="34" rx="17" fill="#FFF8ED" fill-opacity="0.92" stroke="#59434A" stroke-opacity="0.2"/>
  <text x="99" y="362" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#59434A">${label}</text>
</svg>`;
    fs.writeFileSync(
      path.join(outDir, `${item.slug}-${variant}.svg`),
      svg,
      "utf8"
    );
  }
}

const GALLERY = [
  { name: "floral-denim-jacket", title: "Denim Jacket Wildflower Back", c1: "#BFE3F5", c2: "#F7C6D9" },
  { name: "pastel-kurti-collar", title: "Kurti French Knot Collar", c1: "#FADCE8", c2: "#FFF0B8" },
  { name: "custom-tulip-bridal", title: "Custom Pastel Tulip Bouquet", c1: "#E7DDF7", c2: "#FADCE8" },
  { name: "baby-romper-bunny", title: "Baby Romper Bunny Stitch", c1: "#FFF0B8", c2: "#BFE3F5" },
  { name: "saree-pallu-roses", title: "Organza Saree Bullion Roses", c1: "#F7C6D9", c2: "#E7DDF7" },
  { name: "cloud-cardigan-custom", title: "Custom Lavender Cloud Cardigan", c1: "#BFE3F5", c2: "#E7DDF7" },
];

for (const g of GALLERY) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360">
  <defs>
    <linearGradient id="gg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${g.c1}"/>
      <stop offset="100%" stop-color="${g.c2}"/>
    </linearGradient>
  </defs>
  <rect width="480" height="360" rx="32" fill="url(#gg)"/>
  <circle cx="240" cy="165" r="95" fill="#FFF8ED" stroke="#59434A" stroke-width="3" stroke-dasharray="8 6"/>
  <circle cx="240" cy="165" r="56" fill="${g.c1}" stroke="#59434A" stroke-width="2.5"/>
  <path d="M210 165 Q240 125 270 165 Q240 205 210 165 Z" fill="#FFF0B8" stroke="#59434A" stroke-width="2.5"/>
  <circle cx="240" cy="165" r="12" fill="#F7C6D9" stroke="#59434A" stroke-width="2"/>
  <rect x="40" y="294" width="400" height="42" rx="21" fill="#FFF8ED" fill-opacity="0.95"/>
  <text x="240" y="320" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="700" fill="#59434A">${g.title}</text>
</svg>`;
  fs.writeFileSync(path.join(galleryDir, `${g.name}.svg`), svg, "utf8");
}

console.log("Generated product and gallery SVG assets successfully.");
