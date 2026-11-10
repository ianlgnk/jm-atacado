import { LOJA } from "@/config/loja";
import { img } from "@/lib/caminho";
import { IconeWhatsApp } from "./Icones";
import { LinkWhatsApp, NumeroAtendimento } from "./WhatsAppAtendimento";

export function Rodape() {
  return (
    <footer className="rodape">
      <div className="wrap">
        <div className="rodape-marca">
          <img src={img("logo-160.jpg")} alt={`${LOJA.nome} Atendimento`} width={48} height={48} loading="lazy" />
          <div>
            <b>{LOJA.nome} · Atendimento</b>
            <span>Atacado de calçados · {LOJA.local}</span>
            <LinkWhatsApp texto={`Olá! Vim pelo catálogo da ${LOJA.nome} e tenho uma dúvida.`}>
              <IconeWhatsApp /> <NumeroAtendimento />
            </LinkWhatsApp>
          </div>
        </div>
        <div className="cred">
          <span>Preços de atacado por par. Estoque, frete e pagamento são confirmados pela loja.</span>
          <span>
            Site por{" "}
            <a
              href={`https://wa.me/5533988429751?text=${encodeURIComponent(`Olá, Ian! Vi o site da ${LOJA.nome} e quero saber mais sobre o seu trabalho.`)}`}
              target="_blank"
              rel="noopener"
            >
              Ian LGNK Consultoria
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
