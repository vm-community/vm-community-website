import type { VerticalContent } from '../types';

export const temple: VerticalContent = {
  key: 'temple',
  slug: 'temple',
  noun: 'temple',
  nounPlural: 'temples, gurdwaras and monasteries',
  title: 'VibeMind for temples, gurdwaras and monasteries',
  metaDescription:
    'Festivals and programmes, seva volunteers, offering records, notices, archives and family lineages for your place of worship, on the web for the committee and in every member’s pocket.',
  hero: {
    headline: 'Your place of worship, connected.',
    sub: 'Plan festivals and programmes, coordinate seva, keep offering records and preserve your archives. The committee works on the web; every member carries the community in their pocket.',
    illustration: 'festival',
  },
  benefits: [
    {
      title: 'Festivals and programmes',
      body: 'Recurring programmes as series, one-off festivals with RSVP and capacity, and volunteer rosters so nothing is left to the last minute.',
      icon: 'CalendarDays',
      module: 'events',
    },
    {
      title: 'Seva and volunteers',
      body: 'Seva teams with rosters for each programme. Volunteers accept or decline from their phone; organisers see gaps before the day.',
      icon: 'HeartHandshake',
      module: 'ministry',
    },
    {
      title: 'Offerings and donation records',
      body: 'Funds for offerings, festivals and building projects. Gifts made through your own channels are recorded, reconciled and summarised in annual statements.',
      icon: 'HandCoins',
      module: 'giving',
    },
    {
      title: 'Announcements and notices',
      body: 'Notices, timings and updates pinned where everyone sees them, with reactions and comments kept orderly through approvals.',
      icon: 'Megaphone',
      module: 'announcements',
    },
    {
      title: 'Media and archives',
      body: 'Photo albums with consent recorded, and documents, records and histories kept with versions for the generations to come.',
      icon: 'Images',
      module: 'media',
    },
    {
      title: 'Families and lineages',
      body: 'Households for everyday use, and an optional family tree that follows lineages across generations and branches.',
      icon: 'Network',
      module: 'tree',
    },
  ],
  web: {
    intro:
      'Committee members, administrators and treasurers run the place of worship from a desk: the dashboard, the offerings ledger, programme planning and approvals.',
    tasks: [
      {
        title: 'Dashboard and reports',
        body: 'Attendance, membership and offering trends in one place, with CSV export for committee meetings.',
        saves: 'Saves you building the same spreadsheet every month.',
        screen: 'dashboard',
      },
      {
        title: 'Members and households',
        body: 'Edit profiles, manage households, set visibility and welcome new families.',
        saves: 'Saves you the paper register and the phone calls.',
        screen: 'members',
      },
      {
        title: 'Programmes and festival planning',
        body: 'Create recurring programmes, handle exceptions such as a festival date that moves, and generate occurrences.',
        saves: 'Saves you re-creating the same programme every week.',
        screen: 'events',
      },
      {
        title: 'Offerings ledger and statements',
        body: 'Record offerings on behalf of members, mark them received, cancel with a reason, and issue annual statements.',
        saves: 'Saves you the year-end scramble.',
        screen: 'ledger',
      },
      {
        title: 'Notices and approvals',
        body: 'Publish, pin and archive notices; approve hall bookings and review posts before they appear in the feed.',
        saves: 'Saves you chasing a stray message.',
        screen: 'approvals',
      },
      {
        title: 'Documents and media archive',
        body: 'Records, minutes and histories with versions and expiring share links; albums with consent recorded.',
        saves: 'Saves you hunting through cupboards and email attachments.',
        screen: 'documents',
      },
      {
        title: 'Roles and audit trail',
        body: 'Give each person exactly the access they need and see who changed what.',
        saves: 'Saves you guessing after the fact.',
        screen: 'roles',
      },
      {
        title: 'Family tree administration',
        body: 'Link families and lineages, approve connections, merge duplicates and export the tree.',
        saves: 'Saves you untangling who is related to whom.',
        screen: 'tree',
      },
    ],
  },
  mobile: {
    intro:
      'The same community in every member’s pocket: notices, programme RSVP, offering records and seva invites.',
    benefits: [
      {
        title: 'Community feed',
        body: 'Notices, posts and polls from the committee and its groups.',
        icon: 'Newspaper',
      },
      {
        title: 'RSVP and reminders',
        body: 'Say you are coming to a programme or festival and get reminded.',
        icon: 'CalendarDays',
      },
      {
        title: 'Push notifications',
        body: 'Announcements, seva invites and replies, with per-topic preferences.',
        icon: 'Bell',
      },
      {
        title: 'Offering record and statement',
        body: 'Record an offering you made and see your annual statement.',
        icon: 'HandCoins',
      },
      {
        title: 'Household and family view',
        body: 'Your household, and the wider family tree where it is enabled.',
        icon: 'Network',
      },
      {
        title: 'Directory, with privacy',
        body: 'Find people according to the visibility they chose.',
        icon: 'Users',
      },
      {
        title: 'Groups and seva teams',
        body: 'Join groups, respond to roster invites, serve where you are needed.',
        icon: 'UsersRound',
      },
      {
        title: 'Photo albums',
        body: 'Browse festival and programme albums shared with consent.',
        icon: 'Images',
      },
      {
        title: 'Certificates and documents',
        body: 'Your certificates and the community’s shared documents.',
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
      persona: 'Member',
      web: 'Annual offering statement, printable certificates',
      mobile: 'Feed, RSVP, record an offering, seva invites',
    },
    {
      persona: 'Committee member',
      web: 'Dashboard, programme planning, notices, certificates',
      mobile: 'Roster responses, post a notice, quick replies',
    },
    {
      persona: 'Treasurer',
      web: 'Ledger, reconciliation, statements, trends',
      mobile: 'Mark an offering received, check a fund',
    },
    {
      persona: 'Administrator',
      web: 'Roles, settings, approvals, audit log, series',
      mobile: 'Approve a post, pin a notice',
    },
  ],
  scenarios: [
    {
      persona: 'Member',
      title: 'Festival week, from the phone',
      steps: [
        'Reads the notice about the festival programme in the feed and RSVPs for the family.',
        'Records the offering given at the programme by UPI so it appears on the annual statement.',
        'Accepts a roster invite to help with seva in the kitchen on the festival day.',
      ],
    },
    {
      persona: 'Committee member',
      title: 'Monday, on the web',
      steps: [
        'Opens the dashboard and checks RSVPs for the coming festival against hall capacity.',
        'Sees two seva slots still open and sends reminders to the team.',
        'Uploads the festival schedule to documents and pins the notice.',
      ],
    },
    {
      persona: 'Treasurer',
      title: 'Month end, on the web',
      steps: [
        'Filters the ledger by fund and marks the month’s offerings as received against bank references.',
        'Cancels a duplicate entry with a reason; the audit log records it.',
        'Exports the offering trend report for the committee meeting.',
      ],
    },
  ],
  modules: [
    { key: 'members', label: 'Members and guests' },
    { key: 'families', label: 'Households' },
    { key: 'tree', label: 'Family tree' },
    { key: 'events', label: 'Programmes and events' },
    { key: 'giving', label: 'Offerings and donations' },
    { key: 'community', label: 'Community feed' },
    { key: 'groups', label: 'Groups' },
    { key: 'ministry', label: 'Seva teams and rosters' },
    { key: 'documents', label: 'Documents' },
    { key: 'media', label: 'Media and archives' },
    { key: 'bookings', label: 'Facilities and bookings' },
    { key: 'announcements', label: 'Announcements' },
    { key: 'certificates', label: 'Certificates' },
    { key: 'prayer', label: 'Blessing requests', optional: true },
    { key: 'hr', label: 'Staff and HR' },
  ],
  familyConnections: {
    title: 'Households and lineages',
    body: 'Start with households, and grow into a full family tree that follows lineages across generations and branches, with approvals and privacy for every connection.',
  },
  privacy: {
    title: 'Private by design',
    body: 'Each member chooses who sees their details. Consent is recorded before photos are shared. Roles limit what committee members and staff can see, and every change is in the audit trail.',
  },
  faq: [
    {
      q: 'Does it handle offerings online?',
      a: 'It records offerings and donations that people make through your own channels, such as UPI, cash or bank transfer, and produces statements. It does not take card or bank details.',
    },
    {
      q: 'Does it work for gurdwaras and monasteries as well as temples?',
      a: 'Yes. The wording is neutral, so programmes, seva, offerings and notices fit your tradition without assumptions.',
    },
    {
      q: 'Can we keep our archives and photos?',
      a: 'Yes. Documents keep versions and can be shared by expiring links, and photo albums record consent before anything is shared.',
    },
    {
      q: 'Do we need the family tree?',
      a: 'No. Households work on their own. The family tree is an optional service you can enable later.',
    },
  ],
  related: ['church', 'mosque', 'family-association'],
};
