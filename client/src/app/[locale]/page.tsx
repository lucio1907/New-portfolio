import { setRequestLocale } from "next-intl/server";
import SiteHeader from "@/features/portfolio/components/SiteHeader";
import Hero from "@/features/portfolio/components/Hero";
import About from "@/features/portfolio/components/About";
import Experience from "@/features/portfolio/components/Experience";
import Stack from "@/features/portfolio/components/Stack";
import Projects from "@/features/portfolio/components/Projects";
import Contact from "@/features/portfolio/components/Contact";
import Footer from "@/features/portfolio/components/Footer";

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SiteHeader />
      <div className="mx-auto grid max-w-[1400px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <main id="main" className="px-5 md:px-10 lg:pl-16 lg:pr-6">
          <Hero />
          <About />
          <Experience />
          <Stack />
          <Projects />
          <Contact />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Home;
