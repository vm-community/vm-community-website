'use client';

import { Bell, Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { ApiError } from '@/lib/api/types';
import { AttachmentTile } from '@/components/vm/AttachmentTile';
import { Avatar, ParticipantStack } from '@/components/vm/Avatar';
import { Banner, InlineAlert } from '@/components/vm/Banner';
import { Breadcrumbs } from '@/components/vm/Breadcrumbs';
import { Button, ButtonLink } from '@/components/vm/Button';
import { Card, CardHeader } from '@/components/vm/Card';
import { Checkbox, RadioGroup } from '@/components/vm/Checkbox';
import { Chip, PrivateBadge, RoleBadge, StatusChip } from '@/components/vm/Chip';
import { Combobox, type ComboOption } from '@/components/vm/Combobox';
import { CommentThread } from '@/components/vm/CommentThread';
import { ConfirmDialog } from '@/components/vm/ConfirmDialog';
import { DateField } from '@/components/vm/DateField';
import { Dialog } from '@/components/vm/Dialog';
import { DropZone, type PickedImage } from '@/components/vm/DropZone';
import { ExpandableText } from '@/components/vm/ExpandableText';
import { Field, FormErrorSummary } from '@/components/vm/Field';
import { Gallery } from '@/components/vm/Gallery';
import { InfiniteList } from '@/components/vm/InfiniteList';
import { List, ListRow } from '@/components/vm/ListRow';
import { Wordmark } from '@/components/vm/Logo';
import { Menu, Popover } from '@/components/vm/Menu';
import { PageHeader } from '@/components/vm/PageHeader';
import { Pagination } from '@/components/vm/Pagination';
import { PollOptions } from '@/components/vm/PollOptions';
import { ProgressBar, Spinner } from '@/components/vm/Progress';
import { ReactionBar } from '@/components/vm/ReactionBar';
import { Segmented } from '@/components/vm/Segmented';
import { Select } from '@/components/vm/Select';
import { Skeleton, SkeletonCard, SkeletonList } from '@/components/vm/Skeleton';
import { EmptyState, ErrorState, PermissionDeniedState } from '@/components/vm/States';
import { InsightCard, QuickAction, StatCard } from '@/components/vm/StatCard';
import { Stepper } from '@/components/vm/Stepper';
import { Switch, ToggleField } from '@/components/vm/Switch';
import { Table } from '@/components/vm/Table';
import { Tabs } from '@/components/vm/Tabs';
import { TagInput } from '@/components/vm/TagInput';
import { TextArea } from '@/components/vm/TextArea';
import { TextField } from '@/components/vm/TextField';
import { ThemeToggle } from '@/components/vm/ThemeToggle';
import { useToast } from '@/components/vm/Toast';
import { Tooltip } from '@/components/vm/Tooltip';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { colorTokens, radiusTokens, spaceTokens, typeTokens } from '@/styles/tokens';
import { useTranslations } from 'next-intl';

/* Dev-only page: literal strings are allowed here by lint config (src/app/design-system/**). */

const people = [
  { name: 'Anna Mathew' },
  { name: 'Ben Thomas' },
  { name: 'Carla Varghese' },
  { name: 'Daniel Kurian' },
  { name: 'Esther Joseph' },
  { name: 'Faisal Rahman' },
];

const SAMPLE_PNG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#7C3AED"/><circle cx="200" cy="200" r="120" fill="#4F46E5"/></svg>',
  );

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="flex flex-col gap-4 py-6 vm-border-t" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="text-h2 font-semibold">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <li className="flex items-center gap-3 text-small">
      <span className="size-6 rounded-sm vm-border" style={{ background: value }} aria-hidden />
      <span className="font-medium">{name}</span>
      <code className="ms-auto text-caption text-text-muted">{value}</code>
    </li>
  );
}

