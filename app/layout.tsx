import type {Metadata} from "next";
import { Analytics } from "@vercel/analytics/react"
import {Geist, Geist_Mono} from "next/font/google";
import "../styles/globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "URBH Nominations",
    description: "Referee nominations for URBH matches",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <link rel="icon" href="/urbh_logo.png" sizes="any"/>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        {children}
        <Analytics/>
        </body>
        </html>
    );
}
