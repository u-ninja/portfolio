// +91 90743 76257, the number on the résumé. Opens a chat with a first line already typed.
export const WHATSAPP_URL = 'https://wa.me/919074376257?text=' + encodeURIComponent('Hi Ullas, I saw your portfolio.');

/** A chat bubble in the site's own line style: square corners, and a receiver drawn like the logo's connector with two nodes. */
export function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.75 3.75h16.5v13.5H10.5l-5 4v-4H3.75z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8.5v1a5 5 0 0 0 5 5h1" stroke="var(--color-signal-soft)" strokeWidth="1.5" />
      <rect x="7.75" y="6.5" width="2.5" height="2.5" fill="var(--color-signal-soft)" />
      <rect x="14.5" y="13.25" width="2.5" height="2.5" fill="var(--color-signal-soft)" />
    </svg>
  );
}
