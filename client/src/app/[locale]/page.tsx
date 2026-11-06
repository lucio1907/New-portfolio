import { setRequestLocale } from "next-intl/server";
import Nav from "@/features/portfolio/components/Nav";
import Hero from "@/features/portfolio/components/Hero";
import Manifesto from "@/features/portfolio/components/Manifesto";
import PosChapter from "@/features/portfolio/components/PosChapter";
import { CrmChapter, ProjectChapter } from "@/features/portfolio/components/Chapters";
import MoreProjects from "@/features/portfolio/components/MoreProjects";
import BigNumber from "@/features/portfolio/components/BigNumber";
import Trajectory from "@/features/portfolio/components/Trajectory";
import HowIWork from "@/features/portfolio/components/HowIWork";
import TechSheet from "@/features/portfolio/components/TechSheet";
import ContactSection from "@/features/portfolio/components/ContactSection";

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <PosChapter />
        <CrmChapter />
        <ProjectChapter name="nadira" />
        <ProjectChapter name="sitiohoy" offset />
        <MoreProjects />
        <BigNumber />
        <Trajectory />
        <HowIWork />
        <TechSheet />
        <ContactSection />
      </main>
    </>
  );
};

export default Home;
