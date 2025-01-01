import { orders } from "@/data/orders";
import { OrderPageClient } from "./page.client";

// This is required for static site generation
export function generateStaticParams() {
  return orders.map((order) => ({
    id: order.id,
  }));
}

export default function OrderPage({ params }: { params: { id: string } }) {
  return <OrderPageClient params={params} />;
}