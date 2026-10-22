import { CommunitiesScreen } from './phone/CommunitiesScreen';
import { EventScreen } from './phone/EventScreen';
import { FamilyScreen } from './phone/FamilyScreen';
import { FeedScreen } from './phone/FeedScreen';
import { GivingScreen } from './phone/GivingScreen';
import { PHONE_DESIGN } from './phone/Shell';
import { PrivacyScreen } from './phone/PrivacyScreen';
import { Scaled } from './Scaled';
import { ServingScreen } from './phone/ServingScreen';

export type PhoneScreenKind =
  'feed' | 'event' | 'giving' | 'family' | 'serving' | 'privacy' | 'communities';

const SCREENS: Record<PhoneScreenKind, () => React.JSX.Element> = {
  feed: FeedScreen,
  event: EventScreen,
  giving: GivingScreen,
  family: FamilyScreen,
  serving: ServingScreen,
  privacy: PrivacyScreen,
  communities: CommunitiesScreen,
};

/** An illustrative phone screen: a full app layout at 390 x 844, scaled to fit its frame. */
export function PhoneScreen({ kind }: { kind: PhoneScreenKind }) {
  const Screen = SCREENS[kind];
  return (
    <Scaled designWidth={PHONE_DESIGN.w} designHeight={PHONE_DESIGN.h} initialScale={0.74}>
      <Screen />
    </Scaled>
  );
}
