import { openDB, type IDBPDatabase } from 'idb';
import { COMMUNITIES } from '../communities';
import { MOCK_DB_VERSION, type CommunityData, type MockDb } from '../model/types';
import { SEED_VERSION, buildCommunityData } from '../seed';

const DB_NAME = 'vm-community-mock';
const STORE = 'state';
const KEY = 'db';

let db: MockDb | null = null;
let idb: IDBPDatabase | null = null;
let dirty = false;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let loading: Promise<MockDb> | null = null;

function freshDb(now: Date): MockDb {
  const communities: Record<string, CommunityData> = {};
  for (const c of COMMUNITIES) communities[c.slug] = buildCommunityData(c, now);
  return { version: MOCK_DB_VERSION, createdAt: now.toISOString(), communities };
}

async function openIdb(): Promise<IDBPDatabase | null> {
  if (typeof indexedDB === 'undefined') return null;
  try {
    return await openDB(DB_NAME, 1, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(STORE)) database.createObjectStore(STORE);
      },
    });
  } catch {
    return null;
  }
}

function isCurrent(candidate: MockDb | undefined): candidate is MockDb {
  if (candidate?.version !== MOCK_DB_VERSION) return false;
  return COMMUNITIES.every((c) => candidate.communities[c.slug]?.seedVersion === SEED_VERSION);
}

/** Loads (or seeds) the database once. Safe to call many times. */
export function ensureDb(now: Date = new Date()): Promise<MockDb> {
  if (db) return Promise.resolve(db);
  loading ??= (async () => {
    idb = await openIdb();
    let stored: MockDb | undefined;
    if (idb) {
      try {
        stored = (await idb.get(STORE, KEY)) as MockDb | undefined;
      } catch {
        stored = undefined;
      }
    }
    db = isCurrent(stored) ? stored : freshDb(now);
    if (db !== stored) scheduleSave();
    return db;
  })();
  return loading;
}

export function getDb(): MockDb {
  if (!db) throw new Error('mock db not loaded; call ensureDb() first');
  return db;
}

export function markDirty(): void {
  dirty = true;
  scheduleSave();
}

function scheduleSave(): void {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    void persist();
  }, 250);
}

async function persist(): Promise<void> {
  if (!idb || !db) return;
  dirty = false;
  try {
    await idb.put(STORE, db, KEY);
  } catch {
    dirty = true;
  }
}

export async function flush(): Promise<void> {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  if (dirty) await persist();
}

/** "Reset demo data": regenerate from the seed, relative to now so the demo never looks stale. */
export async function resetDb(now: Date = new Date()): Promise<MockDb> {
  await ensureDb(now);
  db = freshDb(now);
  dirty = true;
  await persist();
  return db;
}
