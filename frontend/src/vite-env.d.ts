/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME?: string           // Nom de l’appli, ex: "Lovable"
  readonly VITE_DEFAULT_LANGUAGE?: string   // Langue par défaut pour l’utilisateur
  readonly VITE_ENABLE_LOGS?: 'true' | 'false' // Activer ou désactiver logs
  readonly VITE_WS_URL?: string             // URL pour WebSocket si chat en temps réel
  readonly VITE_MAX_EXERCISES?: string      // Limite d’exercices récupérés
  readonly VITE_THEME?: string              // Thème par défaut de l’appli
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
