# JM Atacado

Catálogo de atacado da JM Calçados. O lojista escolhe os modelos e quantas grades fechadas de cada cor (a fábrica não vende par a par), e o pedido sai pronto para o WhatsApp de quem atende: o vendedor do link ou, sem link de vendedor, o atendimento da loja. Quem atende confere o estoque e manda a chave Pix (ou combina outra forma de pagamento) na conversa. Os textos do site não citam vendedor pelo nome, porque mais de um vendedor vai usar o catálogo.

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
| WhatsApp de atendimento, vendedores e seus números, chave Pix | `src/config/loja.ts` |
| Estatística de acessos (token do Cloudflare Web Analytics) | `ESTATISTICA` em `src/config/loja.ts` |
| Produtos, preços, cores/estampas, esgotado, público de cada linha | `LINHAS` em `src/data/catalogo.ts` |
| Grades de 12 pares (feminina, masculina, juvenil, infantil) | `GRADES` em `src/data/catalogo.ts` |
| Comissão por categoria (chinelos 0,50 · tênis 1,00) | `CATEGORIAS` em `src/data/catalogo.ts` |
| Fotos (`<linha>-<nn>-480.jpg` e `-1200.jpg`) | `public/img/` |
| Vídeo da capa (Pexels, licença livre, pexels.com/video/8456413) | `public/video/` |
| Texto da mensagem do pedido | `mensagem()` em `src/lib/pedido.ts` |
| Pix copia e cola (BR Code estático) | `src/lib/pix.ts` |

## Link de cada vendedor

Cada vendedor divulga o próprio link, com `?v=` e o id dele (o id fica em `VENDEDORES`, em `src/config/loja.ts`):

```
https://ianlgnk.github.io/jm-atacado/?v=fabiola
https://ianlgnk.github.io/jm-atacado/linha/al/?v=fabiola
```

Quem abre por esse link manda o pedido, as dúvidas e a pergunta de reposição para o WhatsApp desse vendedor, e o aparelho guarda a escolha para as próximas visitas. Se a pessoa abrir depois o link de outro vendedor, passa a valer o novo. Sem `?v=`, vai para o vendedor padrão (`VENDEDOR_PADRAO`, hoje a Fabíola). O "Compartilhar" de uma linha leva o `?v=` junto.

Para pôr um vendedor novo, acrescente uma linha em `VENDEDORES` com id, nome e WhatsApp (só dígitos, com 55 e DDD).

## Pedido com fotos (separação)

A mensagem do pedido começa com um link "Ver com fotos". Ele abre `/separar/` com foto, código, cor, grades e pares por numeração de cada modelo, para quem atende tirar print, imprimir ou mandar para quem separa no estoque ("Enviar para quem separa"). Cada cor tem um "Separado" que fica guardado no aparelho.

Não há servidor: o pedido inteiro vai no próprio link, depois do `#` (ex.: `/separar/#JM-1011-9DW_AL01x2_GL03x1`, código sem hífen e `x` grades). Dados do cliente não vão no link. Por isso os códigos (AL-01, GL-03…) não devem mudar: um link antigo com um código trocado mostraria outra foto.

## Publicar

Todo push no `main` publica sozinho em **https://ianlgnk.github.io/jm-atacado/** (workflow `.github/workflows/pages.yml`).

O site mora numa subpasta, então o build do Pages usa `NEXT_PUBLIC_BASE_PATH=/jm-atacado`. Links com `next/link` recebem o prefixo sozinhos; imagens de `public/` usam `img()` de `src/lib/caminho.ts`.

## Pendências

- Confirmar o número de atendimento: o WhatsApp mostra (37) 9197-7372, com 8 dígitos.
- O catálogo veio do grupo SISTEMA JM (fábrica), em 10/11/2026: 26 linhas, 384 cores/estampas. Os nomes das cores e estampas foram dados a partir das fotos; alguns são palpites e podem ser trocados em `LINHAS`.
- Linhas de lançamento marcadas: Âmbar Lux, Glitter e Estrela (mudar em `lancamento`).
- A mensagem do pedido não traz comissão: quem manda é o lojista.
