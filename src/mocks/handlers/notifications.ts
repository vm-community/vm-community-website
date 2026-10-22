import { fail } from '../core/errors';
import { defineMany, mutationResult, paginate } from '../core/registry';

defineMany({
  'notifications.search': {
    scope: 'notification.read_own',
    handler: (args, ctx) => {
      let rows = ctx.data.notifications.filter((n) => n.user === ctx.user.email);
      if (args.unread_only) rows = rows.filter((n) => !n.is_read);
      if (args.topic) rows = rows.filter((n) => n.topic === String(args.topic));
      rows = [...rows].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
      return paginate(rows, args);
    },
  },
  'notifications.unread_count': {
    scope: 'notification.read_own',
    handler: (_args, ctx) => ({
      count: ctx.data.notifications.filter((n) => n.user === ctx.user.email && !n.is_read).length,
    }),
  },
  'notifications.mark_read': {
    scope: 'notification.read_own',
    mutation: true,
    handler: (args, ctx) => {
      const row = ctx.data.notifications.find(
        (n) => n.name === String(args.name) && n.user === ctx.user.email,
      );
      if (!row) fail('NOT_FOUND');
      row.is_read = true;
      ctx.touch();
      return mutationResult(row, 'Marked as read');
    },
  },
  'notifications.mark_all_read': {
    scope: 'notification.read_own',
    mutation: true,
    handler: (_args, ctx) => {
      let n = 0;
      for (const row of ctx.data.notifications) {
        if (row.user === ctx.user.email && !row.is_read) {
          row.is_read = true;
          n += 1;
        }
      }
      ctx.touch();
      return mutationResult({ updated: n }, 'All notifications marked as read');
    },
  },
  'notifications.delete_notification': {
    scope: 'notification.read_own',
    mutation: true,
    handler: (args, ctx) => {
      const idx = ctx.data.notifications.findIndex(
        (n) => n.name === String(args.name) && n.user === ctx.user.email,
      );
      if (idx < 0) fail('NOT_FOUND');
      const [row] = ctx.data.notifications.splice(idx, 1);
      ctx.touch();
      return mutationResult(row, 'Notification deleted');
    },
  },
  'notifications.list_topics': {
    scope: 'notification.read_own',
    handler: (_args, ctx) => ({
      topics: [...new Set(ctx.data.notifications.map((n) => n.topic))].sort(),
    }),
  },
});
