"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRender3DStatus } from "../hooks/useCanRender3D";
import { dispatchExperience, getSnapshot } from "@/features/experience/store";

// three.js and React Three Fiber live in this lazy chunk only.
const RoomCanvas = dynamic(() => import("./RoomCanvas"), { ssr: false });

/** Lightweight CSS stand-in while the 3D room loads (night window + desk). */
const RoomPoster = () => (
  <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#151D52_0%,#0F1640_70%,#1B1538_100%)]">
    <div className="absolute right-[12%] top-[16%] h-[36%] w-[24%] rounded-sm border-[6px] border-[#CFC6B0]/70 bg-[radial-gradient(1px_1px_at_20%_30%,#EEE8DA_99%,transparent),radial-gradient(1px_1px_at_70%_20%,#EEE8DA_99%,transparent),radial-gradient(1px_1px_at_45%_60%,#A9AECC_99%,transparent),linear-gradient(180deg,#0B1030,#2A3A80)]" />
    <div className="absolute bottom-[30%] right-[8%] h-[3%] w-[48%] rounded-sm bg-[#A06B45]/80" />
    <div className="absolute bottom-[33%] right-[22%] h-[20%] w-[18%] rounded-md border-[6px] border-[#11152E] bg-[#24306E]" />
  </div>
);

/**
 * The room behind the intro card. The CSS poster renders on the server; the
 * 3D canvas replaces it once the page is idle. Without 3D (no WebGL, reduced
 * motion or data saving) the visitor goes straight to the desktop.
 */
const RoomStage = () => {
  const status = useRender3DStatus();
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (status === "unavailable" && getSnapshot().experience.mode === "room") {
      dispatchExperience({ type: "sit", animate: false });
    }
  }, [status]);

  return (
    <div className="absolute inset-0">
      <div className={`transition-opacity duration-700 ${rendered ? "opacity-0" : "opacity-100"}`}>
        <RoomPoster />
      </div>
      {status === "ready" && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${rendered ? "opacity-100" : "opacity-0"}`}>
          <RoomCanvas onRendered={() => setRendered(true)} />
        </div>
      )}
    </div>
  );
};

export default RoomStage;
