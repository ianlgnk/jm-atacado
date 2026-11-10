// Dados da loja e do atendimento. É aqui que se troca número, chave Pix e regras do pedido.
// Os textos do site falam "a loja" (sem nome de vendedor): mais de um vendedor vai usar o mesmo catálogo.

export const LOJA = {
  nome: "JM Calçados",
  local: "Nova Serrana – MG",
  prefixoPedido: "JM",

  atendimento: {
    // Número exatamente como o WhatsApp mostra (+55 37 9197-7372), só dígitos.
    whatsapp: "553791977372",
    exibir: "(37) 9197-7372",
  },

  // Hoje a chave Pix NÃO fica no site: a loja confere o estoque e manda a chave no WhatsApp.
  // Se um dia quiserem QR Code com o valor já preenchido, é só pôr a chave aqui. Formatos:
  // CNPJ/CPF só números, e-mail, celular como +5537999999999 ou chave aleatória.
  pix: {
    chave: "",
    recebedor: "JM CALCADOS", // até 25 letras, sem acento
    cidade: "NOVA SERRANA", // até 15 letras, sem acento
  },

} as const;

export type Atendimento = { whatsapp: string; exibir: string };
export type Vendedor = Atendimento & { id: string; nome: string };

// Cada vendedor divulga o próprio link: https://ianlgnk.github.io/jm-atacado/?v=<id>
// (vale para qualquer página, ex.: /linha/al/?v=fabiola). Quem chega por esse link manda o pedido
// e as dúvidas para o WhatsApp desse vendedor, e o aparelho lembra nas próximas visitas.
// Sem ?v= o pedido vai para o atendimento da loja, acima. O id vai no link: minúsculo, sem acento nem espaço.
export const VENDEDORES: Vendedor[] = [
  { id: "fabiola", nome: "Fabíola", whatsapp: "553791977372", exibir: "(37) 9197-7372" },
  { id: "luiza", nome: "Luiza", whatsapp: "553791350773", exibir: "(37) 9135-0773" },
  { id: "maycon", nome: "Maycon", whatsapp: "553799386262", exibir: "(37) 9938-6262" },
];

export const linkWhatsApp = (texto: string, numero: string = LOJA.atendimento.whatsapp) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
