import { LOJA } from "@/config/loja";
import { IconeWhatsApp } from "./Icones";
import { LinkWhatsApp } from "./WhatsAppAtendimento";

export function BlocoTenis() {
  return (
    <div className="em-breve">
      <h2>Tênis chegam em breve</h2>
      <p>Olympikus, Adidas, Nike e modelos de outras fábricas de Nova Serrana vão entrar aqui. Procurando algo que ainda não está no catálogo?</p>
      <LinkWhatsApp className="btn btn-contorno" texto={`Olá! Procuro um modelo que não achei no catálogo da ${LOJA.nome}.`}>
        <IconeWhatsApp /> Perguntar no WhatsApp
      </LinkWhatsApp>
    </div>
  );
}