export function DesignSystemClient() {
  const t = useTranslations();
  const { effective } = useTheme();
  const { toast } = useToast();
  const [dialog, setDialog] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [tab, setTab] = useState('a');
  const [seg, setSeg] = useState<'hourglass' | 'ancestors' | 'list'>('hourglass');
  const [sw, setSw] = useState(true);
  const [radio, setRadio] = useState('b');
  const [tags, setTags] = useState(['music', 'football']);
  const [combo, setCombo] = useState<ComboOption | null>(null);
  const [picked, setPicked] = useState<PickedImage | null>(null);
  const [page, setPage] = useState(2);
  const [text, setText] = useState('');
  const [myReaction, setMyReaction] = useState<string | null>(null);
  const [vote, setVote] = useState<string | null>(null);
  const [items, setItems] = useState(5);

  const tokens = colorTokens[effective];
  const rows = people.map((p, i) => ({
    id: String(i),
    name: p.name,
    status: ['ACTIVE', 'PENDING', 'INACTIVE', 'SUSPENDED', 'ARCHIVED', 'ACTIVE'][i] ?? 'ACTIVE',
    city: ['Kochi', 'Pune', 'Pala', 'Kozhikode', 'Thrissur', 'Mangaluru'][i] ?? '',
  }));

  return (
    <main id="main" className="vm-gutter mx-auto max-w-content py-6">
      <header className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <Wordmark />
        <div className="flex items-center gap-3">
          <Chip tone="info">{effective}</Chip>
          <ThemeToggle />
        </div>
      </header>
      <PageHeader
        title="Design system"
        subtitle="Every token and component, in both themes. Internal visual-regression surface."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Design system' }]}
        primaryAction={
          <Button
            pill
            arrow
            onClick={() =>
              toast({ title: 'Saved', body: 'Your changes are safe.', tone: 'success' })
            }
          >
            Primary action
          </Button>
        }
        secondaryActions={
          <Menu
            items={[
              { key: 'a', label: 'Duplicate' },
              { key: 'b', label: 'Archive' },
              { key: 'c', label: 'Delete', danger: true, dividerBefore: true },
            ]}
          />
        }
      />

      <Section id="tokens" title="Tokens">
        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <CardHeader title="Colour" />
            <ul className="flex flex-col gap-2">
              {Object.entries(tokens).map(([k, v]) => (
                <Swatch key={k} name={k} value={v} />
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Spacing & radius" />
            <ul className="flex flex-col gap-2 text-small">
              {Object.entries(spaceTokens).map(([k, v]) => (
                <li key={k} className="flex items-center gap-3">
                  <span className="h-4 bg-primary" style={{ inlineSize: v }} aria-hidden />
                  <span>space-{k}</span>
                  <code className="ms-auto text-caption text-text-muted">{v}px</code>
                </li>
              ))}
              {Object.entries(radiusTokens).map(([k, v]) => (
                <li key={k} className="flex items-center gap-3">
                  <span className="size-6 bg-secondary" style={{ borderRadius: v }} aria-hidden />
                  <span>radius-{k}</span>
                  <code className="ms-auto text-caption text-text-muted">{v}px</code>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Type" />
            <p className="text-display font-bold">Display 36</p>
            <p className="text-h1 font-semibold">Heading 1 · 24</p>
            <p className="text-h2 font-semibold">Heading 2 · 20</p>
            <p className="text-h3 font-semibold">Heading 3 · 18</p>
            <p className="text-body">Body 16 — the quick brown fox jumps over the lazy dog.</p>
            <p className="text-small text-text-muted">Small 14 — secondary text and table cells.</p>
            <p className="text-caption text-text-muted">Caption 12 — badges and timestamps.</p>
            <ul className="mt-3 text-caption text-text-muted">
              {Object.entries(typeTokens).map(([k, v]) => (
                <li key={k}>
                  {k}: {String(v)}
                </li>
              ))}
            </ul>
            <div
              className="mt-4 h-12 rounded-md vm-gradient-brand"
              aria-label="Brand gradient"
              role="img"
            />
            <div
              className="mt-2 h-12 rounded-md vm-hero-glow vm-border"
              aria-label="Hero glow"
              role="img"
            />
          </Card>
        </div>
      </Section>

      <Section id="buttons" title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="link">Link</Button>
          <Button pill arrow>
            Get started
          </Button>
          <ButtonLink href="/" pill variant="secondary">
            Outlined pill
          </ButtonLink>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button icon={<Plus className="vm-icon" aria-hidden />} iconOnly>
            Add
          </Button>
          <Button size="sm" variant="secondary">
            Small
          </Button>
          <Button size="lg">Large</Button>
          <Tooltip content="You need the Families: edit permission.">
            <Button disabled aria-disabled>
              Explained
            </Button>
          </Tooltip>
        </div>
      </Section>

      <Section id="chips" title="Chips, badges, avatars">
        <div className="flex flex-wrap items-center gap-2">
          {[
            'ACTIVE',
            'PENDING',
            'INACTIVE',
            'ARCHIVED',
            'SUSPENDED',
            'DECLINED',
            'REJECTED',
            'PUBLISHED',
            'DRAFT',
            'UNDER_REVIEW',
            'CANCELLED',
          ].map((s) => (
            <StatusChip key={s} status={s} />
          ))}
          <RoleBadge role="Staff" />
          <PrivateBadge />
          <Chip outline>Not a member</Chip>
          <Chip tone="secondary">Adoptive</Chip>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name="Anna Mathew" size="sm" />
          <Avatar name="Ben Thomas" size="md" />
          <Avatar name="Carla Varghese" size="lg" />
          <Avatar name="Daniel Kurian" size="xl" src={SAMPLE_PNG} />
          <Avatar name="Private member" masked />
          <Avatar name="Esther Joseph" deceased />
          <ParticipantStack people={people} />
        </div>
      </Section>

      <Section id="cards" title="Cards, stats, insights, quick actions">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <StatCard
            label="Members"
            value="1,284"
            delta={{ text: '+3.2%', direction: 'up' }}
            sparkline={[3, 4, 4, 6, 5, 8, 9]}
            icon={<Users className="vm-icon" aria-hidden />}
            gradient
          />
          <StatCard label="Pending links" value="2" delta={{ text: '−1', direction: 'down' }} />
          <StatCard label="Events this month" value="7" />
          <QuickAction
            label="Add relative"
            icon={<Plus className="vm-icon" aria-hidden />}
            onClick={() => toast({ title: 'Quick action' })}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <InsightCard
            title="3 members have not attended in 90 days"
            body="A gentle check-in might help."
            icon={<Bell className="vm-icon" aria-hidden />}
            tone="warning"
            action={
              <Button size="sm" variant="secondary">
                See who
              </Button>
            }
          />
          <Card feature>
            <CardHeader
              title="Feature card"
              subtitle="Larger radius for feature and modal surfaces"
              action={<Menu items={[{ key: 'x', label: 'Open' }]} />}
            />
            <ExpandableText
              text={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(12)}
              limit={140}
            />
          </Card>
        </div>
      </Section>

      <Section id="lists" title="List rows, table, pagination, infinite list">
        <List>
          {people.slice(0, 3).map((p, i) => (
            <ListRow
              key={p.name}
              leading={<Avatar name={p.name} decorative />}
              title={p.name}
              subtitle="Member since 2019"
              meta={<StatusChip status={i === 1 ? 'PENDING' : 'ACTIVE'} />}
              trailing={<Menu items={[{ key: 'a', label: 'Edit' }]} />}
              href="#lists"
            />
          ))}
        </List>
        <Table
          caption="Sample members"
          columns={[
            { key: 'name', header: 'Name', sortable: true, cell: (r) => r.name },
            {
              key: 'status',
              header: 'Status',
              sortable: true,
              cell: (r) => <StatusChip status={r.status} />,
            },
            { key: 'city', header: 'City', cell: (r) => r.city, hideOnCard: true },
          ]}
          rows={rows}
          rowKey={(r) => r.id}
          sort={{ key: 'name', dir: 'asc' }}
          onSort={() => undefined}
          rowActions={() => <Menu items={[{ key: 'e', label: 'Edit' }]} />}
        />
        <Pagination page={page} pageLength={20} total={183} onPageChange={setPage} />
        <InfiniteList
          hasMore={items < 10}
          loadingMore={false}
          onLoadMore={() => setItems((n) => n + 2)}
          auto={false}
        >
          <ul className="flex flex-col gap-2">
            {Array.from({ length: items }, (_, i) => (
              <li key={i} className="rounded-md bg-surface p-3 text-small">
                Item {i + 1}
              </li>
            ))}
          </ul>
        </InfiniteList>
      </Section>

      <Section id="forms" title="Form kit">
        <FormErrorSummary errors={[{ field: 'email', message: 'Enter a valid email address.' }]} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="First name" required hint="As it appears on official records.">
            <TextField placeholder="Anna" />
          </Field>
          <Field label="Email" error="Enter a valid email address." required>
            <TextField type="email" defaultValue="not-an-email" />
          </Field>
          <Field label="Bio" optionalLabel>
            <TextArea
              value={text}
              onChange={(e) => setText(e.target.value)}
              counterMax={120}
              placeholder="A few words about you"
            />
          </Field>
          <Field label="Membership type">
            <Select
              options={[
                { value: 'REGULAR', label: 'Regular' },
                { value: 'VISITOR', label: 'Visitor' },
              ]}
            />
          </Field>
          <Field label="Date of birth">
            <DateField defaultValue="1990-05-12" />
          </Field>
          <Field label="Person" hint="Start typing to search">
            <Combobox
              value={combo}
              onChange={setCombo}
              placeholder="Search people…"
              loadOptions={(q) =>
                Promise.resolve(
                  people
                    .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
                    .map((p) => ({
                      value: p.name,
                      label: p.name,
                      leading: <Avatar name={p.name} size="sm" decorative />,
                    })),
                )
              }
            />
          </Field>
          <Field label="Interests">
            <TagInput value={tags} onChange={setTags} />
          </Field>
          <Field label="Visibility" asGroup>
            <RadioGroup
              name="vis"
              value={radio}
              onChange={setRadio}
              options={[
                { value: 'a', label: 'Public' },
                {
                  value: 'b',
                  label: 'Members only',
                  description: 'Only signed-in members see this.',
                },
                { value: 'c', label: 'Private' },
              ]}
            />
          </Field>
          <Field label="Photo">
            <DropZone value={picked} onChange={setPicked} />
          </Field>
          <div className="flex flex-col gap-3">
            <Switch label="Email notifications" checked={sw} onChange={setSw} />
            <ToggleField
              title="Push notifications"
              description="Only on your phone."
              checked={!sw}
              onChange={(v) => setSw(!v)}
            />
            <Checkbox
              label="I confirm everyone in this photo consented"
              description="Required for uploads."
            />
            <Segmented
              value={seg}
              onChange={setSeg}
              options={[
                { value: 'hourglass', label: 'Hourglass' },
                { value: 'ancestors', label: 'Ancestors' },
                { value: 'list', label: 'List' },
              ]}
            />
          </div>
        </div>
        <Stepper
          steps={[
            { key: '1', label: 'Relation' },
            { key: '2', label: 'Person' },
            { key: '3', label: 'Family' },
            { key: '4', label: 'Dates' },
            { key: '5', label: 'Review' },
          ]}
          current={2}
          onStepClick={() => undefined}
        />
      </Section>

      <Section id="feedback" title="Feedback and states">
        <Banner tone="warning" title="Demo data" onClose={() => undefined}>
          Nothing you do here is saved to a real community.
        </Banner>
        <InlineAlert tone="success" title="Saved">
          Your profile is up to date.
        </InlineAlert>
        <InlineAlert
          tone="danger"
          title="Something went wrong"
          action={
            <Button size="sm" variant="secondary">
              Retry
            </Button>
          }
        >
          We could not reach the server.
        </InlineAlert>
        <div className="grid gap-4 md:grid-cols-3">
          <Card padded={false}>
            <EmptyState
              title="Nothing here yet"
              body="Be the first to post."
              action={<Button size="sm">Post</Button>}
            />
          </Card>
          <Card padded={false}>
            <ErrorState
              error={new ApiError('INTERNAL', { traceId: 'trc-8f2a91' })}
              onRetry={() => undefined}
            />
          </Card>
          <Card padded={false}>
            <PermissionDeniedState scope="family.edit" />
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <SkeletonList rows={3} />
          <SkeletonCard />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-2/3" />
            <ProgressBar value={62} />
            <Spinner />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setDialog(true)}>Open dialog / sheet</Button>
          <Button variant="danger" onClick={() => setConfirm(true)}>
            Danger confirm
          </Button>
          <Popover trigger="Filters" label="Filters">
            <Switch label="Only active" checked={sw} onChange={setSw} />
          </Popover>
          <Button
            variant="secondary"
            onClick={() =>
              toast({
                title: 'Reaction failed',
                body: 'We rolled it back.',
                tone: 'danger',
                action: { label: 'Retry', onClick: () => undefined },
              })
            }
          >
            Toast with action
          </Button>
        </div>
        <Dialog
          open={dialog}
          onClose={() => setDialog(false)}
          title="Edit family"
          description="Changes apply to everyone in the household."
          footer={
            <>
              <Button variant="secondary" onClick={() => setDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setDialog(false)}>Save</Button>
            </>
          }
        >
          <Field label="Family name" required>
            <TextField defaultValue="Mathew" />
          </Field>
        </Dialog>
        <ConfirmDialog
          open={confirm}
          onClose={() => setConfirm(false)}
          onConfirm={() => setConfirm(false)}
          title="Delete this person?"
          body="This cannot be undone."
          danger
          consequences={['Also removes 3 relationships', 'Removes them from 2 families']}
          typeToConfirm="DELETE"
          confirmLabel="Delete"
        />
      </Section>

      <Section id="social" title="Feed widgets">
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { key: 'a', label: 'About' },
            { key: 'b', label: 'Discussions', count: 12 },
            { key: 'c', label: 'Members', count: 48 },
            { key: 'd', label: 'Requests', disabled: true },
          ]}
        >
          <p className="text-small text-text-muted">Panel for tab {tab}</p>
        </Tabs>
        <Breadcrumbs
          items={[
            { label: 'Families', href: '#' },
            { label: 'Mathew', href: '#' },
            { label: 'Anna' },
          ]}
        />
        <ReactionBar
          summary={{
            by_type: { LIKE: 4, LOVE: 2, PRAY: myReaction === 'PRAY' ? 1 : 0 },
            total: 6,
            my_reaction: myReaction,
          }}
          canReact
          onReact={(ty) => setMyReaction((m) => (m === ty ? null : ty))}
          supportLabel="I prayed"
        />
        <PollOptions
          options={[
            { id: 'o1', label: 'Saturday morning', votes: 12 },
            { id: 'o2', label: 'Sunday afternoon', votes: 7 },
            { id: 'o3', label: 'Either works', votes: 3 },
          ]}
          totalVotes={22}
          myVote={vote}
          canVote
          onVote={setVote}
        />
        <CommentThread
          canWrite
          onCreate={() => undefined}
          onReply={() => undefined}
          comments={[
            {
              id: '1',
              author: { name: 'Anna Mathew' },
              content: 'Looking forward to this!',
              timeLabel: '2 hours ago',
              status: 'APPROVED',
              isMine: false,
              replies: [
                {
                  id: '2',
                  author: { name: 'Ben Thomas' },
                  content: 'Same here.',
                  timeLabel: '1 hour ago',
                  status: 'APPROVED',
                  isMine: true,
                },
              ],
            },
            {
              id: '3',
              author: { name: 'Carla Varghese' },
              content: 'Can we bring guests?',
              timeLabel: '30 minutes ago',
              status: 'PENDING',
              isMine: true,
            },
          ]}
        />
        <AttachmentTile
          name="Minutes-2026-03.pdf"
          sizeBytes={482_000}
          caption="March meeting"
          href="#"
          onRemove={() => undefined}
        />
        <Gallery
          images={[
            { src: SAMPLE_PNG, alt: 'Sample one' },
            { src: SAMPLE_PNG, alt: 'Sample two', caption: 'Picnic' },
            { src: SAMPLE_PNG, alt: 'Sample three' },
          ]}
        />
        <p className="text-caption text-text-muted">{t('common.illustrative')}</p>
      </Section>
    </main>
  );
}
