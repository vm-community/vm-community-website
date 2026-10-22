import type { VerticalContent } from '../types';

export const club: VerticalContent = {
  key: 'club',
  slug: 'clubs',
  noun: 'club',
  nounPlural: 'clubs',
  title: 'VibeMind for clubs',
  metaDescription:
    'Memberships and dues, sessions and fixtures, squads and committees, facility bookings, polls and sponsor funds for your sports, social or hobby club.',
  hero: {
    headline: 'Run your club without the spreadsheets.',
    sub: 'Track memberships and dues, schedule sessions and fixtures, pick squads and book the courts. Officers work on the web; every member has the club in their pocket.',
    illustration: 'fixtures',
  },
  benefits: [
    {
      title: 'Memberships and dues',
      body: 'Membership types and status in one directory. Dues paid through your own channels are recorded and reconciled, with statements for each member.',
      icon: 'HandCoins',
      module: 'giving',
    },
    {
      title: 'Sessions and fixtures',
      body: 'Weekly sessions as recurring series, one-off fixtures with RSVP and capacity, and attendance and check-in on the day.',
      icon: 'CalendarDays',
      module: 'events',
    },
    {
      title: 'Squads and committees',
      body: 'Squads with rosters for each fixture and committees with clear roles. Players accept or decline from their phone; captains see gaps early.',
      icon: 'Trophy',
      module: 'ministry',
    },
    {
      title: 'Facility bookings',
      body: 'Courts, pitches and rooms with availability and approval, so two teams never turn up for the same slot.',
      icon: 'Building2',
      module: 'bookings',
    },
    {
      title: 'Club feed and polls',
      body: 'Posts, polls and reactions for team selection, kit orders and social nights, instead of a noisy group chat.',
      icon: 'Newspaper',
      module: 'community',
    },
    {
      title: 'Sponsors and funds',
      body: 'Funds for kit, tournaments and sponsor contributions, with a clear record of what came in and what it was for.',
      icon: 'Star',
      module: 'giving',
    },
  ],
  web: {
    intro:
      'Officers, coaches and treasurers run the club from a desk: the dashboard, the dues ledger, session planning and booking approvals.',
    tasks: [
      {
        title: 'Dashboard and reports',
        body: 'Attendance, membership numbers and dues status in one place, with CSV export for committee meetings.',
        saves: 'Saves you building the same spreadsheet every month.',
        screen: 'dashboard',
      },
      {
        title: 'Members and membership types',
        body: 'Edit profiles, set membership types and status, manage visibility and welcome new joiners.',
        saves: 'Saves you the paper register and the phone calls.',
        screen: 'members',
      },
      {
        title: 'Sessions and fixtures',
        body: 'Create recurring sessions, handle exceptions such as a rained-off week, and open fixtures with RSVP and capacity.',
        saves: 'Saves you re-creating the same session every week.',
        screen: 'events',
      },
      {
        title: 'Dues ledger and statements',
        body: 'Record dues on behalf of members, mark them received, cancel with a reason, and issue statements.',
        saves: 'Saves you chasing who has paid.',
        screen: 'ledger',
      },
      {
        title: 'Booking approvals and moderation',
        body: 'Approve or decline court and room requests with a reason, and review posts before they appear in the feed.',
        saves: 'Saves you double-booked courts.',
        screen: 'approvals',
      },
      {
        title: 'Documents and media library',
        body: 'Constitution, minutes and fixtures lists with versions and expiring share links; match albums with consent recorded.',
        saves: 'Saves you hunting through email attachments.',
        screen: 'documents',
      },
      {
        title: 'Roles and audit trail',
        body: 'Give each officer exactly the access they need and see who changed what.',
        saves: 'Saves you guessing after the fact.',
        screen: 'roles',
      },
      {
        title: 'Membership cards and certificates',
        body: 'Issue membership cards and award certificates from templates, and keep the register in one place.',
        saves: 'Saves you designing a card every season.',
        screen: 'documents',
      },
    ],
  },
  mobile: {
    intro:
      'The same club in every member’s pocket: feed, session RSVP, dues record and squad invites.',
    benefits: [
      {
        title: 'Club feed and polls',
        body: 'Posts, polls and announcements from the club and its squads.',
        icon: 'Newspaper',
      },
      {
        title: 'RSVP and reminders',
        body: 'Say you are playing or coming along and get reminded before the session.',
        icon: 'CalendarDays',
      },
      {
        title: 'Push notifications',
        body: 'Announcements, squad invites and replies, with per-topic preferences.',
        icon: 'Bell',
      },
      {
        title: 'Dues record and statement',
        body: 'Record a payment you made and see your statement.',
        icon: 'HandCoins',
      },
      {
        title: 'Directory, with privacy',
        body: 'Find fellow members according to the visibility they chose.',
        icon: 'Users',
      },
      {
        title: 'Squads and committees',
        body: 'Join squads, respond to selection invites and see your fixtures.',
        icon: 'Trophy',
      },
      {
        title: 'Groups',
        body: 'Join social groups and interest groups with their own feed.',
        icon: 'UsersRound',
      },
      {
        title: 'Facility bookings',
        body: 'Request a court or room and see when it is approved.',
        icon: 'Building2',
      },
      {
        title: 'Membership card and documents',
        body: 'Your membership card and the club’s shared documents.',
        icon: 'FileText',
      },
      {
        title: 'Dark mode and several communities',
        body: 'Light or dark, and switch between the clubs you belong to.',
        icon: 'Sparkles',
      },
    ],
    screens: ['feed', 'event', 'giving'],
  },
  glance: [
    {
      persona: 'Member',
      web: 'Dues statement, printable membership card',
      mobile: 'Feed, polls, RSVP, record a payment, squad invites',
    },
    {
      persona: 'Coach',
      web: 'Session planning, squad rosters, attendance',
      mobile: 'Squad responses, post to the squad, check-in',
    },
    {
      persona: 'Treasurer',
      web: 'Dues ledger, reconciliation, statements, trends',
      mobile: 'Mark a payment received, check a fund',
    },
    {
      persona: 'Administrator',
      web: 'Roles, settings, approvals, audit log, series',
      mobile: 'Approve a booking, pin an announcement',
    },
  ],
  scenarios: [
    {
      persona: 'Member',
      title: 'Match week, from the phone',
      steps: [
        'Votes in the poll for Saturday’s kick-off time and RSVPs for the fixture.',
        'Records the season dues paid by UPI so they appear on the statement.',
        'Accepts a squad invite for the weekend fixture.',
      ],
    },
    {
      persona: 'Coach',
      title: 'Monday, on the web',
      steps: [
        'Opens the dashboard and sees attendance at the last three sessions.',
        'Fills the Saturday squad roster and sends invites; replies come back to the phone.',
        'Requests the second court for Thursday’s session; the booking is approved by the secretary.',
      ],
    },
    {
      persona: 'Treasurer',
      title: 'Month end, on the web',
      steps: [
        'Filters the ledger by fund and marks the month’s dues as received against bank references.',
        'Cancels a duplicate entry with a reason; the audit log records it.',
        'Exports the dues report for the committee meeting.',
      ],
    },
  ],
  modules: [
    { key: 'members', label: 'Members and guests' },
    { key: 'events', label: 'Sessions and fixtures' },
    { key: 'giving', label: 'Dues and funds' },
    { key: 'community', label: 'Club feed and polls' },
    { key: 'groups', label: 'Groups' },
    { key: 'ministry', label: 'Squads and rosters' },
    { key: 'documents', label: 'Documents' },
    { key: 'media', label: 'Media' },
    { key: 'bookings', label: 'Facilities and bookings' },
    { key: 'announcements', label: 'Announcements' },
    { key: 'certificates', label: 'Membership cards and certificates' },
    { key: 'families', label: 'Households', optional: true },
    { key: 'tree', label: 'Family tree', optional: true },
    { key: 'hr', label: 'Staff and HR', optional: true },
  ],
  privacy: {
    title: 'Private by design',
    body: 'Each member chooses who sees their details. Consent is recorded before photos are shared. Roles limit what officers and staff can see, and every change is in the audit trail.',
  },
  faq: [
    {
      q: 'Can members pay their dues in the app?',
      a: 'It records dues that people pay through your club’s own channels, such as UPI, cash or bank transfer, and produces statements. It does not take card or bank details.',
    },
    {
      q: 'Can we run sessions and fixtures?',
      a: 'Yes. Sessions are recurring events, fixtures are one-off events, both with RSVP, capacity, attendance and check-in.',
    },
    {
      q: 'Can we book courts and rooms?',
      a: 'Yes. Members request a slot, conflicts are flagged, and a manager approves or declines with a reason.',
    },
    {
      q: 'Can we issue membership cards?',
      a: 'Yes. Cards and certificates are created from templates and issued to members, and can be revoked if needed.',
    },
  ],
  related: ['alumni', 'society', 'charity'],
};
