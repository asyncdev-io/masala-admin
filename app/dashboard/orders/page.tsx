"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPendingOrders, getInProgressOrders } from "@/data/orders";
import { OrderCard } from "@/components/orders/order-card";

export default function OrdersPage() {
  const router = useRouter();
  const pendingOrders = getPendingOrders();
  const inProgressOrders = getInProgressOrders();

  const handleOrderClick = (orderId: string) => {
    router.push(`/dashboard/orders/${orderId}`);
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
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={handleOrderClick}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* In Progress Orders */}
        <Card>
          <CardHeader>
            <CardTitle>En Progreso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inProgressOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={handleOrderClick}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
