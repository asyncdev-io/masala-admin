"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useGetNotificationsByRestaurantQuery } from "@/lib/store/api";
import { OrderCard } from "@/components/orders/order-card";

export default function OrdersPage() {
  const router = useRouter();
  const selectedRestaurantId = useSelector((state: RootState) => state.restaurant.selectedRestaurant.id);

  const {
    data: notifications,
    isLoading,
    isError,
  } = useGetNotificationsByRestaurantQuery(selectedRestaurantId!, {
    skip: !selectedRestaurantId,
  });

  const handleOrderClick = (orderId: string) => {
    router.push(`/dashboard/orders/${orderId}`);
  };

  const pendingOrders = notifications
  ?.filter((n) => n.order?.status === "PENDING")
  .map((n) => ({
    id: n.order.id,
    table: "Mesa " + (n.order.address?.tableNumber ?? "1"),
    status: n.order.status.toLowerCase() as "pending" | "in_progress" | "completed",
    createdAt: n.order.createdAt,
    total: n.order.total,
    items: n.order.items.map((item: {
      id: string;
      quantity: number;
      meal: { name: string; price: string | number };
    }) => ({
      id: item.id,
      name: item.meal.name,
      price: parseFloat(item.meal.price.toString()),
      quantity: item.quantity,
    })),
  }));


  const inProgressOrders = notifications
  ?.filter((n) => n.order?.status === "IN_PROGRESS")
  .map((n) => ({
    id: n.order.id,
    table: "Mesa " + (n.order.address?.tableNumber ?? "1"),
    status: n.order.status.toLowerCase() as "pending" | "in_progress" | "completed",
    createdAt: n.order.createdAt,
    total: n.order.total,
    items: n.order.items.map((item: {
      id: string;
      quantity: number;
      meal: { name: string; price: string | number };
    }) => ({
      id: item.id,
      name: item.meal.name,
      price: parseFloat(item.meal.price.toString()),
      quantity: item.quantity,
    })),
  }));



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
            {isLoading ? (
              <p>Cargando...</p>
            ) : isError ? (
              <p>Error al cargar órdenes</p>
            ) : (
              <div className="space-y-4">
                {pendingOrders?.map((order) => (
                  <OrderCard key={order.id} order={order} onClick={handleOrderClick} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* In Progress Orders */}
        <Card>
          <CardHeader>
            <CardTitle>En Progreso</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Cargando...</p>
            ) : isError ? (
              <p>Error al cargar órdenes</p>
            ) : (
              <div className="space-y-4">
                {inProgressOrders?.map((order) => (
                  <OrderCard key={order.id} order={order} onClick={handleOrderClick} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
