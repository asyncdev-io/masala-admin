import { type Order } from "@/types/order";
import { formatRelativeTime } from "@/lib/utils/date";

interface OrderCardProps {
  order: Order;
  onClick: (orderId: string) => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  return (
    <div
      className="rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={() => onClick(order.id)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">{order.table}</span>
        <span className="text-sm text-muted-foreground">
          {formatRelativeTime(order.createdAt)}
        </span>
      </div>
      <ul className="list-disc list-inside text-sm">
        {order.items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}