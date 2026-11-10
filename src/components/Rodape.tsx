import { LOJA, linkWhatsAppVendedora } from "@/config/loja";
import { img } from "@/lib/caminho";

export function Rodape() {
  return (
    <footer className="rodape">
      <div className="wrap">
        <div className="rodape-marca">
          <img src={img("logo-160.jpg")} alt={`${LOJA.nome} Atendimento`} width={56} height={56} loading="lazy" />
          <div>
            <b>{LOJA.nome} · Atendimento</b>
            <br />
            Atacado de calçados · {LOJA.local}
            <br />
            <a href={linkWhatsAppVendedora(`Olá! Vim pelo catálogo da ${LOJA.nome} e tenho uma dúvida.`)} target="_blank" rel="noopener">
              WhatsApp {LOJA.vendedora.exibir}
            </a>
          </div>
        </div>
        <div className="cred">
          Preços de atacado por par. Estoque, frete e pagamento são confirmados pela vendedora.
          <br />
          Site por{" "}
          <a
            href={`https://wa.me/5533988429751?text=${encodeURIComponent(`Olá, Ian! Vi o site da ${LOJA.nome} e quero saber mais sobre o seu trabalho.`)}`}
            target="_blank"
            rel="noopener"
          >
            Ian LGNK Consultoria
          </a>
        </div>
      </div>
    </footer>
  );
}
