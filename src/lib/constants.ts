export const COMPANY = {
  name: "Mult Flooring",
  phone: "(508) 510-4007",
  phoneRaw: "5085104007",
  website: "multflooring.com",
  license: "Licensed & Insured in New England",
  rating: "4.9",
  projects: "500+",
  years: "20",
  email: "multflooring@gmail.com",
  address: "Serving New England",
  hours: "Mon to Sat, 8am to 6pm",
  cta: {
    primary: "Request a Consultation",
    collections: "Explore Collections",
    sample: "Order a Free Sample",
    schedule: "Schedule Consultation",
  },
  social: {
    instagram:
      "https://www.instagram.com/tonyspainting_remodeling?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    facebook: "https://www.facebook.com/tonyspaintingmvLLC",
  },
} as const;

export const NAV_LINKS = [
  { label: "Cabinets", href: "/cabinets" },
  { label: "Projects", href: "/projects" },
  { label: "Process", href: "/process" },
  { label: "Contact", href: "/contact" },
] as const;

export const FLOOR_CATEGORIES = [
  "All",
  "Red Oak",
  "White Oak",
  "Parquet",
  "Vinyl (LVP)",
  "Laminate",
] as const;

export type FloorCategory = (typeof FLOOR_CATEGORIES)[number];

export interface FloorProduct {
  id: string;
  name: string;
  species: "Red Oak" | "White Oak" | "Parquet" | "Vinyl (LVP)" | "Laminate";
  width: string;
  finish: string;
  thickness: string;
  grade: string;
  coating: string;
  indoor: boolean;
  description: string;
  image: string;
  colors: string[];
  tag?: string;
}

