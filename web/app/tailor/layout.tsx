import type { Metadata } from 'next';
import './cv.css';

// Private tool: not linked from anywhere and kept out of search engines. The API behind it needs the password.
export const metadata: Metadata = { title: 'Tailor', robots: { index: false, follow: false } };

export default function TailorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
