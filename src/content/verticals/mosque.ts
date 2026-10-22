import type { VerticalContent } from '../types';

export const mosque: VerticalContent = {
  key: 'mosque',
  slug: 'mosque',
  noun: 'mosque',
  nounPlural: 'mosques',
  title: 'VibeMind for mosques',
  metaDescription:
    'One notice board, committees and volunteers, donation records, education programmes and hall bookings for your masjid, on the web for leaders and in the pocket of every member.',
  hero: {
    headline: 'Your mosque, connected.',
    sub: 'Share notices, plan classes and lectures, keep donation records and coordinate volunteers. The committee works on the web; every member carries the masjid in their pocket.',
    illustration: 'notice-board',
  },
  benefits: [
    {
      title: 'One notice board',
      body: 'Announcements, events and the schedule of classes and lectures in one place, so the community hears it from the masjid first.',
      icon: 'Megaphone',
      module: 'announcements',
    },
    {
      title: 'Committee and volunteers',
      body: 'Committees and volunteer teams with rosters for each programme. Volunteers accept or decline from their phone; organisers see gaps before the day.',
      icon: 'HeartHandshake',
      module: 'ministry',
    },
    {
      title: 'Donations and zakat and sadaqah records',
      body: 'Funds for zakat, sadaqah and building projects. Donations made through your own channels are recorded, reconciled and summarised in annual statements.',
      icon: 'HandCoins',
      module: 'giving',
    },
    {
      title: 'Education programmes',
      body: 'Weekly classes, Qur’an circles and lecture series as recurring events, with registration, capacity and attendance.',
      icon: 'GraduationCap',
      module: 'events',
    },
    {
      title: 'Facilities',
      body: 'Hall and room bookings with availability and approval, so families and groups know where they can gather.',
      icon: 'Building2',
      module: 'bookings',
    },
    {
      title: 'Respectful by design',
      body: 'Privacy controls for every member, gender-neutral defaults and no assumptions about who belongs. Photos are shared only with consent.',
      icon: 'ShieldCheck',
      module: 'privacy',
    },
  ],
  web: {
    intro:
      'Imams, committee members and treasurers run the masjid from a desk: the dashboard, the donation ledger, programme planning and approvals.',
    tasks: [
      {
        title: 'Dashboard and reports',
        body: 'Attendance, membership and donation trends in one place, with CSV export for committee meetings.',
        saves: 'Saves you building the same spreadsheet every month.',
        screen: 'dashboard',
      },
      {
        title: 'Members and households',
        body: 'Edit profiles, manage households, set visibility and welcome new people to the community.',
        saves: 'Saves you the paper register and the phone calls.',
        screen: 'members',
      },
      {
        title: 'Classes, lectures and events',
        body: 'Create recurring classes, handle exceptions such as a moved lecture, and open registration with a capacity.',
        saves: 'Saves you re-creating the same event every week.',
        screen: 'events',
      },
      {
        title: 'Donation ledger and statements',
        body: 'Record donations on behalf of members, mark them received, cancel with a reason, and issue annual statements.',
        saves: 'Saves you the year-end scramble.',
        screen: 'ledger',
      },
      {
        title: 'Announcements and approvals',
        body: 'Publish, pin and archive notices; approve hall bookings and review posts before they appear in the feed.',
        saves: 'Saves you chasing a stray message.',
        screen: 'approvals',
      },
      {
        title: 'Documents and media library',
        body: 'Minutes, policies and timetables with versions and expiring share links; albums with consent recorded.',
        saves: 'Saves you hunting through email attachments.',
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
        body: 'Link families, approve connections, merge duplicates and export the tree.',
        saves: 'Saves you untangling who is related to whom.',
        screen: 'tree',
      },
    ],
  },
  mobile: {
    intro:
      'The same masjid in every member’s pocket: notices, class registration, donation records and volunteer invites.',
    benefits: [
      {
        title: 'Community feed',
        body: 'Notices, posts and polls from the masjid and its groups.',
        icon: 'Newspaper',
      },
      {
        title: 'RSVP and reminders',
        body: 'Say you are coming to a class or gathering and get reminded.',
        icon: 'CalendarDays',
      },
      {
        title: 'Push notifications',
        body: 'Announcements, volunteer invites and replies, with per-topic preferences.',
        icon: 'Bell',
      },
      {
        title: 'Donation record and statement',
        body: 'Record a donation you made and see your annual statement.',
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
        title: 'Groups and volunteer teams',
        body: 'Join groups, respond to roster invites, help where you are needed.',
        icon: 'UsersRound',
      },
      {
        title: 'Education programmes',
        body: 'Browse classes and lecture series and register in a tap.',
        icon: 'GraduationCap',
      },
      {
        title: 'Certificates and documents',
        body: 'Your certificates and the masjid’s shared documents.',
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
      web: 'Annual donation statement, printable certificates',
      mobile: 'Feed, class registration, record a donation, volunteer invites',
    },
    {
      persona: 'Imam',
      web: 'Programme planning, announcements, certificates',
      mobile: 'Post a notice, see who is coming, quick replies',
    },
    {
      persona: 'Treasurer',
      web: 'Ledger, reconciliation, statements, trends',
      mobile: 'Mark a donation received, check a fund',
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
      title: 'Friday, from the phone',
      steps: [
        'Reads the notice about the weekend lecture in the feed and registers for the family.',
        'Records the sadaqah given at the masjid by UPI so it appears on the annual statement.',
        'Accepts a roster invite to help with the community iftar next month.',
      ],
    },
    {
      persona: 'Imam',
      title: 'Monday, on the web',
      steps: [
        'Opens the dashboard and sees registrations for the new Qur’an circle.',
        'Schedules the weekly class as a recurring series, with one exception for a holiday.',
        'Issues a nikah certificate from the template; the family sees it on their phones.',
      ],
    },
    {
      persona: 'Treasurer',
      title: 'Month end, on the web',
      steps: [
        'Filters the ledger by fund and marks the month’s donations as received against bank references.',
        'Cancels a duplicate entry with a reason; the audit log records it.',
        'Exports the donation trend report for the committee meeting.',
      ],
    },
  ],
  modules: [
    { key: 'members', label: 'Members and guests' },
    { key: 'families', label: 'Households' },
    { key: 'tree', label: 'Family tree' },
    { key: 'events', label: 'Classes and events' },
    { key: 'giving', label: 'Donations' },
    { key: 'community', label: 'Community feed' },
    { key: 'groups', label: 'Groups' },
    { key: 'ministry', label: 'Committees and volunteer rosters' },
    { key: 'documents', label: 'Documents' },
    { key: 'media', label: 'Media' },
    { key: 'bookings', label: 'Hall and room bookings' },
    { key: 'announcements', label: 'Announcements' },
    { key: 'certificates', label: 'Certificates' },
    { key: 'prayer', label: 'Dua requests', optional: true },
    { key: 'hr', label: 'Staff and HR' },
  ],
  familyConnections: {
    title: 'Households and the family tree',
    body: 'Start with households so the masjid knows who belongs together, and grow into a full family tree: generations, marriages between families and guardians, all with approvals and privacy.',
  },
  privacy: {
    title: 'Private by design',
    body: 'Each member chooses who sees their details. Consent is recorded before photos are shared. Roles limit what committee members and staff can see, and every change is in the audit trail.',
  },
  faq: [
    {
      q: 'Does it handle zakat and sadaqah online?',
      a: 'It records donations that people make through your masjid’s own channels, such as UPI, cash or bank transfer, and produces statements. It does not take card or bank details.',
    },
    {
      q: 'Can we run classes with registration?',
      a: 'Yes. Classes and lecture series are recurring events with registration, capacity and attendance.',
    },
    {
      q: 'Can we book the hall and rooms?',
      a: 'Yes. Members request a booking, conflicts are flagged, and a manager approves or declines with a reason.',
    },
    {
      q: 'Do we need the family tree?',
      a: 'No. Households work on their own. The family tree is an optional service you can enable later.',
    },
  ],
  related: ['church', 'temple', 'family-association'],
};
