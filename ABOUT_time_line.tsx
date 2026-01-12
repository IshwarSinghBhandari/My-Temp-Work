"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useMemo } from "react";

export default function JourneyTimeline() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const singleTimelineWidth = useMemo(
    () => (isMobile ? 2400 : 3600),
    [isMobile]
  );

  /* -------------------------------
     Timeline Data (unchanged)
  -------------------------------- */
  const timelineEvents = [
    {
      year: "2015",
      position: "bottom",
      icon: "/image/About/badge.webp",
      description:
        "Birth of Cloudtrack, A world-class logistics software, that fueled partnerships with industry leaders like",
      logos: [
        { name: "Stellar", path: "/image/About/stellar.webp", height: 46 },
        {
          name: "Hexagonal",
          path: "/image/About/cloudtrack_logo.webp",
          height: 50,
        },
      ],
    },
    {
      year: "2016",
      position: "top",
      icon: "/image/About/badge.webp",
      description:
        "Exemplary service quality fuels market demand and creates collaborations with ground-breaking startups like",
      logos: [
        { name: "DOORMINT", path: "/image/About/doormint.webp", height: 38 },
        { name: "KODO", path: "/image/About/kodo.webp", height: 26 },
        { name: "grayQuest", path: "/image/About/grayquest.webp", height: 28 },
        { name: "zoctor", path: "/image/About/zoctor.webp", height: 26 },
      ],
    },
    {
      year: "2017",
      position: "bottom",
      icon: "/image/About/grothicon.webp",
      description: "The First Milestone ",
      highlight: "1 Million USD in Revenue",
      subText: "is reached with an in-house team of 50-plus engineers",
    },
    {
      year: "2020",
      position: "top",
      icon: "/image/About/badge.webp",
      description: "Cloudesign becomes a recognized technology partner of",
      logos: [
        { name: "AWS", path: "/image/logo/aws.webp", height: 38 },
        { name: "UiPath", path: "/image/logo/uipath.webp", height: 46 },
        { name: "Microsoft", path: "/image/logo/microsoft.webp", height: 38 },
      ],
    },
    {
      year: "2021",
      position: "bottom",
      icon: "/image/About/checkicon.webp",
      description:
        "Cloudtrack becomes on independent entity led by Nishant Shetty and Shivalik Prasad(Executive Director, Map My India)",
      logos: [
        { name: "Baxter", path: "/image/logo/baxter.webp", height: 24 },
        { name: "Daikin", path: "/image/logo/daikin.webp", height: 46 },
        { name: "Kurion", path: "/image/logo/kurion.webp", height: 24 },
        {
          name: "Johnson & Johnson",
          path: "/image/logo/johnsons.webp",
          height: 38,
        },
      ],
    },
    {
      year: "2023",
      position: "top",
      icon: "/image/About/grothicon.webp",
      description: "Cloudesign Touches ",
      highlight: "5 Million USD in Revenue",
      subText: "is reached with an in-house",
    },
  ];

  /* -------------------------------
     Mobile Detection
  -------------------------------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* -------------------------------
     Infinite Scroll Reset (3 copies)
  -------------------------------- */
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollLeft = singleTimelineWidth;

    const onScroll = () => {
      const max = singleTimelineWidth * 2;
      if (container.scrollLeft <= 0) {
        container.scrollLeft += singleTimelineWidth;
      } else if (container.scrollLeft >= max) {
        container.scrollLeft -= singleTimelineWidth;
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [singleTimelineWidth]);

  /* -------------------------------
     Smooth Auto Scroll (time-based)
  -------------------------------- */
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const speed = 0; // px per second

    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      container.scrollLeft += (speed * delta) / 1000;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* -------------------------------
     Drag to Scroll with Mouse
  -------------------------------- */
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      scrollLeftRef.current = container.scrollLeft;
      container.style.cursor = "grabbing";
      container.style.userSelect = "none";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const x = e.clientX;
      const walk = (x - startXRef.current) * 1.5; // Scroll speed multiplier
      container.scrollLeft = scrollLeftRef.current - walk;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      container.style.cursor = "grab";
      container.style.userSelect = "";
    };

    const handleMouseLeave = () => {
      isDraggingRef.current = false;
      container.style.cursor = "grab";
      container.style.userSelect = "";
    };

    container.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  /* -------------------------------
     Active Card Detection
  -------------------------------- */
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const update = () => {
      const cards =
        container.querySelectorAll<HTMLElement>("[data-card-index]");
      const triggerX = window.innerWidth * 0.75;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const index = Number(card.dataset.cardIndex);
        if (center <= triggerX && center >= 0) {
          setActiveIndex(index);
        }
      });

      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }, []);

  /* -------------------------------
     Render (unchanged)
  -------------------------------- */
  return (
    <section className="bg-[#0A0A0A] py-10 md:py-[103px] overflow-hidden font-sans">
      <h2
        className="text-center text-2xl mb-4 font-semibold md:text-[36px] px-6 leading-tight md:px-[105px] red-hat-display"
        style={{
          background:
            "var(--Linear, linear-gradient(100deg, rgba(109, 117, 133, 0.90) 26.8%, rgba(218, 54, 67, 0.90) 76.45%))",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        A Journey Defined by Ground-breaking Innovations, Stellar Executions and
        Fulfilling Customer Relationships
      </h2>
      <div className="relative h-[500px] md:h-[620px] overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide h-full cursor-grab active:cursor-grabbing"
        >
          <div className="relative inline-flex items-center h-full">
            {[1, 2, 3].map((copy) => (
              <div
                key={copy}
                className="relative inline-flex items-center h-full flex-shrink-0"
                style={{ minWidth: `${singleTimelineWidth}px` }}
              >
                <div className="absolute w-full h-[2px] bg-white/10 top-1/2 -translate-y-1/2" />
                <div className="relative flex justify-between w-full px-4 md:px-8 z-10">
                  {timelineEvents.map((event, index) => {
                    const globalIndex = index;
                    const isActive = activeIndex === globalIndex;

                    return (
                      <div
                        key={`${copy}-${index}`}
                        data-card-index={globalIndex}
                        className="relative flex flex-col items-start flex-1"
                      >
                        {/* Node */}
                        <div className="relative">
                          <div
                            className={`absolute top-1/2 left-[18px] md:left-[36px] -translate-x-1/2 -translate-y-1/2 w-4 h-4 md:w-8 md:h-8 rounded-full blur-md transition-all duration-200 ${
                              isActive
                                ? "bg-red-600/80 scale-110"
                                : "bg-red-600/40"
                            }`}
                          />
                          <div
                            className={`w-2 h-2 md:w-3 md:h-3 rounded-full border-2 ml-4 md:ml-8 relative z-10 transition-all duration-200 ${
                              isActive
                                ? "bg-red-600 border-red-600 scale-125"
                                : "bg-[#0A0A0A] border-white/20"
                            }`}
                          />
                          {/* Moving Glow Line */}
                          {isActive && (
                            <div
                              className="absolute top-1/2 left-[18px] md:left-[36px] -translate-y-1/2 h-[2px] md:h-[3px] w-[200px] md:w-[600px] z-0"
                              style={{
                                background:
                                  "linear-gradient(to right, rgba(220, 38, 38, 0.8) 0%, rgba(220, 38, 38, 0.8) 60%, rgba(220, 38, 38, 0) 100%)",
                              }}
                            />
                          )}
                        </div>
                        {/* Year Label */}
                        <div
                          className={`absolute ${
                            event.position === "top"
                              ? "top-[40px] md:top-[60px]"
                              : "bottom-[40px] md:bottom-[60px]"
                          }
                            ${
                              isActive
                                ? "border-red-600/50 text-gray-300"
                                : "border-[#353435] text-gray-400"
                            } 
                          left-3 md:left-7 bg-gradient-to-b from-[rgba(35,35,35,0)] to-[#232323] border border-[#353435] px-3 py-2 md:px-8 md:py-4 rounded-lg text-gray-400 text-sm md:text-lg font-medium whitespace-nowrap `}
                        >
                          {event.year}
                        </div>

                        {/* Event Card */}
                        <div
                          className={`absolute ${
                            event.position === "top"
                              ? "bottom-[20px] md:bottom-[40px]"
                              : "top-[20px] md:top-[40px]"
                          } 
                            left-4 md:left-8 w-[280px] md:w-[530px] bg-gradient-to-b from-[rgba(35,35,35,0)] to-[#232323] rounded-xl p-3 md:p-4 border shadow-2xl transition-all duration-200 ${
                              isActive
                                ? "border-red-600/50"
                                : "border-[#353535]"
                            }`}
                        >
                          {/* Icon Container */}
                          <div className="mb-2 md:mb-4">
                            <div className="w-[48px] h-[48px] md:w-[72px] md:h-[72px] pt-[10px] pr-[9px] pb-[9px] pl-[10px] md:pt-[16.5px] md:pr-[15.5px] md:pb-[15.5px] md:pl-[16.5px] bg-gradient-to-b from-[rgba(35,35,35,0)] to-[#232323] border border-[#353435] rounded-[8px] md:rounded-[10px] flex items-center justify-center">
                              <Image
                                src={event.icon}
                                alt="icon"
                                width={48}
                                height={44}
                                className="object-contain w-6 h-6 md:w-12 md:h-11"
                              />
                            </div>
                          </div>

                          <p className="text-gray-400 text-sm md:text-lg leading-relaxed mb-2 md:mb-4 font-inter">
                            {event.description}
                          </p>

                          {/* Logos Row */}
                          {event.logos && (
                            <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                              {event.logos.map((logo, lIdx) => (
                                <div
                                  key={lIdx}
                                  className=" flex items-center gap-1"
                                >
                                  {logo.path && (
                                    <div
                                      className={`relative flex items-center justify-center`}
                                      style={{
                                        height: isMobile
                                          ? `${(logo.height || 46) * 0.6}px`
                                          : `${logo.height || 46}px`,
                                      }}
                                    >
                                      <Image
                                        src={logo.path}
                                        alt={logo.name}
                                        width={100}
                                        height={logo.height || 46}
                                        className="object-contain w-auto"
                                        style={{
                                          height: isMobile
                                            ? `${(logo.height || 46) * 0.6}px`
                                            : `${logo.height || 46}px`,
                                        }}
                                        onError={(e) => {
                                          e.currentTarget.style.display =
                                            "none";
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Revenue Highlight Style */}
                          {event.highlight && (
                            <div className="space-y-2 md:space-y-3">
                              <div className="bg-[#153B23] w-full border border-[#22C55E]/20 rounded-lg px-3 py-1.5 md:px-4 md:py-2">
                                <p className="text-[#22C55E] font-bold text-sm md:text-lg tracking-wide font-inter">
                                  {event.highlight}
                                </p>
                              </div>
                              <p className="text-gray-400 text-sm md:text-lg leading-relaxed mb-2 md:mb-4 font-inter">
                                {event.subText}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>{" "}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
