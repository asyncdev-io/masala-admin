"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import { OrderDetails } from "@/components/orders/order-details";
import { getOrder } from "@/data/orders";
import { formatRelativeTime } from "@/lib/utils/date";

interface OrderPageClientProps {
  params: {
    id: string;
  };
}

export function OrderPageClient({ params }: OrderPageClientProps) {
  const router = useRouter();
  const order = getOrder(params.id);

  if (!order) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatRelativeTime(order.createdAt)}</span>
        </div>
      </div>
      
      <OrderDetails order={order} />
    </div>
  );
}