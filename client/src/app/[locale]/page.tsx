import AboutMePage from "@/components/aboutme/AboutMePage";
import ContactMe from "@/components/contact/ContactMe";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/home/Navbar/Navbar";
import HomeView from "@/components/home/homepage/HomeView";
import Projects from "@/components/projects/Projects";
import TechStack from "@/components/stack/TechStack";
import GridBackground from "@/components/motion/GridBackground";
import { setRequestLocale } from "next-intl/server";

const Home = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative w-full h-full">
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
    </div>
  );
};

export default Home;
