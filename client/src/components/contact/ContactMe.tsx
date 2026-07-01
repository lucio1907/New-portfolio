import React from "react";
import { useTranslations } from "next-intl";
import SectionHeader from "@/components/common/SectionHeader";
import { FadeIn } from "@/components/motion/Reveal";

const contactRows = [
  { key: "phone", href: "tel:+543329402087", value: "+54 3329 402087" },
  {
    key: "github",
    href: "https://github.com/lucio1907",
    value: "@lucio1907 ↗",
  },
  {
    key: "linkedin",
    href: "https://www.linkedin.com/in/luciogastellu/",
    value: "luciogastellu ↗",
  },
  {
    key: "twitter",
    href: "https://x.com/Lu_Gastellu",
    value: "@Lu_Gastellu ↗",
  },
] as const;

const ContactMe = (): React.ReactElement => {
  const t = useTranslations("contact");

  return (
    <section
      id="contacto"
      className="scroll-mt-20 border-t border-border-soft bg-gradient-to-b from-transparent to-accent/[0.04]"
    >
      <div className="mx-auto max-w-[1200px] px-5 pb-20 pt-[110px] md:px-10">
        <SectionHeader number="04" label={t("label")} className="mb-11" />

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <FadeIn>
            <div>
              <h2 className="mb-6 text-contact-h2 text-foreground">
                {t("heading")}
              </h2>
              <p className="mb-9 max-w-[440px] text-lg text-muted">
                {t("subtitle")}
              </p>
              <a
                href="mailto:luciogastellu.dev@gmail.com"
                className="inline-flex items-center gap-3 border-b border-accent/40 pb-2 font-mono text-email-link text-foreground transition-colors duration-200 hover:text-accent"
              >
                <span className="text-accent">→</span>{" "}
                luciogastellu.dev@gmail.com
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.12}>
            <div className="flex flex-col gap-4">
              {contactRows.map((row) => (
                <a
                  key={row.key}
                  href={row.href}
                  target={row.key === "phone" ? undefined : "_blank"}
                  className="flex items-center justify-between rounded-row border border-border px-[18px] py-4 transition-colors duration-200 hover:border-accent/40 hover:bg-accent/5"
                >
                  <span className="font-mono text-xs text-faint">
                    {t(`rows.${row.key}`)}
                  </span>
                  <span className="font-mono text-[13px] text-foreground">
                    {row.value}
                  </span>
                </a>
              ))}
            </div>
          </FadeIn>
        </div>

        <FadeIn>
          <blockquote className="mt-20 border-t border-border-soft pt-10 font-mono text-sm leading-[1.7] text-faint-2">
            <span className="text-muted">{t("quote")}</span> — Bill Gates
          </blockquote>
        </FadeIn>
      </div>
    </section>
  );
};

export default ContactMe;
