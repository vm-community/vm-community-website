import { getRequestConfig } from 'next-intl/server';
import { DEFAULT_LOCALE, loadMessages } from './config';

export default getRequestConfig(async () => {
  const locale = DEFAULT_LOCALE;
  return { locale, messages: await loadMessages(locale), timeZone: 'UTC' };
});
