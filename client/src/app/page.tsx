import AboutMePage from "@/components/aboutme/AboutMePage";
import ContactMe from "@/components/contact/ContactMe";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/home/Navbar/Navbar";
import HomeView from "@/components/home/homepage/HomeView";
import Projects from "@/components/projects/Projects";
import TechStack from "@/components/stack/TechStack";
import React from "react";

const Home = () => {
  return (
    <div className="w-full h-full">
      <Navbar />
      <div className="flex flex-col gap-[100px] md:gap-[150px] mt-20">
        <HomeView />
        <AboutMePage/>
        <TechStack />
        <Projects/>
        <ContactMe/>
      </div>
      <Footer/>
    </div>
  );
};

export default Home;
