import Link from "next/link";
import { OrderForm } from "@/components/orders/OrderForm";

export default function HomePage() {
  return (
    <main className="page-container">
      <OrderForm />
      <Link href="/kitchen" className="valdrak-link">
        Go to kitchen
      </Link>
    </main>
  );
}