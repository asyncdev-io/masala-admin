import { type Order } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useConfirmOrderMutation, useCancelOrderMutation } from "@/lib/store/api";
import { toast } from "@/hooks/use-toast";

interface OrderDetailsProps {
  order: Order;
  notificationId: string;
  onOrderUpdated?: () => void;
}

export function OrderDetails({ order, notificationId, onOrderUpdated }: OrderDetailsProps) {
  console.log("Order Details:", order);
  
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800"
  };

  const [confirmOrder, { isLoading: isConfirming }] = useConfirmOrderMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const handleConfirm = async () => {
    try {
      await confirmOrder(notificationId).unwrap();
      toast({
        title: "Orden confirmada",
        description: "La orden ha sido confirmada exitosamente.",
      });
      onOrderUpdated?.();
    } catch (e) {
      toast({
        title: "Error al confirmar",
        description: "No se pudo confirmar la orden. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async () => {
    try {
      await cancelOrder(notificationId).unwrap();
      toast({
        title: "Orden cancelada",
        description: "La orden ha sido cancelada exitosamente.",
      });
      onOrderUpdated?.();
    } catch (e) {
      toast({
        title: "Error al cancelar",
        description: "No se pudo cancelar la orden. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  // Calcular subtotal usando finalCustomerPrice si existe, si no, usar price
  const subtotal = order.items.reduce((acc: number, item: typeof order.items[number]) => {
    const finalPrice = item.meal?.finalCustomerPrice
      ? parseFloat(item.meal.finalCustomerPrice)
      : item.meal?.price
        ? parseFloat(item.meal.price)
        : parseFloat(item.price?.toString() || '0');
    return acc + finalPrice * (item.quantity || 1);
  }, 0);
  // Usar propina del objeto order si existe
  const tip = typeof order.tip === 'number' ? order.tip : (order.tip ? parseFloat(order.tip) : 0);
  // Total = subtotal + propina
  const total = subtotal + tip;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">{order.title}</CardTitle>
          <Badge className={statusColors[order.status]}>
            {order.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-4">Productos de la órden:</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start border-b pb-4">
                <div>
                  <p className="font-medium">{item.meal?.name || 'Sin nombre'}</p>
                  {item.meal?.description && (
                    <p className="text-sm text-muted-foreground">{item.meal.description}</p>
                  )}
                  {item.meal?.imageUrl && (
                    <img src={item.meal.imageUrl} alt={item.meal.name} className="w-20 h-20 object-cover rounded mt-2" />
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">${item.meal?.price || '0.00'} × {item.quantity}</p>
                  <p className="text-sm text-muted-foreground">
                    ${(Number(item.meal?.price || 0) * item.quantity).toFixed(2)}
                  </p>
                  {item.meal?.finalCustomerPrice && (
                    <p className="text-xs text-green-700">Final: ${item.meal.finalCustomerPrice}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div> 

        {/* Order Totals */}
        <div className="space-y-1 pt-4 border-t">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Subtotal</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-semibold">Propina</p>
            <p>${tip.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center border-t pt-2">
            <p className="font-semibold">Total</p>
            <p className="font-semibold">${total.toFixed(2)}</p>
          </div>
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Notas</h3>
            <p className="text-muted-foreground">{order.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-4">
          {order.status === "pending" && (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleConfirm}
              disabled={isConfirming}
            >
              Confirmar orden
            </button>
          )}
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleCancel}
            disabled={isCancelling}
          >
            Cancelar orden
          </button>
        </div>
      </CardContent>
    </Card>
  );
}