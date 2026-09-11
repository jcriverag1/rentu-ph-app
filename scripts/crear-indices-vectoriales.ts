/**
 * Crea (si no existe) el índice HNSW de similitud coseno sobre
 * `documento_ph_chunks.embedding`, usado por la búsqueda semántica del
 * Copiloto Administrativo (`src/lib/data/documentos-ph.ts` →
 * `buscarChunksRelevantes`).
 *
 * Por qué existe este script: `embedding` es un campo `Unsupported("vector(384)")`
 * en `prisma/schema.prisma` porque Prisma no modela `vector` nativamente —
 * eso significa que Prisma NO gestiona (ni protege) este índice. Ya se
 * perdió una vez entre corridas de `prisma db push` en el schema de otros
 * modelos. Corre este script después de cualquier `prisma db push`:
 *
 *   pnpm db:vector-index
 *
 * Idempotente: usa `CREATE INDEX IF NOT EXISTS`, seguro de correr varias veces.
 */
import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS documento_ph_chunks_embedding_hnsw_idx
    ON documento_ph_chunks USING hnsw (embedding vector_cosine_ops)
  `);

  const indices = await prisma.$queryRawUnsafe<{ indexname: string }[]>(`
    SELECT indexname FROM pg_indexes WHERE tablename = 'documento_ph_chunks'
  `);

  console.log("✓ Índices en documento_ph_chunks:", indices.map((i) => i.indexname).join(", "));
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("❌ Error creando el índice vectorial:", error);
  process.exit(1);
});
