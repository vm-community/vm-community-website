import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VerticalPage } from '@/components/marketing/VerticalPage';
import { VERTICAL_CONTENT, contentBySlug } from '@/content/verticals';

export function generateStaticParams() {
  return VERTICAL_CONTENT.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = contentBySlug(slug);
  if (!content) return {};
  return {
    title: content.title,
    description: content.metaDescription,
    alternates: { canonical: `/for/${content.slug}` },
  };
}

export default async function VerticalLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = contentBySlug(slug);
  if (!content) notFound();
  return <VerticalPage content={content} />;
}
