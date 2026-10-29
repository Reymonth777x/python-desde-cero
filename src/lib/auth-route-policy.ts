export function isGuestOnlyAuthPage(pathname: string): boolean {
  return pathname === '/login' || pathname === '/login/forgot-password';
}
