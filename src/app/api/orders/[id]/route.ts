import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { updateOrderStatus } from "@/services/orders.service";
import type { OrderStatus } from "@/types/order";

const validStatuses: OrderStatus[] = ["Pending", "Preparing", "Ready"];

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const status = body?.status as OrderStatus;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const result = await updateOrderStatus(id, status);

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update order error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Error updating order",
      },
      { status: 500 }
    );
  }
}