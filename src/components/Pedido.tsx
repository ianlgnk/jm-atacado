"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LOJA } from "@/config/loja";
import { img } from "@/lib/caminho";
import { pedido, usePedido, type Cliente, type FormaPagamento } from "@/lib/carrinho";
import { abrirFolha } from "@/lib/folhas";
import { brl, mascaraTelefone } from "@/lib/formato";
import { avulsos, descreverItem, faltandoNoFormulario, grupos, paresDoItem, totais } from "@/lib/pedido";
import { Stepper } from "./Stepper";

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

export function Pedido() {
  const e = usePedido();
  const router = useRouter();
  const [tentou, setTentou] = useState(false);
  const t = totais(e.itens);
  const falta = faltandoNoFormulario(e);
  const invalido = (k: keyof Cliente) => tentou && falta.includes(k);

  if (!t.modelos) {
    return (
      <div className="vazio">
        <span className="eyebrow">Seu pedido</span>
        <h1 className="titulo">Seu pedido está vazio</h1>
        <p className="sub">Escolha os modelos e as grades no catálogo. Eles aparecem aqui, prontos para enviar.</p>
        <Link className="btn btn-ouro" href="/catalogo/">
          Ver catálogo →
        </Link>
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
    router.push("/pagamento/");
  }

  return (
    <>
      <Link className="voltar" href="/catalogo/">
        ← Continuar escolhendo
      </Link>
      <h1 className="titulo">Seu pedido</h1>
      <p className="sub">Confira os modelos, preencha seus dados e escolha como pagar.</p>
      <div className="pedido">
        <div>
          {grupos(e.itens).map(({ linha, vars }) => {
            const pares = vars.reduce((a, v) => a + paresDoItem(v.cod, e.itens[v.cod]), 0);
            return (
              <div className="bloco" key={linha.id}>
                <h3>
                  {linha.nome}
                  <span>{brl(linha.preco)} o par</span>
                </h3>
                {vars.map((v) => {
                  const it = e.itens[v.cod];
                  const p = paresDoItem(v.cod, it);
                  return (
                    <div className="item" key={v.cod}>
                      <img src={img(`${v.foto}-480.jpg`)} alt="" loading="lazy" />
                      <div>
                        <div className="cab-item">
                          <b>
                            {v.cod} · {v.nome}
                          </b>
                          <span>{brl(p * linha.preco)}</span>
                        </div>
                        <div className="detalhe">
                          {p} pares · {descreverItem(v.cod, it)}
                        </div>
                        <div className="acoes">
                          <Stepper
                            valor={it.g}
                            rotulo={["grade", "grades"]}
                            nome={`Grades fechadas de ${v.cod}`}
                            onMais={() => pedido.maisGrade(v.cod)}
                            onMenos={() => pedido.menosGrade(v.cod)}
                            desativado={v.esgotado}
                          />
                          <button type="button" className="link-num" onClick={() => abrirFolha({ tipo: "numeracao", cod: v.cod })}>
                            {avulsos(it) ? "Editar avulsos" : "Avulsos por numeração"}
                          </button>
                          <button type="button" className="remover" onClick={() => pedido.remover(v.cod)}>
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="subtotal">
                  <span>{pares} pares</span>
                  <b>{brl(pares * linha.preco)}</b>
                </div>
              </div>
            );
          })}
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
            <button type="submit" className="btn btn-ouro largo">
              {PIX_NO_SITE && e.pagamento === "pix" ? "Continuar para o pagamento →" : "Revisar e enviar →"}
            </button>
            <p className="nota aviso-envio">O pedido vai para o WhatsApp de {LOJA.vendedora.nome}, {LOJA.vendedora.exibir}.</p>
          </form>
        </aside>
      </div>
    </>
  );
}
