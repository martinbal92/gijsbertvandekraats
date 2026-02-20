import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;

  // Skip if already has a locale prefix or is a static asset
  if (pathname.startsWith('/nl') || pathname.startsWith('/en') || pathname.includes('.')) {
    return next();
  }

  // Detect preferred language from browser Accept-Language header
  const acceptLang = context.request.headers.get('accept-language') || '';
  const preferredLocale = acceptLang.toLowerCase().startsWith('en') ? 'en' : 'nl';

  // Redirect to the localized version of the requested path
  const redirectPath = pathname === '/' ? '' : pathname;
  return context.redirect(`/${preferredLocale}${redirectPath}`, 302);
});
