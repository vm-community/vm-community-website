/**
 * JSON-LD structured data. The payload is JSON we build ourselves (never user content), so a
 * script tag with serialised JSON is safe; `<` is escaped to keep it inert inside HTML.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
