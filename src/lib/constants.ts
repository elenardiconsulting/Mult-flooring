export const COMPANY = {
  name: "Mult Flooring",
  phone: "(508) 560-2310",
  phoneRaw: "5085602310",
  website: "multflooring.com",
  license: "Licensed & Insured · MA · RI · CT",
  rating: "4.9",
  projects: "1,200+",
  years: "14",
  email: "contact@multflooring.com",
  address: "Serving Massachusetts, Rhode Island & Connecticut",
  hours: "Mon–Sat, 8am–6pm",
  cta: {
    primary: "Get a Free Quote",
    collections: "Explore Collections",
    sample: "Order a Free Sample",
    schedule: "Schedule Consultation",
  },
  social: {
    instagram: "https://instagram.com/multflooring",
    facebook: "https://facebook.com/multflooring",
  },
} as const;

export const NAV_LINKS = [
  { label: "Collections", href: "#collections" },
  { label: "Projects", href: "#projects" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
] as const;

export const TILE_CATEGORIES = [
  "All",
  "Stone Look",
  "Wood Look",
  "Porcelain",
  "Large Format",
  "Outdoor",
] as const;

export type TileCategory = (typeof TILE_CATEGORIES)[number];

export interface Tile {
  id: string;
  name: string;
  category: TileCategory;
  material: string;
  size: string;
  finish: string;
  pei: string;
  slipResistance: string;
  indoor: boolean;
  outdoor: boolean;
  image: string;
  colors: string[];
}

export const TILES: Tile[] = [
  {
    id: "calacatta-gold",
    name: "Calacatta Gold",
    category: "Stone Look",
    material: "Porcelain",
    size: '24×48"',
    finish: "Polished",
    pei: "PEI IV",
    slipResistance: "R10",
    indoor: true,
    outdoor: false,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    colors: ["#f5f0e8", "#e8dcc8", "#d4c8b0"],
  },
  {
    id: "nero-marquina",
    name: "Nero Marquina",
    category: "Stone Look",
    material: "Porcelain",
    size: '24×24"',
    finish: "Matte",
    pei: "PEI III",
    slipResistance: "R11",
    indoor: true,
    outdoor: true,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    colors: ["#1a1a1a", "#2e2e2e", "#3d3530"],
  },
  {
    id: "oak-natural",
    name: "Oak Natural",
    category: "Wood Look",
    material: "Porcelain",
    size: '8×48"',
    finish: "Satin",
    pei: "PEI IV",
    slipResistance: "R10",
    indoor: true,
    outdoor: false,
    image:
      "https://images.unsplash.com/photo-1562184552-997c461abbe6?w=800&q=80",
    colors: ["#C47C3A", "#8B5E3C", "#D4956B"],
  },
  {
    id: "cement-grey",
    name: "Cement Grey",
    category: "Large Format",
    material: "Porcelain",
    size: '32×64"',
    finish: "Matte",
    pei: "PEI III",
    slipResistance: "R11",
    indoor: true,
    outdoor: true,
    image:
      "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800&q=80",
    colors: ["#9e9e9e", "#757575", "#bdbdbd"],
  },
  {
    id: "bianco-dolomite",
    name: "Bianco Dolomite",
    category: "Stone Look",
    material: "Porcelain",
    size: '12×24"',
    finish: "Honed",
    pei: "PEI III",
    slipResistance: "R10",
    indoor: true,
    outdoor: false,
    image:
      "https://images.unsplash.com/photo-1600566753151-384129cf4d3a?w=800&q=80",
    colors: ["#f0ede8", "#ddd8d0", "#c8c0b4"],
  },
  {
    id: "terracotta-outdoor",
    name: "Terracotta Outdoor",
    category: "Outdoor",
    material: "Porcelain",
    size: '16×16"',
    finish: "Textured",
    pei: "PEI V",
    slipResistance: "R12",
    indoor: false,
    outdoor: true,
    image:
      "https://images.unsplash.com/photo-1600210491892-03d54078399a?w=800&q=80",
    colors: ["#C47C3A", "#a05a28", "#8B4513"],
  },
  {
    id: "walnut-dark",
    name: "Walnut Dark",
    category: "Wood Look",
    material: "Porcelain",
    size: '8×48"',
    finish: "Satin",
    pei: "PEI IV",
    slipResistance: "R10",
    indoor: true,
    outdoor: false,
    image:
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80",
    colors: ["#3d2b1f", "#5c3d2e", "#7a5040"],
  },
  {
    id: "arctic-white",
    name: "Arctic White",
    category: "Porcelain",
    material: "Porcelain",
    size: '24×48"',
    finish: "Polished",
    pei: "PEI III",
    slipResistance: "R9",
    indoor: true,
    outdoor: false,
    image:
      "https://images.unsplash.com/photo-1574691250077-03a929faece5?w=800&q=80",
    colors: ["#ffffff", "#f5f5f5", "#e8e8e8"],
  },
];

export interface Testimonial {
  name: string;
  city: string;
  rating: number;
  text: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah M.",
    city: "Newton, MA",
    rating: 5,
    text: "Mult Flooring transformed our entire first floor. The tile selection process was seamless and the installation crew was incredibly professional.",
  },
  {
    name: "James R.",
    city: "Providence, RI",
    rating: 5,
    text: "We had large format tiles installed in our kitchen and bathrooms. The result looks like a luxury hotel. Could not be happier.",
  },
  {
    name: "Amanda L.",
    city: "Hartford, CT",
    rating: 5,
    text: "From the showroom consultation to the final install, every step was handled with care. Our hardwood floors look stunning.",
  },
  {
    name: "Carlos D.",
    city: "Boston, MA",
    rating: 5,
    text: "Hired them for a commercial renovation. On time, under budget, and the quality exceeded our expectations. Highly recommend.",
  },
  {
    name: "Patricia K.",
    city: "Brookline, MA",
    rating: 5,
    text: "The team helped us choose the perfect stone look tile for our bathroom. The attention to detail during installation was remarkable.",
  },
];

