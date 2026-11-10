// Dados da loja e da vendedora. É aqui que se troca número, chave Pix e regras do pedido.

export const LOJA = {
  nome: "JM Calçados",
  local: "Nova Serrana – MG",
  prefixoPedido: "JM",

  vendedora: {
    nome: "Fabíola",
    // Número exatamente como o WhatsApp mostra (+55 37 9197-7372), só dígitos.
    whatsapp: "553791977372",
    exibir: "(37) 9197-7372",
  },

  // Hoje a chave Pix NÃO fica no site: a vendedora confere o estoque e manda a chave no WhatsApp.
  // Se um dia quiserem QR Code com o valor já preenchido, é só pôr a chave aqui. Formatos:
  // CNPJ/CPF só números, e-mail, celular como +5537999999999 ou chave aleatória.
  pix: {
    chave: "",
    recebedor: "JM CALCADOS", // até 25 letras, sem acento
    cidade: "NOVA SERRANA", // até 15 letras, sem acento
  },

  // Põe a linha "Comissão" na mensagem do pedido, para a vendedora encaminhar ao financeiro.
  // Atenção: a mensagem é enviada pelo lojista, então ele também vê essa linha.
  comissaoNaMensagem: true,
} as const;

export const linkWhatsAppVendedora = (texto: string) =>
  `https://wa.me/${LOJA.vendedora.whatsapp}?text=${encodeURIComponent(texto)}`;
