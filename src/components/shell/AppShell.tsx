'use client';

import {
  Award,
  BadgeCheck,
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  CalendarCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  ClipboardCheck,
  FileText,
  Flag,
  HandCoins,
  HandHeart,
  HeartHandshake,
  Home,
  HousePlus,
  Images,
  Lock,
  LogOut,
  Megaphone,
  MoreHorizontal,
  Network,
  Newspaper,
  ScrollText,
  Search,
  Settings,
  ShieldCheck,
  UserCog,
  UserPlus,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo, useState, type ReactNode } from 'react';
import { useStoredFlag } from '@/lib/hooks/useStoredFlag';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from '@/components/vm/Avatar';
import { Chip } from '@/components/vm/Chip';
import { Dialog } from '@/components/vm/Dialog';
import { Wordmark } from '@/components/vm/Logo';
import { Menu } from '@/components/vm/Menu';
import { ThemeToggle } from '@/components/vm/ThemeToggle';
import { useApi } from '@/lib/api/provider';
import { isMockMode } from '@/lib/api/client';
import { useMe, useScopes, useSession } from '@/lib/auth/SessionProvider';
import { cn } from '@/lib/cn';
import { appPath, visibleNav, type NavItem } from '@/lib/nav';
import { useVertical } from '@/lib/verticals/VerticalProvider';

const ICONS: Record<string, LucideIcon> = {
  Home,
  Newspaper,
  CalendarDays,
  Network,
  HousePlus,
  Users,
  UserPlus,
  UsersRound,
  HandHeart,
  Megaphone,
  HandCoins,
  FileText,
  Images,
  Building2,
  CalendarCheck,
  HeartHandshake,
  ClipboardCheck,
  Award,
  Bell,
  CircleUser,
  UserCog,
  ShieldCheck,
  BadgeCheck,
  Flag,
  BarChart3,
  ScrollText,
  Settings,
  Briefcase,
  Lock,
};

const COLLAPSE_KEY = 'vm.sidebar.collapsed';

function useNavLabel(): (item: NavItem) => string {
  const t = useTranslations('nav');
  const { v } = useVertical();
  return (item) =>
    item.vocabKey
      ? v(item.vocabKey, item.vocabKey === 'tree' ? 'singular' : 'plural', true)
      : t(item.labelKey);
}

function NavLink({
  item,
  slug,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  slug: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const label = useNavLabel()(item);
  const href = appPath(slug, item.path);
  const active = item.path === '' ? pathname === href : pathname.startsWith(href);
  const Icon = ICONS[item.icon] ?? Home;
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        onClick={onNavigate}
        title={collapsed ? label : undefined}
        className={cn(
          'flex items-center gap-3 rounded-md px-3 text-small font-medium transition-colors vm-target',
          active ? 'vm-tint-primary' : 'text-text-muted hover:text-text vm-hover-surface',
          collapsed && 'justify-center px-0',
        )}
      >
        <Icon className="vm-icon" aria-hidden />
        <span className={cn(collapsed && 'vm-sr-only')}>{label}</span>
      </Link>
    </li>
  );
}

