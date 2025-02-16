import type {Metadata} from "next";
import {Analytics} from "@vercel/analytics/react"
import {Poppins} from "next/font/google";
import "../styles/globals.css";
import {cn} from "@/lib/utils";

const poppins = Poppins({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: "--font-poppins",
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
            className={cn(`${poppins.variable} antialiased`, "bg-[url('../public/background.png')] bg-no-repeat bg-contain bg-right bg-fixed")}
        >
        {children}
        <Analytics/>
        </body>
        </html>
    );
}
