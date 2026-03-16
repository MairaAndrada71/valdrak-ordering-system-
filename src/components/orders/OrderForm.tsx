"use client";

import { useState } from "react";
import { FOOD_OPTIONS, DRINK_OPTIONS } from "@/constants/menu";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function OrderForm() {
  const [table, setTable] = useState(1);
  const [food, setFood] = useState(FOOD_OPTIONS[0]);
  const [foodQty, setFoodQty] = useState(0);
  const [drink, setDrink] = useState(DRINK_OPTIONS[0]);
  const [drinkQty, setDrinkQty] = useState(0);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const items: { type: "food" | "drink"; name: string; qty: number }[] = [];

    if (foodQty > 0) {
      items.push({ type: "food", name: food, qty: foodQty });
    }

    if (drinkQty > 0) {
      items.push({ type: "drink", name: drink, qty: drinkQty });
    }

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table, items }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(data?.message || "Could not send order");
      return;
    }

    setFoodQty(0);
    setDrinkQty(0);
    setMessage("Order sent successfully");
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="valdrak-form">
        <h1>New Order</h1>

        <label>
          Table
          <input
            type="number"
            min={1}
            value={table}
            onChange={(e) => setTable(Number(e.target.value))}
          />
        </label>

        <label>
          Food
          <select value={food} onChange={(e) => setFood(e.target.value)}>
            {FOOD_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Food quantity
          <input
            type="number"
            min={0}
            value={foodQty}
            onChange={(e) => setFoodQty(Number(e.target.value))}
          />
        </label>

        <label>
          Drink
          <select value={drink} onChange={(e) => setDrink(e.target.value)}>
            {DRINK_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Drink quantity
          <input
            type="number"
            min={0}
            value={drinkQty}
            onChange={(e) => setDrinkQty(Number(e.target.value))}
          />
        </label>

        <Button type="submit">Send order</Button>

        {message && <p>{message}</p>}
      </form>
    </Card>
  );
}