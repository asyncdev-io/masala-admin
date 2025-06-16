import { OrderPageClient } from "./page.client";


export default function OrderPage({ params }: { params: { id: string } }) {
  
  return <OrderPageClient params={params} />;
}
