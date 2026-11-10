// Gera o "Pix copia e cola" estático (BR Code, padrão EMV do Banco Central) com valor e identificador.
// Não passa por banco nem API: o código só aponta para a chave da loja com o valor já preenchido.

import { semAcento } from "./formato";

const campo = (id: string, valor: string) => id + String(valor.length).padStart(2, "0") + valor;

const limpar = (s: string, max: number) =>
  semAcento(s).replace(/[^A-Za-z0-9 ]/g, "").toUpperCase().trim().slice(0, max);

export function crc16(texto: string) {
  let crc = 0xffff;
  for (let i = 0; i < texto.length; i++) {
    crc ^= texto.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function pixCopiaECola(o: { chave: string; recebedor: string; cidade: string; valor: number; txid: string }) {
  const conta = campo("00", "br.gov.bcb.pix") + campo("01", o.chave.trim());
  const txid = o.txid.replace(/[^A-Za-z0-9]/g, "").slice(0, 25) || "***";
  const corpo =
    campo("00", "01") +
    campo("26", conta) +
    campo("52", "0000") +
    campo("53", "986") +
    (o.valor > 0 ? campo("54", o.valor.toFixed(2)) : "") +
    campo("58", "BR") +
    campo("59", limpar(o.recebedor, 25) || "LOJA") +
    campo("60", limpar(o.cidade, 15) || "BRASIL") +
    campo("62", campo("05", txid)) +
    "6304";
  return corpo + crc16(corpo);
}
