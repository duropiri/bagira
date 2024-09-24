"use client";
import Image from "next/image";
import React, { useEffect, useRef } from "react";

const GalleryCircleSection = () => {
  const svgRef = useRef(null);

  const handleMouseEnter = () => {
    if (svgRef.current) {
      svgRef.current.classList.remove("spin-slow");
      svgRef.current.classList.add("spin-fast");
    }
  };

  const handleMouseLeave = () => {
    if (svgRef.current) {
      svgRef.current.classList.remove("spin-fast");
      svgRef.current.classList.add("spin-slow");
    }
  };

  // GSAP Animations
  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      let effectElements = gsap.utils.toArray("[data-speed]");
      effectElements.forEach((el) => {
        let speed = parseFloat(el.getAttribute("data-speed"));
        gsap.fromTo(
          el,
          { y: 0 },
          {
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              onRefresh: (self) => {
                let start = Math.max(0, self.start); // ensure no negative values
                let distance = self.end - start;
                let end = start + distance / speed;
                self.setPositions(start, end);
                if (self.animation) {
                  // Check if self.animation is defined
                  self.animation.vars.y = (end - start) * (1 - speed);
                  self.animation
                    .invalidate()
                    .progress(1)
                    .progress(self.progress);
                }
              },
            },
          }
        );
      });

      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    };

    loadGSAP();
  }, []);
  return (
    <div id="gallery" className="gallery-circle-section panel">
      <div className="gallery-circle-component">


        <div
            className="gallery-circle"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              className="gallery-circle-svg"
              style={{ transformOrigin: "center" }}
            >
              <path
                id="circlePath"
                d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                fill="transparent"
              />
              <text
                className="josefin-600-20 normal-case"
                fill="white"
              >
                <textPath
                  href="#circlePath"
                  textAnchor="middle"
                  startOffset="50%"
                  fontSize="15"
                >
                  The world without art is just &quot;meh&quot;—
                </textPath>
              </text>
            </svg>

            <a
              href="/the-gallery"
              className="gallery-circle-a"
            >
              <Image
                alt=""
                src="/images/The_gallery_logo_black.webp"
                objectFit="cover"
                height={170}
                width={414}
                className="gallery-circle-image"
              />
              <video
                src="/media/BagiraGallery Opening Event.mov"
                autoPlay
                loop
                muted
                className="gallery-circle-video"
              />
            </a>
          </div>
      </div>
    </div>
  );
};

export default GalleryCircleSection;
