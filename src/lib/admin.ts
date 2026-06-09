// Operator/admin emails — may view any business via the switcher.
// Mirror of ADMIN_EMAILS in the backend (server.js).
export const ADMIN_EMAILS = ['larsbeurskens@gmail.com', 'lars@pulperiastudio.com'];

export function isAdminEmail(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}
