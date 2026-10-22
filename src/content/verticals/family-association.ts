import type { VerticalContent } from '../types';

export const familyAssociation: VerticalContent = {
  key: 'family-association',
  slug: 'family-associations',
  noun: 'family association',
  nounPlural: 'family associations',
  title: 'VibeMind for family associations',
  metaDescription:
    'A full family tree, reunions and gatherings, contributions and welfare funds, remembrance, elders and conveners, photos and documents for your family association.',
  hero: {
    headline: 'Keep every branch of the family close.',
    sub: 'Bring every branch into one family tree, plan reunions, keep contribution records and remember loved ones together. Conveners work on the web; every relative has the family in their pocket.',
    illustration: 'tree',
  },
  benefits: [
    {
      title: 'Every branch, one tree',
      body: 'A full family tree across generations, with households, links between families and approvals, so every branch can find its place.',
      icon: 'Network',
      module: 'tree',
    },
    {
      title: 'Reunions and gatherings',
      body: 'Reunions and family gatherings as events, with RSVP, headcounts and attendance, so the hosts know who is coming.',
      icon: 'CalendarDays',
      module: 'events',
    },
    {
      title: 'Contributions and welfare funds',
      body: 'Funds for levies, welfare and family projects. Contributions made through your own channels are recorded, reconciled and summarised in statements.',
      icon: 'HandCoins',
      module: 'giving',
    },
    {
      title: 'Remembering together',
      body: 'Births and anniversaries from the tree, and a gentle remembrance list for the family members we have lost.',
      icon: 'Sparkles',
      module: 'tree',
    },
    {
      title: 'Elders and conveners',
      body: 'Roles for conveners and elders, with approvals for new links and posts, so the family decides who can change what.',
      icon: 'Vote',
      module: 'members',
    },
    {
      title: 'Photos and documents',
      body: 'Albums with consent recorded and a shared archive of letters, records and histories, kept with versions.',
      icon: 'Images',
      module: 'media',
    },
  ],
  web: {
    intro:
      'Conveners, elders and treasurers look after the family from a desk: the tree, the contribution ledger, gathering plans and approvals.',
    tasks: [
      {
        title: 'Dashboard and reports',
        body: 'Branches, upcoming gatherings and contribution trends in one place, with CSV export.',
        saves: 'Saves you building the same spreadsheet every year.',
        screen: 'dashboard',
      },
      {
        title: 'Members and households',
        body: 'Edit profiles, manage households, set visibility and bring new relatives into the family.',
        saves: 'Saves you the address book and the phone calls.',
        screen: 'members',
      },
      {
        title: 'Reunions and gathering planning',
        body: 'Create reunions and recurring gatherings, open RSVP with headcounts, and record who came.',
        saves: 'Saves you counting replies in a chat thread.',
        screen: 'events',
      },
      {
        title: 'Contribution ledger and statements',
        body: 'Record contributions on behalf of relatives, mark them received, cancel with a reason, and issue statements.',
        saves: 'Saves you chasing who has contributed.',
        screen: 'ledger',
      },
      {
        title: 'Announcements and approvals',
        body: 'Publish family news, and review posts and new tree links before they appear.',
        saves: 'Saves you untangling a mistaken link later.',
        screen: 'approvals',
      },
      {
        title: 'Documents and photo archive',
        body: 'Letters, records and histories with versions and expiring share links; albums with consent recorded.',
        saves: 'Saves you hunting through old boxes and email attachments.',
        screen: 'documents',
      },
      {
        title: 'Roles and audit trail',
        body: 'Give each convener and elder exactly the access they need and see who changed what.',
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
      'The whole family in every relative’s pocket: the tree, gatherings, news and contribution records.',
    benefits: [
      {
        title: 'Family tree and household view',
        body: 'Explore your household and the wider tree, and see how you are related.',
        icon: 'Network',
      },
      {
        title: 'Family feed',
        body: 'News, photos, polls and announcements from the association and its branches.',
        icon: 'Newspaper',
      },
      {
        title: 'RSVP and reminders',
        body: 'Say you are coming to a reunion or gathering and get reminded.',
        icon: 'CalendarDays',
      },
      {
        title: 'Push notifications',
        body: 'Announcements, invites and replies, with per-topic preferences.',
        icon: 'Bell',
      },
      {
        title: 'Contribution record and statement',
        body: 'Record a contribution you made and see your statement.',
        icon: 'HandCoins',
      },
      {
        title: 'Birthdays and anniversaries',
        body: 'Remember the days that matter, drawn from the tree.',
        icon: 'Gift',
      },
      {
        title: 'Directory, with privacy',
        body: 'Find relatives according to the visibility they chose.',
        icon: 'Users',
      },
      {
        title: 'Branches and committees',
        body: 'Join your branch, respond to invites and help where you are needed.',
        icon: 'UsersRound',
      },
      {
        title: 'Photos, certificates and documents',
        body: 'Family albums, your certificates and the association’s shared documents.',
        icon: 'Images',
      },
      {
        title: 'Dark mode and several communities',
        body: 'Light or dark, and switch between the communities you belong to.',
        icon: 'Sparkles',
      },
    ],
    screens: ['feed', 'event', 'family'],
  },
  glance: [
    {
      persona: 'Member',
      web: 'Statement, certificates, exploring the tree on a large screen',
      mobile: 'Tree, feed, RSVP, record a contribution, birthdays',
    },
    {
      persona: 'Convener',
      web: 'Gathering planning, announcements, tree approvals',
      mobile: 'Post news, see who is coming, approve a link',
    },
    {
      persona: 'Treasurer',
      web: 'Ledger, reconciliation, statements, trends',
      mobile: 'Mark a contribution received, check a fund',
    },
    {
      persona: 'Administrator',
      web: 'Roles, settings, approvals, audit log, tree merges',
      mobile: 'Approve a post, pin an announcement',
    },
  ],
  scenarios: [
    {
      persona: 'Member',
      title: 'Before the reunion, from the phone',
      steps: [
        'Opens the family tree, finds a cousin from another branch and sees how they are related.',
        'RSVPs for the household to the annual reunion.',
        'Records this year’s contribution to the welfare fund by UPI so it appears on the statement.',
      ],
    },
    {
      persona: 'Convener',
      title: 'Monday, on the web',
      steps: [
        'Reviews a new link between two branches and approves it.',
        'Opens the RSVP headcount for the reunion and shares it with the hosts.',
        'Adds a name to the remembrance list and posts a note for the family.',
      ],
    },
    {
      persona: 'Treasurer',
      title: 'Year end, on the web',
      steps: [
        'Filters the ledger by fund and marks the year’s contributions as received against bank references.',
        'Cancels a duplicate entry with a reason; the audit log records it.',
        'Issues statements to every contributing household.',
      ],
    },
  ],
  modules: [
    { key: 'members', label: 'Members and guests' },
    { key: 'families', label: 'Households' },
    { key: 'tree', label: 'Family tree' },
    { key: 'events', label: 'Reunions and gatherings' },
    { key: 'giving', label: 'Contributions and welfare funds' },
    { key: 'community', label: 'Family feed' },
    { key: 'groups', label: 'Groups' },
    { key: 'ministry', label: 'Branches and committees' },
    { key: 'documents', label: 'Documents' },
    { key: 'media', label: 'Photos and media' },
    { key: 'announcements', label: 'Announcements' },
    { key: 'certificates', label: 'Certificates' },
    { key: 'bookings', label: 'Facilities and bookings', optional: true },
    { key: 'hr', label: 'Staff and HR', optional: true },
  ],
  familyConnections: {
    title: 'The full family tree',
    body: 'Build the tree branch by branch: generations, marriages between families, non-member and departed relatives, and links across families with approvals. Private details stay masked, and you can export the tree whenever you like.',
  },
  privacy: {
    title: 'Private by design',
    body: 'Each relative chooses who sees their details, and living relatives’ private details are masked in the tree. Consent is recorded before photos are shared. Roles limit what conveners can change, and every change is in the audit trail.',
  },
  faq: [
    {
      q: 'Can we handle levies and welfare contributions online?',
      a: 'It records contributions that people make through your association’s own channels, such as UPI, cash or bank transfer, and produces statements. It does not take card or bank details.',
    },
    {
      q: 'Can relatives who are not members appear in the tree?',
      a: 'Yes. Relatives who are not members, and those who have passed away, can be part of the tree, with privacy controls for living relatives.',
    },
    {
      q: 'Who decides what goes into the tree?',
      a: 'Your conveners and elders. Links between families and new posts can require approval, and every change is in the audit trail.',
    },
    {
      q: 'Can we export our tree?',
      a: 'Yes. The tree can be exported, so your family history is never locked in.',
    },
  ],
  related: ['church', 'society', 'alumni'],
};
