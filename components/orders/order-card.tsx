import { type Order } from "@/types/order";
import { formatRelativeTime } from "@/lib/utils/date";
import { useConfirmOrderMutation } from "@/lib/store/api";
import { useState } from "react";

interface OrderWithNotificationId extends Order {
  notificationId: string;
}

interface OrderCardProps {
  order: OrderWithNotificationId;
  onClick: (orderId: string, notificationId: string) => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const [confirmOrder, { isLoading: isConfirming }] = useConfirmOrderMutation();
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await confirmOrder(order.notificationId).unwrap();
      setConfirmed(true);
    } catch (err) {
      // Manejar error si es necesario
    }
  };

  return (
    <div
      className="rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={() => onClick(order.id, order.notificationId)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">{order.title}</span>
        <span className="text-sm text-muted-foreground">
          {formatRelativeTime(order.createdAt)}
        </span>
      </div>
      <ul className="list-disc list-inside text-sm">
        {order.items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      {/* Mostrar propina si existe */}
      {typeof order.tip === 'number' && order.tip > 0 && (
        <div className="mt-2 text-sm text-green-700">Propina: ${order.tip.toFixed(2)}</div>
      )}
      {/* Botón para confirmar orden solo si está pendiente */}
      {order.status === "pending" && !confirmed && (
        <button
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded w-full"
          onClick={handleConfirm}
          disabled={isConfirming}
        >
          {isConfirming ? "Confirmando..." : "Confirmar orden"}
        </button>
      )}
      {confirmed && (
        <div className="mt-3 text-green-600 font-semibold text-center">Orden confirmada</div>
      )}
    </div>
  );
}