export const FLOORS: FloorProduct[] = [
  // ── RED OAK ──
  {
    id: "red-oak-3",
    name: '3" Red Oak',
    species: "Red Oak",
    width: '3"',
    finish: "Unfinished",
    thickness: '¾"',
    grade: "Select & Better",
    coating: "Site-finished",
    indoor: true,
    description:
      "Classic 3-inch Red Oak strip flooring. The most popular hardwood in America, prized for its warm grain pattern and exceptional durability.",
    image:
      "https://images.unsplash.com/photo-1562184552-997c461abbe6?w=800&q=80",
    colors: ["#C47C3A", "#8B5E3C", "#A0522D"],
  },
  {
    id: "red-oak-314",
    name: '3¼" Red Oak',
    species: "Red Oak",
    width: '3¼"',
    finish: "Unfinished",
    thickness: '¾"',
    grade: "Select & Better",
    coating: "Site-finished",
    indoor: true,
    description:
      "Standard 3¼-inch Red Oak, the most installed hardwood width in New England homes. Timeless character with open grain.",
    image: "/floors/red-oak-3-25.png",
    colors: ["#C47C3A", "#8B5E3C", "#D4956B"],
    tag: "Most Popular",
  },
  {
    id: "red-oak-6",
    name: '6" Red Oak',
    species: "Red Oak",
    width: '6"',
    finish: "Unfinished",
    thickness: '¾"',
    grade: "Select & Better",
    coating: "Site-finished",
    indoor: true,
    description:
      "Wide-plank 6-inch Red Oak for a more contemporary, open feel. Shows the natural grain and character of the wood beautifully.",
    image: "/floors/red-oak-6.png",
    colors: ["#B8713A", "#8B5E3C", "#C8905A"],
  },
  {
    id: "red-oak-7",
    name: '7" Red Oak',
    species: "Red Oak",
    width: '7"',
    finish: "Unfinished",
    thickness: '¾"',
    grade: "Character",
    coating: "Site-finished",
    indoor: true,
    description:
      "Extra-wide 7-inch planks showcase the full natural beauty of Red Oak. Ideal for open-concept spaces and modern farmhouse aesthetics.",
    image: "/floors/red-oak-7.png",
    colors: ["#A0622A", "#7A4A20", "#B87840"],
  },
  {
    id: "red-oak-8",
    name: '8" Red Oak',
    species: "Red Oak",
    width: '8"',
    finish: "Unfinished",
    thickness: '¾"',
    grade: "Character",
    coating: "Site-finished",
    indoor: true,
    description:
      "Premium 8-inch wide-plank Red Oak. Statement flooring for living rooms, dining areas and master suites.",
    image: "/floors/red-oak-8.png",
    colors: ["#9A5C28", "#7A4018", "#B07038"],
  },
  {
    id: "red-oak-9",
    name: '9" Red Oak',
    species: "Red Oak",
    width: '9"',
    finish: "Unfinished",
    thickness: '¾"',
    grade: "Character",
    coating: "Site-finished",
    indoor: true,
    description:
      "The widest Red Oak plank we carry. Creates a dramatic, luxurious look that transforms any room into something extraordinary.",
    image: "/floors/red-oak-9.png",
    colors: ["#8B5220", "#6B3E18", "#A06830"],
    tag: "Wide Plank",
  },
  // ── WHITE OAK ──
  {
    id: "white-oak-314",
    name: '3¼" White Oak',
    species: "White Oak",
    width: '3¼"',
    finish: "Unfinished",
    thickness: '¾"',
    grade: "Select & Better",
    coating: "Site-finished",
    indoor: true,
    description:
      "White Oak offers a cooler, more contemporary tone than Red Oak. Tighter grain and natural gray undertones make it ideal for modern interiors.",
    image: "/floors/white-oak-3-25.png",
    colors: ["#D4C4A8", "#B8A888", "#C8B898"],
    tag: "Trending",
  },
  {
    id: "white-oak-6",
    name: '6" White Oak',
    species: "White Oak",
    width: '6"',
    finish: "Unfinished",
    thickness: '¾"',
    grade: "Select & Better",
    coating: "Site-finished",
    indoor: true,
    description:
      "Wide-plank White Oak with a clean, Scandinavian-inspired look. Accepts stain beautifully, from natural to dark espresso.",
    image: "/floors/white-oak-6.png",
    colors: ["#C8B898", "#A89878", "#D8C8A8"],
  },
  {
    id: "white-oak-7",
    name: '7" White Oak',
    species: "White Oak",
    width: '7"',
    finish: "Unfinished",
    thickness: '¾"',
    grade: "Select & Better",
    coating: "Site-finished",
    indoor: true,
    description:
      "Seven-inch White Oak planks, the designer's choice for high-end residential projects. Minimal knots, refined grain structure.",
    image: "/floors/white-oak-7.png",
    colors: ["#BCA888", "#9A8868", "#CEB898"],
  },
  {
    id: "white-oak-8",
    name: '8" White Oak',
    species: "White Oak",
    width: '8"',
    finish: "Unfinished",
    thickness: '¾"',
    grade: "Character",
    coating: "Site-finished",
    indoor: true,
    description:
      "Wide-plank 8-inch White Oak with natural character marks. Each plank tells its own story.",
    image: "/floors/white-oak-8.png",
    colors: ["#B89878", "#988060", "#C8A888"],
    tag: "Wide Plank",
  },
  // ── PARQUET ──
  {
    id: "white-oak-parquet",
    name: "White Oak Parquet",
    species: "Parquet",
    width: '12"×12"',
    finish: "Unfinished",
    thickness: '¾"',
    grade: "Select",
    coating: "Site-finished",
    indoor: true,
    description:
      "Classic herringbone and basket-weave patterns in White Oak. Adds architectural interest and a timeless European elegance to any room.",
    image: "/floors/white-oak-parquet.png",
    colors: ["#C8B898", "#A89878", "#D8C8A8"],
    tag: "Signature",
  },
  {
    id: "red-oak-parquet",
    name: "Red Oak Parquet",
    species: "Parquet",
    width: '12"×12"',
    finish: "Unfinished",
    thickness: '¾"',
    grade: "Select",
    coating: "Site-finished",
    indoor: true,
    description:
      "Warm Red Oak in traditional parquet patterns. A statement floor for formal dining rooms, foyers, and classic New England homes.",
    image: "/floors/red-oak-parquet.png",
    colors: ["#C47C3A", "#8B5E3C", "#D4956B"],
    tag: "Signature",
  },
  // ── VINYL LVP ──
  {
    id: "lvp-premium",
    name: "Premium LVP",
    species: "Vinyl (LVP)",
    width: '7"',
    finish: "Embossed",
    thickness: "6mm",
    grade: "Commercial Grade",
    coating: "UV-cured urethane",
    indoor: true,
    description:
      "Luxury Vinyl Plank with 100% waterproof core. Perfect for kitchens, bathrooms and basements. Realistic wood-look texture with AC4 wear layer.",
    image:
      "https://images.unsplash.com/photo-1562184552-997c461abbe6?w=800&q=80",
    colors: ["#8B6914", "#6B5010", "#A07820"],
    tag: "100% Waterproof",
  },
  // ── LAMINATE ──
  {
    id: "laminate-12mm",
    name: "12mm Laminate",
    species: "Laminate",
    width: '5"',
    finish: "Embossed in Register",
    thickness: "12mm",
    grade: "AC3 Residential",
    coating: "Aluminum Oxide",
    indoor: true,
    description:
      "High-definition laminate with authentic wood texture. Scratch-resistant, easy to install, and budget-friendly without compromising on style.",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
    colors: ["#9A7840", "#7A5820", "#B09050"],
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
    id: 'hardwood-stairs-dark',
    name: 'Hardwood Staircase',
    city: 'West Bridgewater, MA',
    type: 'Residential',
    material: 'Dark Walnut Hardwood',
    image: '/projects/project-03.jpg',
  },
  {
    id: 'staircase-premium',
    name: 'Premium Stair Installation',
    city: 'Newton, MA',
    type: 'Residential',
    material: 'Red Oak Hardwood',
    image: '/projects/project-04.jpg',
  },
  {
    id: 'wide-plank-living',
    name: 'Wide Plank Living Room',
    city: 'Brookline, MA',
    type: 'Residential',
    material: 'Wide Plank Red Oak',
    image: '/projects/project-07.jpg',
  },
  {
    id: 'full-floor-install',
    name: 'Full Floor Installation',
    city: 'Boston, MA',
    type: 'Commercial',
    material: 'Select Red Oak',
    image: '/projects/project-10.jpg',
  },
  {
    id: 'installation-process',
    name: 'New Construction Floor',
    city: 'Brockton, MA',
    type: 'Residential',
    material: 'Red Oak 3¼"',
    image: '/projects/project-14.jpg',
  },
  {
    id: 'hardwood-result',
    name: 'Hardwood Renovation',
    city: 'Providence, RI',
    type: 'Residential',
    material: 'Natural Red Oak',
    image: '/projects/project-01.jpg',
  },
  {
    id: 'stair-detail',
    name: 'Staircase Detail Work',
    city: 'Quincy, MA',
    type: 'Residential',
    material: 'Dark Stained Oak',
    image: '/projects/project-06.jpg',
  },
  {
    id: 'floor-process',
    name: 'Floor Installation Detail',
    city: 'Hartford, CT',
    type: 'Commercial',
    material: 'Select White Oak',
    image: '/projects/project-09.jpg',
  },
  {
    id: 'finished-room',
    name: 'Finished Hardwood Room',
    city: 'Wellesley, MA',
    type: 'Residential',
    material: 'Gunstock Red Oak',
    image: '/projects/project-13.jpg',
  },
  {
    id: 'premium-result',
    name: 'Premium Renovation Result',
    city: 'Attleboro, MA',
    type: 'Residential',
    material: 'Special Walnut Oak',
    image: '/projects/project-17.jpg',
  },
];
