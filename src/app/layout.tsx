import type { Metadata } from "next";
import { Inter, Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({  subsets: ["latin"], weight: ["100", "200", "300","400", "500", "600","700", "800", "900"]})

export const metadata: Metadata = {
  title: {
    default: "IRCTC Ticket Assistant - Smart Booking Calculator",
    template: "%s | IRCTC Ticket Assistant",
  },
  description: "Calculate precise Tatkal and General booking dates, check PNR status, and track live train status. Your smart railway companion for Indian Railways.",
  keywords: ["IRCTC", "Indian Railways", "Tatkal Booking", "Booking Calculator", "PNR Status", "Train Status", "Railway Enquiry", "Ticket Booking"],
  authors: [{ name: "AsthriX" }],
  creator: "AsthriX",
  publisher: "AsthriX",
  metadataBase: new URL('https://irctc-ticket-assistant.vercel.app'), // Replace with actual domain
  openGraph: {
    title: "IRCTC Ticket Assistant - Smart Booking Calculator",
    description: "Never miss a booking window again. Calculate opening dates, check PNR, and track trains.",
    url: 'https://irctc-ticket-assistant.vercel.app',
    siteName: 'IRCTC Ticket Assistant',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "IRCTC Ticket Assistant",
    description: "Smart booking calculator for Indian Railways. Tatkal & General dates, PNR, and more.",
    creator: "@asthrix", // Replace if applicable
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={montserrat.className}>
        <Providers>
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
