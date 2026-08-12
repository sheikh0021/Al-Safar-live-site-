import type { Package } from "@/lib/types";

export const packages: Package[] = [
  {
    id: 1, slug: "essential-umrah", name: "Essential Umrah", tier: "Basic",
    description: "A thoughtful, affordable journey with all pilgrimage essentials covered.",
    price: 85000, durationDays: 10, hotel: "Comfort 3-star stay", distance: "900m from Haram",
    meals: false, transport: true, accent: "sand"
  },
  {
    id: 2, slug: "serene-journey", name: "Serene Journey", tier: "Standard",
    description: "Balanced comfort, guided ziyarat and carefully planned transfers throughout.",
    price: 120000, durationDays: 14, hotel: "Premium 4-star stay", distance: "550m from Haram",
    meals: true, transport: true, featured: true, accent: "teal"
  },
  {
    id: 3, slug: "royal-pilgrimage", name: "Royal Pilgrimage", tier: "Premium",
    description: "An elevated spiritual experience with excellent hotels and private guidance.",
    price: 149999, durationDays: 15, hotel: "Luxury 5-star stay", distance: "250m from Haram",
    meals: true, transport: true, accent: "gold"
  },
  {
    id: 4, slug: "signature-alsafar", name: "Signature AlSafar", tier: "Deluxe",
    description: "Our finest door-to-door pilgrimage with suites, concierge and private transport.",
    price: 219999, durationDays: 18, hotel: "Kaaba-view 5-star suite", distance: "Steps from Haram",
    meals: true, transport: true, accent: "midnight"
  }
];

export const formatRupees = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
