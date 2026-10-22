import { useTranslations } from 'next-intl';
import { PhoneFrame } from './DeviceFrames';
import { PhoneScreen } from './PhoneScreens';
import { WebScreen } from './WebScreens';

/** Home page scene: one laptop with the web dashboard and one phone with the feed, overlapping, in sync. */
export function DevicePair() {
  const t = useTranslations('marketing.home');
  return (
    <div className="relative md:flex md:items-start">
      <div className="flex flex-col gap-5 md:w-9/12">
        <div>
          <div className="rounded-t-lg bg-text p-3 vm-elevated-3">
            <div className="overflow-hidden rounded-sm bg-bg">
              <WebScreen kind="dashboard" />
            </div>
          </div>
          <div aria-hidden className="-mx-6 h-3 rounded-b-lg bg-border" />
        </div>
        <div>
          <h3 className="text-h3 font-semibold">{t('syncWebTitle')}</h3>
          <p className="mt-1 text-small text-text-muted">{t('syncWebBody')}</p>
        </div>
      </div>
      <div className="relative mt-7 flex flex-col gap-5 md:-ms-14 md:mt-12 md:w-3/12">
        <PhoneFrame label={t('syncPhoneCaption')}>
          <PhoneScreen kind="feed" />
        </PhoneFrame>
        <div>
          <h3 className="text-h3 font-semibold">{t('syncPhoneTitle')}</h3>
          <p className="mt-1 text-small text-text-muted">{t('syncPhoneBody')}</p>
        </div>
      </div>
      <span className="absolute start-1/3 top-0 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-surface-raised px-4 py-2 text-small font-semibold vm-elevated-2 md:inline-flex">
        <span aria-hidden className="size-2 rounded-full bg-success" />
        {t('syncBadge')}
      </span>
    </div>
  );
}
