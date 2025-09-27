import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import I18nProvider from "../../lib/i18n-provider";

const ibm = IBM_Plex_Sans_Thai({
  weight: ["400", "700"],
  subsets: ["latin", "thai"],
  variable: "--font-ibm",
});

export const metadata: Metadata = {
  title: "Blog",
  description: "Sample blog website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibm.className}  antialiased`}>
        <I18nProvider>
          <div className="w-full h-[7svh]">
            <Navbar />
          </div>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
