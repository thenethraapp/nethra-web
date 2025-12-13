import apiClient from "@/api/core/apiClient";

export interface CatalogueItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
}

export interface GetCatalogueResponse {
  success: boolean;
  data: CatalogueItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const getCatalogue = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<GetCatalogueResponse> => {
  const response = await apiClient.get("/api/shop/catalogue", { params });
  return response.data;
};

export const getCatalogueItemById = async (id: string): Promise<{ success: boolean; data: CatalogueItem }> => {
  const response = await apiClient.get(`/api/shop/catalogue/${id}`);
  return response.data;
};
