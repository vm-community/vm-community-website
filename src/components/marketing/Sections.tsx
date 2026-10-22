import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  ClipboardCheck,
  FileText,
  Gift,
  GraduationCap,
  HandCoins,
  HandHeart,
  HeartHandshake,
  Home,
  Images,
  Lock,
  Megaphone,
  Network,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
  UsersRound,
  Vote,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { ButtonLink } from '@/components/vm/Button';
import { Card } from '@/components/vm/Card';
import { cn } from '@/lib/cn';
import type { IconName } from '@/content/types';

const ICONS: Record<IconName, LucideIcon> = {
  Users,
  CalendarDays,
  HandCoins,
  HandHeart,
  Award,
  HeartHandshake,
  Megaphone,
  Building2,
  Images,
  FileText,
  Network,
  ShieldCheck,
  BarChart3,
  Newspaper,
  Bell,
  Lock,
  UsersRound,
  ClipboardCheck,
  Sparkles,
  Trophy,
  GraduationCap,
  Home,
  Gift,
  Vote,
  BookOpen,
  Star,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const I = ICONS[name];
  return <I className={cn('vm-icon', className)} aria-hidden />;
}

export function Section({
  id,
  children,
  className,
  tone = 'bg',
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: 'bg' | 'surface';
}) {
  return (
    <section id={id} className={cn('py-7 md:py-8', tone === 'surface' && 'bg-surface', className)}>
      <div className="vm-gutter mx-auto max-w-content">{children}</div>
    </section>
  );
}

export function SectionHeading({
  title,
  sub,
  eyebrow,
  align = 'center',
  as: Tag = 'h2',
}: {
  title: string;
  sub?: string;
  eyebrow?: string;
  align?: 'center' | 'start';
  as?: 'h1' | 'h2' | 'h3';
}) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-2',
        align === 'center' ? 'items-center text-center' : 'items-start text-start',
      )}
    >
      {eyebrow && (
        <p className="text-caption font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
      )}
      <Tag
        className={cn(
          'font-semibold text-text',
          Tag === 'h1' ? 'text-display md:text-display-lg' : 'text-h1 md:text-display',
        )}
      >
        {title}
      </Tag>
      {sub && <p className="max-w-prose text-body text-text-muted">{sub}</p>}
    </div>
  );
}

export function BenefitGrid({
  items,
  columns = 3,
}: {
  items: Array<{ title: string; body: string; icon: IconName; href?: string; cta?: string }>;
  columns?: 2 | 3 | 4;
}) {
  const cols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 md:grid-cols-3',
    4: 'sm:grid-cols-2 md:grid-cols-4',
  }[columns];
  return (
    <ul className={cn('grid gap-4', cols)}>
      {items.map((b) => (
        <li key={b.title}>
          <Card feature className="flex h-full flex-col gap-3">
            <span className="w-fit rounded-md p-2 vm-tint-primary">
              <Icon name={b.icon} />
            </span>
            <h3 className="text-h3 font-semibold">{b.title}</h3>
            <p className="text-small text-text-muted">{b.body}</p>
            {b.href && b.cta && (
              <Link
                href={b.href}
                className="mt-auto text-small font-medium text-primary hover:underline"
              >
                {b.cta}
              </Link>
            )}
          </Card>
        </li>
      ))}
    </ul>
  );
}

export function CtaBand({
  title,
  body,
  href = '/get-started',
  cta,
}: {
  title: string;
  body?: string;
  href?: string;
  cta: string;
}) {
  return (
    <section className="vm-gutter mx-auto my-8 max-w-content">
      <div className="flex flex-col items-center gap-4 rounded-lg vm-gradient-brand px-5 py-8 text-center text-on-scrim">
        <h2 className="text-h1 font-semibold text-on-scrim md:text-display">{title}</h2>
        {body && <p className="max-w-prose text-small text-on-scrim">{body}</p>}
        <ButtonLink href={href} pill arrow variant="secondary" className="bg-bg text-text">
          {cta}
        </ButtonLink>
      </div>
    </section>
  );
}

export function Steps({ items }: { items: Array<{ title: string; body: string }> }) {
  const t = useTranslations('marketing.common');
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {items.map((s, i) => (
        <li
          key={s.title}
          className="flex flex-col gap-2 rounded-lg bg-surface-raised p-5 vm-elevated-1"
        >
          <span
            className="flex size-6 items-center justify-center rounded-full bg-primary text-small font-semibold text-on-primary"
            aria-hidden
          >
            {i + 1}
          </span>
          <span className="vm-sr-only">{t('stepN', { n: i + 1 })}</span>
          <h3 className="text-h3 font-semibold">{s.title}</h3>
          <p className="text-small text-text-muted">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function GlanceTable({
  rows,
  personaLabel,
  webLabel,
  mobileLabel,
}: {
  rows: Array<{ persona: string; web: string; mobile: string }>;
  personaLabel: string;
  webLabel: string;
  mobileLabel: string;
}) {
  return (
    <div className="overflow-x-auto rounded-md vm-border bg-surface-raised">
      <table className="w-full text-small">
        <thead className="bg-surface text-start text-caption font-semibold uppercase tracking-wide text-text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 text-start">
              {personaLabel}
            </th>
            <th scope="col" className="px-4 py-3 text-start">
              {webLabel}
            </th>
            <th scope="col" className="px-4 py-3 text-start">
              {mobileLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.persona} className="vm-border-t align-top">
              <th scope="row" className="px-4 py-3 text-start font-medium">
                {r.persona}
              </th>
              <td className="px-4 py-3 text-text-muted">{r.web}</td>
              <td className="px-4 py-3 text-text-muted">{r.mobile}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Checklist({
  items,
}: {
  items: Array<{ label: string; optional?: boolean; note?: string }>;
}) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
      {items.map((m) => (
        <li
          key={m.label}
          className="flex items-center gap-2 rounded-md bg-surface-raised px-4 py-3 text-small vm-elevated-1"
        >
          <span
            className={cn(
              'flex size-5 shrink-0 items-center justify-center rounded-full text-caption',
              m.optional ? 'vm-border text-text-muted' : 'bg-success text-on-scrim',
            )}
            aria-hidden
          >
            {m.optional ? '○' : '✓'}
          </span>
          <span className="flex-1">{m.label}</span>
          {m.note && <span className="text-caption text-text-muted">{m.note}</span>}
        </li>
      ))}
    </ul>
  );
}
