import { NotificationAPI } from "@/types/notification";

export interface OrderListItem {
  id: string;
  notificationId: string;
  title: string;
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  total: number;
  notes?: string;
  tip?: number;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
  }[];
}

function calculateOrderTotal(items: OrderListItem["items"]): number {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

export function useOrdersByStatus(notifications?: NotificationAPI[]) {
  const getOrderNumber = (notification: NotificationAPI): string => notification.order.id;

  const mapOrderItems = (items: any[]): OrderListItem["items"] =>
    items.map((item) => ({
      id: item.id,
      name: item.meal?.name ?? "",
      price: item.meal?.finalCustomerPrice
        ? parseFloat(item.meal.finalCustomerPrice)
        : item.meal?.price
        ? parseFloat(item.meal.price)
        : parseFloat(item.price?.toString() || "0"),
      quantity: item.quantity ?? 1,
      notes: item.notes,
    }));

  const mapNotificationToOrder = (notification: NotificationAPI): OrderListItem => {
    const items = mapOrderItems(notification.order.items);
    const tipRaw = notification.order.tip;
    const tip = typeof tipRaw === "number"
      ? tipRaw
      : tipRaw
      ? parseFloat(tipRaw)
      : 0;
    const total = calculateOrderTotal(items);
    return {
      id: notification.order.id,
      notificationId: notification.id,
      title: `Orden ${getOrderNumber(notification)}`,
      status: notification.order.status.toLowerCase() as "pending" | "in_progress" | "completed",
      createdAt: notification.order.createdAt,
      total,
      tip,
      notes: notification.order.notes,
      items,
    };
  };

  const pendingOrders: OrderListItem[] = (notifications || [])
    .filter((notification) => notification.order?.status === "PENDING")
    .sort((a, b) => new Date(a.order.createdAt).getTime() - new Date(b.order.createdAt).getTime())
    .map(mapNotificationToOrder);

  const inProgressOrders: OrderListItem[] = (notifications || [])
    .filter((notification) => notification.order?.status === "IN_PROGRESS")
    .sort((a, b) => new Date(a.order.createdAt).getTime() - new Date(b.order.createdAt).getTime())
    .map(mapNotificationToOrder);

  return { pendingOrders, inProgressOrders };
}
