export interface NotificationAPI { 
  id: string;
  read: boolean;
  status: "PENDING" | "CONFIRMED" | "CANCELED";
  createdAt: string;
  order: {
    id: string;
    status: string;
    createdAt: string;
    total: number;
    notes?: string; 
    tip?: number | string;
    items: {
      id: string;
      quantity: number;
      notes?: string; 
      meal: {
        name: string;
        price: string | number;
        finalCustomerPrice?: string;
      };
    }[];
  };
}
