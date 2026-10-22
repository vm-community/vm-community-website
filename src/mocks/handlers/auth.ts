import { ROLE_NAMES } from '@/lib/auth/scopes';
import { COMMUNITIES } from '../communities';
import { validate } from '../core/errors';
import { defineMany } from '../core/registry';

export interface MeResponse {
  email: string;
  full_name: string;
  tenant: string;
  community: string;
  role: string;
  scopes: string[];
}

defineMany({
  'auth.me': {
    scope: null,
    handler: (_args, ctx): MeResponse => ({
      email: ctx.user.email,
      full_name: ctx.user.full_name,
      tenant: ctx.community.slug,
      community: ctx.community.name,
      role: ROLE_NAMES[ctx.role],
      scopes: [...ctx.scopes].sort(),
    }),
  },
  'auth.my_sites': {
    scope: null,
    handler: (_args, ctx) => ({
      sites: COMMUNITIES.map((c) =>
        c.slug === ctx.community.slug
          ? {
              slug: c.slug,
              name: c.name,
              role: ROLE_NAMES[ctx.role],
              membership_status: 'ACTIVE',
              detail_available: true,
            }
          : {
              slug: c.slug,
              name: null,
              role: null,
              membership_status: null,
              detail_available: false,
            },
      ),
    }),
  },
  'auth.exchange_site': {
    scope: null,
    handler: (args) => {
      validate(args).required('slug').throwIfInvalid();
      return { access_token: `mock-token-${String(args.slug)}`, expires_in: 300 };
    },
  },
  'auth.password_reset': {
    scope: null,
    mutation: true,
    handler: (args) => {
      validate(args).required('email').email('email').throwIfInvalid();
      // Never reveals whether the address exists.
      return { ok: true };
    },
  },
});
