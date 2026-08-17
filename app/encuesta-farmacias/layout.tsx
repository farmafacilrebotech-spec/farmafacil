import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://farmafacil.solutions'),

  title: 'Encuesta farmacias — FarmaFácil',

  description:
    'Tu experiencia nos ayuda a construir soluciones que respondan a la realidad de las farmacias. Participa en 5-7 minutos.',

  openGraph: {
    title: 'Encuesta farmacias — FarmaFácil',

    description:
      'Tu experiencia nos ayuda a construir soluciones que respondan a la realidad de las farmacias. Participa en 5-7 minutos.',

    url: '/encuesta-farmacias',

    siteName: 'FarmaFácil',

    locale: 'es_ES',

    type: 'website',

    images: [
      {
        url: '/images/og/encuesta-farmacias.jpg',
        width: 1200,
        height: 630,
        alt: 'Encuesta FarmaFácil para titulares y cotitulares de farmacia',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title: 'Encuesta farmacias — FarmaFácil',

    description:
      'Tu experiencia nos ayuda a construir soluciones que respondan a la realidad de las farmacias.',

    images: ['/images/og/encuesta-farmacias.jpg'],
  },
};

export default function EncuestaFarmaciasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}