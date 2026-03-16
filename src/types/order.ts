export type OrderStatus = "Pending" | "Preparing" | "Ready";

export type OrderItemType = "food" | "drink";

export type OrderItem = {
  type: OrderItemType;
  name: string;
  qty: number;
};

export type Order = {
  _id: string;
  table: number;
  items: OrderItem[];
  status: OrderStatus;
  time: number;
};

export type CreateOrderInput = {
  table: number;
  items: OrderItem[];
};

export type UpdateOrderStatusInput = {
  status: OrderStatus;
};