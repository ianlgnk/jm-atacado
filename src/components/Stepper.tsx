// Usado só dentro de componentes de cliente (CardVariacao, Folhas, Pedido).
type Props = {
  valor: number;
  rotulo: [string, string]; // singular, plural
  onMais: () => void;
  onMenos: () => void;
  nome: string; // para leitores de tela
  desativado?: boolean;
  destaque?: boolean;
};

export function Stepper({ valor, rotulo, onMais, onMenos, nome, desativado = false, destaque = false }: Props) {
  return (
    <div className={`stepper${destaque && !valor && !desativado ? " mais-forte" : ""}`} role="group" aria-label={nome}>
      <button type="button" onClick={onMenos} disabled={!valor || desativado} aria-label={`Tirar um: ${nome}`}>
        −
      </button>
      <output aria-live="polite">
        {valor}
        <small>{valor === 1 ? rotulo[0] : rotulo[1]}</small>
      </output>
      <button type="button" onClick={onMais} disabled={desativado} aria-label={`Pôr mais um: ${nome}`}>
        +
      </button>
    </div>
  );
}
