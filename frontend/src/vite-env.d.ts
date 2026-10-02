/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ENABLE_HEALTH_POLLING?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
