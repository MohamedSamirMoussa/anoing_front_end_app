import React from "react";
import type { Metadata } from "next";
import { Orbitron, Roboto } from "next/font/google";
import ClientProvider from "./libs/redux/ClientProvider";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./globals.css";
import Loading from "./Loading/page";
const Navbar = React.lazy(() => import("./Components/Navbar/Navbar"));
const Footer = React.lazy(() => import("./Components/Footer/Footer"));
const SnowBackground = React.lazy(
  () => import("./Components/SnowBackground/SnowBackground"),
);
const Donate = React.lazy(() => import("./Components/Donate/Donate"));

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

console.log(clientId);


export const OrbitronFont = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const RobotoFont = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata:Metadata = {
  title: 'Anoing - Minecraft Server',
  description: 'Play on our amazing Minecraft server with friends!',
  keywords: 'minecraft, server, gaming, community',
  openGraph: {
    title: 'Anoing Minecraft Server',
    description: 'Join our Minecraft community today!',
    url: 'https://anoing-app.vercel.app',
    siteName: 'Anoing',
    images: [
      {
        url: 'https://anoing-app.vercel.app/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
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
        suppressHydrationWarning={true}
        className={`${OrbitronFont.variable} ${RobotoFont.variable} antialiased relative bg-[#050505]`}
      >

          <ClientProvider>
            <GoogleOAuthProvider clientId={clientId}>
              <div className="z-10 relative all">
                <React.Suspense fallback={<Loading />}>
                  <SnowBackground />
                  <Navbar />
                  <Donate />
                </React.Suspense>

                <main className="min-h-screen">{children}</main>

                <React.Suspense fallback={null}>
                  <Footer />
                </React.Suspense>

                <Toaster
                  position="bottom-right"
                  reverseOrder={true}
                  toastOptions={{
                    style: {
                      background: "#1f2937",
                      color: "#fff",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.1)",
                    },
                  }}
                />
              </div>
            </GoogleOAuthProvider>
          </ClientProvider>

      </body>
    </html>
  );
}
