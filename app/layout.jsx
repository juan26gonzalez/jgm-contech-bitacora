import './globals.css';
import Providers from '../components/Providers';

export const metadata = {
  title: 'JGM ConTech | Bitácora de Obra & Field Ops',
  description: 'Control de Obra, Calidad y Captura en Campo ISO 19650 • Conectado a Supabase y BIM 4D/5D',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'JGM ConTech',
  },
};

export const viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-[#cbd5e1] text-slate-900 flex flex-col justify-between">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
