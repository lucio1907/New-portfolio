import AboutMePage from "@/components/aboutme/AboutMePage";
import ContactMe from "@/components/contact/ContactMe";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/home/Navbar/Navbar";
import HomeView from "@/components/home/homepage/HomeView";
import Projects from "@/components/projects/Projects";
import TechStack from "@/components/stack/TechStack";
import GridBackground from "@/components/motion/GridBackground";
import { setRequestLocale } from "next-intl/server";
import BugHud from "@/features/debug-me/components/BugHud";
import Confetti from "@/features/debug-me/components/Confetti";

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative w-full h-full pb-24 sm:pb-0">
      <GridBackground />
      <div className="relative z-10">
        <Navbar />
        <HomeView />
        <main>
          <AboutMePage />
          <TechStack />
          <Projects />
          <ContactMe />
        </main>
        <Footer />
      </div>
      <BugHud />
      <Confetti />
    </div>
  );
};

export default Home;
