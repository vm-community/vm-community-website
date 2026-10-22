/**
 * Illustrative family-tree sample used on /family-tree and /for/family-associations.
 * Fictional people only. Layout coordinates are in design px (card 144 x 72).
 * Kinship sentences are hand-written from Anna's point of view for this sample.
 */
export type FamilyKey = 'mathew' | 'thomas' | 'varghese' | 'none' | 'private';

export interface SamplePerson {
  id: string;
  name: string;
  life: string;
  x: number;
  y: number;
  family: FamilyKey;
  tag?: string;
  masked?: boolean;
  generation: number;
  relation: string;
  path: string;
  parents: string;
  partners: string;
  children: string;
  families: string;
}

export const CARD = { w: 144, h: 72 } as const;
export const TREE_SIZE = { w: 1040, h: 580 } as const;

export const FAMILY_NAMES: Record<FamilyKey, string> = {
  mathew: 'Mathew',
  thomas: 'Thomas',
  varghese: 'Varghese',
  none: 'No family',
  private: 'Private',
};

export const SAMPLE_PEOPLE: SamplePerson[] = [
  {
    id: 'joseph',
    name: 'Joseph Mathew',
    life: '1931 – 2012',
    x: 288,
    y: 20,
    family: 'mathew',
    tag: 'Deceased',
    generation: 1,
    relation: 'Grandfather',
    path: 'Anna → child of → Thomas → child of → Joseph',
    parents: 'Not recorded',
    partners: 'Mariam Mathew',
    children: 'Thomas, Ruth',
    families: 'Mathew (primary)',
  },
  {
    id: 'mariam',
    name: 'Mariam Mathew',
    life: '1935 – 2019',
    x: 444,
    y: 20,
    family: 'mathew',
    tag: 'Deceased',
    generation: 1,
    relation: 'Grandmother',
    path: 'Anna → child of → Thomas → child of → Mariam',
    parents: 'Not recorded',
    partners: 'Joseph Mathew',
    children: 'Thomas, Ruth',
    families: 'Mathew (primary)',
  },
  {
    id: 'thomas',
    name: 'Thomas Mathew',
    life: 'b. 1960',
    x: 60,
    y: 170,
    family: 'mathew',
    generation: 2,
    relation: 'Father',
    path: 'Anna → child of → Thomas',
    parents: 'Joseph, Mariam',
    partners: 'Leah Thomas',
    children: 'Ben, Anna',
    families: 'Mathew (primary)',
  },
  {
    id: 'leah',
    name: 'Leah Thomas',
    life: 'b. 1963',
    x: 216,
    y: 170,
    family: 'thomas',
    tag: 'Also in Mathew',
    generation: 2,
    relation: 'Mother',
    path: 'Anna → child of → Leah',
    parents: 'Not recorded',
    partners: 'Thomas Mathew',
    children: 'Ben, Anna',
    families: 'Thomas (primary), Mathew',
  },
  {
    id: 'ruth',
    name: 'Ruth Varghese',
    life: 'b. 1963',
    x: 540,
    y: 170,
    family: 'varghese',
    tag: 'Also in Mathew',
    generation: 2,
    relation: 'Aunt',
    path: 'Anna → child of → Thomas → sibling of → Ruth',
    parents: 'Joseph, Mariam',
    partners: 'George Varghese',
    children: 'Sara, Private member',
    families: 'Varghese (primary), Mathew',
  },
  {
    id: 'george',
    name: 'George Varghese',
    life: 'b. 1960',
    x: 696,
    y: 170,
    family: 'varghese',
    generation: 2,
    relation: 'Uncle by marriage',
    path: 'Anna → … → Ruth → spouse of → George',
    parents: 'Not recorded',
    partners: 'Ruth (current), Elsa Pillai (ended 1989)',
    children: 'Sara, Private member, Paul',
    families: 'Varghese (primary)',
  },
  {
    id: 'elsa',
    name: 'Elsa Pillai',
    life: 'b. 1962',
    x: 864,
    y: 170,
    family: 'none',
    tag: 'Not a member',
    generation: 2,
    relation: 'Not related',
    path: 'George’s former wife. Elsa is not a member and has no login.',
    parents: 'Not recorded',
    partners: 'George Varghese (ended 1989)',
    children: 'Paul',
    families: 'None',
  },
  {
    id: 'ben',
    name: 'Ben Mathew',
    life: 'b. 1994',
    x: 60,
    y: 330,
    family: 'mathew',
    generation: 3,
    relation: 'Brother',
    path: 'Anna → child of → Thomas → parent of → Ben',
    parents: 'Thomas, Leah',
    partners: 'None recorded',
    children: 'None recorded',
    families: 'Mathew (primary)',
  },
  {
    id: 'anna',
    name: 'Anna Mathew',
    life: 'b. 1990',
    x: 216,
    y: 330,
    family: 'mathew',
    tag: 'Focus',
    generation: 3,
    relation: 'The focus person',
    path: 'Every relationship in this sample is read from Anna’s point of view.',
    parents: 'Thomas, Leah',
    partners: 'Daniel Thomas',
    children: 'Maya',
    families: 'Mathew (primary)',
  },
  {
    id: 'daniel',
    name: 'Daniel Thomas',
    life: 'b. 1988',
    x: 372,
    y: 330,
    family: 'thomas',
    generation: 3,
    relation: 'Husband',
    path: 'Anna → spouse of → Daniel',
    parents: 'Not shown here',
    partners: 'Anna Mathew',
    children: 'Maya',
    families: 'Thomas (primary)',
  },
  {
    id: 'sara',
    name: 'Sara Varghese',
    life: 'b. 1991',
    x: 540,
    y: 330,
    family: 'varghese',
    generation: 3,
    relation: 'First cousin',
    path: 'Anna → child of → Thomas → child of → Joseph → parent of → Ruth → parent of → Sara',
    parents: 'Ruth, George',
    partners: 'None recorded',
    children: 'Ishaan (adopted)',
    families: 'Varghese (primary)',
  },
  {
    id: 'noah',
    name: 'Private member',
    life: '',
    x: 696,
    y: 330,
    family: 'private',
    tag: 'Private',
    masked: true,
    generation: 3,
    relation: 'Related, details private',
    path: 'The tree stays connected, but this person chose not to share their name, photo or dates.',
    parents: 'Ruth, George',
    partners: 'Private',
    children: 'Private',
    families: 'Private',
  },
  {
    id: 'paul',
    name: 'Paul Varghese',
    life: 'b. 1989',
    x: 864,
    y: 330,
    family: 'varghese',
    tag: 'Half-sibling',
    generation: 3,
    relation: 'Step-cousin',
    path: 'Anna → … → Ruth → spouse of → George → parent of → Paul. Paul is also Sara’s half-brother.',
    parents: 'George, Elsa',
    partners: 'None recorded',
    children: 'None recorded',
    families: 'Varghese (primary)',
  },
  {
    id: 'maya',
    name: 'Maya Thomas',
    life: 'b. 2022',
    x: 294,
    y: 490,
    family: 'thomas',
    tag: 'Not a member',
    generation: 4,
    relation: 'Daughter',
    path: 'Anna → parent of → Maya',
    parents: 'Anna, Daniel',
    partners: 'Not applicable',
    children: 'None',
    families: 'Thomas (primary), Mathew',
  },
  {
    id: 'ishaan',
    name: 'Ishaan Varghese',
    life: 'b. 2021',
    x: 540,
    y: 490,
    family: 'varghese',
    tag: 'Adopted',
    generation: 4,
    relation: 'First cousin once removed (adoptive)',
    path: 'Anna → … → Ruth → parent of → Sara → adoptive parent of → Ishaan',
    parents: 'Sara (adoptive)',
    partners: 'Not applicable',
    children: 'None',
    families: 'Varghese (primary)',
  },
];

