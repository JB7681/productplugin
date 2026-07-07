export type Product = {
  id: string;
  name: string;
  description: string;
  fullDescription?: string | null;
  category: string;
  image: string;
  affiliateLink: string;
  brand: string;
  price: string;
  originalPrice?: string | null;
  rating?: number | null;
  featured: boolean;
  latest: boolean;
  tags: string[];
  platform: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Profile = {
  id: number;
  name: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  instagram: string;
  youtube: string;
  tiktokOrShorts: string;
  disclosure: string;
};
