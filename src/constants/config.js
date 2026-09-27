// ─────────────────────────────────────────────────────────────────────────────
// APP CONFIGURATION — edit here to customise
// ─────────────────────────────────────────────────────────────────────────────

// OpenAI API key — set in .env as VITE_OPENAI_KEY
// Falls back to offline questions if not set
export const OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY || "";

// Remote DB endpoint — set in .env as VITE_REMOTE_DB
// Questions sync here silently when online
export const REMOTE_DB = import.meta.env.VITE_REMOTE_DB || "";

// App metadata
export const APP_NAME    = "Edu Tug of War";
export const APP_COMPANY = "EdTek Interactive";
export const APP_VERSION = "1.0.0";

// Game settings
export const GAME_CONFIG = {
  MIN_QUESTIONS: 5,
  MAX_QUESTIONS: 20,
  DEFAULT_QUESTIONS: 10,
  ROPE_WIN_THRESHOLD: 95,   // rope position ±95 = win (disabled — set high to keep)
  AI_ACCURACY: {
    Easy:   0.65,
    Medium: 0.82,
    Hard:   0.95,
  },
  TIMERS: { None: 0, "15s": 15, "30s": 30, "60s": 60 },
};

// localStorage keys — change prefix to reset all stored data
export const STORAGE_KEYS = {
  DB:        "etow_ng_qdb_v1",
  QUEUE:     "etow_ng_sync_queue",
  BANK:      "etow_ng_bank_v1",
  LEADERBOARD: "etow_ng_lb_v1",
  META:      "etow_ng_meta_v1",
  CFG:       "etow_cfg",
  NAMES:     "etow_player_names",
};
