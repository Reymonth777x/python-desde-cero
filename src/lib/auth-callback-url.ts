const LOCAL_AUTH_ORIGIN = 'http://localhost:3000';

function isLoopback(hostname: string) {
  const normalized = hostname.replace(/^\[|\]$/g, '').toLowerCase();

  return (
    normalized === 'localhost' ||
    normalized.endsWith('.localhost') ||
    normalized === '127.0.0.1' ||
    normalized === '::1' ||
    normalized === '0.0.0.0'
  );
}

export function resolveAuthCallbackUrl(
  configuredSiteUrl: string | undefined,
  isProduction: boolean,
  flow: 'signup' | 'password-reset' = 'signup',
): string | null {
  const candidate = configuredSiteUrl?.trim() ||
    (isProduction ? '' : LOCAL_AUTH_ORIGIN);

  if (!candidate) return null;

  try {
    const siteUrl = new URL(candidate);

    if (
      siteUrl.username ||
      siteUrl.password ||
      siteUrl.search ||
      siteUrl.hash ||
      siteUrl.pathname !== '/'
    ) {
      return null;
    }

    if (isProduction) {
      if (siteUrl.protocol !== 'https:' || isLoopback(siteUrl.hostname)) {
        return null;
      }
    } else if (
      siteUrl.protocol !== 'https:' &&
      !(siteUrl.protocol === 'http:' && isLoopback(siteUrl.hostname))
    ) {
      return null;
    }

    const callbackUrl = new URL('/auth/callback', siteUrl.origin);

    if (flow === 'password-reset') {
      callbackUrl.searchParams.set('flow', flow);
    }

    return callbackUrl.toString();
  } catch {
    return null;
  }
}
