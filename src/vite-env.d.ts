/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  readonly PROD: boolean
  // add other custom env vars here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
