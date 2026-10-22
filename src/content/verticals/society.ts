import type { VerticalContent } from '../types';

export const society: VerticalContent = {
  key: 'society',
  slug: 'societies',
  noun: 'society',
  nounPlural: 'housing and resident welfare societies',
  title: 'VibeMind for housing and resident welfare societies',
  metaDescription:
    'Residents, households, notices, bookings, dues records, committees and documents for your housing or resident welfare society, on the web for the committee and in every resident’s pocket.',
  hero: {
    headline: 'Every household, one notice board.',
    sub: 'Keep residents informed, book the clubhouse, record dues and keep the bylaws and minutes in one place. The committee works on the web; every resident carries the society in their pocket.',
    illustration: 'residents',
  },
  benefits: [
    {
      title: 'Residents and households',
      body: 'Every resident and every unit as a household, with who lives where and who to contact, shown according to the visibility each person chose.',
      icon: 'Home',
      module: 'families',
    },
    {
      title: 'Notices and approvals',
      body: 'Publish notices, pin the urgent ones and review resident posts before they appear, so the board stays useful.',
      icon: 'Megaphone',
      module: 'announcements',
    },
    {
      title: 'Facilities and bookings',
      body: 'The clubhouse and the hall with availability, clash checks and committee approval, so nobody is double-booked.',
      icon: 'Building2',
      module: 'bookings',
    },
    {
      title: 'Dues and contributions records',
      body: 'Maintenance dues and contributions paid through the society’s own channels are recorded, reconciled and summarised for each household.',
      icon: 'HandCoins',
      module: 'giving',
    },
    {
      title: 'Committees and rosters',
      body: 'Committees with their members, and rosters for festival evenings, clean-up drives and the annual meeting.',
      icon: 'ClipboardCheck',
      module: 'ministry',
    },
    {
      title: 'Documents',
      body: 'Bylaws, minutes and circulars with versions, and share links that expire when you want them to.',
      icon: 'FileText',
      module: 'documents',
    },
  ],
  web: {
    intro:
      'Committee members, treasurers and administrators run the society from a desk: the dashboard, the household register, the dues ledger, bookings and approvals.',
    tasks: [
      {
        title: 'Dashboard and reports',
        body: 'Households, dues status, bookings and activity in one place, with CSV export.',
        saves: 'Saves you building the same spreadsheet before every meeting.',
        screen: 'dashboard',
      },
      {
        title: 'Residents and households',
        body: 'Edit profiles, manage households and units, and set who can see what.',
        saves: 'Saves you the paper register and the phone calls.',
        screen: 'members',
      },
      {
        title: 'Meetings and society events',
        body: 'Plan meetings, festival evenings and recurring events, track RSVPs and attendance.',
        saves: 'Saves you re-creating the same event every month.',
        screen: 'events',
      },
      {
        title: 'Dues ledger and statements',
        body: 'Record dues paid by UPI, cash or bank transfer, mark them received, cancel with a reason and issue statements.',
        saves: 'Saves you the chasing at the end of the quarter.',
        screen: 'ledger',
      },
      {
        title: 'Notices, bookings and approvals',
        body: 'Publish and pin notices, approve or decline clubhouse and hall requests, and review posts before they appear.',
        saves: 'Saves you sorting out clashes by phone.',
        screen: 'approvals',
      },
      {
        title: 'Documents library',
        body: 'Bylaws, minutes and circulars with versions and expiring share links; albums with consent recorded.',
        saves: 'Saves you hunting through chat history for the latest copy.',
        screen: 'documents',
      },
      {
        title: 'Roles and audit trail',
        body: 'Give each committee member exactly the access they need and see who changed what.',
        saves: 'Saves you guessing after the fact.',
        screen: 'roles',
      },
      {
        title: 'Family tree administration',
        body: 'If households want it, link related families, merge duplicates and export the tree.',
        saves: 'Saves you untangling who is related to whom.',
        screen: 'tree',
      },
    ],
  },
  mobile: {
    intro:
      'The whole society in every resident’s pocket: notices, bookings, event RSVP and dues records.',
    benefits: [
      {
        title: 'Notice board',
        body: 'Notices, polls and posts from the committee and the groups you belong to.',
        icon: 'Newspaper',
      },
      {
        title: 'RSVP and reminders',
        body: 'Say you are coming to a meeting or event and get reminded.',
        icon: 'CalendarDays',
      },
      {
        title: 'Push notifications',
        body: 'Notices, booking decisions and replies, with per-topic preferences.',
        icon: 'Bell',
      },
      {
        title: 'Dues record and statement',
        body: 'Record a payment you made and see your household’s statement.',
        icon: 'HandCoins',
      },
      {
        title: 'Book a facility',
        body: 'Request the clubhouse or the hall and see when it is decided.',
        icon: 'Building2',
      },
      {
        title: 'Household view',
        body: 'Your household and the wider family tree where it is enabled.',
        icon: 'Home',
      },
      {
        title: 'Resident directory, with privacy',
        body: 'Find neighbours according to the visibility they chose.',
        icon: 'Users',
      },
      {
        title: 'Groups and committees',
        body: 'Join groups, respond to roster invites and help where you are needed.',
        icon: 'UsersRound',
      },
      {
        title: 'Documents',
        body: 'Bylaws, minutes and circulars whenever you need them.',
        icon: 'FileText',
      },
      {
        title: 'Dark mode and several communities',
        body: 'Light or dark, and switch between the communities you belong to.',
        icon: 'Sparkles',
      },
    ],
    screens: ['feed', 'event', 'giving'],
  },
  glance: [
    {
      persona: 'Resident',
      web: 'Household statement, bylaws and minutes',
      mobile: 'Notices, RSVP, book the clubhouse, record a payment',
    },
    {
      persona: 'Committee member',
      web: 'Dashboard, household register, meeting planning',
      mobile: 'Approve a booking, roster responses, quick replies',
    },
    {
      persona: 'Treasurer',
      web: 'Dues ledger, reconciliation, statements, trends',
      mobile: 'Mark a payment received, check a fund',
    },
    {
      persona: 'Administrator',
      web: 'Roles, settings, approvals, audit log, series',
      mobile: 'Approve a post, pin a notice',
    },
  ],
  scenarios: [
    {
      persona: 'Resident',
      title: 'A weekend, from the phone',
      steps: [
        'Reads the notice about the water tank cleaning and sees it pinned at the top.',
        'Requests the clubhouse for a birthday and is told once the committee approves.',
        'Records this quarter’s maintenance paid by UPI so it appears on the household statement.',
      ],
    },
    {
      persona: 'Committee member',
      title: 'Before the meeting, on the web',
      steps: [
        'Reviews the clubhouse requests and approves two, declining one with a reason.',
        'Publishes a notice about the annual meeting and opens RSVPs.',
        'Uploads the draft minutes and shares a link that expires after a week.',
      ],
    },
    {
      persona: 'Treasurer',
      title: 'Quarter end, on the web',
      steps: [
        'Filters the ledger by household and marks payments as received against bank references.',
        'Cancels a duplicate entry with a reason; the audit log records it.',
        'Exports the dues report for the committee.',
      ],
    },
  ],
  modules: [
    { key: 'members', label: 'Residents' },
    { key: 'families', label: 'Households' },
    { key: 'tree', label: 'Family tree' },
    { key: 'events', label: 'Meetings and events' },
    { key: 'giving', label: 'Dues and contributions' },
    { key: 'community', label: 'Community feed' },
    { key: 'groups', label: 'Groups' },
    { key: 'ministry', label: 'Committees and rosters' },
    { key: 'documents', label: 'Documents' },
    { key: 'media', label: 'Media' },
    { key: 'bookings', label: 'Facilities and bookings' },
    { key: 'announcements', label: 'Notices' },
    { key: 'certificates', label: 'Certificates', optional: true },
    { key: 'hr', label: 'Staff and HR', optional: true },
  ],
  familyConnections: {
    title: 'Households and the family tree',
    body: 'Start with households for every unit, and grow into a family tree where residents want one: related families, generations and links, all with approvals and privacy.',
  },
  privacy: {
    title: 'Private by design',
    body: 'Each resident chooses who sees their details, so a neighbour directory never becomes a public list. Consent is recorded before photos are shared. Roles limit what committee members and staff can see, and every change is in the audit trail.',
  },
  faq: [
    {
      q: 'Does it collect maintenance dues online?',
      a: 'It records dues that residents pay through the society’s own channels, such as UPI, cash or bank transfer, and produces statements. It does not take card or bank details.',
    },
    {
      q: 'Who approves clubhouse and hall bookings?',
      a: 'People with the right role, usually committee members. Requests show conflicts, and decisions come with a reason.',
    },
    {
      q: 'Can we limit who sees the bylaws and minutes?',
      a: 'Yes. Documents keep versions, and share links can expire, so a circular is not forwarded forever.',
    },
    {
      q: 'Do we need the family tree?',
      a: 'No. Households work on their own. The family tree is an optional service you can enable later.',
    },
  ],
  related: ['club', 'alumni', 'charity'],
};
