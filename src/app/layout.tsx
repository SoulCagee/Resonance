import type { Metadata } from "next";
// import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from 'nuqs/adapters/next/app' 
import { Toaster } from "sonner";
import { ClerkProvider} from '@clerk/nextjs'
import { TRPCReactProvider } from "@/trpc/client";
import localFont from 'next/font/local'

// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
//   display: 'swap',
//   adjustFontFallback: false,
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const geistSans = localFont({
  src: '../fonts/Geist[wght].woff2',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: '../fonts/GeistMono[wght].woff2',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: {
    default : 'Resonance' ,
    template : '%s | Resonance'  
  },
  description: "AI-powered text-to-speech and voice cloning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <NuqsAdapter>
            {children}
            </NuqsAdapter>
            <Toaster />
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
