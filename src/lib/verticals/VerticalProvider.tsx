'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { z } from 'zod';
import { useApi } from '@/lib/api/provider';
import { useSession } from '@/lib/auth/SessionProvider';
import { applyAccent, resolveAccent } from '@/lib/theme/theme';
import { useTheme } from '@/lib/theme/ThemeProvider';
import {
  capitalise,
  getPreset,
  isModuleEnabled,
  resolveVocab,
  type ModuleKey,
  type VerticalPreset,
  type VocabForm,
  type VocabKey,
} from './index';

export const publicSettingsSchema = z.object({
  community_name: z.string().nullable().optional(),
  accent_color: z.string().nullable().optional(),
  community_type: z.string().nullable().optional(),
  logo_url: z.string().nullable().optional(),
  tagline: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
  locale: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),
});
export type PublicSettings = z.infer<typeof publicSettingsSchema>;

interface VerticalContextValue {
  preset: VerticalPreset;
  settings: PublicSettings | null;
  communityName: string;
  currency: string;
  locale: string;
  accentFellBack: boolean;
  isModuleEnabled: (module: ModuleKey) => boolean;
  /** Vocabulary resolver: v('member') → "member", v('member','plural', true) → "Members". */
  v: (key: VocabKey, form?: VocabForm, capitalised?: boolean) => string;
}

const VerticalContext = createContext<VerticalContextValue | null>(null);

export const PUBLIC_SETTINGS_KEY = (slug: string | null) => ['settings', 'public', slug] as const;

/**
 * Derives the active vertical preset from the community's public settings (`community_type`,
 * an assumption: the real backend has no such field yet and defaults to church).
 */
export function VerticalProvider({
  children,
  forcePreset,
}: {
  children: ReactNode;
  forcePreset?: VerticalPreset;
}) {
  const api = useApi();
  const { session, hydrated } = useSession();
  const { effective } = useTheme();
  const t = useTranslations();

  const settingsQuery = useQuery({
    queryKey: PUBLIC_SETTINGS_KEY(session.communitySlug),
    queryFn: async () => publicSettingsSchema.parse(await api.call('settings.get_public_settings')),
    enabled: hydrated && Boolean(session.communitySlug) && !forcePreset,
    staleTime: 5 * 60_000,
  });

  const settings = settingsQuery.data ?? null;
  const preset = forcePreset ?? getPreset(settings?.community_type);

  const accent = useMemo(
    () => resolveAccent(settings?.accent_color ?? null, effective),
    [settings?.accent_color, effective],
  );
  useEffect(() => {
    if (forcePreset) return;
    applyAccent(accent);
    return () => applyAccent({ primary: null, hover: null, fellBack: false });
  }, [accent, forcePreset]);

  const catalogLookup = useCallback(
    (path: string): string | undefined => (t.has(path) ? t(path) : undefined),
    [t],
  );

  const value = useMemo<VerticalContextValue>(
    () => ({
      preset,
      settings,
      communityName: settings?.community_name ?? '',
      currency: settings?.currency ?? 'INR',
      locale: settings?.locale ?? 'en-IN',
      accentFellBack: accent.fellBack,
      isModuleEnabled: (module) => isModuleEnabled(preset, module),
      v: (key, form = 'singular', capitalised = false) => {
        const word = resolveVocab(preset, key, form, catalogLookup);
        return capitalised ? capitalise(word) : word;
      },
    }),
    [preset, settings, accent.fellBack, catalogLookup],
  );

  return <VerticalContext.Provider value={value}>{children}</VerticalContext.Provider>;
}

export function useVertical(): VerticalContextValue {
  const ctx = useContext(VerticalContext);
  if (!ctx) throw new Error('useVertical must be used within VerticalProvider');
  return ctx;
}

export function useVocab(): VerticalContextValue['v'] {
  return useVertical().v;
}
