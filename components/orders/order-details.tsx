import { OrderItem, type Order } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useConfirmOrderMutation, useCancelOrderMutation } from "@/lib/store/api";

interface OrderDetailsProps {
  order: Order;
  notificationId: string;
}

export function OrderDetails({ order, notificationId }: OrderDetailsProps) {
  console.log("Order Details:", order);
  
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800"
  };

  const [confirmOrder, { isLoading: isConfirming }] = useConfirmOrderMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const handleConfirm = async () => {
    try {
      await confirmOrder(notificationId).unwrap();
      // Opcional: mostrar toast o refrescar datos
    } catch (e) {
      // Manejo de error opcional
    }
  };

  const handleCancel = async () => {
    try {
      await cancelOrder(notificationId).unwrap();
      // Opcional: mostrar toast o refrescar datos
    } catch (e) {
      // Manejo de error opcional
    }
  };

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

        {/* Order Total */}
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="font-semibold">Total</p>
          <p className="font-semibold">${order.total.toFixed(2)}</p>
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
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleConfirm}
            disabled={isConfirming}
          >
            Confirmar orden
          </button>
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