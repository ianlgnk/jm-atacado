// Catálogo da JM, montado a partir do grupo SISTEMA JM (fábrica). Para pôr uma cor como esgotada,
// use o terceiro valor da variação: ["Preta", "", true].
// Fotos ficam em public/img/<foto>-480.jpg e <foto>-1200.jpg (a foto de cada variação é <linha>-<nn>).

export type CategoriaId = "chinelos" | "tenis";

export type Tamanho = { n: string; q: number };

export type Categoria = {
  id: CategoriaId;
  nome: string;
  comissaoPorPar: number; // R$ de comissão por par vendido
};

export const CATEGORIAS: Record<CategoriaId, Categoria> = {
  chinelos: { id: "chinelos", nome: "Chinelos", comissaoPorPar: 0.5 },
  tenis: { id: "tenis", nome: "Tênis", comissaoPorPar: 1 },
};

// Cada linha vende numa grade fechada de 12 pares; a numeração muda com o público.
export type GradeId = "feminina" | "masculina" | "juvenil" | "infantil";

export const GRADES: Record<GradeId, { nome: string; tamanhos: Tamanho[] }> = {
  feminina: { nome: "feminina", tamanhos: [{ n: "33/34", q: 2 }, { n: "35/36", q: 4 }, { n: "37/38", q: 4 }, { n: "39/40", q: 2 }] },
  masculina: { nome: "masculina", tamanhos: [{ n: "37/38", q: 2 }, { n: "39/40", q: 4 }, { n: "41/42", q: 4 }, { n: "43/44", q: 2 }] },
  juvenil: { nome: "juvenil", tamanhos: [{ n: "33/34", q: 6 }, { n: "35/36", q: 6 }] },
  infantil: { nome: "infantil", tamanhos: [{ n: "27/28", q: 3 }, { n: "29/30", q: 3 }, { n: "31/32", q: 3 }, { n: "33/34", q: 3 }] },
};

export type Publico = "feminino" | "masculino" | "infantil";

export const PUBLICOS: { id: Publico; nome: string }[] = [
  { id: "feminino", nome: "Feminino" },
  { id: "masculino", nome: "Masculino" },
  { id: "infantil", nome: "Infantil" },
];

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
  categoria: CategoriaId;
  publico: Publico;
  gradeId: GradeId;
  grade: Tamanho[];
  preco: number;
  lancamento: boolean;
  rotulo: "cores" | "estampas";
  capa: string;
  descricao: string[];
  variacoes: Variacao[];
};

export const paresDaGrade = (l: Pick<Linha, "grade">) => l.grade.reduce((a, t) => a + t.q, 0);

// Numerações em ordem (27/28 antes de 33/34), para somar linhas de grades diferentes.
export const ordemNumeracao = (a: string, b: string) => parseInt(a) - parseInt(b);

type Entrada = [nome: string, busca?: string, esgotado?: boolean];

function linha(def: Omit<Linha, "variacoes" | "grade" | "gradeId" | "publico"> & { vars: Entrada[]; gradeId?: GradeId; publico?: Publico; marca?: string }): Linha {
  const { vars, gradeId = "feminina", publico = "feminino", marca: _marca, ...resto } = def;
  void _marca;
  return {
    ...resto,
    publico,
    gradeId,
    grade: GRADES[gradeId].tamanhos,
    variacoes: vars.map(([nome, busca = "", esgotado = false], i) => {
      const n = String(i + 1).padStart(2, "0");
      return { cod: `${def.id.toUpperCase()}-${n}`, nome, busca, esgotado, foto: `${def.id}-${n}`, linhaId: def.id };
    }),
  };
}

