export type Role = "traveler" | "guide";

export type Package = {
  id: number;
  slug: string;
  name: string;
  tier: "Basic" | "Standard" | "Premium" | "Deluxe";
  description: string;
  price: number;
  durationDays: number;
  hotel: string;
  distance: string;
  meals: boolean;
  transport: boolean;
  featured?: boolean;
  accent: string;
};

export type SessionUser = { id: number; name: string; email: string; role: Role };