function Sidebar({ items, slug }: { items: NavItem[]; slug: string }) {
  const t = useTranslations('nav');
  const [collapsed, setCollapsed] = useStoredFlag(COLLAPSE_KEY);
  const toggle = () => setCollapsed(!collapsed);
  const sections: Array<{ key: NavItem['section']; items: NavItem[] }> = [
    'main',
    'ops',
    'admin',
  ].map((key) => ({
    key: key as NavItem['section'],
    items: items.filter((i) => i.section === key),
  }));
  return (
    <nav
      aria-label={t('primary')}
      className={cn(
        'sticky top-0 hidden h-dvh shrink-0 flex-col gap-2 overflow-y-auto bg-surface p-3 vm-border-e md:flex',
        collapsed ? 'w-sidebar-collapsed' : 'w-sidebar',
      )}
    >
      <div
        className={cn(
          'flex items-center px-2 py-3',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        <Link href="/" className="rounded-sm">
          <Wordmark compact={collapsed} />
        </Link>
      </div>
      {sections.map(
        (s) =>
          s.items.length > 0 && (
            <ul
              key={s.key}
              className={cn('flex flex-col gap-1', s.key !== 'main' && 'mt-2 pt-2 vm-border-t')}
            >
              {s.key === 'admin' && !collapsed && (
                <li className="px-3 py-1 text-caption font-semibold uppercase tracking-wide text-text-muted">
                  {t('admin')}
                </li>
              )}
              {s.items.map((item) => (
                <NavLink key={item.key} item={item} slug={slug} collapsed={collapsed} />
              ))}
            </ul>
          ),
      )}
      <div className="mt-auto flex justify-end pt-2">
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? t('expand') : t('collapse')}
          aria-expanded={!collapsed}
          className="rounded-md p-2 text-text-muted vm-hover-surface vm-target"
        >
          {collapsed ? (
            <ChevronRight className="vm-icon rtl:rotate-180" aria-hidden />
          ) : (
            <ChevronLeft className="vm-icon rtl:rotate-180" aria-hidden />
          )}
        </button>
      </div>
    </nav>
  );
}

function BottomNav({ items, slug }: { items: NavItem[]; slug: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const label = useNavLabel();
  const [moreOpen, setMoreOpen] = useState(false);
  const primary = items
    .filter((i) => i.phoneSlot)
    .sort((a, b) => (a.phoneSlot ?? 0) - (b.phoneSlot ?? 0))
    .slice(0, 4);
  const rest = items.filter((i) => !primary.includes(i));
  return (
    <>
      <nav
        aria-label={t('primary')}
        className="fixed inset-x-0 bottom-0 z-30 flex h-bottomnav items-stretch bg-surface-raised vm-border-t md:hidden print:hidden"
      >
        <ul className="flex w-full">
          {primary.map((item) => {
            const Icon = ICONS[item.icon] ?? Home;
            const href = appPath(slug, item.path);
            const active = item.path === '' ? pathname === href : pathname.startsWith(href);
            return (
              <li key={item.key} className="flex-1">
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex h-full flex-col items-center justify-center gap-1 text-caption',
                    active ? 'text-primary' : 'text-text-muted',
                  )}
                >
                  <Icon className="vm-icon" aria-hidden />
                  <span className="truncate">{label(item)}</span>
                </Link>
              </li>
            );
          })}
          {rest.length > 0 && (
            <li className="flex-1">
              <button
                type="button"
                onClick={() => setMoreOpen(true)}
                aria-haspopup="dialog"
                className="flex h-full w-full flex-col items-center justify-center gap-1 text-caption text-text-muted"
              >
                <MoreHorizontal className="vm-icon" aria-hidden />
                <span>{t('more')}</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
      <Dialog
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        title={t('more')}
        presentation="sheet"
      >
        <nav aria-label={t('secondary')}>
          <ul className="grid grid-cols-2 gap-1 pb-4">
            {rest.map((item) => (
              <NavLink
                key={item.key}
                item={item}
                slug={slug}
                onNavigate={() => setMoreOpen(false)}
              />
            ))}
          </ul>
        </nav>
      </Dialog>
    </>
  );
}

function TopBar({ slug }: { slug: string }) {
  const t = useTranslations();
  const api = useApi();
  const router = useRouter();
  const me = useMe();
  const scopes = useScopes();
  const { communityName, preset } = useVertical();
  const { signOut, switchCommunity } = useSession();
  const unread = useQuery({
    queryKey: ['notifications', 'unread_count', slug],
    queryFn: () => api.call<{ count: number }>('notifications.unread_count'),
    enabled: scopes.has('notification.read_own'),
    refetchInterval: 60_000,
  });
  const sites = useQuery({
    queryKey: ['auth', 'my_sites'],
    queryFn: () =>
      api.call<{ sites: Array<{ slug: string; name: string | null }> }>('auth.my_sites'),
    enabled: me.isSuccess,
    staleTime: 10 * 60_000,
  });
  const siteItems = (sites.data?.sites ?? []).map((s) => ({
    key: s.slug,
    label: s.name ?? s.slug,
    onSelect: () => {
      switchCommunity(s.slug);
      router.push(appPath(s.slug));
    },
  }));
  const count = unread.data?.count ?? 0;
  return (
    <header
      className="sticky top-0 z-20 flex h-topbar items-center gap-2 bg-bg/95 px-4 backdrop-blur vm-border-b"
      aria-label={t('nav.topbar')}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Link href="/" className="rounded-sm md:hidden">
          <Wordmark compact />
        </Link>
        <Menu
          label={t('nav.switchCommunity')}
          triggerVariant="ghost"
          align="start"
          trigger={
            <span className="flex max-w-switcher items-center gap-2">
              <span className="vm-sr-only">{t('nav.switchCommunity')}</span>
              <span className="truncate font-semibold">{communityName || slug}</span>
              <Chip tone="muted" size="sm">
                {preset.marketing.name}
              </Chip>
            </span>
          }
          items={siteItems}
        />
      </div>
      <Link
        href={appPath(slug, '/search')}
        aria-label={t('nav.searchApp')}
        className="rounded-md p-2 text-text-muted vm-hover-surface vm-target max-sm:hidden"
      >
        <Search className="vm-icon" aria-hidden />
      </Link>
      {scopes.has('notification.read_own') && (
        <Link
          href={appPath(slug, '/notifications')}
          aria-label={t('nav.unread', { count })}
          className="relative rounded-md p-2 text-text-muted vm-hover-surface vm-target"
        >
          <Bell className="vm-icon" aria-hidden />
          {count > 0 && (
            <span
              aria-hidden
              className="absolute end-1 top-1 min-w-4 rounded-full bg-danger px-1 text-center text-caption font-semibold text-on-scrim"
            >
              {count > 99 ? '99+' : count}
            </span>
          )}
        </Link>
      )}
      <ThemeToggle compact className="max-sm:hidden" />
      <Menu
        label={t('nav.openProfileMenu')}
        trigger={
          <>
            <span className="vm-sr-only">{t('nav.openProfileMenu')}</span>
            <Avatar name={me.data?.full_name ?? ''} size="sm" decorative />
          </>
        }
        items={[
          {
            key: 'me',
            label: t('nav.me'),
            href: appPath(slug, '/me'),
            icon: <CircleUser className="vm-icon" aria-hidden />,
          },
          {
            key: 'signout',
            label: t('nav.signOut'),
            icon: <LogOut className="vm-icon" aria-hidden />,
            dividerBefore: true,
            onSelect: () => {
              signOut();
              router.push('/signin');
            },
          },
        ]}
      />
    </header>
  );
}

export function AppShell({ slug, children }: { slug: string; children: ReactNode }) {
  const t = useTranslations();
  const scopes = useScopes();
  const me = useMe();
  const { isModuleEnabled } = useVertical();
  const items = useMemo(() => visibleNav(scopes, isModuleEnabled), [scopes, isModuleEnabled]);
  return (
    <div className="flex min-h-dvh">
      <Sidebar items={items} slug={slug} />
      <div className="flex min-w-0 flex-1 flex-col pb-bottomnav md:pb-0">
        <TopBar slug={slug} />
        {isMockMode() && (
          <p
            className="vm-tint-warning px-4 py-1 text-center text-caption font-medium"
            role="status"
          >
            {t('common.demoRibbon')} ·{' '}
            {me.data ? t('shell.roleBadge', { role: me.data.role }) : t('common.loading')}
          </p>
        )}
        <main id="main" className="vm-gutter mx-auto w-full max-w-content flex-1 py-5 md:py-6">
          {children}
        </main>
      </div>
      <BottomNav items={items} slug={slug} />
    </div>
  );
}
