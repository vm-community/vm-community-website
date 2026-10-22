import type { VerticalContent } from '../types';

export const church: VerticalContent = {
  key: 'church',
  slug: 'church',
  noun: 'church',
  nounPlural: 'churches',
  title: 'VibeMind for churches',
  metaDescription:
    'Members, households, services, giving records, prayer and ministries for your church, on the web for leaders and in the pocket of every member.',
  hero: {
    headline: 'Your church, connected.',
    sub: 'Know your flock, plan services, record giving, share prayer and run ministries together. Leaders work on the web; every member carries the church in their pocket.',
    illustration: 'gathering',
  },
  benefits: [
    {
      title: 'Know your flock',
      body: 'Members, households and guests in one directory, with follow-up for first-time visitors and a clear picture of who belongs where.',
      icon: 'Users',
      module: 'members',
    },
    {
      title: 'Services and events',
      body: 'Recurring services as series, one-off events with RSVP and capacity, and serving rosters so nobody is surprised on Sunday.',
      icon: 'CalendarDays',
      module: 'events',
    },
    {
      title: 'Giving and statements',
      body: 'Funds for tithes, offerings and building projects. Gifts made through your own channels are recorded, reconciled and summarised in annual statements.',
      icon: 'HandCoins',
      module: 'giving',
    },
    {
      title: 'Prayer wall',
      body: 'Shared requests the whole church can stand with, and private requests seen only by clergy, with gentle "answered" marks.',
      icon: 'HandHeart',
      module: 'prayer',
    },
    {
      title: 'Care and certificates',
      body: 'Pastoral signals such as members who have not attended in a while, plus baptism and marriage certificates issued from templates.',
      icon: 'Award',
      module: 'certificates',
    },
    {
      title: 'Ministries and volunteers',
      body: 'Ministry teams with rosters per service. Volunteers accept or decline from their phone; leaders see gaps before the day.',
      icon: 'HeartHandshake',
      module: 'ministry',
    },
  ],
  web: {
    intro:
      'Pastors, administrators and treasurers run the church from a desk: the pastoral dashboard, the ledger and reconciliation, series planning and approvals.',
    tasks: [
      {
        title: 'Pastoral dashboard and reports',
        body: 'Attendance, growth, giving trends and absence signals in one place, with CSV export.',
        saves: 'Saves you building the same spreadsheet every month.',
        screen: 'dashboard',
      },
      {
        title: 'Members and households',
        body: 'Edit profiles, manage households, set visibility and convert guests to members.',
        saves: 'Saves you the paper directory and the phone calls.',
        screen: 'members',
      },
      {
        title: 'Services and series planning',
        body: 'Create recurring services, handle exceptions such as a moved Christmas Eve, generate occurrences.',
        saves: 'Saves you re-creating the same event fifty-two times.',
        screen: 'events',
      },
      {
        title: 'Giving ledger and statements',
        body: 'Record gifts on behalf of members, mark them received, cancel with a reason, issue statements.',
        saves: 'Saves you the year-end scramble.',
        screen: 'ledger',
      },
      {
        title: 'Announcements and approvals',
        body: 'Publish, pin and archive announcements; review posts before they appear in the feed.',
        saves: 'Saves you chasing a stray message.',
        screen: 'approvals',
      },
      {
        title: 'Documents and media library',
        body: 'Bulletins, minutes and policies with versions and expiring share links; albums with consent recorded.',
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
        body: 'Link families, approve alliances, merge duplicates and export the tree.',
        saves: 'Saves you untangling who is related to whom.',
        screen: 'tree',
      },
    ],
  },
  mobile: {
    intro:
      'The same church in every member’s pocket: feed, prayer, RSVP, giving record and serving invites.',
    benefits: [
      {
        title: 'Community feed',
        body: 'Posts, polls and announcements from the church and its groups.',
        icon: 'Newspaper',
      },
      {
        title: 'RSVP and reminders',
        body: 'Say you are coming to a service or event and get reminded.',
        icon: 'CalendarDays',
      },
      {
        title: 'Push notifications',
        body: 'Announcements, roster invites and replies, with per-topic preferences.',
        icon: 'Bell',
      },
      {
        title: 'Giving record and statement',
        body: 'Record a gift you made and see your annual statement.',
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
        title: 'Groups and ministry teams',
        body: 'Join groups, respond to roster invites, serve where you are needed.',
        icon: 'UsersRound',
      },
      {
        title: 'Prayer requests',
        body: 'Share a request with the church or privately with clergy.',
        icon: 'HandHeart',
      },
      {
        title: 'Certificates and documents',
        body: 'Your certificates and the church’s shared documents.',
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
      web: 'Annual giving statement, printable certificates',
      mobile: 'Feed, RSVP, prayer, record a gift, serving invites',
    },
    {
      persona: 'Pastor',
      web: 'Pastoral dashboard, absence signals, certificates',
      mobile: 'Prayer queue, roster responses, quick replies',
    },
    {
      persona: 'Treasurer',
      web: 'Ledger, reconciliation, statements, trends',
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
      title: 'Sunday, from the phone',
      steps: [
        'Reads the announcement about the harvest service in the feed and RSVPs for the family.',
        'Records the offering given at the service by UPI so it appears on the annual statement.',
        'Accepts a roster invite to serve on the welcome team next month.',
      ],
    },
    {
      persona: 'Pastor',
      title: 'Monday, on the web',
      steps: [
        'Opens the dashboard: attendance is up, three members have not attended in ninety days.',
        'Reads the private prayer queue and marks two requests as answered with a note.',
        'Issues a baptism certificate from the template; the family sees it on their phones.',
      ],
    },
    {
      persona: 'Treasurer',
      title: 'Month end, on the web',
      steps: [
        'Filters the ledger by fund and marks the weekend’s gifts as received against bank references.',
        'Cancels a duplicate entry with a reason; the audit log records it.',
        'Exports the giving trend report for the elders’ meeting.',
      ],
    },
  ],
  modules: [
    { key: 'members', label: 'Members and guests' },
    { key: 'families', label: 'Households' },
    { key: 'tree', label: 'Family tree' },
    { key: 'events', label: 'Services and events' },
    { key: 'giving', label: 'Giving' },
    { key: 'community', label: 'Community feed' },
    { key: 'groups', label: 'Groups' },
    { key: 'prayer', label: 'Prayer wall' },
    { key: 'ministry', label: 'Ministries and rosters' },
    { key: 'documents', label: 'Documents' },
    { key: 'media', label: 'Media' },
    { key: 'bookings', label: 'Facilities and bookings' },
    { key: 'announcements', label: 'Announcements' },
    { key: 'certificates', label: 'Certificates' },
    { key: 'hr', label: 'Staff and HR' },
  ],
  familyConnections: {
    title: 'Households and the family tree',
    body: 'Start with households for pastoral care, and grow into a full family tree: generations, marriages between families, godparents and guardians, all with approvals and privacy.',
  },
  privacy: {
    title: 'Private by design',
    body: 'Each member chooses who sees their details. Consent is recorded before photos are shared. Roles limit what staff can see, and every change is in the audit trail.',
  },
  faq: [
    {
      q: 'Does it handle tithes and offerings online?',
      a: 'It records gifts that people make through your church’s own channels, such as UPI, cash or bank transfer, and produces statements. It does not take card or bank details.',
    },
    {
      q: 'Can prayer requests stay private?',
      a: 'Yes. A request can be shared with the church or kept private to clergy, and anyone can post anonymously.',
    },
    {
      q: 'Can we issue baptism and marriage certificates?',
      a: 'Yes. Certificates are created from templates, issued, and revoked if needed, with a numbering integrity report.',
    },
    {
      q: 'Do we need the family tree?',
      a: 'No. Households work on their own. The family tree is an optional service you can enable later.',
    },
  ],
  related: ['mosque', 'temple', 'family-association'],
};
