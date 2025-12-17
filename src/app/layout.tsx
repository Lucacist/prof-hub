import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
// 1. Import de Clerk
import { ClerkProvider } from '@clerk/nextjs'
import { frFR } from '@clerk/localizations' // Optionnel : pour avoir le login en français

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prof Hub",
  description: "Gestion de devoirs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. On enveloppe tout le HTML avec ClerkProvider
    <ClerkProvider localization={frFR}>
      <html lang="fr">
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}