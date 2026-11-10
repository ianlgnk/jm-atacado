import type { Metadata } from "next";
import { Pagamento } from "@/components/Pagamento";

export const metadata: Metadata = { title: "Pagamento" };

export default function PaginaPagamento() {
  return (
    <div className="wrap">
      <Pagamento />
    </div>
  );
}
