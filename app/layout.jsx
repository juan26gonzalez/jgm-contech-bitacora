import './globals.css';

export const metadata = {
  title: 'JGM ConTech | Bitácora de Obra',
  description: 'Control de Obra y Captura en Campo • Ing. Juan González • Conectado a Supabase y BIM 5D/4D',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-100 flex flex-col justify-between">
        {children}
      </body>
    </html>
  );
}
