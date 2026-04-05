"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = imageRef.current!;
      const section = sectionRef.current!;

      const elRect = el.getBoundingClientRect();
      const containerRect = section.getBoundingClientRect();

      const scale = Math.max(
        containerRect.width / elRect.width,
        containerRect.height / elRect.height,
      );

      gsap.fromTo(
        el,
        {
          scale: 0.8,
          borderRadius: 32,
        },
        {
          scale,
          borderRadius: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=1200",
            scrub: true,
            pin: true,
            pinType: "transform",
            anticipatePin: 1,
            invalidateOnRefresh: false,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="">
      <div
        ref={imageRef}
        className="
          w-[60vw] h-[60vh]
          rounded-3xl
          flex items-center justify-center
          text-white text-5xl font-bold
          will-change-transform
        "
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        HERO
      </div>
    </section>
  );
}
