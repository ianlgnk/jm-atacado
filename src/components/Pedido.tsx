"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LOJA } from "@/config/loja";
import { pedido, usePedido, type Cliente, type FormaPagamento, type SeFaltar } from "@/lib/carrinho";
import { brl, mascaraTelefone } from "@/lib/formato";
import { TEXTO_SE_FALTAR, faltandoNoFormulario, grupos, porNumeracaoGeral, totais } from "@/lib/pedido";
import { IconeSeta, IconeVoltar } from "./Icones";
import { DesfazerRemocao } from "./DesfazerRemocao";
import { Matriz } from "./Matriz";
import { RepetirUltimo } from "./RepetirUltimo";

const PIX_NO_SITE = LOJA.pix.chave.trim() !== "";

const PAGAMENTOS: { id: FormaPagamento; titulo: string; texto: string }[] = [
  {
    id: "pix",
    titulo: "Pix",
    texto: PIX_NO_SITE
      ? "Você paga pelo QR Code na próxima tela e manda o comprovante junto com o pedido."
      : "A vendedora confere o estoque e manda a chave Pix no WhatsApp.",
  },
  { id: "combinar", titulo: "Combinar no WhatsApp", texto: "Boleto, cartão ou outra forma: você acerta com a vendedora na conversa." },
];

const OPCOES_FALTA: SeFaltar[] = ["avisar", "trocar", "tirar"];

