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
  title: "Personal Expense Tracker",
  description: "Track your expenses smartly",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`
          h-full ${geistSans.variable} ${geistMono.variable} 
          antialiased bg-gradient-to-br from-[#e8fffb] via-white to-[#d0fff5]
        `}
      >
        {/* GLOBAL WRAPPER FOR PROPER SIDEBAR + PAGE STRUCTURE */}
        <div className="min-h-screen w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