export const LINHAS: Linha[] = [
  linha({
    id: "al", nome: "Âmbar Lux", curto: "Âmbar Lux", categoria: "chinelos", publico: "feminino", gradeId: "feminina",
    preco: 10.5, lancamento: true, rotulo: "cores", capa: "al-01",
    descricao: ["Nova sola com desenhos em alto-relevo", "Aplicação em ABS com corrente cromada e pedrarias", "Solado em micro expandido, leve e confortável", "Fabricação própria"],
    vars: [["Marinho", "azul escuro pedras azuis"], ["Rosa", "pedras rosa"], ["Caramelo", "marrom terracota"], ["Vermelha", "pedras vermelhas"], ["Preta", "pedras pretas"]],
  }),
  linha({
    id: "gl", nome: "Glitter", curto: "Glitter", categoria: "chinelos", publico: "feminino", gradeId: "feminina",
    preco: 8.5, lancamento: true, rotulo: "cores", capa: "gl-01",
    descricao: ["Correia toda com glitter", "Sola em micro expandido", "Aplicação em ABS cromado"],
    vars: [["Lilás", "tira prata glitter"], ["Preta", "tira preta"], ["Areia", "bege tira rosé glitter"]],
  }),
  linha({
    id: "ec", nome: "Estrela", curto: "Estrela", categoria: "chinelos", publico: "feminino", gradeId: "feminina",
    preco: 7.9, lancamento: true, rotulo: "cores", capa: "ec-00",
    descricao: ["Pingente estrela em resina", "Sola em micro expandido", "Aplicação em ABS cromado"],
    vars: [["Preta"], ["Vermelha"], ["Verde-menta", "verde claro sálvia"], ["Vinho", "bordô"], ["Rosa"], ["Caramelo", "terracota marrom"], ["Areia", "bege nude"], ["Lilás"], ["Marinho", "azul escuro"]],
  }),
  linha({
    id: "im", nome: "Imperial", curto: "Imperial", categoria: "chinelos", publico: "feminino", gradeId: "feminina",
    preco: 10.99, lancamento: false, rotulo: "cores", capa: "im-01",
    descricao: ["Correia com pedraria", "Solado em micro expandido"],
    vars: [["Rosa", "rosa claro lilás"], ["Marinho", "azul escuro"], ["Vinho", "bordô"], ["Lilás", "branca gelo"], ["Verde-oliva", "verde musgo"], ["Areia", "bege nude"], ["Vermelha"]],
  }),
  linha({
    id: "au", nome: "Áurea", curto: "Áurea", categoria: "chinelos", publico: "feminino", gradeId: "feminina",
    preco: 10.5, lancamento: false, rotulo: "cores", capa: "au-01",
    descricao: ["Correia com pedraria", "Solado em micro expandido"],
    vars: [["Vinho", "bordô"], ["Lilás", "branca gelo"], ["Caramelo", "marrom terracota"], ["Rosa"], ["Vermelha"]],
  }),
  linha({
    id: "ru", nome: "Rubi", curto: "Rubi", categoria: "chinelos", publico: "feminino", gradeId: "feminina",
    preco: 10.7, lancamento: false, rotulo: "cores", capa: "ru-01",
    descricao: ["Correia com pedraria", "Solado em micro expandido"],
    vars: [["Terracota", "caramelo marrom salmão"], ["Lilás", "pérolas"], ["Vermelha"], ["Vinho", "bordô"], ["Areia", "bege nude"]],
  }),
  linha({
    id: "go", nome: "Gota", curto: "Gota", categoria: "chinelos", publico: "feminino", gradeId: "feminina",
    preco: 10.5, lancamento: false, rotulo: "cores", capa: "go-01",
    descricao: ["Aplicação de gota em ABS", "Solado em micro expandido"],
    vars: [["Vermelha"], ["Marinho", "azul escuro"], ["Verde-oliva", "verde musgo"], ["Areia", "bege nude"]],
  }),
  linha({
    id: "co", nome: "Coração", curto: "Coração", categoria: "chinelos", publico: "feminino", gradeId: "feminina",
    preco: 7.9, lancamento: false, rotulo: "cores", capa: "co-00",
    descricao: ["Aplicação de coração em ABS", "Solado em micro expandido"],
    vars: [["Areia", "bege nude tira rosé"], ["Lilás", "branca gelo"], ["Vinho", "bordô"], ["Verde-oliva", "verde musgo"], ["Marinho", "azul escuro"], ["Preta"], ["Rosa", "rosa claro"]],
  }),
  linha({
    id: "fw", nome: "Flower", curto: "Flower", categoria: "chinelos", publico: "feminino", gradeId: "feminina",
    preco: 8.5, lancamento: false, rotulo: "cores", capa: "fw-01",
    descricao: ["Ponto de luz", "Sola em relevo", "Solado em micro expandido"],
    vars: [["Caramelo", "terracota marrom"], ["Rosa", "rosa claro"], ["Vinho", "bordô vermelha"], ["Preta"], ["Azul", "azul turquesa"], ["Marinho", "azul escuro"], ["Areia", "bege creme"]],
  }),
  linha({
    id: "pg", nome: "Pingente", curto: "Pingente", categoria: "chinelos", publico: "feminino", gradeId: "feminina",
    preco: 9.0, lancamento: false, rotulo: "cores", capa: "pg-01",
    descricao: ["Pingente duplo em ABS", "Solado em micro expandido"],
    vars: [["Branca", "tira azul"], ["Verde", "tira amarela brasil"], ["Azul", "azul royal tira branca"], ["Preta", "tira verde"], ["Mostarda", "amarela tira verde-água"], ["Creme", "bege off white"]],
  }),
  linha({
    id: "tr", nome: "Traseirinha", curto: "Traseirinha", categoria: "chinelos", publico: "feminino", gradeId: "feminina",
    preco: 7.5, lancamento: false, rotulo: "cores", capa: "tr-01",
    descricao: ["Traseira personalizada", "Solado em micro expandido"],
    vars: [["Branca", "borda pink rosa"], ["Caramelo", "marrom bege dourada"], ["Preta", "borda pink rosa"], ["Cinza", "chumbo grafite borda branca"]],
  }),
  linha({
    id: "bb", nome: "Bandeira Básico", curto: "Bandeira Básico", categoria: "chinelos", publico: "feminino", gradeId: "feminina",
    preco: 6.0, lancamento: false, rotulo: "cores", capa: "bb-01",
    descricao: ["Estampa em transfer digital", "Solado em micro expandido"],
    vars: [["Azul-turquesa", "azul piscina"], ["Areia", "bege creme"], ["Nude", "rosé marrom claro bronze"], ["Azul", "azul claro céu"], ["Verde-menta", "verde claro"], ["Branca", "off white"], ["Rosa", "pink"], ["Verde-oliva", "verde militar musgo"]],
  }),
  linha({
    id: "fc", nome: "Cereja", curto: "Cereja", categoria: "chinelos", publico: "feminino", gradeId: "feminina",
    preco: 10.0, lancamento: false, rotulo: "estampas", capa: "fc-01",
    descricao: ["Pingente em ABS com resina", "Estampa em transfer digital", "Solado em micro expandido"],
    vars: [["Cerejas e oncinha", "azul estampada animal print"], ["Cerejas e laços", "corações coração"], ["Cerejas", "branca"], ["Cerejas creme", "bege"], ["Cerejinhas", "branca folhas corações"], ["Cerejas pretas e laços", "cereja preta laço vermelho"], ["Cerejas listradas", "rosa listras laços"]],
  }),
  linha({
    id: "fp", nome: "Farm Pingente", curto: "Farm Pingente", categoria: "chinelos", publico: "feminino", gradeId: "feminina",
    preco: 9.5, lancamento: false, rotulo: "estampas", capa: "fp-01",
    descricao: ["Estampa em transfer digital", "Sola em micro expandido", "Pingente em ABS"],
    vars: [["Laranjinha", "laranjas flores bege"], ["Palmeiras e sol", "bege coqueiros pastel"], ["Tucano azul", "turquesa"], ["Letreiro", "farm rio palmeiras preto branca"], ["Corações azuis", "branca olho grego flores"], ["Tucano tropical", "escuro preta colorido"], ["Tucano e bananas", "verde amarelo laranja"], ["Folhagem", "verde rosa tucanos"], ["Araras tropicais", "branca flores papagaio"], ["Coqueiros", "verde branca cocos"], ["Arara e hibisco", "azul roxo lua folhas vermelhas"], ["Tucano no coqueiro", "laranja tartaruga"], ["Abacaxi", "bege verde amarelo flores"], ["Tucano e palmeira", "azul verde espelho"], ["Oncinha P&B", "preta branca tucano bolinhas"], ["Olho grego e penas", "azul branca apanhador de sonhos"], ["Corações P&B", "preta branca"], ["Lavanda", "lilás roxo flores folhas"], ["Laços rosa", "alvo rosa borboletas olho grego"], ["Olho grego Fé", "branca azul estrelas"], ["Heroínas", "meninas superpoderosas branca"], ["Ursinho", "pooh amarelo listras"], ["Tucano amarelo", "bege flor vermelha"], ["Borboletas azul-marinho", "branca azul ornamental"], ["Borboletas azuis", "branca borboleta"], ["Renda", "azul cinza ornamental"], ["Ondas e conchas", "azul turquesa praia branca"], ["Olho grego preto", "preta cinza azul"]],
  }),
  linha({
    id: "fl", nome: "Farm Ponto Luz", curto: "Farm Ponto Luz", categoria: "chinelos", publico: "feminino", gradeId: "feminina",
    preco: 8.5, lancamento: false, rotulo: "estampas", capa: "fl-01",
    descricao: ["Estampa em transfer digital", "Solado em micro expandido"],
    vars: [["Calor", "preta abacaxi tropical"], ["Bordado floral", "bege flores barco abacaxi vinho"], ["Cocar", "penas indígena praia"], ["Náutico", "azul marinho mar veleiro conchas"], ["Mandala folclórica", "amarela colorida"], ["Folhagem azul", "folhas folha"], ["Frutas", "melancia mamão banana tutti frutti"], ["Arara azul", "azulejo pássaro"], ["Copacabana", "calçadão preta branca coqueiro rio"], ["Ilustração rosa", "pink mulher"], ["Zodíaco", "signos astrologia"], ["Renda azul", "branca azul flores brasil"], ["Praia do Rio", "amarela coqueiros rio de janeiro"], ["Folhas amarelas", "preta banana-da-terra monstera"], ["Girassóis", "preta corações amarelos"], ["Garfield", "laranja gato"], ["Porcelana azul", "azul e branco azulejo"], ["Flores rosa", "hibisco preta floral"], ["Coqueiros", "café marrom bege palmeira"]],
  }),
  linha({
    id: "qp", nome: "Quadrada Ponto Luz", curto: "Quadrada", categoria: "chinelos", publico: "feminino", gradeId: "feminina",
    preco: 8.0, lancamento: false, rotulo: "estampas", capa: "qp-01",
    descricao: ["Estampa em transfer digital", "Solado em micro expandido"],
    vars: [["Olho grego e borboletas", "branca azul amuleto praia"], ["Cereja e frases de amor", "vinho branca laço coração"], ["Cerejas vinho", "branca estampa cereja"], ["Cerejas e margaridas", "rosa flores"], ["Hamsá azul", "olho grego mão de fátima branca"], ["Borboletas pink", "rosa listras"], ["Stitch e dente-de-leão", "disney lilás pôr do sol"], ["Olho grego e mandala", "branca azul"], ["Magali", "turma da mônica melancia rosa"], ["Florzinha", "meninas superpoderosas pink estrelas"]],
  }),
  linha({
    id: "fv", nome: "Estampas Femininas", curto: "Estampas femininas", categoria: "chinelos", publico: "feminino", gradeId: "feminina",
    preco: 7.0, lancamento: false, rotulo: "estampas", capa: "fv-01",
    descricao: ["Estampa em transfer digital", "Solado em micro expandido"],
    vars: [["Olho grego e tartarugas", "branca azul sol conchas mar"], ["Flores azuis", "branca azul amarela floral"], ["Flamingos", "rosa verde tropical folhas sol"], ["Letreiro tropical", "preta folhagem flores havaianas"], ["Praia", "mar areia amarela verde listras"], ["Meninas Superpoderosas", "xadrez preto branco docinho desenho"], ["Folhagem laranja", "amarela onça tropical folhas"], ["Flores verdes e azuis", "aquarela branca floral"], ["Borboleta amarela", "monarca asas laranja preta"], ["Pôr do sol", "palmeiras coqueiros rosa laranja"], ["Tucano colorido", "tropical azul laranja rosa"], ["Verão em letras", "sol melancia rosa creme"], ["Bob Esponja", "patrick lula molusco desenho"], ["Margaridas roxas", "roxo lilás flores"], ["Tartarugas azuis", "branca azul tropical folhas"], ["Rosas", "rosa pink flores"], ["Olho grego azul", "branca azul amuleto"], ["Araras e frutas", "azul uvas pássaros papagaio"], ["Pôr do sol alça preta", "palmeiras coqueiros roxo"], ["Olho de Hórus", "egípcio dourado preto amarelo"], ["Arte colorida", "rosa flores abstrato"], ["Corais coloridos", "branca recife mar conchas"], ["Margarida e Donald", "pato disney rosa"], ["Cruzeiro", "time futebol azul branco estrelas"], ["Stitch de Natal", "azul gorro natal disney"], ["Tigres e palmeiras", "onça selva coqueiros"], ["Folhas verdes", "bege palmeira estampa tropical"], ["Girassóis", "pôr do sol amarela flores"], ["Margarida roxa", "pata disney corações lilás"], ["Stitch e Angel", "azul rosa disney"], ["Verão colorido", "papaia frutas raios abstrato"], ["Animais marinhos", "caranguejo lula estrela-do-mar lilás"], ["Flores folclóricas", "vermelha branca floral bordado"], ["Hibiscos azuis", "branca azul flores havaiana"], ["Snoopy", "azul branca desenho"], ["Veleiros", "barco mar amarela coqueiro"], ["Olho grego e coqueiros", "branca azul grécia santorini"], ["Borboleta e flor", "bege verde botânica aquarela"], ["Margarida pink", "pata disney branca rosa"], ["Minnie", "rosa azul claro disney"], ["Bob Esponja amarelo", "rosto desenho azul"], ["Stitch azul", "branco azul claro disney natal"], ["Stitch listras", "natal verde vermelha disney"], ["Conchas", "búzios mar branca"], ["Minnie vermelha", "corações disney preta bolinhas"], ["Cidades de praia", "palmeiras letras sul sal"], ["Mickey e Minnie onça", "disney animal print preta"], ["Gatinhos", "gatos laranja"], ["Flores lilás", "branca folhas margaridas"], ["Flores roxas", "grandes aquarela rosa"], ["Cactos", "amarela flores"], ["Coalas", "azul turquesa bichinho"], ["Rosas amarelas", "listras verde branca farm"], ["Olho grego rosa", "lilás águas-vivas"], ["Tartaruga e corais", "branca azul mar conchas"], ["Piu-Piu", "amarela canário looney tunes"], ["Vaquinha", "preta branca fofa laço rosa"], ["Borboletas azuis", "branca azul"]],
  }),
  linha({
    id: "cc", nome: "Coca-Cola", curto: "Coca-Cola", categoria: "chinelos", publico: "feminino", gradeId: "feminina",
    preco: 7.0, lancamento: false, rotulo: "estampas", capa: "cc-01",
    descricao: ["Estampa em transfer digital", "Solado em micro expandido"],
    vars: [["Coca floral azul", "marinho flores branca"], ["Coca rosas", "branca amarela rosas"], ["Coca lírio", "roxa laranja flor amarela"], ["Coca kombi", "buldogue amarela branca"], ["Coca corações", "azul marinho rosa"], ["Coca flores rosa", "preta flores rosas"], ["Coca listras roxas", "palmeiras preta roxa verde"], ["Coca margaridas", "turquesa vermelha coke"], ["Coca flor roxa", "amarela branca floral"], ["Coca vintage", "pin-up retrô vermelha ice cold"], ["Coca rosto", "preto branco lábios olhos azuis vermelha"], ["Coca floral amarela", "preta flores amarela"], ["Coca cerejas", "marinho vermelha coke frutas"], ["Coca hibisco", "preta rosa coke flores"], ["Coca cachorros", "pug dogs vermelha colorida"], ["Coca tampinhas", "branca vermelha coke garrafa"], ["Coke tropical", "lilás roxa folhas"], ["Coca tropical rosa", "rosa clara folhas flores"], ["Coke P&B", "preta branca verde azul"], ["Coca colagem", "amarela limão fotos"], ["Coca laranja", "tropical folhas boca verde amarela"], ["Coca paraíso", "flor roxa preta amarela limão"], ["Coca colagem verde", "limão cartaz vintage"], ["Coca drink", "branca bege marrom"], ["Coca listras verdes", "vermelha branca garrafa"], ["Coca garotas", "preta retrô rosa listras"], ["Coca céu", "azul roxa coke"], ["Coke lilás", "branca rosa pause"]],
  }),
  linha({
    id: "kn", nome: "Kenner New", curto: "Kenner New", categoria: "chinelos", publico: "masculino", gradeId: "masculina",
    preco: 12.0, lancamento: false, rotulo: "cores", capa: "kn-01",
    descricao: ["Solado em micro expandido"],
    vars: [["Café", "marrom chocolate kenner"], ["Branca", "kenner"], ["Preta", "kenner"]],
  }),
  linha({
    id: "kt", nome: "Kenner Transfer", curto: "Kenner Transfer", categoria: "chinelos", publico: "masculino", gradeId: "masculina",
    preco: 11.0, lancamento: false, rotulo: "estampas", capa: "kt-01",
    descricao: ["Estampa em transfer digital", "Solado em micro expandido"],
    vars: [["Pôr do sol", "praia coqueiros mar kenner bege"], ["Preta e azul", "listras faixa azul kenner"], ["Preta e branca", "logo grande kenner"], ["Branca azul e vermelha", "since 88 kenner"], ["Branca e preta", "logo kenner cinza"]],
  }),
  linha({
    id: "bt", nome: "Bandeira Tradicional", curto: "Bandeira Tradicional", categoria: "chinelos", publico: "masculino", gradeId: "masculina",
    preco: 7.5, lancamento: false, rotulo: "cores", capa: "bt-01",
    descricao: ["Solado em micro expandido"],
    vars: [["Branca", "bandeira brasil havaianas"], ["Preta", "bandeira brasil havaianas"]],
  }),
  linha({
    id: "me", nome: "Estampas Masculinas", curto: "Estampas masculinas", categoria: "chinelos", publico: "masculino", gradeId: "masculina",
    preco: 8.9, lancamento: false, rotulo: "estampas", capa: "me-01",
    descricao: ["Estampa em transfer digital", "Solado em micro expandido"],
    vars: [["Coqueiros P&B", "palmeiras preto branco havaianas"], ["Surfing for life", "surf prancha havaianas"], ["Homer Simpson", "simpsons donuts havaianas"], ["Batman", "amarelo preto herói havaianas"], ["Hulk", "verde cinza herói havaianas"], ["Pato Donald", "azul desenho havaianas"], ["Cerveja", "chopp dourado havaianas"], ["Xadrez", "quadriculado preto branco havaianas"], ["Coqueiros azul", "palmeiras zigue-zague preto havaianas"], ["Surfista azul", "prancha havaianas"], ["Surfers paradise", "california surf preto palmeira havaianas"], ["Lacoste Jamaica", "verde amarelo preto"], ["Lacoste verde listrado", "jacaré preto verde água"], ["Lacoste praia", "carro fusca pôr do sol amarelo"], ["Lacoste jacarés", "crocodilo verde branco"], ["Lacoste azul listrado", "branco verde água"], ["Lacoste NBA", "basquete azul vermelho"], ["Lacoste luva", "vermelho preto branco"], ["Lacoste Simpsons", "bart branco"], ["Lacoste Beach", "life is better praia azul branco"], ["Lacoste jacarés pretos", "preto branco estampa"], ["Lacoste azul", "jacaré verde marinho"], ["Lacoste California", "preto colorido"], ["Hugo Boss amarelo", "preto listrado"], ["Hugo Boss azul", "listras branco"], ["Hugo Boss verde água", "boss grande"], ["Hugo Boss HB", "marinho azul"], ["Boss touro", "bulls vermelho branco"], ["Cavalera águia dourada", "preto"], ["Cavalera fogos", "preto branco"], ["Cavalera cinza", "triângulos preto"], ["Cavalera folhas", "azul verde"], ["Cavalera águia branca", "preto"], ["Colcci coqueiros", "palmeiras preto branco"], ["Colcci letras", "preto branco"], ["Colcci listrado", "vermelho preto verde"], ["Colcci preto listrado", "branco logo"], ["Colcci azul listrado", "branco faixas"], ["Diesel cinza", "preto xadrez"], ["Diesel preto", "letras brancas"], ["Diesel azul", "listrado branco"], ["Diesel marrom", "branco cinza"], ["Diesel enter", "preto vermelho"], ["Colcci laranja", "marrom branco preto"], ["Tommy script", "branco assinatura"], ["Tommy preto", "letras brancas"], ["Tommy listras", "branco azul vermelho"], ["Tommy Hilfiger vermelho", "preto branco"], ["Tommy marinho", "h vermelho branco"], ["Tommy preto grande", "letras brancas"], ["Tommy amarelo", "marinho vermelho"], ["Tommy marinho e vermelho", "bandeira"], ["Tommy azul e vermelho", "listrado"], ["Tommy Jeans preto", "vermelho"], ["Tommy azul listrado", "azul claro marinho"], ["Tommy Jeans rosa", "marinho cinza"]],
  }),
  linha({
    id: "ti", nome: "Times", curto: "Times", categoria: "chinelos", publico: "masculino", gradeId: "masculina",
    preco: 8.9, lancamento: false, rotulo: "estampas", capa: "ti-01",
    descricao: ["Estampa em transfer digital", "Solado em micro expandido"],
    vars: [["CBF preta", "seleção brasileira preto dourado"], ["Seleção branca", "cbf estrelas verde"], ["Seleção amarela", "brasil bandeira verde"], ["Brasil mini bandeira", "verde amarelo"], ["Brasil geométrica", "cbf azul verde amarelo"], ["Esse ano é nosso", "brasil hexa branca verde"], ["São Paulo", "spfc tricolor preto"], ["Cruzeiro", "azul raposa"], ["Flamengo", "mengão rubro-negro"], ["Corinthians", "timão vermelho preto"], ["Atlético Mineiro", "galo preto"], ["Eu sou brasileiro", "branca amarela brasil orgulho"], ["Botafogo", "fogão preto branco"]],
  }),
  linha({
    id: "ju", nome: "Juvenil", curto: "Juvenil", categoria: "chinelos", publico: "infantil", gradeId: "juvenil",
    preco: 8.9, lancamento: false, rotulo: "estampas", capa: "ju-01",
    descricao: ["Estampa em transfer digital", "Solado em micro expandido"],
    vars: [["Scooby-Doo", "salsicha desenho preto"], ["Corinthians listrado", "timão preto branco"], ["São Paulo", "spfc tricolor preto"], ["Corinthians Timão", "branco preto vermelho"], ["Cruzeiro", "azul raposa"], ["Flamengo", "mengão rubro-negro"], ["Lobo cinza", "act branco"], ["Coqueiros pôr do sol", "palmeiras pássaros branco"], ["Acostamento floral", "azul rosa flores"], ["Lacoste arco-íris", "preto listrado colorido"], ["Escrita azul", "branca letras"], ["Lacoste jacaré cinza", "preto"], ["Lacoste deserto", "marinho vermelho pôr do sol"], ["Lacoste listrado cinza", "branco preto"], ["Acostamento vermelho", "preto geométrico"], ["Lobo azul", "cinza branco"], ["Listras azuis", "branca marinho verde água"]],
  }),
  linha({
    id: "in", nome: "Infantil Estampas", curto: "Infantil estampas", categoria: "chinelos", publico: "infantil", gradeId: "infantil",
    preco: 7.0, lancamento: false, rotulo: "estampas", capa: "in-01",
    descricao: ["Estampa em transfer digital", "Solado em micro expandido"],
    vars: [["Minnie", "vermelha bege laço disney"], ["Panda", "urso preto branco rosa listras"], ["Skye", "patrulha canina cachorra roxa rosa"], ["Capivara cestinha", "capivara flores rosa cesta"], ["Tigrão", "ursinho pooh amarelo mel disney"], ["Capivara pizza", "capivara pintinho bolinhas vermelha"], ["Lobo P&B", "preta branca acostamento"], ["Homem-Aranha", "spider man azul vermelha teias herói"], ["Looney Tunes P&B", "pernalonga patolino preto branco desenho"], ["Marie", "aristogatas gata rosa pink gatinha disney"], ["Listrado vinho", "gato preto branco vinho lacoste"], ["Letras vermelhas", "branca texto lettering"], ["Raposa", "preta vermelha"], ["Tom e Jerry", "gato rato lacoste cinza laranja"], ["Lobo montanha", "paisagem floresta preto branco"], ["Mickey Lacoste", "mickey vermelho preto amarelo disney"], ["Listrado verde", "branca verde lacoste riscas"], ["Azul", "turquesa glitter transparente lisa"], ["Acostamento", "listras azul vermelha branca cachorro"], ["Preta", "lisa"], ["Capivara coração", "capivara rosa pink corações"], ["Branca", "lisa glitter transparente"], ["Capivara lilás", "capivara lilás roxa nuvem"], ["Rei Leão", "simba leão preta laranja disney"], ["Havaianas P&B", "letras branca preta logo"], ["Rabiscos", "grafite branca preta amarela doodle"], ["Seleção azul", "brasil cbf futebol azul copa"], ["Urso girassol", "ursinho marrom girassóis"], ["Minnie pink", "minnie mouse rosa pink preta"], ["Rabiscos vinho", "branca flamingo desenhos"], ["Seleção amarela", "brasil cbf futebol copa"], ["Seleção verde", "brasil cbf futebol copa"], ["Seleção branca", "brasil cbf futebol copa"], ["Brasil crianças", "brazil bandeira bonecos branca verde"], ["Bandeira do Brasil", "brasil verde amarela futebol copa"], ["Capivara florzinhas", "capivara coração lilás roxa margaridas"], ["Minnie lilás", "minnie mouse rosa bolinhas laço"], ["Divertida Mente", "inside out alegria raiva azul"], ["Barbie", "boneca rosa pink glitter roxa"], ["Princesa borboletas", "vestido roxo azul fada"], ["Hello Kitty", "gatinha branca azul laço sanrio"], ["Mickey", "mickey mouse amarela vermelha preta disney"], ["Mãozinhas coloridas", "aquarela flores farm tropical"], ["Cinderela", "princesa azul disney"], ["Atlético Mineiro", "galo futebol time preta branca"], ["São Paulo", "spfc tricolor futebol time"], ["Santos", "peixe futebol time branca preta"], ["Elsa", "frozen princesa azul gelo disney"], ["Hulk", "herói verde marvel"], ["Urso marrom", "ursinho pelúcia marrom"], ["Batman", "morcego herói preta dc"], ["Gelo azul", "frozen azul roxa"], ["Carros", "relâmpago mcqueen vermelha disney"], ["Frozen rosa", "elsa turquesa azul claro"], ["Princesas", "disney bege"], ["Tom e Jerry cores", "gato rato colorida"], ["Naruto", "anime preta branca mangá"], ["Pumba", "rei leão timão verde disney"], ["Michael Jordan", "basquete 23 bulls pernalonga preta vermelha"]],
  }),
  linha({
    id: "ip", nome: "Infantil Pingente", curto: "Infantil pingente", categoria: "chinelos", publico: "infantil", gradeId: "infantil",
    preco: 8.0, lancamento: false, rotulo: "estampas", capa: "ip-01",
    descricao: ["ABS personalizado na tira", "Estampa em transfer digital", "Solado em micro expandido"],
    vars: [["Capivara", "rosa coração óculos pingente bege"], ["Barbie", "boneca rosa pingente"], ["Cachorrinho", "cachorro bege flores"], ["Hello Kitty", "gatinha rosa branca laço"], ["Vaquinha", "vaca rosa pink corações listras"], ["Margarida", "pato disney rosa branca"], ["Stitch", "azul rosa disney"], ["Skye", "patrulha canina cachorra rosa arco-íris"], ["Gucci", "preta bege logo monograma"]],
  }),
];

export const VARIACOES: Record<string, Variacao> = Object.fromEntries(
  LINHAS.flatMap((l) => l.variacoes.map((v) => [v.cod, v])),
);

export const TOTAL_MODELOS = Object.keys(VARIACOES).length;

export const linhaPorId = (id: string) => LINHAS.find((l) => l.id === id);
export const linhaDaVariacao = (cod: string) => linhaPorId(VARIACOES[cod]?.linhaId ?? "");
