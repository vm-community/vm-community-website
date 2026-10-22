# Family Tree API v1 — proposed contract

**Status: PROPOSED. The real backend does not have this API.** The mock backend implements it
fully (Phase 3) and the web UI uses it; against a live backend the UI feature-detects it (§7.9)
and falls back to the household view. This document is written so the backend team can implement
the service; it follows every convention of the verified API (§4.4): `/api/method/vm_community.api.<module>.<function>`,
`{ message }` envelope, `{ error: { code, message, trace_id, details } }` errors, `request_id`
idempotency (24 h), soft delete, audit rows, UPPER_SNAKE enums, `YYYY-MM-DD` dates, opaque ids.

Scopes: the proposal **reuses `family.read` / `family.edit`** (assumption A6). No new scope.

## 1. Concepts

- **Person** — a node: community member **or** non-member relative, living or deceased.
- **Relationship** — typed, dated, directed link between two persons.
- **Union** — derived couple (or single parent) node from which children descend. Never stored.
- **Family (VM Family)** — existing household/lineage grouping; a person may be in several, primary in one.
- **Family Link** — typed link between two families; derived automatically from cross-family
  relationships or created manually; approval workflow.

### Direction semantics (enforced everywhere)

- `PARENT_OF`, `ADOPTIVE_PARENT_OF`, `STEP_PARENT_OF`, `FOSTER_PARENT_OF`, `GUARDIAN_OF`:
  `person_a` is the parent/guardian, `person_b` the child.
- `SPOUSE_OF`, `PARTNER_OF`, `SIBLING_OF` are symmetric and stored with the lexicographically
  smaller id as `person_a`.
- Siblings are **derived** from shared parents. An explicit `SIBLING_OF` exists only for
  half/step/unknown-parent cases.

## 2. Data model additions

`Person` gains (or a lightweight Relative record mirrors): `is_community_member: boolean`,
`is_deceased: boolean`, `date_of_death?: date`, `birth_place?: string(120)`, `maiden_name?: string(60)`.
Non-member relatives have no login, email, membership or member number. Visibility rules apply to
relatives too (`PRIVATE` allowed).

New doctypes:

```
VM Relationship
  name (opaque), type (enum above), person_a, person_b, parent_role? MOTHER|FATHER|OTHER,
  status CURRENT|ENDED|WIDOWED|DIVORCED|ANNULLED (meaningful for unions; CURRENT otherwise),
  start_date?, end_date?, is_verified bool, source? string(200), is_deleted, doc_version

VM Family Link
  name, family_a, family_b, link_type MARRIAGE_ALLIANCE|KINSHIP|ADOPTION|GUARDIANSHIP|OTHER,
  origin DERIVED|MANUAL, via_relationship?, status PENDING|ACTIVE|REJECTED|ENDED,
  requested_by, approval_a_by?, approval_a_at?, approval_b_by?, approval_b_at?,
  start_date?, end_date?, notes? string(1000), is_deleted, doc_version
```

Payload shapes are the TypeScript interfaces of PROMPT.md §7.3 (`TreePerson`, `Relationship`,
`Union`, `FamilyLink`, `TreePayload`), validated client-side with Zod (`src/lib/tree/schemas.ts`).

## 3. Endpoints

