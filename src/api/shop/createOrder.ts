import apiClient from "@/api/core/apiClient";

export interface CreateOrderData {
  productId: string;
  email: string;
  phone: string;
  name?: string;
  quantity: number;
  paymentMethod?: 'transfer' | 'card';
  paymentReference?: string;
  shippingAddress?: string;
  notes?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  data: {
    _id: string;
    product: {
      _id: string;
      name: string;
      price: number;
      imageUrl: string;
    };
    customer: {
      email: string;
      phone: string;
      name?: string;
    };
    quantity: number;
    totalAmount: number;
    paymentMethod?: 'transfer' | 'card' | null;
    paymentStatus: 'pending' | 'completed' | 'failed';
    orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
  };
  message?: string;
}

export const createOrder = async (data: CreateOrderData): Promise<CreateOrderResponse> => {
  const response = await apiClient.post("/api/shop/orders", data);
  return response.data;
};
