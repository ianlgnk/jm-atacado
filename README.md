# JM Atacado

Catálogo de atacado da JM Calçados (vendedora: Fabíola). O lojista escolhe os modelos, monta grades fechadas ou pares avulsos e o pedido sai pronto para o WhatsApp da vendedora, com a comissão calculada. A vendedora confere o estoque e manda a chave Pix (ou combina outra forma de pagamento) na conversa.

O site também sabe gerar QR Code Pix com o valor preenchido, mas hoje está desligado: a chave Pix fica vazia em `src/config/loja.ts`.

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
| Vídeo da capa (Pexels, licença livre, pexels.com/video/8456413) | `public/video/` |
| Texto da mensagem do pedido | `mensagem()` em `src/lib/pedido.ts` |
| Pix copia e cola (BR Code estático) | `src/lib/pix.ts` |

## Publicar

Todo push no `main` publica sozinho em **https://ianlgnk.github.io/jm-atacado/** (workflow `.github/workflows/pages.yml`).

O site mora numa subpasta, então o build do Pages usa `NEXT_PUBLIC_BASE_PATH=/jm-atacado`. Links com `next/link` recebem o prefixo sozinhos; imagens de `public/` usam `img()` de `src/lib/caminho.ts`.

## Pendências

- Confirmar o número de atendimento: o WhatsApp mostra (37) 9197-7372, com 8 dígitos.
- Nomes das cores/estampas e códigos (GL-01, FP-13…) são provisórios.
- A linha "Comissão" vai na mensagem que o lojista envia, então ele também vê. Para tirar, `comissaoNaMensagem: false`.
