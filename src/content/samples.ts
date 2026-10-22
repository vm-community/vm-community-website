/**
 * Illustrative sample data for marketing device frames. Fictional names only; every surface
 * that uses it is labelled "Illustrative example".
 */
export interface SampleFeedItem {
  id: string;
  author: string;
  time: string;
  text?: string;
  poll?: { question: string; options: Array<[string, number]> };
  reactions?: Record<string, number>;
  comments?: number;
}

export const sampleFeed: SampleFeedItem[] = [
  {
    id: 'p1',
    author: 'Anna Mathew',
    time: '2 h',
    text: 'Harvest gathering this Saturday at 5 pm. Bring the family and a dish to share.',
    reactions: { LIKE: 12, LOVE: 4 },
    comments: 3,
  },
  {
    id: 'p2',
    author: 'Ben Thomas',
    time: '5 h',
    poll: {
      question: 'Which evening works for the volunteers’ meeting?',
      options: [
        ['Tuesday', 8],
        ['Thursday', 5],
      ],
    },
  },
  {
    id: 'p3',
    author: 'Youth group',
    time: 'Yesterday',
    text: 'Photos from the weekend camp are in the album. Thank you to every volunteer.',
    reactions: { LIKE: 21, CELEBRATE: 6 },
    comments: 7,
  },
];

export const sampleEvent = {
  title: 'Community picnic',
  date: { day: '14', month: 'Jun' },
  time: '10:00 – 14:00',
  venue: 'Riverside park, north lawn',
  going: [
    'Anna Mathew',
    'Ben Thomas',
    'Carla Varghese',
    'Daniel Kurian',
    'Esther Joseph',
    'Faisal Rahman',
    'Grace Pillai',
  ],
  capacity: 120,
  registered: 86,
};

export const sampleStatement = {
  year: 2026,
  total: 18500,
  rows: [
    { date: '2026-01-05', fund: 'General fund', amount: 2500, method: 'UPI' },
    { date: '2026-02-02', fund: 'Building project', amount: 5000, method: 'Bank' },
    { date: '2026-03-01', fund: 'General fund', amount: 2500, method: 'UPI' },
    { date: '2026-04-06', fund: 'Welfare fund', amount: 1500, method: 'Cash' },
  ],
};

export const sampleHousehold = {
  family: 'Mathew family',
  members: [
    { name: 'Thomas Mathew', label: 'Father' },
    { name: 'Anna Mathew', label: 'Mother' },
    { name: 'Leah Mathew', label: 'Daughter' },
    { name: 'Noah Mathew', label: 'Son' },
  ],
  linked: ['Thomas family', 'Varghese family'],
};

export const sampleDashboard = {
  stats: [
    {
      label: 'Members',
      value: '1,284',
      delta: '+3.2%',
      direction: 'up' as const,
      spark: [3, 4, 4, 6, 5, 8, 9],
    },
    {
      label: 'Households',
      value: '412',
      delta: '+1.1%',
      direction: 'up' as const,
      spark: [2, 2, 3, 3, 4, 4, 5],
    },
    {
      label: 'This month',
      value: '7 events',
      delta: '2 upcoming',
      direction: 'flat' as const,
      spark: [1, 3, 2, 4, 3, 5, 4],
    },
    {
      label: 'Contributions',
      value: '₹2.4L',
      delta: '−4%',
      direction: 'down' as const,
      spark: [6, 7, 5, 6, 8, 7, 6],
    },
  ],
  activity: [
    'Anna Mathew joined the welcome team',
    'Harvest gathering published',
    'Welfare fund statement issued',
  ],
};

export const sampleMembers = [
  { name: 'Anna Mathew', status: 'ACTIVE', city: 'Kochi', household: 'Mathew' },
  { name: 'Ben Thomas', status: 'PENDING', city: 'Pune', household: 'Thomas' },
  { name: 'Carla Varghese', status: 'ACTIVE', city: 'Pala', household: 'Varghese' },
  { name: 'Daniel Kurian', status: 'INACTIVE', city: 'Kozhikode', household: 'Kurian' },
];

export const sampleLedger = [
  { donor: 'Anna Mathew', fund: 'General fund', amount: 2500, status: 'RECEIVED' },
  { donor: 'Ben Thomas', fund: 'Building project', amount: 5000, status: 'PENDING' },
  { donor: 'Carla Varghese', fund: 'Welfare fund', amount: 1500, status: 'RECEIVED' },
];

