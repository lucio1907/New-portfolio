import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// The address bar showing and hiding on phones must not restart the scenes.
ScrollTrigger.config({ ignoreMobileResize: true });

// Web fonts change text heights, and so every scene's start and end.
if (typeof document !== "undefined") {
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

export { gsap, ScrollTrigger };
