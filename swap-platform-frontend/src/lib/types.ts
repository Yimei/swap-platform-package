export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  point_price: number;
  condition: string;
  city: string;
  image_url: string | null;
  image_urls: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  coin_balance: number;
  products: Product[];
};
