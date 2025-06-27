import { OrderCard } from "@/components/orders/order-card";
import Loader from "@/components/ui/loader";
import { OrderListItem } from "@/hooks/use-orders-by-status";

interface OrderListSectionProps {
  orders: OrderListItem[];
  isLoading: boolean;
  isError: boolean;
  onOrderClick: (orderId: string, notificationId: string) => void;
  emptyMessage?: string;
}

export function OrderListSection({
  orders,
  isLoading,
  isError,
  onOrderClick,
  emptyMessage = "No hay órdenes para mostrar",
}: OrderListSectionProps) {
  if (isLoading) return <Loader />;
  if (isError) return <p className="text-red-500">Error al cargar órdenes</p>;
  if (!orders || orders.length === 0) return <p>{emptyMessage}</p>;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onClick={onOrderClick} />
      ))}
    </div>
  );
}
