import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Encuesta farmacias — FarmaFácil',
  description:
    'Tu experiencia puede ayudarnos a construir una solución pensada desde la realidad de las farmacias. Participa en 5-7 minutos.',

  openGraph: {
    title: 'Encuesta farmacias — FarmaFácil',
    description:
      'Tu experiencia puede ayudarnos a construir una solución pensada desde la realidad de las farmacias. Participa en 5-7 minutos.',
    url: 'https://farmafacil.solutions/encuesta-farmacias',
    siteName: 'FarmaFácil',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: 'https://farmafacil.solutions/encuesta-farmacias/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Encuesta FarmaFácil para titulares de farmacia',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Encuesta farmacias — FarmaFácil',
    description:
      'Tu experiencia puede ayudarnos a construir una solución pensada desde la realidad de las farmacias.',
    images: [
      'https://farmafacil.solutions/encuesta-farmacias/opengraph-image.jpg',
    ],
  },
};

export default function EncuestaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}