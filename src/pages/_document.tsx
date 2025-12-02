// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon/Logo Meta Tags */}
        <link rel="icon" href="/logos/nethra_logo_nobg.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/logos/nethra_logo_nobg.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/logos/nethra_logo_nobg.png" sizes="180x180" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Nethra" />
        <meta property="og:description" content="Trusted Eye Care, When You Need It Most" />
        <meta property="og:image" content="https://www.nethra.app/logos/nethra_logo_nobg.png" />
        <meta property="og:url" content="https://www.nethra.app" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nethra" />
        <meta name="twitter:description" content="Trusted Eye Care, When You Need It Most" />
        <meta name="twitter:image" content="https://www.nethra.app/logos/nethra_logo_nobg.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}