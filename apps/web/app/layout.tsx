import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import type { ReactNode } from "react";

import { AppToaster } from "@/components/app-toaster";

import "./globals.css";

const bodyFont = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body"
});

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "DynEcho",
  description: "Web-first acoustic product shell with a portable engine boundary.",
  icons: {
    icon: "/icon.svg"
  }
};

const themeScript = `(function(){try{var t=localStorage.getItem("dynecho-theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}else if(matchMedia("(prefers-color-scheme:dark)").matches){document.documentElement.setAttribute("data-theme","dark")}else{document.documentElement.setAttribute("data-theme","light")}}catch(e){document.documentElement.setAttribute("data-theme","light")}})()`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${bodyFont.variable} ${displayFont.variable} font-body text-[color:var(--ink)] antialiased`}>
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
