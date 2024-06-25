import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "600", "900"] });

export const metadata: Metadata = {
  title: "Lucio Gastellu",
  description: "Lucio Gastellu professional portfolio",
  keywords: ['Professional', 'Web', 'Development', 'UI', 'Data', 'Dev', 'Frontend', 'Backend', 'Software', 'System', 'Databases']
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${poppins.className} bg-[#191919]`}>{children}</body>
    </html>
  );
}
