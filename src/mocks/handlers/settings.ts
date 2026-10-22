import { fail, validate } from '../core/errors';
import { defineMany, mutationResult, paginate } from '../core/registry';
import { runtimeId } from '../core/ids';
import { toServerDateTime } from '@/lib/format/dates';

const PUBLIC_KEYS = [
  'community_name',
  'accent_color',
  'community_type',
  'logo_url',
  'tagline',
] as const;

defineMany({
  'settings.get_public_settings': {
    scope: 'settings.read_public',
    handler: (_args, ctx) => {
      const appearance = ctx.data.settings.appearance ?? {};
      const general = ctx.data.settings.general ?? {};
      const out: Record<string, unknown> = {};
      for (const k of PUBLIC_KEYS) out[k] = appearance[k] ?? null;
      out.currency = general.currency ?? 'INR';
      out.locale = general.locale ?? 'en-IN';
      out.timezone = general.timezone ?? 'UTC';
      return out;
    },
  },
  'settings.get_categories': {
    scope: 'settings.read',
    handler: (_args, ctx) => ({ categories: Object.keys(ctx.data.settings).sort() }),
  },
  'settings.get_settings': {
    scope: 'settings.read',
    handler: (args, ctx) => {
      const category = typeof args.category === 'string' ? args.category : '';
      const settings = ctx.data.settings[category];
      if (!settings) fail('NOT_FOUND');
      return { category, settings };
    },
  },
  'settings.get_audit': {
    scope: 'settings.read',
    handler: (args, ctx) => {
      const rows = ctx.data.audit.filter((r) => r.entity_doctype === 'VM Setting');
      const filtered = args.category
        ? rows.filter((r) => r.category === String(args.category))
        : rows;
      return paginate(filtered, args);
    },
  },
  'settings.update_settings': {
    scope: 'settings.write',
    mutation: true,
    handler: (args, ctx) => {
      validate(args).required('category').throwIfInvalid();
      const category = String(args.category);
      const current = ctx.data.settings[category];
      if (!current) fail('NOT_FOUND');
      const changes = (args.changes ?? {}) as Record<string, unknown>;
      for (const [k, v] of Object.entries(changes)) {
        if (typeof v === 'string' && v.length > 500)
          fail('VALIDATION_TOO_LONG', { details: { [k]: 'VALIDATION_TOO_LONG' } });
        current[k] = v;
      }
      ctx.data.audit.unshift({
        name: runtimeId('AUD'),
        entity_doctype: 'VM Setting',
        entity_id: category,
        actor: ctx.user.email,
        event_type: 'UPDATE',
        trace_id: runtimeId('trc'),
        category,
        timestamp: toServerDateTime(ctx.now),
        summary: `Updated ${Object.keys(changes).length} setting(s) in ${category}`,
      });
      ctx.touch();
      return mutationResult({ category, settings: current }, 'Settings updated');
    },
  },
  'settings.reset_setting': {
    scope: 'settings.write',
    mutation: true,
    handler: (args, ctx) => {
      validate(args).required('key').throwIfInvalid();
      const key = String(args.key);
      for (const cat of Object.values(ctx.data.settings)) {
        if (key in cat) {
          delete cat[key];
          ctx.touch();
          return mutationResult({ key }, 'Setting reset');
        }
      }
      return fail('NOT_FOUND');
    },
  },
  'meta.field_contracts': {
    scope: null,
    handler: () => ({
      field_contracts: {
        'Person.first_name': { required: true, maxLength: 60 },
        'Person.last_name': { required: true, maxLength: 60 },
        'Person.display_name': { required: false, maxLength: 120 },
        'Person.email': { required: false, maxLength: 254, format: 'email' },
        'Person.phone_number': { required: false, maxLength: 20 },
        'Person.bio': { required: false, maxLength: 1000 },
        'VM Family.family_name': { required: true, maxLength: 120 },
        'VM Family.notes': { required: false, maxLength: 2000 },
        'Post.content': { required: true, maxLength: 5000 },
        'Comment.content': { required: true, maxLength: 2000 },
        'Event.title': { required: true, maxLength: 140 },
        'Event.description': { required: false, maxLength: 5000 },
        'Prayer.body': { required: true, maxLength: 2000 },
      },
      api_contracts: {
        page_length_max: 100,
        page_length_default: 20,
        upload_max_bytes: 10 * 1024 * 1024,
      },
    }),
  },
});
