import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TrackFin",
  description: "AI Finance Tracker",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker
                    .register('/sw.js')
                    .then(function (reg) {
                      console.log('[SW] Registered. Scope:', reg.scope);
                    })
                    .catch(function (err) {
                      console.error('[SW] Registration failed:', err);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`h-full ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen w-full">{children}</div>
      </body>
    </html>
  );
}
