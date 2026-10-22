import type { ModuleKey, VerticalKey } from '@/lib/verticals';

/**
 * Typed marketing content for a community type (§8.1.2). Adding a community type means adding
 * one file in src/content/verticals/. Copy lives here (English first); a locale may override it
 * by shipping a translated content module.
 */
export type IconName =
  | 'Users'
  | 'CalendarDays'
  | 'HandCoins'
  | 'HandHeart'
  | 'Award'
  | 'HeartHandshake'
  | 'Megaphone'
  | 'Building2'
  | 'Images'
  | 'FileText'
  | 'Network'
  | 'ShieldCheck'
  | 'BarChart3'
  | 'Newspaper'
  | 'Bell'
  | 'Lock'
  | 'UsersRound'
  | 'ClipboardCheck'
  | 'Sparkles'
  | 'Trophy'
  | 'GraduationCap'
  | 'Home'
  | 'Gift'
  | 'Vote'
  | 'BookOpen'
  | 'Star';

export interface Benefit {
  title: string;
  body: string;
  icon: IconName;
  /** Real module this benefit is backed by. */
  module: ModuleKey | 'notifications' | 'privacy' | 'reports';
}

export interface WebTask {
  title: string;
  body: string;
  /** Qualitative "Saves you …" line; never an invented number. */
  saves: string;
  /** Which illustrative screen to render in the browser frame. */
  screen:
    'dashboard' | 'members' | 'events' | 'ledger' | 'approvals' | 'documents' | 'roles' | 'tree';
}

export interface MobileBenefit {
  title: string;
  body: string;
  icon: IconName;
}

export interface GlanceRow {
  persona: string;
  web: string;
  mobile: string;
}

export interface Scenario {
  persona: string;
  title: string;
  steps: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface VerticalContent {
  key: VerticalKey;
  /** URL segment under /for (e.g. "clubs"). */
  slug: string;
  /** Short plural noun used in headings ("church", "club"). */
  noun: string;
  nounPlural: string;
  title: string;
  metaDescription: string;
  hero: { headline: string; sub: string; illustration: IllustrationVariant };
  benefits: Benefit[];
  web: { intro: string; tasks: WebTask[] };
  mobile: {
    intro: string;
    benefits: MobileBenefit[];
    screens: Array<'feed' | 'event' | 'giving' | 'family'>;
  };
  glance: GlanceRow[];
  scenarios: Scenario[];
  modules: Array<{ key: ModuleKey; label: string; optional?: boolean }>;
  familyConnections?: { title: string; body: string };
  privacy: { title: string; body: string };
  faq: FaqItem[];
  related: VerticalKey[];
}

export type IllustrationVariant =
  | 'gathering'
  | 'notice-board'
  | 'festival'
  | 'fixtures'
  | 'tree'
  | 'reunion'
  | 'residents'
  | 'campaign'
  | 'network';
