import './globals.css';

export const metadata = {
  title: 'ReuSource / ByLink - B2B Industrial Biomass Supply Chain Network',
  description:
    'Platform Agregasi Limbah Kayu & Biomassa Industri Terdesentralisasi B2B Berbasis Spasial & Standar Mutu Berkelanjutan.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
          async
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

