// Dados da loja e do atendimento. É aqui que se troca número, chave Pix e regras do pedido.
// Os textos do site falam "a loja" (sem nome de vendedor): mais de um vendedor vai usar o mesmo catálogo.

export type Atendimento = { whatsapp: string; exibir: string };
export type Vendedor = Atendimento & { id: string; nome: string };

// Cada vendedor divulga o próprio link: https://ianlgnk.github.io/jm-atacado/?v=<id>
// (vale para qualquer página, ex.: /linha/al/?v=fabiola). Quem chega por esse link manda o pedido
// e as dúvidas para o WhatsApp desse vendedor, e o aparelho lembra nas próximas visitas.
// O id vai no link: minúsculo, sem acento nem espaço. WhatsApp: só dígitos, como o app mostra (55 + DDD + número).
export const VENDEDORES: Vendedor[] = [
  { id: "fabiola", nome: "Fabíola", whatsapp: "553791977372", exibir: "(37) 9197-7372" },
  { id: "luiza", nome: "Luiza", whatsapp: "553791350773", exibir: "(37) 9135-0773" },
  { id: "maycon", nome: "Maycon", whatsapp: "553799386262", exibir: "(37) 9938-6262" },
];

// Sem vendedor no link (?v=), o pedido e as dúvidas vão para este vendedor.
export const VENDEDOR_PADRAO = "fabiola";

const padrao = VENDEDORES.find((v) => v.id === VENDEDOR_PADRAO) ?? VENDEDORES[0];

export const LOJA = {
  nome: "JM Calçados",
  local: "Nova Serrana – MG",
  prefixoPedido: "JM",

  // Atendimento de quem chega sem link de vendedor: o vendedor padrão, acima.
  atendimento: { whatsapp: padrao.whatsapp, exibir: padrao.exibir } as Atendimento,

  // Hoje a chave Pix NÃO fica no site: a loja confere o estoque e manda a chave no WhatsApp.
  // Se um dia quiserem QR Code com o valor já preenchido, é só pôr a chave aqui. Formatos:
  // CNPJ/CPF só números, e-mail, celular como +5537999999999 ou chave aleatória.
  pix: {
    chave: "",
    recebedor: "JM CALCADOS", // até 25 letras, sem acento
    cidade: "NOVA SERRANA", // até 15 letras, sem acento
  },
} as const;

export const linkWhatsApp = (texto: string, numero: string = LOJA.atendimento.whatsapp) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
