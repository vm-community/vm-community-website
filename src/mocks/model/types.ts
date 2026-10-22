import type { RoleKey } from '@/lib/auth/scopes';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
export type PersonStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'ARCHIVED' | 'DELETED';
export type Visibility = 'PUBLIC' | 'MEMBERS' | 'STAFF' | 'PRIVATE';

/** Person as the backend models it (§6.2) plus the proposed tree additions (§7.3). */
export interface Person {
  name: string;
  email?: string;
  username?: string;
  first_name: string;
  last_name: string;
  display_name: string;
  phone_number?: string;
  profile_image_url?: string;
  bio?: string;
  date_of_birth?: string;
  gender?: Gender;
  occupation?: string;
  interests: string[];
  skills: string[];
  member_number?: string;
  membership_type?: string;
  membership_start_date?: string;
  membership_end_date?: string;
  status: PersonStatus;
  custom_fields: Record<string, string>;
  linked_user?: string;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  visibility: Visibility;
  visibility_overrides: Record<string, Visibility>;
  date_format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' | 'DD MMM YYYY';
  time_format: '12H' | '24H';
  is_deleted: boolean;
  doc_version: number;
  creation: string;
  modified: string;
  // proposed tree additions (ASSUMPTIONS: extend Person rather than a separate Relative record)
  is_community_member: boolean;
  is_deceased: boolean;
  date_of_death?: string;
  birth_place?: string;
  maiden_name?: string;
}

export interface MockUser {
  email: string;
  full_name: string;
  role: RoleKey;
  /** The Person record this login is linked to. */
  person: string;
}

export interface AuditRow {
  name: string;
  entity_doctype: string;
  entity_id: string;
  actor: string;
  event_type: string;
  trace_id: string;
  category: string;
  timestamp: string;
  summary: string;
  sensitive?: Record<string, unknown>;
  dpdp?: Record<string, unknown>;
}

export interface NotificationRow {
  name: string;
  user: string;
  topic: string;
  title: string;
  body: string;
  deep_link_route?: string;
  is_read: boolean;
  created_at: string;
  source_doctype?: string;
  source_doc?: string;
}

/** Everything the mock backend stores for one community. Collections are added per phase. */
export interface CommunityData {
  slug: string;
  seedVersion: number;
  users: MockUser[];
  persons: Person[];
  settings: Record<string, Record<string, unknown>>;
  audit: AuditRow[];
  notifications: NotificationRow[];
  /** Idempotency cache: key = user|fn|request_id → { at, result } */
  idempotency: Record<string, { at: string; result: unknown }>;
  /** Free-form collections registered by later phases (families, events, ...). */
  collections: Record<string, unknown[]>;
}

export interface MockDb {
  version: number;
  createdAt: string;
  communities: Record<string, CommunityData>;
}

export const MOCK_DB_VERSION = 1;
