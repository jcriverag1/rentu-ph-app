import os from "node:os";
import path from "node:path";
import { env, pipeline, type FeatureExtractionPipeline } from "@xenova/transformers";

/**
 * Embeddings 100% locales (sin API de pago): corremos un modelo ONNX
 * cuantizado en el propio proceso de Node con @xenova/transformers. El
 * modelo se descarga una sola vez desde el Hub de Hugging Face y se
 * cachea en disco (ver `env.cacheDir`).
 *
 * Se eligió un modelo multilingüe porque los documentos de la copropiedad
 * (reglamentos, actas) están en español.
 */
const MODELO_EMBEDDING = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";
export const DIMENSION_EMBEDDING = 384;

env.allowLocalModels = false;
env.cacheDir = path.join(os.tmpdir(), "rentu-xenova-cache");

let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

function obtenerExtractor(): Promise<FeatureExtractionPipeline> {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", MODELO_EMBEDDING);
  }
  return extractorPromise;
}

/** Genera un embedding normalizado (norma L2 = 1) por cada texto de entrada. */
export async function generarEmbeddings(textos: string[]): Promise<number[][]> {
  if (textos.length === 0) return [];

  const extractor = await obtenerExtractor();
  const salida = await extractor(textos, { pooling: "mean", normalize: true });
  return salida.tolist() as number[][];
}

export async function generarEmbedding(texto: string): Promise<number[]> {
  const [vector] = await generarEmbeddings([texto]);
  return vector;
}
