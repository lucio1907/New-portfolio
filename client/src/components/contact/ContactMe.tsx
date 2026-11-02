import React from "react";
import { useTranslations } from "next-intl";
import SectionHeader from "@/components/common/SectionHeader";
import { FadeIn } from "@/components/motion/Reveal";
import ContactBug from "@/features/debug-me/bugs/ContactBug";

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

const ROW_COLORS = ["bg-yellow", "bg-lilac", "bg-blue text-white", "bg-pink"];

const ContactMe = (): React.ReactElement => {
  const t = useTranslations("contact");

  return (
    <section
      id="contacto"
      className="scroll-mt-28 border-y-3 border-ink bg-yellow"
    >
      <div className="mx-auto max-w-[1240px] px-5 pb-20 pt-24 md:px-10">
        <SectionHeader number="04" label={t("label")} color="bg-white" className="mb-10" />

        <ContactBug />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <FadeIn>
            <div>
              <h3 className="mb-5 text-h2 text-ink">{t("heading")}</h3>
              <p className="mb-8 max-w-[460px] text-lg font-medium text-ink-soft">
                {t("subtitle")}
              </p>
              <a
                href="mailto:luciogastellu.dev@gmail.com"
                className="brutal-btn max-w-full break-all bg-white py-3 font-mono text-base md:text-xl"
              >
                <span aria-hidden="true" className="text-pink">
                  →
                </span>
                luciogastellu.dev@gmail.com
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.12}>
            <ul className="flex flex-col gap-4">
              {contactRows.map((row, index) => (
                <li key={row.key}>
                  <a
                    href={row.href}
                    target={row.key === "phone" ? undefined : "_blank"}
                    rel={row.key === "phone" ? undefined : "noreferrer"}
                    className={`brutal-btn w-full justify-between py-3 ${ROW_COLORS[index % ROW_COLORS.length]}`}
                  >
                    <span className="font-mono text-xs uppercase tracking-[0.12em]">
                      {t(`rows.${row.key}`)}
                    </span>
                    <span className="font-mono text-sm">{row.value}</span>
                  </a>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        <FadeIn>
          <blockquote className="mt-16 max-w-[720px] -rotate-1 rounded-card border-3 border-dashed border-ink bg-white/60 px-6 py-5 font-mono text-sm font-medium leading-[1.7]">
            {t("quote")} <span className="font-bold">— Bill Gates</span>
          </blockquote>
        </FadeIn>
      </div>
    </section>
  );
};

export default ContactMe;
