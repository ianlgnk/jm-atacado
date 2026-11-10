# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Lojistas e revendedores que já compram da JM Calçados pela vendedora Fabíola. Recebem o link no WhatsApp, abrem quase sempre no celular e montam um pedido de atacado em grades de 12 pares (a numeração muda com o público: feminina 33/34–39/40, masculina 37/38–43/44, juvenil 33/34–35/36, infantil 27/28–33/34) ou em pares avulsos por numeração. Muitos repõem os mesmos modelos de tempos em tempos.

## Product Purpose

Substituir o atendimento manual (foto por foto e legenda com preço no WhatsApp) por um catálogo onde o próprio lojista escolhe modelos, monta as grades e envia o pedido pronto para o WhatsApp da vendedora. Sucesso: pedidos chegam completos e organizados, a vendedora gasta menos tempo atendendo e o lojista compra rápido pelo celular.

## Positioning

Catálogo de atacado de Nova Serrana feito para o jeito que esse mercado já compra: grades, códigos de modelo, conferência de estoque e pagamento pela própria conversa no WhatsApp. Não é loja com checkout: o fechamento continua humano.

## Operating Context

- O lojista recebe o link pela vendedora e volta a ele para repor.
- O pedido sai como mensagem de WhatsApp para a vendedora, com número, itens por cor e numeração, totais, comissão e dados do lojista (nome, loja, cidade/UF, telefone, transportadora).
- A vendedora confere o estoque (parte dos produtos vem de outras fábricas de Nova Serrana, sem estoque exato) e responde com a chave Pix ou combina outra forma de pagamento. O site não recebe pagamento.
- O financeiro confere o Pix e a comissão (R$ 0,50 por par de chinelo, R$ 1,00 por par de tênis).

## Capabilities and Constraints

- Site estático (Next.js com `output: "export"`), publicado no GitHub Pages em `/jm-atacado/`. Sem servidor, sem banco: o pedido fica no aparelho do lojista (localStorage).
- Catálogo por linha (26 linhas, separadas em feminino, masculino e infantil) com variações de cor/estampa, código (FP-13), preço por par, esgotado ou disponível.
- Pedido em pares por numeração; "grade" é atalho que soma 2-4-4-2. Opções "se faltar alguma cor", "repetir último pedido".
- Hoje só chinelos; tênis e outras fábricas entram depois.
- Nomes de cores/estampas e códigos ainda são provisórios.

## Brand Commitments

- Nome: JM Calçados · Atendimento. Logo: círculo preto com "JM" em moldura quadrada, "CALÇADOS / ATENDIMENTO" em letras brancas condensadas e um brilho dourado (`public/img/logo-*.jpg`).
- Crédito "Site por Ian LGNK Consultoria" no rodapé, com link para o WhatsApp do Ian.
- Referência visual escolhida pelo cliente (nov/2026): e-commerce mobile claro em preto e branco, com barra de abas embaixo, modelos direto na vitrine com +, tela do modelo com foto grande e miniaturas das outras cores, e pedido em folha de baixo.

## Evidence on Hand

- 44 fotos reais de produto (1200×1600) em `public/img/` e o logo.
- Fatos confirmados para a área de confiança: envia para todo o Brasil; fabricação própria (de parte dos modelos, em Nova Serrana).
- Não há depoimentos, números de clientes, Instagram nem prazos de entrega confirmados: não inventar.

## Product Principles

1. Rápido no celular: o caminho do link até o pedido enviado tem o mínimo de toques.
2. Falar a língua do atacado: grade, numeração, código do modelo, pares.
3. O fechamento é humano: o site prepara o pedido; estoque, frete e pagamento se resolvem no WhatsApp.
4. Nada de promessa que a JM não confirmou.
