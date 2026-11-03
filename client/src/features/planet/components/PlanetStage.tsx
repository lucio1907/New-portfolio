import React from "react";
import PlanetPoster from "./PlanetPoster";

/**
 * Where the planet lives: a sticky half-screen panel on desktop and a faint
 * fixed backdrop on mobile. The 3D canvas mounts here (progressive enhancement).
 */
const PlanetStage = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 flex items-start justify-end overflow-hidden opacity-35 lg:pointer-events-auto lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100svh-4rem)] lg:items-center lg:justify-center lg:opacity-100"
    >
      {/* Star field: a few fixed points, no image request. */}
      <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_12%_18%,#EEE8DA_99%,transparent),radial-gradient(1px_1px_at_72%_12%,#EEE8DA_99%,transparent),radial-gradient(1.5px_1.5px_at_88%_64%,#EEE8DA_99%,transparent),radial-gradient(1px_1px_at_30%_82%,#A9AECC_99%,transparent),radial-gradient(1px_1px_at_55%_44%,#A9AECC_99%,transparent),radial-gradient(1.5px_1.5px_at_18%_58%,#EEE8DA_99%,transparent),radial-gradient(1px_1px_at_92%_28%,#A9AECC_99%,transparent)]" />
      <div className="mr-[-30%] mt-20 flex w-full justify-center lg:m-0">
        <PlanetPoster />
      </div>
    </div>
  );
};

export default PlanetStage;
