import type { Metadata } from "next";
import { Pedido } from "@/components/Pedido";

export const metadata: Metadata = { title: "Seu pedido" };

export default function PaginaPedido() {
  return (
    <div className="wrap">
      <Pedido />
    </div>
  );
}
