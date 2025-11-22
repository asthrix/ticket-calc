
export const IRCTC_WEB_URL = 'https://www.irctc.co.in/nget/train-search';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=cris.org.in.prs.ima';
export const APP_STORE_URL = 'https://apps.apple.com/in/app/irctc-rail-connect/id1164063471';
export const APP_SCHEME = 'irctcconnect://';

export const STATUS_STYLES = {
  past: {
    glow: "bg-rose-500",
    icon: "bg-rose-100 text-rose-600",
    text: "bg-linear-to-br from-rose-500 via-primary to-rose-500 bg-clip-text text-transparent",
    button: "bg-linear-to-r from-rose-500 to-primary opacity-90 hover:opacity-100 shadow-lg text-background",
  },
  present: {
    glow: "bg-linear-to-r from-emerald-500 to-teal-500",
    icon: "bg-emerald-100 text-emerald-600",
    text: "bg-linear-to-br from-emerald-500 via-primary to-emerald-500 bg-clip-text text-transparent",
    button: "bg-linear-to-r from-emerald-500 to-primary opacity-90 hover:opacity-100 shadow-lg text-background",
  },
  future: {
    glow: "bg-violet-500",
    icon: "bg-violet-100 text-violet-600",
    text: "bg-linear-to-br from-violet-500 via-primary to-violet-500 bg-clip-text text-transparent",
    button: "bg-linear-to-r from-violet-500 to-primary opacity-90 hover:opacity-100 shadow-lg text-background",
  }
} as const;

export type BookingStatusType = keyof typeof STATUS_STYLES;
