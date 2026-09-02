import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WH3 Diplomacy — Préparez votre alliance',
  description: 'Comparez les affinités diplomatiques de départ dans Total War: WARHAMMER III.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