export type EdgeKind = 'solid' | 'dash' | 'dot' | 'bridge';
export interface Edge {
  /** 'h' horizontal from x to x2 at y, 'v' vertical from y to y2 at x. */
  dir: 'h' | 'v';
  x: number;
  y: number;
  to: number;
  kind: EdgeKind;
}

export const SAMPLE_EDGES: Edge[] = [
  // Joseph + Mariam → Thomas, Ruth
  { dir: 'h', x: 432, y: 56, to: 444, kind: 'solid' },
  { dir: 'v', x: 438, y: 56, to: 130, kind: 'solid' },
  { dir: 'h', x: 132, y: 130, to: 612, kind: 'solid' },
  { dir: 'v', x: 132, y: 130, to: 170, kind: 'solid' },
  { dir: 'v', x: 612, y: 130, to: 170, kind: 'solid' },
  // Thomas + Leah → Ben, Anna
  { dir: 'h', x: 204, y: 206, to: 216, kind: 'solid' },
  { dir: 'v', x: 210, y: 206, to: 290, kind: 'solid' },
  { dir: 'h', x: 132, y: 290, to: 288, kind: 'solid' },
  { dir: 'v', x: 132, y: 290, to: 330, kind: 'solid' },
  { dir: 'v', x: 288, y: 290, to: 330, kind: 'solid' },
  // Ruth + George (alliance) → Sara, Private member
  { dir: 'h', x: 684, y: 206, to: 696, kind: 'bridge' },
  { dir: 'v', x: 690, y: 206, to: 290, kind: 'solid' },
  { dir: 'h', x: 612, y: 290, to: 768, kind: 'solid' },
  { dir: 'v', x: 612, y: 290, to: 330, kind: 'solid' },
  { dir: 'v', x: 768, y: 290, to: 330, kind: 'solid' },
  // George + Elsa (ended) → Paul
  { dir: 'h', x: 840, y: 206, to: 864, kind: 'dash' },
  { dir: 'v', x: 852, y: 206, to: 290, kind: 'dash' },
  { dir: 'h', x: 852, y: 290, to: 936, kind: 'dash' },
  { dir: 'v', x: 936, y: 290, to: 330, kind: 'dash' },
  // Anna + Daniel (alliance) → Maya
  { dir: 'h', x: 360, y: 366, to: 372, kind: 'bridge' },
  { dir: 'v', x: 366, y: 366, to: 490, kind: 'solid' },
  // Sara → Ishaan (adoptive)
  { dir: 'v', x: 612, y: 402, to: 490, kind: 'dot' },
];

