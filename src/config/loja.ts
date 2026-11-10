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

  // Põe a linha "Comissão" na mensagem do pedido, para o atendimento encaminhar ao financeiro.
  // Atenção: a mensagem é enviada pelo lojista, então ele também vê essa linha.
  comissaoNaMensagem: true,
} as const;

export const linkWhatsApp = (texto: string) =>
  `https://wa.me/${LOJA.atendimento.whatsapp}?text=${encodeURIComponent(texto)}`;
