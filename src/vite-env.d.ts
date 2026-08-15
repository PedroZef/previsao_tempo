/// <reference types="vite/client" />

/**
 * Declaração dos tipos de variáveis de ambiente suportadas pelo Vite.
 */
interface ImportMetaEnv {
  readonly VITE_OPENWEATHER_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
