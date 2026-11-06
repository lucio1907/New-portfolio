import type { Metadata } from "next";
import { DM_Mono, Schibsted_Grotesk } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import MotionFlag from "@/features/portfolio/motion/MotionFlag";
import "./globals.css";
import Script from "next/script";

const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-sans",
});

/** Only for the receipt in the POS chapter, where monospace is what it is. */
const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  preload: false,
});

/**
 * Marks the page before it paints when scroll scenes will run, so the tall
 * scroll tracks they need are there from the start and nothing jumps. Without
 * JavaScript or with reduced motion, every section stays in normal flow.
 */
const MOTION_FLAG = `if(matchMedia("(prefers-reduced-motion: no-preference)").matches)document.documentElement.classList.add("motion")`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t.raw("keywords") as string[],
    alternates: {
      languages: {
        es: "/es",
        en: "/en",
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_FLAG }} />
        <link rel="shortcut icon" href="MeMemoji.webp" type="image/x-icon" />
        {/* Google Analytics */}
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-XKW12ZSZDJ"
        ></Script>
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XKW12ZSZDJ');
          `}
        </Script>
      </head>
      <body className={`${sans.variable} ${mono.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <MotionFlag />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
