// Catálogo da JM. Para pôr um produto como esgotado, use o terceiro valor da variação: ["Preta", "", true].
// Fotos ficam em public/img/<foto>-480.jpg e <foto>-1200.jpg (a foto de cada variação é <linha>-<nn>).

export type CategoriaId = "chinelos" | "tenis";

export type Tamanho = { n: string; q: number };

export type Categoria = {
  id: CategoriaId;
  nome: string;
  grade: Tamanho[]; // grade fechada: numeração e pares de cada uma
  comissaoPorPar: number; // R$ de comissão por par vendido
};

export const CATEGORIAS: Record<CategoriaId, Categoria> = {
  chinelos: {
    id: "chinelos",
    nome: "Chinelos",
    grade: [
      { n: "33/34", q: 2 },
      { n: "35/36", q: 4 },
      { n: "37/38", q: 4 },
      { n: "39/40", q: 2 },
    ],
    comissaoPorPar: 0.5,
  },
  tenis: { id: "tenis", nome: "Tênis", grade: [], comissaoPorPar: 1 },
};

export const paresPorGrade = (c: CategoriaId) => CATEGORIAS[c].grade.reduce((a, t) => a + t.q, 0);

export type Variacao = {
  cod: string;
  nome: string;
  busca: string;
  foto: string;
  esgotado: boolean;
  linhaId: string;
};

export type Linha = {
  id: string;
  nome: string;
  curto: string; // nome curto da linha, para filtros e cards
  marca: string;
  categoria: CategoriaId;
  preco: number;
  lancamento: boolean;
  rotulo: "cores" | "estampas";
  capa: string;
  descricao: string[];
  variacoes: Variacao[];
};

type Entrada = [nome: string, busca?: string, esgotado?: boolean];

function linha(def: Omit<Linha, "variacoes"> & { vars: Entrada[] }): Linha {
  const { vars, ...resto } = def;
  return {
    ...resto,
    variacoes: vars.map(([nome, busca = "", esgotado = false], i) => {
      const n = String(i + 1).padStart(2, "0");
      return { cod: `${def.id.toUpperCase()}-${n}`, nome, busca, esgotado, foto: `${def.id}-${n}`, linhaId: def.id };
    }),
  };
}

export const LINHAS: Linha[] = [
  linha({
    id: "al", nome: "Havaianas Âmbar Lux", curto: "Âmbar Lux", marca: "Havaianas", categoria: "chinelos", preco: 10.5,
    lancamento: true, rotulo: "cores", capa: "al-02",
    descricao: ["Nova sola com desenhos em alto-relevo", "Aplicação em ABS com corrente cromada e pedrarias", "Solado em micro expandido, leve e confortável", "Fabricação própria"],
    vars: [["Vermelha"], ["Preta", "dourado"], ["Rosa"], ["Marinho", "azul"]],
  }),
  linha({
    id: "gl", nome: "Havaianas Glitter", curto: "Glitter", marca: "Havaianas", categoria: "chinelos", preco: 8.5,
    lancamento: true, rotulo: "cores", capa: "gl-02",
    descricao: ["Correia toda com glitter", "Sola em micro expandido", "Aplicação em ABS cromado"],
    vars: [["Preta"], ["Lilás", "roxo"], ["Areia", "dourada bege nude"]],
  }),
  linha({
    id: "ec", nome: "Havaianas Estrela Cravejada", curto: "Estrela Cravejada", marca: "Havaianas", categoria: "chinelos", preco: 7.9,
    lancamento: true, rotulo: "cores", capa: "ec-00",
    descricao: ["Pingente estrela em resina", "Sola em micro expandido", "Aplicação em ABS cromado"],
    vars: [["Lilás", "roxo"], ["Areia", "bege nude"], ["Vinho", "bordô"], ["Vermelha"], ["Café", "marrom"], ["Preta"], ["Rosa"], ["Marinho", "azul"]],
  }),
  linha({
    id: "fc", nome: "Havaianas Farm Cereja", curto: "Farm Cereja", marca: "Havaianas", categoria: "chinelos", preco: 10,
    lancamento: false, rotulo: "estampas", capa: "fc-01",
    descricao: ["Pingente em ABS com resina", "Estampa em transfer digital", "Solado em micro expandido"],
    vars: [["Cerejas", "branca vermelha"], ["Cerejas e oncinha", "azul laranja onça"], ["Cerejas e laços", "branca corações"], ["Cerejas creme", "bege"]],
  }),
  linha({
    id: "fp", nome: "Havaianas Farm Pingente", curto: "Farm Pingente", marca: "Havaianas", categoria: "chinelos", preco: 9.5,
    lancamento: false, rotulo: "estampas", capa: "fp-05",
    descricao: ["Estampa em transfer digital", "Sola em micro expandido", "Pingente em ABS"],
    vars: [
      ["Laranjinha", "floral laranja verde"], ["Tucano azul", "azul"], ["Letreiro", "preto branco"], ["Corações azuis", "azul branca flor"],
      ["Tucano tropical", "verde rosa"], ["Folhagem", "branca verde"], ["Araras tropicais", "branca colorida"], ["Arara e hibisco", "azul vermelha"],
      ["Coqueiros", "verde branca"], ["Tucano no coqueiro", "verde"], ["Abacaxi", "verde amarela"], ["Oncinha P&B", "preto branco onça"],
      ["Olho grego e penas", "azul branca"], ["Corações P&B", "preto branco"], ["Lavanda", "lilás roxo floral"], ["Laços rosa", "rosa vermelha branca"],
      ["Olho grego Fé", "azul branca"], ["Tucano amarelo", "amarela"], ["Heroínas", "rosa personagens"], ["Ursinho", "amarela personagem"],
      ["Borboletas azuis", "azul branca"], ["Renda", "preto branco"], ["Olho grego preto", "preta azul"], ["Canarinho", "amarela personagem"],
    ],
  }),
];

export const VARIACOES: Record<string, Variacao> = Object.fromEntries(
  LINHAS.flatMap((l) => l.variacoes.map((v) => [v.cod, v])),
);

export const TOTAL_MODELOS = Object.keys(VARIACOES).length;

export const linhaPorId = (id: string) => LINHAS.find((l) => l.id === id);
export const linhaDaVariacao = (cod: string) => linhaPorId(VARIACOES[cod]?.linhaId ?? "");
