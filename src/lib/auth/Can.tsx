'use client';

import { useTranslations } from 'next-intl';
import { cloneElement, isValidElement, type ReactNode } from 'react';
import { Tooltip } from '@/components/vm/Tooltip';
import { describeScope } from '@/lib/api/errors';
import { useScopes } from './SessionProvider';

export type CanFallback = 'hide' | 'disable' | 'explain';

export function useCan(): (scope: string | readonly string[]) => boolean {
  const scopes = useScopes();
  return (scope) =>
    typeof scope === 'string' ? scopes.has(scope) : scope.some((s) => scopes.has(s));
}

/** Human explanation of a missing permission: "You need the Families: edit permission." */
export function useScopeExplanation(): (scope: string) => string {
  const t = useTranslations();
  return (scope: string) => {
    const { domain, verb } = describeScope(scope);
    const domainLabel = t.has(`scopes.domain.${domain}`) ? t(`scopes.domain.${domain}`) : domain;
    const verbLabel = t.has(`scopes.verb.${verb}`) ? t(`scopes.verb.${verb}`) : verb;
    return t('components.can.explain', { domain: domainLabel, verb: verbLabel });
  };
}

interface CanProps {
  /** One scope, or any-of a list. */
  scope: string | readonly string[];
  fallback?: CanFallback;
  children: ReactNode;
}

interface DisableableProps {
  disabled?: boolean;
  'aria-disabled'?: boolean;
}

/**
 * `<Can scope="family.edit" fallback="hide|disable|explain">`. `explain` renders the control
 * disabled with a tooltip naming the missing permission in plain words.
 */
export function Can({ scope, fallback = 'hide', children }: CanProps) {
  const can = useCan();
  const explain = useScopeExplanation();
  if (can(scope)) return <>{children}</>;
  if (fallback === 'hide') return null;
  const missing = typeof scope === 'string' ? scope : (scope[0] ?? '');
  const disabled = isValidElement<DisableableProps>(children)
    ? cloneElement(children, { disabled: true, 'aria-disabled': true })
    : children;
  if (fallback === 'disable') return <>{disabled}</>;
  return <Tooltip content={explain(missing)}>{disabled}</Tooltip>;
}
