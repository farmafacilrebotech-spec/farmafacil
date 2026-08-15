import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from "next/script";
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';

const inter = localFont({
  src: [
    {
      path: '../public/fonts/inter/Inter-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/inter/Inter-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FarmaFácil — Digitaliza tu farmacia sin complicaciones',
  description:
    'Reduce colas, automatiza pedidos y mejora la atención con catálogo por QR, kiosko en tienda y asistente. Solicita demo gratuita.',

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo/apple-touch-icon.png',
  },

  openGraph: {
    title: 'FarmaFácil — Digitaliza tu farmacia sin complicaciones',
    description:
      'Reduce colas, automatiza pedidos y mejora la atención con catálogo por QR, kiosko en tienda y asistente.',
    url: 'https://farmafacil.solutions',
    siteName: 'FarmaFácil',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/logo/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FarmaFácil',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'FarmaFácil',
    description:
      'Reduce colas, automatiza pedidos y mejora la atención.',
    images: ['/logo/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        
        {/* GA4: carga */}
        <Script 
          async 
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} 
        />

        {/* GA4: inicialización */}
        <Script
          id="ga-init"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        <CartProvider>
          {children}
        </CartProvider>
        <Toaster />
      </body>
    </html>
  );
}
