import Navbar from "@/components/home/Navbar/Navbar";
import HomeView from "@/components/home/homepage/HomeView";
import React from "react";

const Home = () => {
  return (
    <div className="w-full h-full">
      <Navbar />
      <div className="flex flex-col mt-20">
        <HomeView />
      </div>
    </div>
  );
};

export default Home;
