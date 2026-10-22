/** Dev-toolbar switches for the mock backend. Persisted in localStorage (try/catch, memory fallback). */
export type LatencyPreset = 0 | 300 | 1500;

export interface MockSettings {
  latencyMs: LatencyPreset;
  failureRate: number; // 0 or 0.2
  treeApi: boolean;
}

export const DEFAULT_MOCK_SETTINGS: MockSettings = { latencyMs: 0, failureRate: 0, treeApi: true };
const KEY = 'vm.mock.settings';
let memory: MockSettings = { ...DEFAULT_MOCK_SETTINGS };
const listeners = new Set<(s: MockSettings) => void>();

export function readMockSettings(): MockSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return memory;
    const parsed = JSON.parse(raw) as Partial<MockSettings>;
    memory = {
      latencyMs: parsed.latencyMs === 300 || parsed.latencyMs === 1500 ? parsed.latencyMs : 0,
      failureRate: typeof parsed.failureRate === 'number' ? parsed.failureRate : 0,
      treeApi: parsed.treeApi !== false,
    };
  } catch {
    /* keep memory */
  }
  return memory;
}

export function writeMockSettings(next: Partial<MockSettings>): MockSettings {
  memory = { ...readMockSettings(), ...next };
  try {
    localStorage.setItem(KEY, JSON.stringify(memory));
  } catch {
    /* memory only */
  }
  for (const l of listeners) l(memory);
  return memory;
}

export function subscribeMockSettings(listener: (s: MockSettings) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
