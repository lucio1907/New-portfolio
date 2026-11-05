import React from "react";
import { useTranslations } from "next-intl";
import ContactScene from "../motion/ContactScene";
import CopyEmail from "./CopyEmail";
import RiseTitle from "./RiseTitle";
import { CV_HREF, EMAIL, PHONE, SOCIAL_LINKS } from "../lib/constants";

const [localPart, domain] = EMAIL.split("@");

/** The last screen: one question, and the address as big as it fits. */
const ContactSection = () => {
  const t = useTranslations("contact");

  return (
    <ContactScene>
      <div data-contact className="contact-inner">
        <div>
          <RiseTitle className="contact-title" lines={[t("title")]} />
          <p className="contact-lead">{t("lead")}</p>
        </div>
        <div>
          <a href={`mailto:${EMAIL}`} className="contact-email">
            {/* Allow the address to wrap after the @ instead of mid-word. */}
            {localPart}@<wbr />
            {domain}
          </a>
          <div className="contact-actions mt-6 flex flex-wrap gap-3">
            <CopyEmail />
            <a href={CV_HREF} target="_blank" rel="noreferrer" className="action">
              {t("cv")}
            </a>
          </div>
        </div>
        <footer className="contact-links">
          <p>
            <span>{t("phone")}</span>
            <a href={PHONE.href} className="text-link">{PHONE.label}</a>
          </p>
          {SOCIAL_LINKS.map((link) => (
            <p key={link.key}>
              <span>{t(link.key)}</span>
              <a href={link.href} target="_blank" rel="noreferrer" className="text-link">
                {link.value}
              </a>
            </p>
          ))}
        </footer>
      </div>
    </ContactScene>
  );
};

export default ContactSection;
