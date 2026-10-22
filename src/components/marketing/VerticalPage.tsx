import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { BrowserFrame, PhoneFrame } from './DeviceFrames';
import { Faq } from './Faq';
import { FamilyTreeLazy } from './FamilyTreeLazy';
import { NetworkMotif, TreeMotif } from './NetworkMotif';
import { PhoneScreen } from './PhoneScreens';
import {
  BenefitGrid,
  Checklist,
  CtaBand,
  GlanceTable,
  Icon,
  Section,
  SectionHeading,
} from './Sections';
import { WebScreen } from './WebScreens';
import { Breadcrumbs } from '@/components/vm/Breadcrumbs';
import { ButtonLink } from '@/components/vm/Button';
import { Card } from '@/components/vm/Card';
import { Chip } from '@/components/vm/Chip';
import type { VerticalContent } from '@/content/types';
import { VERTICAL_CONTENT, forPath } from '@/content/verticals';
import { PRESETS } from '@/lib/verticals';
import { accentPalette } from '@/styles/tokens';

/** The /for/<type> landing page template (§8.1.2). Rendered from a typed content module. */
export async function VerticalPage({ content }: { content: VerticalContent }) {
  const tc = await getTranslations('marketing.common');
  const tn = await getTranslations('marketing.nav');
  const tv = await getTranslations('verticals');
  const preset = PRESETS[content.key];
  const accent = accentPalette[preset.accentDefault];
  const related = content.related
    .map((k) => VERTICAL_CONTENT.find((c) => c.key === k))
    .filter((c): c is VerticalContent => Boolean(c));

  return (
    <>
      <section className="vm-hero-glow relative overflow-hidden">
        <div className="vm-gutter mx-auto grid max-w-content items-center gap-7 py-8 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <Breadcrumbs
              items={[
                { label: tc('home'), href: '/' },
                { label: tc('breadcrumbFor'), href: '/for' },
                { label: tv(`${content.key}.name`) },
              ]}
            />
            <h1 className="text-display font-bold md:text-display-lg">{content.hero.headline}</h1>
            <p className="max-w-prose text-body text-text-muted md:text-h3">{content.hero.sub}</p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/get-started" pill arrow size="lg">
                {tn('getStarted')}
              </ButtonLink>
              <ButtonLink href="/mobile" pill variant="secondary" size="lg">
                {tc('seeMobile')}
              </ButtonLink>
            </div>
          </div>
          <div style={{ color: accent }}>
            {content.hero.illustration === 'tree' ? <TreeMotif /> : <NetworkMotif />}
          </div>
        </div>
      </section>

      <Section id="why" tone="surface">
        <SectionHeading title={tc('whyChoose', { type: content.noun })} />
        <BenefitGrid items={content.benefits} />
      </Section>

      <Section id="web">
        <SectionHeading title={tc('forLeaders')} sub={content.web.intro} />
        <ul className="grid gap-4 md:grid-cols-2">
          {content.web.tasks.map((task) => (
            <li key={task.title}>
              <Card feature className="flex h-full flex-col gap-3">
                <BrowserFrame>
                  <WebScreen kind={task.screen} />
                </BrowserFrame>
                <h3 className="text-h3 font-semibold">{task.title}</h3>
                <p className="text-small text-text-muted">{task.body}</p>
                <p className="text-caption font-medium text-primary">{task.saves}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="mobile" tone="surface">
        <SectionHeading title={tc('forMembers')} sub={content.mobile.intro} />
        <div className="flex flex-col gap-6">
          <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {content.mobile.benefits.map((b) => (
              <li
                key={b.title}
                className="flex gap-3 rounded-md bg-surface-raised p-4 vm-elevated-1"
              >
                <span className="h-fit rounded-md p-2 vm-tint-primary">
                  <Icon name={b.icon} />
                </span>
                <span>
                  <span className="block font-semibold">{b.title}</span>
                  <span className="block text-small text-text-muted">{b.body}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="grid gap-4 sm:grid-cols-3">
            {content.mobile.screens.map((s) => (
              <PhoneFrame key={s}>
                <PhoneScreen kind={s} />
              </PhoneFrame>
            ))}
          </div>
        </div>
      </Section>

      <Section id="glance">
        <SectionHeading title={tc('glance')} />
        <GlanceTable
          rows={content.glance}
          personaLabel={tc('persona')}
          webLabel={tc('bestOnWeb')}
          mobileLabel={tc('bestOnMobile')}
        />
      </Section>

      <Section id="day" tone="surface">
        <SectionHeading title={tc('dayInLife')} eyebrow={tc('illustrative')} />
        <ul className="grid gap-4 md:grid-cols-3">
          {content.scenarios.map((s) => (
            <li key={s.title}>
              <Card feature className="flex h-full flex-col gap-3">
                <Chip tone="primary" className="w-fit">
                  {s.persona}
                </Chip>
                <h3 className="text-h3 font-semibold">{s.title}</h3>
                <ol className="flex list-decimal flex-col gap-2 ps-5 text-small text-text-muted">
                  {s.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="modules">
        <SectionHeading title={tc('modulesFor', { type: content.nounPlural })} />
        <Checklist
          items={content.modules.map((m) => ({
            label: m.label,
            optional: m.optional,
            note: m.optional ? tc('optional') : undefined,
          }))}
        />
      </Section>

      {content.familyConnections && (
        <Section id="family" tone="surface">
          {content.key === 'family-association' ? (
            <div className="flex flex-col gap-6">
              <SectionHeading
                title={content.familyConnections.title}
                sub={content.familyConnections.body}
              />
              <Chip tone="muted" className="mx-auto w-fit">
                {tc('illustrativeSample')}
              </Chip>
              <FamilyTreeLazy />
              <Link
                href="/family-tree"
                className="mx-auto text-small font-medium text-primary hover:underline"
              >
                {tn('familyTree')}
              </Link>
            </div>
          ) : (
            <div className="grid items-center gap-6 md:grid-cols-2">
              <div className="text-primary">
                <TreeMotif />
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="text-h1 font-semibold">{content.familyConnections.title}</h2>
                <p className="text-body text-text-muted">{content.familyConnections.body}</p>
                <Link
                  href="/family-tree"
                  className="text-small font-medium text-primary hover:underline"
                >
                  {tn('familyTree')}
                </Link>
              </div>
            </div>
          )}
        </Section>
      )}

      <Section id="privacy">
        <div className="mx-auto flex max-w-prose flex-col items-center gap-3 text-center">
          <span className="rounded-md p-2 vm-tint-success">
            <Icon name="Lock" />
          </span>
          <h2 className="text-h1 font-semibold">{content.privacy.title}</h2>
          <p className="text-body text-text-muted">{content.privacy.body}</p>
          <Link href="/trust" className="text-small font-medium text-primary hover:underline">
            {tn('trust')}
          </Link>
        </div>
      </Section>

      <Section id="faq" tone="surface">
        <Faq title={tc('faq')} items={content.faq} />
      </Section>

      <CtaBand title={tc('ctaTitle')} body={tc('ctaBody')} cta={tn('getStarted')} />

      <Section id="related">
        <SectionHeading title={tc('relatedTypes')} />
        <ul className="grid gap-4 sm:grid-cols-3">
          {related.map((r) => (
            <li key={r.key}>
              <Link
                href={forPath(r)}
                className="block rounded-lg bg-surface-raised p-5 vm-elevated-1 transition-colors vm-hover-surface"
              >
                <span className="block font-semibold">{tv(`${r.key}.name`)}</span>
                <span className="block text-small text-text-muted">{tv(`${r.key}.promise`)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
