import type { Metadata } from "next";
import { Separacao } from "@/components/Separacao";

export const metadata: Metadata = { title: "Pedido com fotos" };

// Aberta pelo link "Ver com fotos" da mensagem do pedido. Fica fora do menu.
export default function PaginaSeparar() {
  return (
    <div className="wrap tela">
      <Separacao />
    </div>
  );
}
