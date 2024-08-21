import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "600", "900"] });

export const metadata: Metadata = {
  title: "Lucio Gastellu",
  description: "Lucio Gastellu professional portfolio",
  keywords: [
    "Professional",
    "Web",
    "Development",
    "UI",
    "Data",
    "Dev",
    "Frontend",
    "Backend",
    "Software",
    "System",
    "Databases",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="shortcut icon" href="MeMemoji.webp" type="image/x-icon" />
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XKW12ZSZDJ"
        ></Script>
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XKW12ZSZDJ');
          `}
        </Script>
      </head>
      <body className={`${poppins.className} bg-[#191919] scroll-smooth`}>
        {children}
      </body>
    </html>
  );
}
