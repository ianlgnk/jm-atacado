import { LOJA, linkWhatsAppVendedora } from "@/config/loja";
import { IconeWhatsApp } from "./Icones";

export function BlocoTenis() {
  return (
    <div className="em-breve">
      <h2>Tênis chegam em breve</h2>
      <p>Olympikus, Adidas, Nike e modelos de outras fábricas de Nova Serrana vão entrar aqui. Procurando algo que ainda não está no catálogo?</p>
      <a className="btn btn-contorno" href={linkWhatsAppVendedora(`Olá! Procuro um modelo que não achei no catálogo da ${LOJA.nome}.`)} target="_blank" rel="noopener">
        <IconeWhatsApp /> Perguntar à vendedora
      </a>
    </div>
  );
}
