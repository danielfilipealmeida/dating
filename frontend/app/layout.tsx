import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {AppDataProvider} from "./context/appData";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dating App",
  description: "A bare-bones dating application created as exercise on Next.JS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppDataProvider>
          {children}
        </AppDataProvider>
      </body>
    </html>
  );
}
