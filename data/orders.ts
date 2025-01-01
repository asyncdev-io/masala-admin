import { Order } from "@/types/order";

// Mock orders data
export const orders: Order[] = [
  {
    id: "1",
    table: "Table 5",
    status: "pending",
    items: [
      { id: "1", name: "Classic Burger", quantity: 2, price: 12.99, notes: "No onions" },
      { id: "2", name: "Caesar Salad", quantity: 1, price: 8.99 }
    ],
    total: 34.97,
    createdAt: new Date().toISOString(),
    notes: "Customer requested extra napkins"
  },
  {
    id: "2",
    table: "Table 3",
    status: "in_progress",
    items: [
      { id: "3", name: "Pasta Carbonara", quantity: 1, price: 15.99 },
      { id: "4", name: "Tiramisu", quantity: 1, price: 7.99 }
    ],
    total: 23.98,
    createdAt: new Date().toISOString()
  }
];

export function getOrder(id: string): Order | undefined {
  return orders.find(order => order.id === id);
}

export function getPendingOrders(): Order[] {
  return orders.filter(order => order.status === "pending");
}

export function getInProgressOrders(): Order[] {
  return orders.filter(order => order.status === "in_progress");
}