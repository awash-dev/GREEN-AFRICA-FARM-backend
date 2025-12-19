export interface Product {
  id?: string | number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  image_base64?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
