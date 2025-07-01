export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  mealPrice?: number;
  notes?: string;
  meal?: {
    id: string;
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    productId: string;
    priceId: string;
    finalCustomerPrice: string;
  };
}

export interface Order {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  items: OrderItem[];
  total: number;
  createdAt: string;
  notes?: string;
  tip?: number;
}