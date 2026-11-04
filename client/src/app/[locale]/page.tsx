import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import About from "@/features/portfolio/components/About";
import Experience from "@/features/portfolio/components/Experience";
import Projects from "@/features/portfolio/components/Projects";
import Stack from "@/features/portfolio/components/Stack";
import Contact from "@/features/portfolio/components/Contact";
import LanguageToggle from "@/features/portfolio/components/LanguageToggle";
import { OWNER_NAME } from "@/features/portfolio/lib/constants";

const Sections = () => {
  const t = useTranslations();
  const sections = [
    ["about", <About key="about" />],
    ["experience", <Experience key="experience" />],
    ["projects", <Projects key="projects" />],
    ["stack", <Stack key="stack" />],
    ["contact", <Contact key="contact" />],
  ] as const;

  return (
    <main className="mx-auto max-w-3xl space-y-20 px-5 py-16">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-5xl font-semibold">{OWNER_NAME}</h1>
          <p className="mt-2">{t("role")}</p>
        </div>
        <LanguageToggle />
      </header>
      {sections.map(([id, body]) => (
        <section key={id} id={id}>
          <h2 className="mb-6 text-3xl font-semibold">{t(`nav.${id}`)}</h2>
          {body}
        </section>
      ))}
    </main>
  );
};

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Sections />;
};

export default Home;
