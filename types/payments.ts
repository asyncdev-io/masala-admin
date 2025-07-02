import { Order } from "./order";

export interface IPendingPayments {
  restaurantName: string;
  restaurantId: string;
  amountToTransfer: number;
  amountToTransferFormatted: string;
  amountGenerated: number;
  amountGeneratedFormatted: string;
  orders: Order[];
}