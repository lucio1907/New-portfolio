"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import PlanetPoster from "./PlanetPoster";
import { useCanRender3D } from "../hooks/useCanRender3D";

// three.js and React Three Fiber live in this lazy chunk only.
const PlanetCanvas = dynamic(() => import("./PlanetCanvas"), { ssr: false });

/**
 * Where the planet lives: a sticky half-screen panel on desktop and a faint
 * fixed backdrop on mobile. The CSS poster renders on the server; the 3D
 * canvas replaces it once the page is idle (progressive enhancement).
 */
const PlanetStage = () => {
  const canRender3D = useCanRender3D();
  const [rendered, setRendered] = useState(false);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 flex items-start justify-end overflow-hidden opacity-35 lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100svh-4rem)] lg:items-center lg:justify-center lg:opacity-100"
    >
      {/* Star field for the poster; the 3D scene draws its own stars. */}
      <div
        className={`absolute inset-0 bg-[radial-gradient(1px_1px_at_12%_18%,#EEE8DA_99%,transparent),radial-gradient(1px_1px_at_72%_12%,#EEE8DA_99%,transparent),radial-gradient(1.5px_1.5px_at_88%_64%,#EEE8DA_99%,transparent),radial-gradient(1px_1px_at_30%_82%,#A9AECC_99%,transparent),radial-gradient(1px_1px_at_55%_44%,#A9AECC_99%,transparent),radial-gradient(1.5px_1.5px_at_18%_58%,#EEE8DA_99%,transparent),radial-gradient(1px_1px_at_92%_28%,#A9AECC_99%,transparent)] transition-opacity duration-700 ${rendered ? "opacity-0" : "opacity-100"}`}
      />
      <div className="relative mr-[-34%] mt-16 aspect-square w-[min(118%,640px)] lg:m-0 lg:w-[min(100%,680px)]">
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${rendered ? "opacity-0" : "opacity-100"}`}
        >
          <PlanetPoster />
        </div>
        {canRender3D && (
          <div className={`absolute inset-0 transition-opacity duration-700 ${rendered ? "opacity-100" : "opacity-0"}`}>
            <PlanetCanvas onRendered={() => setRendered(true)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanetStage;
