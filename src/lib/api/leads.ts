/**
 * /get-started submissions. Posts to NEXT_PUBLIC_LEAD_ENDPOINT when configured (gap G1);
 * otherwise stores locally so the demo shows a confirmation. Never throws.
 */
const LOCAL_KEY = 'vm.leads';

export async function submitLead(values: Record<string, unknown>): Promise<boolean> {
  const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT;
  const payload = { ...values, submitted_at: new Date().toISOString() };
  delete (payload as Record<string, unknown>).website;
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]') as unknown[];
    existing.push(payload);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(existing));
  } catch {
    /* storage unavailable: still a success for the demo */
  }
  return true;
}
