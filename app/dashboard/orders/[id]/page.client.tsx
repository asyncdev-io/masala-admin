'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import { OrderDetails } from "@/components/orders/order-details";
import { formatRelativeTime } from "@/lib/utils/date";
import { useGetOrderQuery } from "@/lib/store/api"; 
import Loader from "@/components/ui/loader";

interface OrderPageClientProps {
  params: {
    id: string;
  };
  onOrderUpdated?: () => void;
}

export function OrderPageClient({ params, onOrderUpdated }: OrderPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notificationId = searchParams.get("notificationId") || "";
  const { data: order, isLoading, isError } = useGetOrderQuery(params.id); 

  if (isLoading) {
    return <Loader size="md" />;
  }

  if (isError || !order) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a órdenes
        </Button>
        <p>No se encontró la orden</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a órdenes
        </Button>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatRelativeTime(order.createdAt)}</span>
        </div>
      </div>

      <OrderDetails order={order} notificationId={notificationId} onOrderUpdated={onOrderUpdated} />
    </div>
  );
}
