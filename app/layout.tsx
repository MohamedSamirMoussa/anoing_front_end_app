import React from "react";
import type { Metadata } from "next";
import { Orbitron, Roboto } from "next/font/google";
import ClientProvider from "./libs/redux/ClientProvider";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./globals.css";
import Loading from "./Components/Loading/Loading";

const Navbar = React.lazy(() => import("./Components/Navbar/Navbar"));
const Footer = React.lazy(() => import("./Components/Footer/Footer"));
const SnowBackground = React.lazy(() => import("./Components/SnowBackground/SnowBackground"));
const Donate = React.lazy(() => import("./Components/Donate/Donate"));

const clientId = process.env.NEXT_PUNLIC_GOOGLE_CLIENT_ID as string;

export const OrbitronFont = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const RobotoFont = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anoing",
  description: "Anoing app website is here.",
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
                <React.Suspense fallback={null}>
                  <SnowBackground />
                  <Navbar />
                  <Donate />
                </React.Suspense>

                <main className="min-h-screen">
                  {children}
                </main>

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
                      border: "1px solid rgba(255,255,255,0.1)"
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