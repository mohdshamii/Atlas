/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_PATH: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_MAP_TILE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
