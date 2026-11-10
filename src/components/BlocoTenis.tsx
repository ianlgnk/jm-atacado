import { LOJA, linkWhatsAppVendedora } from "@/config/loja";

export function BlocoTenis() {
  return (
    <div className="em-breve">
      <span className="eyebrow">Em breve</span>
      <b>Tênis e outras fábricas</b>
      <p>Olympikus, Adidas, Nike e modelos de outras fábricas de Nova Serrana entram aqui. Procurando algo que ainda não está no catálogo?</p>
      <a className="link-num" href={linkWhatsAppVendedora(`Olá! Procuro um modelo que não achei no catálogo da ${LOJA.nome}.`)} target="_blank" rel="noopener">
        Perguntar no WhatsApp
      </a>
    </div>
  );
}
