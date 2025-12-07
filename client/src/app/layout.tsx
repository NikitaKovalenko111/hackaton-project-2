import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/libs/providers/query-provider";
import { Header } from "@/libs/view/header/header";
import { Toaster as HotToaster } from "react-hot-toast";
import { RoleProvider } from "@/libs/providers/ability-provider";
import { Notifications } from "@/libs/view/notifications/notifications";
import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "@/libs/providers/store-provider";
import { RequestNotifications } from "@/libs/view/notifications/request-notifications";
import { SocketProvider } from "@/libs/hooks/useSocket";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/libs/view/siderbar/sidebar";
import { Suspense } from "react";
import Loading from "./loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "APC - Assessment of Professional Competence",
  description: "Платформа для оценки профессиональных компетенций",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="ru"
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <QueryProvider>
            <RoleProvider>
              <SocketProvider>
                <SidebarProvider>
                    {children}
                    <Notifications />
                    <RequestNotifications />
                </SidebarProvider>
              </SocketProvider>
            </RoleProvider>
          </QueryProvider>
        </StoreProvider>
        <HotToaster />
        <Toaster />
      </body>
    </html>
  );
}
