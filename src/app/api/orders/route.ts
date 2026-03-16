import { NextResponse } from "next/server";
import { createOrder, getOrders } from "@/services/orders.service";
import { isPositiveNumber } from "@/lib/utils";
import type { CreateOrderInput } from "@/types/order";

function isValidCreateOrderInput(body: unknown): body is CreateOrderInput {
  if (!body || typeof body !== "object") return false;

  const payload = body as CreateOrderInput;

  return (
    isPositiveNumber(payload.table) &&
    Array.isArray(payload.items) &&
    payload.items.length > 0 &&
    payload.items.every(
      (item) =>
        (item.type === "food" || item.type === "drink") &&
        typeof item.name === "string" &&
        item.name.trim().length > 0 &&
        isPositiveNumber(item.qty)
    )
  );
}

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Get orders error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Error fetching orders",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!isValidCreateOrderInput(body)) {
      return NextResponse.json(
        { message: "Incomplete order data" },
        { status: 400 }
      );
    }

    const order = await createOrder(body);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Error saving order",
      },
      { status: 500 }
    );
  }
}