import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '@/content/types';
import { JsonLd } from './JsonLd';

/** Accordion built on native <details> (keyboard and screen-reader friendly) + FAQPage JSON-LD. */
export function Faq({ items, title }: { items: FaqItem[]; title: string }) {
  return (
    <div className="mx-auto max-w-prose">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((i) => ({
            '@type': 'Question',
            name: i.q,
            acceptedAnswer: { '@type': 'Answer', text: i.a },
          })),
        }}
      />
      <h2 className="mb-5 text-center text-h1 font-semibold">{title}</h2>
      <ul className="flex flex-col gap-2">
        {items.map((i) => (
          <li key={i.q}>
            <details className="group rounded-md bg-surface-raised vm-elevated-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-body font-medium vm-target vm-summary">
                {i.q}
                <ChevronDown
                  className="vm-icon shrink-0 transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="px-5 pb-5 text-small text-text-muted">{i.a}</p>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
