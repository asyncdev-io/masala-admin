"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useGetNotificationsByRestaurantQuery } from "@/lib/store/api";
import { OrderListSection } from "@/components/orders/order-list-section";
import { useOrdersByStatus } from "@/hooks/use-orders-by-status";

export default function OrdersPage() {
  const router = useRouter();
  const selectedRestaurantId = useSelector((state: RootState) => state.restaurant.selectedRestaurant.id);

  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
  } = useGetNotificationsByRestaurantQuery(selectedRestaurantId!, {
    skip: !selectedRestaurantId,
  });

  const handleOrderUpdated = () => {
    refetch();
  };

  const { pendingOrders, inProgressOrders } = useOrdersByStatus(notifications);

  const handleOrderClick = (orderId: string, notificationId: string) => {
    // Pasar handleOrderUpdated como query param temporal (ejemplo simple)
    // En un caso real, usarías contexto o router events para refrescar
    router.push(`/dashboard/orders/${orderId}?notificationId=${notificationId}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Órdenes</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pending Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Órdenes pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderListSection
              orders={pendingOrders}
              isLoading={isLoading}
              isError={isError}
              onOrderClick={handleOrderClick}
              emptyMessage="No hay órdenes para mostrar"
            />
          </CardContent>
        </Card>

        {/* In Progress Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Órdenes en progreso</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderListSection
              orders={inProgressOrders}
              isLoading={isLoading}
              isError={isError}
              onOrderClick={handleOrderClick}
              emptyMessage="No hay órdenes para mostrar"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
