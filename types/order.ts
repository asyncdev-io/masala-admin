export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  table: string;
  status: 'pending' | 'in_progress' | 'completed';
  items: OrderItem[];
  total: number;
  createdAt: string;
  notes?: string;
}