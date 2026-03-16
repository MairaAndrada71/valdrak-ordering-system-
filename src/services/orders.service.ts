import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongo";
import type { CreateOrderInput, Order, OrderStatus } from "@/types/order";

type DbOrder = Omit<Order, "_id"> & {
  _id: ObjectId;
};

export async function createOrder(input: CreateOrderInput) {
  const db = await getDb();

  const newOrder = {
    table: input.table,
    items: input.items,
    status: "Pending" as OrderStatus,
    time: Date.now(),
  };

  const result = await db.collection("orders").insertOne(newOrder);

  return {
    _id: result.insertedId.toString(),
    ...newOrder,
  };
}

export async function getOrders(): Promise<Order[]> {
  const db = await getDb();

  const orders = (await db
    .collection("orders")
    .find()
    .sort({ time: -1 })
    .toArray()) as DbOrder[];

  return orders.map((order) => ({
    ...order,
    _id: order._id.toString(),
  }));
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const db = await getDb();

  return db.collection("orders").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status } }
  );
}