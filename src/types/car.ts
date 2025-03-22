export interface Car {
  id: number;
  name: string;
  price_usd: number;
  price_aed: number;
  price_eur: number;
  year: number;
  image: string;
  mileage: string;
  location: string;
  type: string;
  model: string;
  engine: string;
  color: string;
  status: string;
  specs: string;
  warranty: string;
  transmission: string;
  body_type: string;
  fuel_type: string;
  doors: number;
  cylinders: number;
  horsepower: number;
  make: string;
  images: string[];
  folder_path: string;
  engine_sound_url: string | null; // Changed to match database text type
}