| Scope       | Function                   | Method | Params                                                                                                                                                                                           | Returns                                                                                    |
| ----------- | -------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| family.read | `tree.get`                 | GET    | `focus_person`, `[view=HOURGLASS]`, `[depth_up=3]`, `[depth_down=3]`, `[include_spouses=1]`, `[include_other_families=1]`, `[as_of_date]`, `[family]`                                            | `TreePayload` (server-masked)                                                              |
| family.read | `tree.expand`              | GET    | `person`, `direction=UP\|DOWN\|SIDE`, `[depth=1]`                                                                                                                                                | `TreePayload` fragment                                                                     |
| family.read | `tree.path`                | GET    | `person_a`, `person_b`                                                                                                                                                                           | `{ found, path:[{person, edge}], code:{kind, degree?, removed?, via, half?} }`             |
| family.read | `tree.stats`               | GET    | `[family]` or `[person]`                                                                                                                                                                         | stats object (§7.4)                                                                        |
| family.read | `tree.export`              | GET    | `format=GEDCOM\|JSON`, `[focus_person]`, `[family]`, `[depth]`                                                                                                                                   | `{ filename, content }` (audited; masked persons exported as "Private")                    |
| family.edit | `relationship.create`      | POST   | `type`, `person_a`, `person_b`, `[parent_role]`, `[status]`, `[start_date]`, `[end_date]`, `[source]`, `request_id`                                                                              | `{ doc: Relationship, message, derived_link?: FamilyLink }`                                |
| family.edit | `relationship.update`      | POST   | `id`, `doc_version`, fields                                                                                                                                                                      | `{ doc, message }` (`CONFLICT_VERSION` on stale)                                           |
| family.edit | `relationship.end`         | POST   | `id`, `status=DIVORCED\|WIDOWED\|ANNULLED\|ENDED`, `end_date`                                                                                                                                    | `{ doc, message }`                                                                         |
| family.edit | `relationship.delete`      | POST   | `id`                                                                                                                                                                                             | `{ doc, message }` (soft)                                                                  |
| family.edit | `person.create_relative`   | POST   | `first_name`, `last_name`, `[gender]`, `[date_of_birth]`, `[date_of_death]`, `[is_deceased]`, `[birth_place]`, `[maiden_name]`, `[family]`, `[relationship_to]`, `[relation_type]`, `request_id` | `{ doc: TreePerson, relationship?, message }`                                              |
| family.read | `person.search_duplicates` | GET    | `[person]`                                                                                                                                                                                       | `[{ a, b, score, reasons[] }]`                                                             |
| family.edit | `person.merge`             | POST   | `keep`, `remove`, `field_choices` (map field → `keep\|remove`)                                                                                                                                   | `{ doc: TreePerson, moved: { relationships, family_memberships, notes, links }, message }` |
| family.read | `family_link.list`         | GET    | `[family]`, `[status]`, `[link_type]`, `[page]`, `[page_length]`                                                                                                                                 | list envelope of `FamilyLink`                                                              |
| family.read | `family_link.graph`        | GET    | —                                                                                                                                                                                                | `{ families:[{id, family_name, status, member_count}], links:[FamilyLink] }`               |
| family.edit | `family_link.request`      | POST   | `family_a`, `family_b`, `link_type`, `[start_date]`, `[notes]`, `request_id`                                                                                                                     | `{ doc, message }`                                                                         |
| family.edit | `family_link.approve`      | POST   | `id`                                                                                                                                                                                             | `{ doc, message }`                                                                         |
| family.edit | `family_link.reject`       | POST   | `id`, `reason`                                                                                                                                                                                   | `{ doc, message }`                                                                         |
| family.edit | `family_link.end`          | POST   | `id`, `end_date`                                                                                                                                                                                 | `{ doc, message }`                                                                         |

`families.get` is extended **additively** with `linked_families: FamilyLink[]` and
`relatives: TreePerson[]` (non-member persons connected to roster members but not in the roster).

## 4. Guardrails (server validates; client mirrors for UX)

1. No self-relationship → `VALIDATION_INVALID` (`details.person_b`).
2. No duplicate edge (same type and pair) → `CONFLICT_DUPLICATE`.
3. No cycles in parent→child → `VALIDATION_INVALID` (`details.person_b: "CYCLE"`).
4. Parent older than child: error if parent's birth ≥ child's birth (`details.start_date`/`person_a`); warning (returned in `warnings[]`) when the gap is < 12 or > 60 years.
5. At most one CURRENT spouse per person (setting `tree.max_concurrent_spouses`, default 1) → `CONFLICT_DUPLICATE` with `details.person_a: "CURRENT_UNION_EXISTS"`.
6. Ended union needs `end_date ≥ start_date` → `VALIDATION_INVALID` (`details.end_date`).
7. A union cannot end after a partner's death unless `WIDOWED` → `VALIDATION_INVALID`.
8. A FamilyLink cannot target the same family twice nor duplicate an ACTIVE/PENDING link of the same type → `CONFLICT_DUPLICATE`.
9. Deleting a person with relationships requires `confirm_cascade=1`; otherwise `RECORD_IN_USE` with `details.relationships: "<n>"`.
10. Masked persons' identity never leaks through error messages (`details` refer to field names only).

## 5. Family-link workflow

- Creating any relationship between members of two different families creates a **derived PENDING
  link idempotently** (`origin=DERIVED`, `via_relationship` set). The requester's side counts as
  approved at request time if the requester holds `family.edit` over that family.
- Approvers = head of family or any `family.edit` holder of the other family; they receive an
  in-app notification (topic `family_link`).
- `approve` from the remaining side → `ACTIVE`. `reject` → `REJECTED` (person-level relationship
  stays; the family-level bridge is removed; requester notified with the reason).
- `end` sets `ENDED` with `end_date` and keeps history.

## 6. Privacy and masking

- The server applies `Person.visibility` and `visibility_overrides` **in the payload**: a person
  the viewer may not see is returned with `masked: true`, `display_name: "Private member"`, and
  no names, dates, photo, place or contact fields. Structure (ids and edges) is preserved.
- Masked persons are not searchable, are excluded from `tree.export` as "Private", and never
  appear in `person.search_duplicates` results for that viewer.
- Deceased non-member relatives are visible to members of the family and staff.
- **DSAR erasure** must cover relationships, family links (`requested_by`, approvals) and
  relative records created by or about the person: remove or anonymise them, and write a DPDP audit row.

## 7. Audit

Every mutation writes an audit row (`entity_doctype` = `VM Relationship` / `VM Family Link` /
`Person`, `category = family_tree`). `person.merge` stores a snapshot of the removed record in
the sensitive audit payload so an undo can re-create it.

## 8. Feature detection

Clients call `tree.stats` once per session. HTTP 404 / `NOT_FOUND` on the **method** means the
service is absent → the client uses the household view. (Mock mode: dev-toolbar switch.)
