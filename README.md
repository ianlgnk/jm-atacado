# JM Atacado

Catálogo de atacado da JM Calçados. O lojista escolhe os modelos, monta grades fechadas ou pares avulsos e o pedido sai pronto para o WhatsApp de atendimento da loja, com a comissão calculada. Quem atende confere o estoque e manda a chave Pix (ou combina outra forma de pagamento) na conversa. Os textos do site não citam vendedor pelo nome, porque mais de um vendedor vai usar o catálogo.

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
| WhatsApp de atendimento, chave Pix, comissão na mensagem | `src/config/loja.ts` |
| Produtos, preços, cores/estampas, esgotado, público de cada linha | `LINHAS` em `src/data/catalogo.ts` |
| Grades de 12 pares (feminina, masculina, juvenil, infantil) | `GRADES` em `src/data/catalogo.ts` |
| Comissão por categoria (chinelos 0,50 · tênis 1,00) | `CATEGORIAS` em `src/data/catalogo.ts` |
| Fotos (`<linha>-<nn>-480.jpg` e `-1200.jpg`) | `public/img/` |
| Vídeo da capa (Pexels, licença livre, pexels.com/video/8456413) | `public/video/` |
| Texto da mensagem do pedido | `mensagem()` em `src/lib/pedido.ts` |
| Pix copia e cola (BR Code estático) | `src/lib/pix.ts` |

## Publicar

Todo push no `main` publica sozinho em **https://ianlgnk.github.io/jm-atacado/** (workflow `.github/workflows/pages.yml`).

O site mora numa subpasta, então o build do Pages usa `NEXT_PUBLIC_BASE_PATH=/jm-atacado`. Links com `next/link` recebem o prefixo sozinhos; imagens de `public/` usam `img()` de `src/lib/caminho.ts`.

## Pendências

- Confirmar o número de atendimento: o WhatsApp mostra (37) 9197-7372, com 8 dígitos.
- O catálogo veio do grupo SISTEMA JM (fábrica), em 10/11/2026: 26 linhas, 384 cores/estampas. Os nomes das cores e estampas foram dados a partir das fotos; alguns são palpites e podem ser trocados em `LINHAS`.
- Linhas de lançamento marcadas: Âmbar Lux, Glitter e Estrela (mudar em `lancamento`).
- A linha "Comissão" vai na mensagem que o lojista envia, então ele também vê. Para tirar, `comissaoNaMensagem: false`.
