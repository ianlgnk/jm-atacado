# JM Atacado

Catálogo de atacado da JM Calçados (vendedora: Fabíola). O lojista escolhe os modelos, monta grades fechadas ou pares avulsos, paga no Pix (QR Code com o valor) ou combina outra forma, e o pedido sai pronto para o WhatsApp da vendedora, com a comissão calculada.

Next.js 16 gerado como site estático (`out/`). Sem servidor e sem banco por enquanto: o pedido fica salvo no aparelho do lojista.

## Rodar

```bash
npm install
npm run dev
```

## Onde mudar as coisas

| O quê | Arquivo |
|---|---|
| WhatsApp da vendedora, chave Pix, comissão na mensagem | `src/config/loja.ts` |
| Produtos, preços, cores/estampas, esgotado | `src/data/catalogo.ts` |
| Grade e comissão por categoria (chinelos 0,50 · tênis 1,00) | `CATEGORIAS` em `src/data/catalogo.ts` |
| Fotos (`<linha>-<nn>-480.jpg` e `-1200.jpg`) | `public/img/` |
| Texto da mensagem do pedido | `mensagem()` em `src/lib/pedido.ts` |
| Pix copia e cola (BR Code estático) | `src/lib/pix.ts` |

## Publicar

`npm run build` gera a pasta `out/`. Qualquer hospedagem estática que aceite repositório privado serve (Cloudflare Pages, Netlify, Vercel): comando de build `npm run build`, pasta de saída `out`.

## Pendências

- Chave Pix da JM em `src/config/loja.ts` (sem ela, a tela de pagamento pede a chave pelo WhatsApp).
- Confirmar o número de atendimento: o WhatsApp mostra (37) 9197-7372, com 8 dígitos.
- Nomes das cores/estampas e códigos (GL-01, FP-13…) são provisórios.
- A linha "Comissão" vai na mensagem que o lojista envia, então ele também vê. Para tirar, `comissaoNaMensagem: false`.
