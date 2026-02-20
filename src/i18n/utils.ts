import nl from './nl.json';
import en from './en.json';

const translations = { nl, en } as const;
type Locale = keyof typeof translations;

/**
 * Get a translated string by dot-notation key.
 * Returns the key itself if no translation is found.
 *
 * @example t('nl', 'nav.home') // "Home"
 * @example t('en', 'bruidstaarten.hero.title') // "Custom Wedding Cakes"
 */
export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  for (const k of keys) {
    value = value?.[k];
  }
  return typeof value === 'string' ? value : key;
}

/**
 * Get the full translation object for a given locale and key.
 * Useful for accessing arrays or nested objects.
 *
 * @example tObject('nl', 'bruidstaarten.faq.items') // FAQ items array
 */
export function tObject(locale: Locale, key: string): any {
  const keys = key.split('.');
  let value: any = translations[locale];
  for (const k of keys) {
    value = value?.[k];
  }
  return value ?? undefined;
}

/**
 * Extract the locale from the current URL pathname.
 * Defaults to 'nl' if no valid locale prefix is found.
 */
export function getLocaleFromUrl(url: URL): Locale {
  const [, locale] = url.pathname.split('/');
  if (locale === 'en') return 'en';
  return 'nl';
}

/**
 * Generate a localized path by prepending the locale prefix.
 *
 * @example getLocalizedPath('/contact', 'en') // "/en/contact"
 * @example getLocalizedPath('/bruidstaarten', 'nl') // "/nl/bruidstaarten"
 */
export function getLocalizedPath(path: string, locale: Locale): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`;
}

/**
 * Get the alternate locale (for language switcher).
 */
export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'nl' ? 'en' : 'nl';
}

/**
 * Map of Dutch page slugs to English equivalents for the language switcher.
 */
export const pageSlugMap: Record<string, string> = {
  bruidstaarten: 'wedding-cakes',
  'zakelijke-patisserie': 'corporate-patisserie',
  vijfheeren: 'vijf-heeren',
  over: 'about',
  contact: 'contact',
};

/**
 * Reverse map: English slugs to Dutch.
 */
export const reversePageSlugMap: Record<string, string> = Object.fromEntries(
  Object.entries(pageSlugMap).map(([nl, en]) => [en, nl])
);

export const locales: Locale[] = ['nl', 'en'];
export const defaultLocale: Locale = 'nl';
export type { Locale };
