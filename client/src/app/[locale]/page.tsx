import { setRequestLocale } from "next-intl/server";
import OsShell from "@/features/os/components/OsShell";
import About from "@/features/portfolio/components/About";
import Experience from "@/features/portfolio/components/Experience";
import Projects from "@/features/portfolio/components/Projects";
import Stack from "@/features/portfolio/components/Stack";
import Contact from "@/features/portfolio/components/Contact";

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  // Window contents render on the server: every section is in the HTML.
  return (
    <OsShell
      contents={{
        about: <About />,
        experience: <Experience />,
        projects: <Projects />,
        stack: <Stack />,
        contact: <Contact />,
        terminal: null,
      }}
    />
  );
};

export default Home;
