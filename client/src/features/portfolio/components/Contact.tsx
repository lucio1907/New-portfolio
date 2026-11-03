import React from "react";
import { useTranslations } from "next-intl";
import Section from "./Section";
import CopyEmail from "./CopyEmail";
import { CV_HREF, EMAIL, PHONE, SOCIAL_LINKS } from "../lib/constants";

const [localPart, domain] = EMAIL.split("@");

const Contact = () => {
  const t = useTranslations("site");
  const tr = useTranslations("contact.rows");

  return (
    <Section id="contact" title={t("sections.contact")} intro={t("contact.intro")}>
      <a
        href={`mailto:${EMAIL}`}
        className="font-display text-[clamp(1.2rem,2.5vw,1.9rem)] font-medium text-sun underline decoration-sun/30 underline-offset-[6px] transition-colors hover:decoration-sun"
      >
        {/* Allow the address to wrap after the @ instead of mid-word. */}
        {localPart}@<wbr />
        {domain}
      </a>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <CopyEmail />
        <a href={CV_HREF} target="_blank" rel="noreferrer" className="btn min-h-[40px] px-4 text-sm">
          {t("hero.cv")}
        </a>
      </div>

      <ul className="mt-10 grid max-w-prose gap-3 text-[15.5px] sm:grid-cols-2">
        <li>
          <span className="block text-sm text-haze">{t("contact.phone")}</span>
          <a href={PHONE.href} className="link">{PHONE.label}</a>
        </li>
        {SOCIAL_LINKS.map((link) => (
          <li key={link.key}>
            <span className="block text-sm text-haze">{tr(link.key)}</span>
            <a href={link.href} target="_blank" rel="noreferrer" className="link">
              {link.value}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
};

export default Contact;
