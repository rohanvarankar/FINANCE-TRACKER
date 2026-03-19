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
  title: "FinTrack — Personal Finance Tracker",
  description: "Track income & expenses, set budgets, plan goals and visualize your financial future. Free personal finance app.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`
          h-full ${geistSans.variable} ${geistMono.variable} 
          antialiased
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
