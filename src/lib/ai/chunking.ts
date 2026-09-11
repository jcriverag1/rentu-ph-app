const TAMANIO_CHUNK = 800;
const SOLAPAMIENTO = 120;

/**
 * Trocea texto libre en fragmentos aptos para indexar: agrupa párrafos hasta
 * el tamaño objetivo y, si un párrafo por sí solo excede ese tamaño, lo
 * corta con solapamiento para no perder contexto en el borde del corte.
 */
export function trocearTexto(texto: string): string[] {
  const limpio = texto.replace(/\r\n/g, "\n").trim();
  if (!limpio) return [];

  const parrafos = limpio
    .split(/\n{2,}/)
    .map((parrafo) => parrafo.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let actual = "";

  for (const parrafo of parrafos) {
    const combinado = actual ? `${actual}\n\n${parrafo}` : parrafo;
    if (combinado.length <= TAMANIO_CHUNK) {
      actual = combinado;
      continue;
    }

    if (actual) chunks.push(actual);

    if (parrafo.length <= TAMANIO_CHUNK) {
      actual = parrafo;
    } else {
      const paso = TAMANIO_CHUNK - SOLAPAMIENTO;
      for (let i = 0; i < parrafo.length; i += paso) {
        chunks.push(parrafo.slice(i, i + TAMANIO_CHUNK));
      }
      actual = "";
    }
  }

  if (actual) chunks.push(actual);
  return chunks;
}
