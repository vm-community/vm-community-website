import { ROLE_KEYS, type RoleKey } from '@/lib/auth/scopes';
import type { CommunityRecord } from '../communities';
import { makeId } from '../core/ids';
import { FIRST_NAMES_F, FIRST_NAMES_M, LAST_NAMES } from '../core/names';
import type { Rng } from '../core/rng';
import type { MockUser, Person } from '../model/types';
import { toServerDate, toServerDateTime } from '@/lib/format/dates';

export function personaEmail(role: RoleKey, slug: string): string {
  return `${role.replace('_', '.')}@${slug}.demo`;
}

export function blankPerson(name: string, now: Date): Person {
  return {
    name,
    first_name: '',
    last_name: '',
    display_name: '',
    interests: [],
    skills: [],
    status: 'ACTIVE',
    custom_fields: {},
    visibility: 'MEMBERS',
    visibility_overrides: {},
    date_format: 'DD/MM/YYYY',
    time_format: '12H',
    is_deleted: false,
    doc_version: 1,
    creation: toServerDateTime(now),
    modified: toServerDateTime(now),
    is_community_member: true,
    is_deceased: false,
  };
}

/** One login per role per community. Each is linked to a seeded, active Person. */
export function seedPersonas(
  community: CommunityRecord,
  rng: Rng,
  now: Date,
): { users: MockUser[]; persons: Person[] } {
  const users: MockUser[] = [];
  const persons: Person[] = [];
  ROLE_KEYS.forEach((role, i) => {
    const female = i % 2 === 0;
    const first = female ? rng.pick(FIRST_NAMES_F) : rng.pick(FIRST_NAMES_M);
    const last = rng.pick(LAST_NAMES);
    const person = blankPerson(makeId('PER', rng), now);
    person.first_name = first;
    person.last_name = last;
    person.display_name = `${first} ${last}`;
    person.email = personaEmail(role, community.slug);
    person.username = `${first}.${last}`.toLowerCase();
    person.gender = female ? 'FEMALE' : 'MALE';
    person.phone_number = `+91 9${rng.int(100000000, 999999999)}`;
    const birth = new Date(now.getFullYear() - rng.int(26, 62), rng.int(0, 11), rng.int(1, 28));
    person.date_of_birth = toServerDate(birth);
    person.member_number = `M-${(1000 + i).toString()}`;
    person.membership_type = role === 'guest' ? 'VISITOR' : 'REGULAR';
    person.membership_start_date = toServerDate(new Date(now.getFullYear() - rng.int(1, 12), 0, 1));
    person.status = 'ACTIVE';
    person.city = community.city;
    person.country = community.country;
    person.linked_user = person.email;
    person.visibility = 'MEMBERS';
    person.is_community_member = true;
    persons.push(person);
    users.push({ email: person.email, full_name: person.display_name, role, person: person.name });
  });
  return { users, persons };
}
