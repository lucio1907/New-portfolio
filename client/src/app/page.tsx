import Navbar from "@/components/home/Navbar/Navbar";
import HomeView from "@/components/home/homepage/HomeView";
import TechStack from "@/components/stack/TechStack";
import React from "react";

const Home = () => {
  return (
    <div className="w-full h-full">
      <Navbar />
      <div className="flex flex-col gap-[100px] md:gap-[150px] mt-20">
        <HomeView />
        <TechStack />
      </div>
    </div>
  );
};

export default Home;
