import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

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
      <body className={nunito.variable}>
        <Navbar />
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
