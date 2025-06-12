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
    address?: {
      tableNumber?: number;
    };
    items: {
      id: string;
      quantity: number;
      meal: {
        name: string;
        price: string | number;
      };
    }[];
  };
}