export interface Project {
  id: string;
  name: string;
  city: string;
  type: "Residential" | "Commercial" | "Hospitality";
  material: string;
  image: string;
}

export const PROJECTS: Project[] = [
  {
    id: "newton-residence",
    name: "Newton Residence",
    city: "Newton, MA",
    type: "Residential",
    material: 'Calacatta Gold 24×48"',
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
  },
  {
    id: "boston-commercial",
    name: "Downtown Office Lobby",
    city: "Boston, MA",
    type: "Commercial",
    material: 'Cement Grey 32×64"',
    image:
      "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1200&q=80",
  },
  {
    id: "providence-hotel",
    name: "The Biltmore Suite",
    city: "Providence, RI",
    type: "Hospitality",
    material: 'Bianco Dolomite 12×24"',
    image:
      "https://images.unsplash.com/photo-1600566753151-384129cf4d3a?w=1200&q=80",
  },
  {
    id: "brookline-kitchen",
    name: "Brookline Kitchen Remodel",
    city: "Brookline, MA",
    type: "Residential",
    material: 'Arctic White 24×48"',
    image:
      "https://images.unsplash.com/photo-1574691250077-03a929faece5?w=1200&q=80",
  },
  {
    id: "hartford-spa",
    name: "Riverview Wellness Spa",
    city: "Hartford, CT",
    type: "Commercial",
    material: 'Nero Marquina 24×24"',
    image:
      "https://images.unsplash.com/photo-1600210491892-03d54078399a?w=1200&q=80",
  },
  {
    id: "wellesley-master",
    name: "Wellesley Master Bath",
    city: "Wellesley, MA",
    type: "Residential",
    material: 'Oak Natural 8×48"',
    image:
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&q=80",
  },
];
