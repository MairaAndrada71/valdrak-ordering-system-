"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Order, OrderStatus } from "@/types/order";

type OrderCardProps = {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => Promise<void>;
};

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  return (
    <Card>
      <h3>Table {order.table}</h3>

      <ul>
        {order.items.map((item, index) => (
          <li key={`${item.name}-${index}`}>
            {item.qty} x {item.name}
          </li>
        ))}
      </ul>

      <p>
        Status: <strong>{order.status}</strong>
      </p>

      <div className="valdrak-actions">
        <Button onClick={() => onStatusChange(order._id, "Preparing")}>
          Preparing
        </Button>
        <Button onClick={() => onStatusChange(order._id, "Ready")}>
          Ready
        </Button>
      </div>
    </Card>
  );
}