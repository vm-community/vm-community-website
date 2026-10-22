import {
  Bell,
  CalendarDays,
  Home,
  Network,
  Newspaper,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { sampleCommunity, samplePhone } from '@/content/samples';
import { cn } from '@/lib/cn';

/** Phone design size; screens are laid out at this size and scaled into the frame. */
export const PHONE_DESIGN = { w: 390, h: 844 } as const;

const TAB_ICONS: LucideIcon[] = [Home, Newspaper, CalendarDays, Network, UserRound];

/**
 * Real app layout: status bar, app bar (community name + screen title + bell), content area
 * (padding 20, gap 12), bottom tab bar. `active` is the tab index (0 Home ... 4 Me).
 */
export function PhoneShell({
  active,
  title,
  children,
  dim,
}: {
  active: number;
  title: string;
  children: ReactNode;
  dim?: boolean;
}) {
  return (
    <div
      className="relative flex flex-col bg-bg text-text"
      style={{ width: PHONE_DESIGN.w, height: PHONE_DESIGN.h }}
    >
      <div
        aria-hidden
        className="flex items-center justify-between px-5 pt-3 text-caption font-semibold"
      >
        <span>9:41</span>
        <span className="h-2 w-5 rounded-full bg-text" />
      </div>
      <div aria-hidden className="flex items-center gap-3 px-5 pb-2 pt-3">
        <span className="min-w-0 flex-1">
          <span className="block text-caption text-text-muted">{sampleCommunity.name}</span>
          <span className="block text-h2 font-semibold">{title}</span>
        </span>
        <span className="relative flex size-target items-center justify-center rounded-full vm-border">
          <Bell className="vm-icon" />
          <span className="absolute end-3 top-3 size-2 rounded-full bg-danger" />
        </span>
      </div>
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-5 pb-3',
          dim && 'opacity-60',
        )}
      >
        {children}
      </div>
      <nav aria-hidden className="flex vm-border-t bg-surface-raised px-2 pb-5 pt-2">
        {samplePhone.tabs.map((label, i) => {
          const I = TAB_ICONS[i] ?? Home;
          return (
            <span
              key={label}
              className={cn(
                'flex min-h-target flex-1 flex-col items-center justify-center gap-1 rounded-md text-caption font-medium',
                i === active ? 'text-primary' : 'text-text-muted',
              )}
            >
              <I className="vm-icon" />
              {label}
            </span>
          );
        })}
      </nav>
    </div>
  );
}
