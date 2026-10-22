import type { VerticalContent } from '../types';

export const alumni: VerticalContent = {
  key: 'alumni',
  slug: 'alumni',
  noun: 'alumni group',
  nounPlural: 'alumni groups',
  title: 'VibeMind for alumni groups',
  metaDescription:
    'A directory with privacy controls, batch groups, reunions, giving back and a media archive for your alumni group, on the web for chapter leads and in every alumnus’s pocket.',
  hero: {
    headline: 'Find your batch again.',
    sub: 'Bring every batch and chapter together: a directory people control, reunions with RSVP, funds for giving back and a shared archive. Chapter leads work on the web; every alumnus carries the group in their pocket.',
    illustration: 'reunion',
  },
  benefits: [
    {
      title: 'Find your batch',
      body: 'A directory with privacy controls, so people can be found by batch and chapter only as far as they choose, and a group for every batch.',
      icon: 'Network',
      module: 'members',
    },
    {
      title: 'Reunions and chapters',
      body: 'Reunions and chapter meet-ups as events or recurring series, with RSVP, capacity and check-in on the day.',
      icon: 'CalendarDays',
      module: 'events',
    },
    {
      title: 'Giving back',
      body: 'Funds for scholarships, drives and the campus. Gifts made through your own channels are recorded and summarised in annual statements.',
      icon: 'HandCoins',
      module: 'giving',
    },
    {
      title: 'Mentoring and groups',
      body: 'Groups for cities, industries and interests, so newer alumni can find someone a few steps ahead.',
      icon: 'UsersRound',
      module: 'groups',
    },
    {
      title: 'Announcements and newsletters',
      body: 'Publish news, pin what matters and let chapters share updates, with a review step before posts appear.',
      icon: 'Newspaper',
      module: 'announcements',
    },
    {
      title: 'Media archive',
      body: 'Albums from old campus days and recent reunions, with consent recorded, plus documents such as newsletters and constitutions.',
      icon: 'Images',
      module: 'media',
    },
  ],
  web: {
    intro:
      'Chapter leads, treasurers and administrators run the group from a desk: the dashboard, the directory, reunion planning, the ledger and approvals.',
    tasks: [
      {
        title: 'Dashboard and reports',
        body: 'Membership by batch and chapter, event turnout and giving trends in one place, with CSV export.',
        saves: 'Saves you rebuilding the same spreadsheet before every committee meeting.',
        screen: 'dashboard',
      },
      {
        title: 'Directory and batches',
        body: 'Edit profiles, set visibility, and keep a group for every batch and chapter.',
        saves: 'Saves you the scattered contact lists and chat groups.',
        screen: 'members',
      },
      {
        title: 'Reunions and chapter events',
        body: 'Plan reunions and recurring chapter meet-ups, set capacity, track RSVPs and check people in.',
        saves: 'Saves you counting replies by hand.',
        screen: 'events',
      },
      {
        title: 'Giving ledger and statements',
        body: 'Record gifts made by UPI, cash or bank transfer, track funds, and issue annual statements.',
        saves: 'Saves you the year-end scramble.',
        screen: 'ledger',
      },
      {
        title: 'Announcements and approvals',
        body: 'Publish and pin news, and review posts before they appear in the feed.',
        saves: 'Saves you chasing a stray message.',
        screen: 'approvals',
      },
      {
        title: 'Documents and media library',
        body: 'Newsletters, minutes and constitutions with versions and expiring share links; albums with consent recorded.',
        saves: 'Saves you hunting through old email attachments.',
        screen: 'documents',
      },
      {
        title: 'Roles and audit trail',
        body: 'Give each chapter lead exactly the access they need and see who changed what.',
        saves: 'Saves you guessing after the fact.',
        screen: 'roles',
      },
      {
        title: 'Shared archive',
        body: 'Keep the group’s shared history in one place, with older versions kept and links that expire.',
        saves: 'Saves you losing the latest copy.',
        screen: 'documents',
      },
    ],
  },
  mobile: {
    intro:
      'The whole alumni group in every member’s pocket: feed, reunion RSVP, giving record and chapter groups.',
    benefits: [
      {
        title: 'Community feed',
        body: 'Posts, polls and announcements from the group and its chapters.',
        icon: 'Newspaper',
      },
      {
        title: 'RSVP and reminders',
        body: 'Say you are coming to a reunion or meet-up and get reminded.',
        icon: 'CalendarDays',
      },
      {
        title: 'Push notifications',
        body: 'Announcements, invites and replies, with per-topic preferences.',
        icon: 'Bell',
      },
      {
        title: 'Giving record and statement',
        body: 'Record a gift you made and see your annual statement.',
        icon: 'HandCoins',
      },
      {
        title: 'Directory, with privacy',
        body: 'Find batchmates according to the visibility they chose.',
        icon: 'Users',
      },
      {
        title: 'Batch and chapter groups',
        body: 'Join your batch, your city or an interest group and take part in the discussion.',
        icon: 'UsersRound',
      },
      {
        title: 'Chapter teams',
        body: 'Accept or decline an invite to help organise a reunion.',
        icon: 'HeartHandshake',
      },
      {
        title: 'Photos and documents',
        body: 'Browse albums and the group’s shared documents.',
        icon: 'Images',
      },
      {
        title: 'Your data, your choice',
        body: 'Manage consents and ask for your data to be exported or erased.',
        icon: 'Lock',
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
      web: 'Annual giving statement, browsing albums and documents',
      mobile: 'Feed, RSVP, batch groups, record a gift, directory',
    },
    {
      persona: 'Chapter lead',
      web: 'Reunion planning, attendance, chapter groups',
      mobile: 'Team responses, quick announcements, check-in',
    },
    {
      persona: 'Treasurer',
      web: 'Ledger, funds, statements, trends',
      mobile: 'Mark a gift received, check a fund',
    },
    {
      persona: 'Administrator',
      web: 'Roles, settings, approvals, audit log, series',
      mobile: 'Approve a post, pin an announcement',
    },
  ],
  scenarios: [
    {
      persona: 'Member',
      title: 'Finding the batch, from the phone',
      steps: [
        'Opens the batch group and sees that a reunion has been announced.',
        'RSVPs for two and gets a reminder the week before.',
        'Records a gift to the scholarship fund made by UPI so it appears on the annual statement.',
      ],
    },
    {
      persona: 'Chapter lead',
      title: 'Planning the reunion, on the web',
      steps: [
        'Creates the reunion event with a capacity and opens RSVPs.',
        'Invites four volunteers to the organising team; they accept from their phones.',
        'Checks people in on the day and posts an album with consent recorded.',
      ],
    },
    {
      persona: 'Treasurer',
      title: 'Year end, on the web',
      steps: [
        'Filters the ledger by fund and marks gifts as received against bank references.',
        'Cancels a duplicate entry with a reason; the audit log records it.',
        'Issues annual statements so every giver sees theirs on their phone.',
      ],
    },
  ],
  modules: [
    { key: 'members', label: 'Directory' },
    { key: 'events', label: 'Reunions and events' },
    { key: 'giving', label: 'Giving back' },
    { key: 'community', label: 'Community feed' },
    { key: 'groups', label: 'Batch and chapter groups' },
    { key: 'ministry', label: 'Chapters and teams' },
    { key: 'documents', label: 'Documents' },
    { key: 'media', label: 'Media archive' },
    { key: 'announcements', label: 'Announcements' },
    { key: 'families', label: 'Households', optional: true },
    { key: 'tree', label: 'Family tree', optional: true },
    { key: 'bookings', label: 'Facilities and bookings', optional: true },
    { key: 'certificates', label: 'Certificates', optional: true },
  ],
  privacy: {
    title: 'Found only as far as you choose',
    body: 'Each person chooses who sees their details, so a directory never becomes a mailing list. Consent is recorded before photos are shared. Roles limit what chapter leads can see, and every change is in the audit trail.',
  },
  faq: [
    {
      q: 'Can alumni give through the platform?',
      a: 'It records gifts that people make through your group’s own channels, such as UPI, cash or bank transfer, and produces statements. It does not take card or bank details.',
    },
    {
      q: 'Can people hide their details from the directory?',
      a: 'Yes. Each person sets their own visibility, and the directory respects it everywhere.',
    },
    {
      q: 'Can each chapter run its own events?',
      a: 'Yes. Chapter leads can plan events and series for their chapter, with roles limiting what each lead can change.',
    },
    {
      q: 'Do we need the family tree?',
      a: 'No. It is an optional service you can enable later, along with households.',
    },
  ],
  related: ['club', 'society', 'charity'],
};
