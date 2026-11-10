// Usado só dentro de componentes de cliente (Pedido, Pagamento): recebe funções como props.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { linkWhatsApp } from "@/config/loja";
import { foiEnviado, pedido, usePedido } from "@/lib/carrinho";
import { prenderFocoEm } from "@/lib/foco";
import { faltandoNoFormulario, mensagem } from "@/lib/pedido";
import { useAtendimento } from "@/lib/vendedor";
import { IconeWhatsApp } from "./Icones";

// Botão que abre o WhatsApp de quem atende com o pedido pronto.
// O WhatsApp só abre com um toque (o celular bloqueia abrir sozinho), então o envio é sempre um link de verdade.
// validar: se devolver false, o toque não sai da página (ex.: faltam dados).
export function BotaoEnviar({
  id,
  className = "btn btn-wa largo",
  validar,
  aoEnviar,
  children,
}: {
  id?: string;
  className?: string;
  validar?: () => boolean;
  aoEnviar?: () => void;
  children?: ReactNode;
}) {
  const e = usePedido();
  const { whatsapp } = useAtendimento();
  return (
    <a
      id={id}
      className={className}
      href={linkWhatsApp(mensagem(e), whatsapp)}
      target="_blank"
      rel="noopener"
      onClick={(ev) => {
        if (validar && !validar()) {
          ev.preventDefault();
          return;
        }
        pedido.registrarEnvio();
        aoEnviar?.();
      }}
    >
      <IconeWhatsApp /> {children ?? "Enviar pedido no WhatsApp"}
    </a>
  );
}

// Se o cliente sai da página com o pedido pronto e ainda não enviado (para pagar no app do banco, por exemplo)
// e volta, aparece esta folha com o botão de enviar, a um toque.
export function LembreteEnvio({ aoEnviar }: { aoEnviar?: () => void }) {
  const e = usePedido();
  const [aberto, setAberto] = useState(false);
  const saiuEm = useRef(0);
  const folha = useRef<HTMLDivElement>(null);
  const pronto = Object.keys(e.itens).length > 0 && !faltandoNoFormulario(e).length && !foiEnviado(e);

  useEffect(() => {
    const aoMudar = () => {
      if (document.visibilityState === "hidden") saiuEm.current = Date.now();
      else if (saiuEm.current && Date.now() - saiuEm.current > 1500) {
        saiuEm.current = 0;
        setAberto(true);
      }
    };
    document.addEventListener("visibilitychange", aoMudar);
    return () => document.removeEventListener("visibilitychange", aoMudar);
  }, []);

  const visivel = aberto && pronto;

  useEffect(() => {
    if (!visivel) return;
    const soltar = prenderFocoEm(folha.current);
    folha.current?.querySelector<HTMLElement>(".btn-wa")?.focus();
    const esc = (ev: KeyboardEvent) => ev.key === "Escape" && setAberto(false);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("keydown", esc);
      soltar();
    };
  }, [visivel]);

  if (!visivel) return null;

  return (
    <div className="veu" ref={folha} onClick={(ev) => ev.target === ev.currentTarget && setAberto(false)}>
      <div className="folha lembrete" role="dialog" aria-modal="true" aria-labelledby="lembrete-t">
        <h2 id="lembrete-t">Falta enviar o pedido</h2>
        <p>
          O pedido {e.numero} ainda não chegou na loja. Envie agora para a loja conferir e separar, mesmo que você já tenha pago.
        </p>
        <BotaoEnviar
          aoEnviar={() => {
            setAberto(false);
            aoEnviar?.();
          }}
        />
        <button type="button" className="btn btn-contorno largo" onClick={() => setAberto(false)}>
          Agora não
        </button>
      </div>
    </div>
  );
}
