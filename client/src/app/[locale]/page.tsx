import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import About from "@/features/portfolio/components/About";
import Experience from "@/features/portfolio/components/Experience";
import Projects from "@/features/portfolio/components/Projects";
import Stack from "@/features/portfolio/components/Stack";
import Contact from "@/features/portfolio/components/Contact";
import Nav from "@/features/portfolio/components/Nav";
import Hero from "@/features/portfolio/components/Hero";
import Manifesto from "@/features/portfolio/components/Manifesto";
import PosChapter from "@/features/portfolio/components/PosChapter";

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
    <>
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <PosChapter />
        <div className="mx-auto max-w-3xl space-y-20 px-5 py-24">
          {sections.map(([id, body]) => (
            <section key={id} id={id}>
              <h2 className="mb-6 text-3xl font-semibold">{t(`nav.${id}`)}</h2>
              {body}
            </section>
          ))}
        </div>
      </main>
    </>
  );
};

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Sections />;
};

export default Home;
