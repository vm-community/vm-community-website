'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod/mini';
import { InlineAlert } from '@/components/vm/Banner';
import { Button } from '@/components/vm/Button';
import { Card } from '@/components/vm/Card';
import { Field, FormErrorSummary } from '@/components/vm/Field';
import { Select } from '@/components/vm/Select';
import { TextArea } from '@/components/vm/TextArea';
import { TextField } from '@/components/vm/TextField';
import { VERTICAL_KEYS } from '@/lib/verticals';
import { submitLead } from '@/lib/api/leads';

const NO_MARKUP = /^[^<>]*$/;

const schema = z.object({
  community_name: z.string().check(z.trim(), z.minLength(2), z.maxLength(120), z.regex(NO_MARKUP)),
  type: z.enum(VERTICAL_KEYS),
  role: z.enum(['leader', 'admin', 'treasurer', 'member', 'other']),
  size: z.enum(['1', '2', '3', '4']),
  email: z.email().check(z.maxLength(254)),
  message: z.optional(z.string().check(z.trim(), z.maxLength(2000))),
  website: z.string().check(z.maxLength(0)), // honeypot: must stay empty
});
export type LeadForm = z.infer<typeof schema>;

export function GetStartedForm() {
  const t = useTranslations('marketing.getStarted');
  const tv = useTranslations('validation');
  const tt = useTranslations('verticals');
  const [state, setState] = useState<'idle' | 'sent' | 'failed'>('idle');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<LeadForm>({
    resolver: standardSchemaResolver(schema),
    defaultValues: { type: 'generic', role: 'leader', size: '2', message: '', website: '' },
  });

  const fieldError = (name: keyof LeadForm): string | undefined => {
    const e = errors[name];
    if (!e) return undefined;
    if (name === 'email') return tv('email');
    if (name === 'community_name')
      return String(e.message ?? '')
        .toLowerCase()
        .includes('match')
        ? tv('noMarkup')
        : tv('required');
    return tv('required');
  };

  const onSubmit = async (values: LeadForm) => {
    if (values.website) return; // honeypot
    const ok = await submitLead(values);
    setState(ok ? 'sent' : 'failed');
  };

  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'hello@example.invalid';

  if (state === 'sent') {
    return (
      <Card feature>
        <InlineAlert tone="success" title={t('sent')}>
          {t('sentBody')}
        </InlineAlert>
      </Card>
    );
  }

  const summary = Object.keys(errors)
    .map((k) => ({ field: k, message: fieldError(k as keyof LeadForm) ?? '' }))
    .filter((e) => e.message);

  return (
    <Card feature>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {submitCount > 0 && <FormErrorSummary errors={summary} />}
        {state === 'failed' && <InlineAlert tone="danger">{t('failed')}</InlineAlert>}
        <Field label={t('communityName')} required error={fieldError('community_name')}>
          <TextField {...register('community_name')} maxLength={120} autoComplete="organization" />
        </Field>
        <Field label={t('type')} required error={fieldError('type')}>
          <Select
            {...register('type')}
            placeholder={false}
            options={VERTICAL_KEYS.map((k) => ({
              value: k,
              label: k === 'generic' ? t('roleOther') : tt(`${k}.name`),
            }))}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('role')} required error={fieldError('role')}>
            <Select
              {...register('role')}
              placeholder={false}
              options={[
                { value: 'leader', label: t('roleLeader') },
                { value: 'admin', label: t('roleAdmin') },
                { value: 'treasurer', label: t('roleTreasurer') },
                { value: 'member', label: t('roleMember') },
                { value: 'other', label: t('roleOther') },
              ]}
            />
          </Field>
          <Field label={t('size')} required error={fieldError('size')}>
            <Select
              {...register('size')}
              placeholder={false}
              options={[1, 2, 3, 4].map((n) => ({ value: String(n), label: t(`size${n}`) }))}
            />
          </Field>
        </div>
        <Field label={t('email')} required error={fieldError('email')}>
          <TextField type="email" {...register('email')} maxLength={254} autoComplete="email" />
        </Field>
        <Field label={t('message')} optionalLabel error={fieldError('message')}>
          <TextArea {...register('message')} maxLength={2000} rows={4} />
        </Field>
        <div className="vm-sr-only" aria-hidden>
          <label>
            {t('message')}
            <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
          </label>
        </div>
        <Button type="submit" pill arrow loading={isSubmitting}>
          {t('send')}
        </Button>
        <p className="text-caption text-text-muted">
          {t('mailto')}:{' '}
          <a href={`mailto:${contact}`} className="text-primary hover:underline">
            {contact}
          </a>
        </p>
      </form>
    </Card>
  );
}