export function Pedido() {
  const e = usePedido();
  const router = useRouter();
  const [tentou, setTentou] = useState(false);
  const t = totais(e.itens);
  const gs = grupos(e.itens, true);
  const falta = faltandoNoFormulario(e);
  const invalido = (k: keyof Cliente) => tentou && falta.includes(k);

  // Vindo da folha do pedido (que trava a rolagem), a página abria no meio.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!gs.length) {
    return (
      <div className="vazio">
        <h1 className="titulo">Seu pedido está vazio</h1>
        <p className="sub">Escolha os modelos e as grades no catálogo. Eles aparecem aqui, prontos para enviar.</p>
        <DesfazerRemocao />
        <div className="ctas" style={{ justifyContent: "center" }}>
          <Link className="btn btn-tinta" href="/catalogo/">
            Ver catálogo
          </Link>
          <RepetirUltimo />
        </div>
      </div>
    );
  }

  const campo = (k: keyof Cliente, rotulo: string, extra: React.InputHTMLAttributes<HTMLInputElement> & { opcional?: boolean } = {}) => {
    const { opcional, ...attrs } = extra;
    return (
      <div className="campo">
        <label htmlFor={`f-${k}`}>
          {rotulo} {opcional && <i>(opcional)</i>}
        </label>
        <input
          id={`f-${k}`}
          name={k}
          value={e.cliente[k]}
          aria-invalid={invalido(k) || undefined}
          onChange={(ev) => pedido.cliente(k, k === "telefone" ? mascaraTelefone(ev.target.value) : ev.target.value)}
          {...attrs}
        />
      </div>
    );
  };

  function continuar(ev: { preventDefault(): void }) {
    ev.preventDefault();
    setTentou(true);
    if (falta.length) {
      document.getElementById(`f-${falta[0]}`)?.focus();
      return;
    }
    if (!t.pares) return;
    router.push("/pagamento/");
  }

  return (
    <>
      <Link className="voltar" href="/catalogo/">
        <IconeVoltar /> Continuar escolhendo
      </Link>
      <h1 className="titulo">Seu pedido</h1>
      <p className="sub">Confira os pares por cor e numeração, preencha seus dados e escolha como pagar.</p>
      <div className="pedido">
        <div className="pedido-itens">
          <DesfazerRemocao />
          {gs.map((g) => (
            <Matriz key={g.linha.id} linha={g.linha} vars={g.vars} />
          ))}
        </div>

        <aside>
          <div className="bloco totais">
            <h3>Resumo</h3>
            <div className="l">
              <span>Modelos</span>
              <b>{t.modelos}</b>
            </div>
            <div className="l">
              <span>Grades fechadas</span>
              <b>{t.grades}</b>
            </div>
            {t.avulsos > 0 && (
              <div className="l">
                <span>Pares avulsos</span>
                <b>{t.avulsos}</b>
              </div>
            )}
            <div className="l">
              <span>Total de pares</span>
              <b>{t.pares}</b>
            </div>
            <div className="por-numeracao">
              {porNumeracaoGeral(e.itens).map((x) => (
                <span key={x.n}>
                  <small>{x.n}</small>
                  <b>{x.pares}</b>
                </span>
              ))}
            </div>
            <div className="l total">
              <span>Total</span>
              <span>{brl(t.valor)}</span>
            </div>
            <p className="nota">Valor de atacado. Frete e disponibilidade confirmados pela vendedora.</p>
          </div>

          <form className="bloco" onSubmit={continuar} noValidate>
            <h3>Seus dados</h3>
            <p className="nota" style={{ marginBottom: 14 }}>
              Ficam salvos neste celular para o próximo pedido.
            </p>
            {campo("nome", "Seu nome", { autoComplete: "name", required: true })}
            {campo("loja", "Nome da loja", { autoComplete: "organization", opcional: true })}
            <div className="duas">
              {campo("cidade", "Cidade", { autoComplete: "address-level2", required: true })}
              {campo("uf", "UF", { autoComplete: "address-level1", maxLength: 2, style: { textTransform: "uppercase" }, required: true })}
            </div>
            {campo("telefone", "Telefone para contato", { type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "(00) 00000-0000", required: true })}
            {campo("transportadora", "Transportadora", { opcional: true, placeholder: "Ex.: a que você já usa, ou retirar na fábrica" })}

            <fieldset className="pagamentos">
              <legend className="lbl-campo">Se faltar alguma cor</legend>
              {OPCOES_FALTA.map((op) => (
                <label key={op} className={`opcao compacta${e.seFaltar === op ? " marcada" : ""}`}>
                  <input type="radio" name="se-faltar" value={op} checked={e.seFaltar === op} onChange={() => pedido.seFaltar(op)} />
                  <span>
                    <b>{TEXTO_SE_FALTAR[op].titulo}</b>
                  </span>
                </label>
              ))}
            </fieldset>

            <div className="campo">
              <label htmlFor="f-obs">
                Observações <i>(opcional)</i>
              </label>
              <textarea id="f-obs" value={e.cliente.obs} onChange={(ev) => pedido.cliente("obs", ev.target.value)} placeholder="Ex.: preciso até sexta" />
            </div>

            <fieldset className="pagamentos">
              <legend className="lbl-campo">Como vai pagar?</legend>
              {PAGAMENTOS.map((p) => (
                <label key={p.id} className={`opcao${e.pagamento === p.id ? " marcada" : ""}`}>
                  <input type="radio" name="pagamento" value={p.id} checked={e.pagamento === p.id} onChange={() => pedido.pagamento(p.id)} />
                  <span>
                    <b>{p.titulo}</b>
                    <small>{p.texto}</small>
                  </span>
                </label>
              ))}
            </fieldset>

            {tentou && falta.length > 0 && (
              <p className="erro" role="alert">
                Preencha nome, cidade, UF e telefone para a vendedora saber de quem é o pedido.
              </p>
            )}
            {tentou && !t.pares && (
              <p className="erro" role="alert">
                O pedido está sem pares. Preencha a tabela ou use “+ grade”.
              </p>
            )}
            <button type="submit" className="btn btn-tinta largo">
              {PIX_NO_SITE && e.pagamento === "pix" ? "Continuar para o pagamento" : "Revisar e enviar"} <IconeSeta />
            </button>
            <p className="nota aviso-envio">
              O pedido vai para o WhatsApp de {LOJA.vendedora.nome}, {LOJA.vendedora.exibir}.
            </p>
          </form>
        </aside>
      </div>
    </>
  );
}
