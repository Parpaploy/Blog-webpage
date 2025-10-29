import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import I18nProvider from "../../lib/i18n-provider";
import Sidebar from "@/components/sidebar/sidebar";
import { SidebarProvider } from "../../hooks/sidebar";
import { ToggleProvider } from "../../hooks/toggle";
import { SocketProvider } from "../../lib/socketContext";

const ibm = IBM_Plex_Sans_Thai({
  weight: ["400", "700"],
  subsets: ["latin", "thai"],
  variable: "--font-ibm",
});

export const metadata: Metadata = {
  title: "Kintsugi",
  description: "Sample blog website",
  icons: {
    icon: [
      {
        url: "/icon-light.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibm.className} antialiased bg-fixed`}
        style={{
          backgroundImage:
            "url('/assets/placeholders/Chihiro Spirited Away.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <SocketProvider>
          <I18nProvider>
            <SidebarProvider>
              <ToggleProvider>
                <div className="w-full h-full flex">
                  <Sidebar />

                  <div className="w-full h-full">
                    <Navbar />

                    {/* Page */}
                    <div className="w-full h-screen max-w-[1920px] pr-8 mx-auto">
                      {children}
                    </div>
                  </div>
                </div>
              </ToggleProvider>
            </SidebarProvider>
          </I18nProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
