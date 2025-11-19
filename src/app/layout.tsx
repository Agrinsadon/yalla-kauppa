import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "Yalla Kauppa - Parhaat ruoat ja tuoreimmat tuotteet",
  description: "Yalla on moderni ruokakauppa, joka tuo sinulle laadukkaita tuotteita jokapäiväiseen käyttöön.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi">
      <body>
        <Navbar />
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