export interface EdgeLabel {
  x: number;
  y: number;
  text: string;
  tone: 'ok' | 'muted' | 'adoptive';
}

export const SAMPLE_LABELS: EdgeLabel[] = [
  { x: 376, y: 412, text: 'Mathew ↔ Thomas · 2018', tone: 'ok' },
  { x: 506, y: 250, text: 'Mathew ↔ Varghese · 1988', tone: 'ok' },
  { x: 862, y: 250, text: 'Ended · 1989', tone: 'muted' },
  { x: 620, y: 436, text: 'Adoptive', tone: 'adoptive' },
  { x: 448, y: 98, text: 'Both deceased, not members', tone: 'muted' },
];

export interface SampleLink {
  title: string;
  status: 'Active' | 'Pending';
  meta: string;
}

export const SAMPLE_LINKS: SampleLink[] = [
  {
    title: 'Mathew ↔ Thomas',
    status: 'Active',
    meta: 'Marriage alliance · 2018 · approved by both families',
  },
  {
    title: 'Mathew ↔ Varghese',
    status: 'Active',
    meta: 'Marriage alliance · 1988 · approved by both families',
  },
  {
    title: 'Thomas ↔ Varghese',
    status: 'Pending',
    meta: 'Kinship · awaiting approval from the Varghese family',
  },
];

export const SAMPLE_STATS = {
  people: 15,
  generations: 4,
  families: 3,
  activeLinks: 2,
  pendingLinks: 1,
  notMembers: 5,
} as const;