export const sampleApprovals = [
  {
    author: 'Daniel Kurian',
    excerpt: 'Volunteers needed for Saturday setup…',
    status: 'UNDER_REVIEW',
  },
  { author: 'Youth group', excerpt: 'Camp photos are up!', status: 'UNDER_REVIEW' },
];

export const sampleDocuments = [
  { title: 'Minutes · March meeting', category: 'Minutes', version: 'v2' },
  { title: 'Hall booking policy', category: 'Policies', version: 'v1' },
  { title: 'Welcome pack', category: 'Guides', version: 'v4' },
];

export const sampleRoles = [
  { role: 'Administrator', scopes: 'Everything' },
  { role: 'Staff', scopes: 'People, events, content' },
  { role: 'Treasurer', scopes: 'Funds, contributions, statements' },
  { role: 'Member', scopes: 'Own profile, feed, RSVP, giving' },
];

/** Illustrative app chrome and screen copy for the device frames (fictional community). */
export const sampleCommunity = { name: 'Grace Community', user: 'Anna Mathew' };

export const sampleWebNav = [
  'Home',
  'Community',
  'Events',
  'Families',
  'Members',
  'Giving',
  'Documents',
] as const;

export const sampleWebScreens: Record<
  'dashboard' | 'members' | 'events' | 'ledger' | 'approvals' | 'documents' | 'roles' | 'tree',
  { nav: (typeof sampleWebNav)[number]; title: string; sub: string; action: string }
> = {
  dashboard: {
    nav: 'Home',
    title: 'Dashboard',
    sub: 'Your community at a glance',
    action: 'New announcement',
  },
  members: {
    nav: 'Members',
    title: 'Members',
    sub: '1,284 people · 412 households',
    action: 'Add member',
  },
  events: {
    nav: 'Events',
    title: 'Events',
    sub: 'Plan services, gatherings and series',
    action: 'New event',
  },
  ledger: {
    nav: 'Giving',
    title: 'Contributions',
    sub: 'Recorded through your own channels',
    action: 'Record contribution',
  },
  approvals: {
    nav: 'Community',
    title: 'Awaiting review',
    sub: 'Posts waiting for an approver',
    action: 'Review all',
  },
  documents: {
    nav: 'Documents',
    title: 'Documents',
    sub: 'Minutes, policies and guides',
    action: 'Upload',
  },
  roles: {
    nav: 'Members',
    title: 'Roles and access',
    sub: 'Each role sees only what it needs',
    action: 'New role',
  },
  tree: {
    nav: 'Families',
    title: 'Family tree',
    sub: 'Three families · four generations',
    action: 'Add relative',
  },
};

export const sampleUpcoming = [
  { day: '14', month: 'Jun', title: 'Community picnic', meta: 'Riverside park · 10:00', going: 86 },
  { day: '21', month: 'Jun', title: 'Volunteers meeting', meta: 'Hall B · 18:30', going: 24 },
  { day: '28', month: 'Jun', title: 'Sunday gathering', meta: 'Main hall · 09:00', going: 212 },
];

export const sampleEvents = [
  {
    day: '14',
    month: 'Jun',
    title: 'Community picnic',
    meta: 'Riverside park · 10:00 – 14:00',
    status: 'PUBLISHED',
    going: '86 / 120',
  },
  {
    day: '21',
    month: 'Jun',
    title: 'Volunteers meeting',
    meta: 'Hall B · 18:30',
    status: 'PUBLISHED',
    going: '24 / 40',
  },
  {
    day: '28',
    month: 'Jun',
    title: 'Sunday gathering',
    meta: 'Weekly series · Main hall',
    status: 'PUBLISHED',
    going: '212',
  },
  {
    day: '05',
    month: 'Jul',
    title: 'Youth camp briefing',
    meta: 'Hall A · 17:00',
    status: 'DRAFT',
    going: '0 / 60',
  },
];

export const sampleActivity = [
  'Anna Mathew joined the welcome team',
  'Harvest gathering was published',
  'Welfare fund statement was issued',
  'Hall B booking approved for 21 Jun',
];

export const samplePhone = {
  tabs: ['Home', 'Community', 'Events', 'Family', 'Me'],
  rsvp: 'RSVP',
  going: 'going',
  addGift: 'Record a contribution',
  statementTitle: 'Annual statement',
  household: 'Your household',
  linked: 'Linked families',
};
