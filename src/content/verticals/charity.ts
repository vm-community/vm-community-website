import type { VerticalContent } from '../types';

export const charity: VerticalContent = {
  key: 'charity',
  slug: 'charities',
  noun: 'charity',
  nounPlural: 'charities',
  title: 'VibeMind for charities',
  metaDescription:
    'Supporters, volunteers, campaigns, drives, reports and statements for your charity, on the web for coordinators and treasurers and in the pocket of every supporter.',
  hero: {
    headline: 'Supporters, volunteers and campaigns in one place.',
    sub: 'Keep supporters informed, run campaigns and drives, coordinate volunteer teams and show where every donation went. Coordinators work on the web; supporters and volunteers carry the charity in their pocket.',
    illustration: 'campaign',
  },
  benefits: [
    {
      title: 'Supporters and volunteers',
      body: 'Supporters, volunteers and guests in one directory, shown according to the visibility each person chose.',
      icon: 'Users',
      module: 'members',
    },
    {
      title: 'Campaigns and funds',
      body: 'A fund for each campaign with progress shown, donations recorded from your own channels, and statements for donors.',
      icon: 'HandCoins',
      module: 'giving',
    },
    {
      title: 'Events and drives',
      body: 'Collection drives, camps and fundraisers as events or recurring series, with RSVP, capacity and check-in on the day.',
      icon: 'CalendarDays',
      module: 'events',
    },
    {
      title: 'Teams and rosters',
      body: 'Volunteer teams with rosters per drive. Volunteers accept or decline from their phone; coordinators see gaps before the day.',
      icon: 'HeartHandshake',
      module: 'ministry',
    },
    {
      title: 'Transparency',
      body: 'Reports, an audit trail of every change and annual statements, so supporters and trustees can see how things were recorded.',
      icon: 'BarChart3',
      module: 'reports',
    },
    {
      title: 'Documents and media',
      body: 'Annual reports, policies and minutes with versions and expiring share links, plus albums with consent recorded.',
      icon: 'FileText',
      module: 'documents',
    },
  ],
  web: {
    intro:
      'Coordinators, treasurers and administrators run the charity from a desk: the dashboard, the donations ledger and campaign funds, drive planning and approvals.',
    tasks: [
      {
        title: 'Dashboard and reports',
        body: 'Supporters, volunteers, donations and campaign progress in one place, with CSV export.',
        saves: 'Saves you building the same report for every trustees’ meeting.',
        screen: 'dashboard',
      },
      {
        title: 'Supporters and volunteers',
        body: 'Edit profiles, set visibility and turn guests into supporters.',
        saves: 'Saves you the scattered contact lists.',
        screen: 'members',
      },
      {
        title: 'Drives and event planning',
        body: 'Create drives and recurring events, set capacity and track RSVPs and attendance.',
        saves: 'Saves you re-creating the same event every month.',
        screen: 'events',
      },
      {
        title: 'Donations ledger and statements',
        body: 'Record donations made by UPI, cash or bank transfer, track campaign funds, mark them received and issue statements.',
        saves: 'Saves you the year-end scramble.',
        screen: 'ledger',
      },
      {
        title: 'Announcements and approvals',
        body: 'Publish campaign updates, pin what matters and review posts before they appear in the feed.',
        saves: 'Saves you chasing a stray message.',
        screen: 'approvals',
      },
      {
        title: 'Documents and media library',
        body: 'Annual reports, policies and minutes with versions and expiring share links; albums with consent recorded.',
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
        title: 'Reports and shared documents',
        body: 'Share reports with trustees or partners through links that expire when you want them to.',
        saves: 'Saves you forwarding files that never go away.',
        screen: 'documents',
      },
    ],
  },
  mobile: {
    intro:
      'The charity in every supporter’s and volunteer’s pocket: updates, drive RSVP, donation record and volunteer invites.',
    benefits: [
      {
        title: 'Community feed',
        body: 'Campaign updates, polls and announcements from the charity.',
        icon: 'Newspaper',
      },
      {
        title: 'RSVP and reminders',
        body: 'Say you are coming to a drive or event and get reminded.',
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
        title: 'Campaign progress',
        body: 'See how each campaign fund is doing.',
        icon: 'BarChart3',
      },
      {
        title: 'Directory, with privacy',
        body: 'Find people according to the visibility they chose.',
        icon: 'Users',
      },
      {
        title: 'Groups and volunteer teams',
        body: 'Join groups, respond to roster invites and help where you are needed.',
        icon: 'UsersRound',
      },
      {
        title: 'Photos and documents',
        body: 'Browse albums and the charity’s shared reports.',
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
      persona: 'Supporter',
      web: 'Annual donation statement, reports and albums',
      mobile: 'Feed, RSVP, record a donation, volunteer invites',
    },
    {
      persona: 'Coordinator',
      web: 'Drive planning, rosters, campaign progress',
      mobile: 'Roster responses, quick announcements, check-in',
    },
    {
      persona: 'Treasurer',
      web: 'Ledger, campaign funds, statements, trends',
      mobile: 'Mark a donation received, check a fund',
    },
    {
      persona: 'Administrator',
      web: 'Roles, settings, approvals, audit log, series',
      mobile: 'Approve a post, pin an announcement',
    },
  ],
  scenarios: [
    {
      persona: 'Supporter',
      title: 'Giving and helping, from the phone',
      steps: [
        'Reads the campaign update in the feed and sees how far the fund has come.',
        'Records a donation made by UPI so it appears on the annual statement.',
        'Accepts an invite to help at next month’s collection drive.',
      ],
    },
    {
      persona: 'Coordinator',
      title: 'Planning a drive, on the web',
      steps: [
        'Creates the drive with a capacity and opens RSVPs.',
        'Fills the volunteer roster; three people accept from their phones and one declines with a reason.',
        'Posts an album afterwards with consent recorded.',
      ],
    },
    {
      persona: 'Treasurer',
      title: 'Year end, on the web',
      steps: [
        'Filters the ledger by campaign and marks donations as received against bank references.',
        'Cancels a duplicate entry with a reason; the audit log records it.',
        'Issues annual statements so every donor sees theirs on their phone.',
      ],
    },
  ],
  modules: [
    { key: 'members', label: 'Supporters and volunteers' },
    { key: 'events', label: 'Events and drives' },
    { key: 'giving', label: 'Donations and campaigns' },
    { key: 'community', label: 'Community feed' },
    { key: 'groups', label: 'Groups' },
    { key: 'ministry', label: 'Volunteer teams and rosters' },
    { key: 'documents', label: 'Documents' },
    { key: 'media', label: 'Media' },
    { key: 'announcements', label: 'Announcements' },
    { key: 'hr', label: 'Staff and HR' },
    { key: 'families', label: 'Households', optional: true },
    { key: 'tree', label: 'Family tree', optional: true },
    { key: 'bookings', label: 'Facilities and bookings', optional: true },
    { key: 'certificates', label: 'Certificates', optional: true },
  ],
  privacy: {
    title: 'Trust you can show',
    body: 'Each supporter chooses who sees their details. Consent is recorded before photos are shared. Roles limit what staff and volunteers can see, and every change is in the audit trail.',
  },
  faq: [
    {
      q: 'Can supporters donate through the platform?',
      a: 'It records donations that people make through your charity’s own channels, such as UPI, cash or bank transfer, and produces statements. It does not take card or bank details.',
    },
    {
      q: 'Are the statements official receipts?',
      a: 'No. They are statements of what was recorded. Check what your own rules require before relying on them for anything more.',
    },
    {
      q: 'Can we see how each campaign is doing?',
      a: 'Yes. Each campaign is a fund with progress shown, and reports can be exported.',
    },
    {
      q: 'Can volunteers respond from their phones?',
      a: 'Yes. They get a roster invite and can accept or decline, with a reason if they decline.',
    },
  ],
  related: ['alumni', 'society', 'club'],
};
