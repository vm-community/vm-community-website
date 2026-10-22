import type { Edge, FamilyKey } from './familyTreeSample';

/** Compact three-generation tree used by the family-association hero and section (cards 96 x 44). */
export const MINI_CARD = { w: 96, h: 44 } as const;
export const MINI_SIZE = { w: 560, h: 290 } as const;

export interface MiniPerson {
  name: string;
  life: string;
  x: number;
  y: number;
  family: FamilyKey;
  focus?: boolean;
}

export const MINI_PEOPLE: MiniPerson[] = [
  { name: 'Joseph', life: '1931–2012', x: 160, y: 0, family: 'mathew' },
  { name: 'Mariam', life: '1935–2019', x: 272, y: 0, family: 'mathew' },
  { name: 'Thomas', life: 'b. 1960', x: 24, y: 100, family: 'mathew' },
  { name: 'Leah', life: 'b. 1963', x: 136, y: 100, family: 'thomas' },
  { name: 'Ruth', life: 'b. 1963', x: 336, y: 100, family: 'varghese' },
  { name: 'George', life: 'b. 1960', x: 448, y: 100, family: 'varghese' },
  { name: 'Ben', life: 'b. 1994', x: 0, y: 200, family: 'mathew' },
  { name: 'Anna', life: 'b. 1990', x: 108, y: 200, family: 'mathew', focus: true },
  { name: 'Daniel', life: 'b. 1988', x: 216, y: 200, family: 'thomas' },
  { name: 'Sara', life: 'b. 1991', x: 336, y: 200, family: 'varghese' },
  { name: 'Paul', life: 'b. 1989', x: 444, y: 200, family: 'varghese' },
];

export const MINI_EDGES: Edge[] = [
  { dir: 'h', x: 256, y: 22, to: 272, kind: 'solid' },
  { dir: 'v', x: 264, y: 22, to: 76, kind: 'solid' },
  { dir: 'h', x: 72, y: 76, to: 384, kind: 'solid' },
  { dir: 'v', x: 72, y: 76, to: 100, kind: 'solid' },
  { dir: 'v', x: 384, y: 76, to: 100, kind: 'solid' },
  { dir: 'h', x: 120, y: 122, to: 136, kind: 'solid' },
  { dir: 'v', x: 128, y: 122, to: 172, kind: 'solid' },
  { dir: 'h', x: 48, y: 172, to: 156, kind: 'solid' },
  { dir: 'v', x: 48, y: 172, to: 200, kind: 'solid' },
  { dir: 'v', x: 156, y: 172, to: 200, kind: 'solid' },
  { dir: 'h', x: 432, y: 122, to: 448, kind: 'solid' },
  { dir: 'v', x: 440, y: 122, to: 172, kind: 'solid' },
  { dir: 'h', x: 384, y: 172, to: 492, kind: 'solid' },
  { dir: 'v', x: 384, y: 172, to: 200, kind: 'solid' },
  { dir: 'v', x: 492, y: 172, to: 200, kind: 'solid' },
  { dir: 'h', x: 204, y: 222, to: 216, kind: 'bridge' },
];
export const MINI_LABEL = { x: 118, y: 254, text: 'Mathew ↔ Thomas · 2018' } as const;

/** Phone variant: two couples and one child (324 wide). */
export const PHONE_SIZE = { w: 324, h: 252 } as const;
export const PHONE_PEOPLE: MiniPerson[] = [
  { name: 'Thomas', life: 'b. 1960', x: 24, y: 0, family: 'mathew' },
  { name: 'Leah', life: 'b. 1963', x: 136, y: 0, family: 'thomas' },
  { name: 'Ben', life: 'b. 1994', x: 0, y: 100, family: 'mathew' },
  { name: 'Anna', life: 'b. 1990', x: 108, y: 100, family: 'mathew', focus: true },
  { name: 'Daniel', life: 'b. 1988', x: 216, y: 100, family: 'thomas' },
  { name: 'Maya', life: 'b. 2022', x: 162, y: 200, family: 'thomas' },
];
export const PHONE_EDGES: Edge[] = [
  { dir: 'h', x: 120, y: 22, to: 136, kind: 'solid' },
  { dir: 'v', x: 128, y: 22, to: 76, kind: 'solid' },
  { dir: 'h', x: 48, y: 76, to: 156, kind: 'solid' },
  { dir: 'v', x: 48, y: 76, to: 100, kind: 'solid' },
  { dir: 'v', x: 156, y: 76, to: 100, kind: 'solid' },
  { dir: 'h', x: 204, y: 122, to: 216, kind: 'bridge' },
  { dir: 'v', x: 210, y: 122, to: 200, kind: 'solid' },
];
export const PHONE_LABEL = { x: 118, y: 154, text: 'Mathew ↔ Thomas · 2018' } as const;

export const HERO_COPY = {
  eyebrow: 'Family connections',
  panelTitle: 'Mathew–Thomas Family Association',
  views: ['Tree', 'List'],
  legend: [
    { key: 'mathew' as const, label: 'Mathew' },
    { key: 'thomas' as const, label: 'Thomas' },
    { key: 'varghese' as const, label: 'Varghese' },
  ],
  sample: 'Illustrative sample',
  approval: {
    title: 'Thomas ↔ Varghese',
    status: 'Pending',
    body: 'Awaiting approval from the Varghese family.',
    approve: 'Approve',
    decline: 'Decline',
  },
  kinship: {
    label: 'How are we related?',
    answer: 'Paul is Anna’s step-cousin.',
    path: 'Anna → Thomas → Ruth → George → Paul',
  },
  phoneKinship: {
    label: 'How are we related?',
    answer: 'Maya is Anna’s daughter.',
    path: 'Anna → parent of → Maya',
  },
  points: [
    'Households today, a full tree when you are ready',
    'Marriages between families, with approvals',
    'Private details stay masked, never exposed',
  ],
  focus: {
    initials: 'AM',
    title: 'Anna Mathew · the focus person',
    body: 'Select anyone in the sample to see how they relate to Anna.',
    link: 'Open the interactive sample',
  },
  sectionPoints: [
    {
      n: '1',
      title: 'Generations and marriages',
      body: 'Parents, partners, adoptive and step relations, including ended and widowed unions.',
    },
    {
      n: '2',
      title: 'Families linked, with approval',
      body: 'A marriage creates a pending link. The other family approves it before the bridge goes live.',
    },
    {
      n: '3',
      title: 'Everyone belongs',
      body: 'Departed ancestors and relatives without an account sit in the tree, clearly marked.',
    },
    {
      n: '4',
      title: 'Private by design',
      body: 'A private person shows as “Private member”. The tree stays connected, the details stay hidden.',
    },
  ],
  stats: [
    { n: '15', l: 'people' },
    { n: '4', l: 'generations' },
    { n: '3', l: 'families' },
    { n: '1', l: 'pending link' },
  ],
  legendEdges: ['Parent', 'Marriage alliance', 'Ended union', 'Adoptive'],
};
