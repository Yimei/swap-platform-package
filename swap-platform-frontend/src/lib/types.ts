export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  point_price: number;
  condition: string;
  city: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
};
