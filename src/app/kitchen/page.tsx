"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { OrderCard } from "@/components/orders/OrderCard";
import type { Order, OrderStatus } from "@/types/order";

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/orders", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        setError("Could not load orders");
        return;
      }

      setOrders(data);
      setError("");
    } catch {
      setError("Connection error");
    }
  }, []);

  async function handleStatusChange(id: string, status: OrderStatus) {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        setError("Could not update order status");
        return;
      }

      await fetchOrders();
    } catch {
      setError("Error updating order");
    }
  }

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!isMounted) return;
      await fetchOrders();
    };

    void run();

    const interval = setInterval(() => {
      void run();
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fetchOrders]);

  return (
    <main className="page-container">
      <div className="kitchen-header">
        <h1>Kitchen</h1>
        <Link href="/" className="valdrak-link">
          Back
        </Link>
      </div>

      {error && <p>{error}</p>}

      <div className="orders-grid">
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </main>
  );
}