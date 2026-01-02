"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Type definitions
export interface CarouselTag {
  label: string;
  description: string | string[];
  active?: boolean;
}

export interface CarouselCard {
  id?: number;
  image: string;
  imageMobile?: string;
  heading: string;
  title: string;
  description: string;
  tags: CarouselTag[];
  buttonLink?: string;
  buttonText?: string;
}

export interface RollingSliderCarouselProps {
  cards: CarouselCard[];
  title?: string;
  description?: string;
  tagInterval?: number;
  primaryColor?: string;
  backgroundColor?: string;
  buttonText?: string;
  inactiveScale?: number;
  radius?: number;
  hideButton?: boolean;
}

export default function RollingSliderCarousel_2({
  cards,
  title = "Our Areas of Expertise",
  description = "Accelerating business transformation through intelligent innovation, robust engineering, and specialized workforce solutions.",
  tagInterval = 6000,
  primaryColor = "#da3643",
  backgroundColor = "#101010",
  buttonText = "Get in touch",
  inactiveScale = 0.75,
  radius = 22,
  hideButton = false,
}: RollingSliderCarouselProps) {
  const carouselRef = useRef(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeTagIndex, setActiveTagIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const slideIndexRef = useRef(0);
  const tagIndexRef = useRef(0);
  const prevSlideIndexRef = useRef(0);
  const tagIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Track window width for responsive radius
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use provided cards or default to empty array
  const cardData = cards || [];
  const cardCount = cardData.length;
  const isSingleCard = cardCount === 1;
  const angle = cardCount > 0 ? 360 / cardCount : 0;
  const mobileRadius = radius;
  
  // Early return if no cards provided
  if (cardCount === 0) {
    return null;
  }

  // Initialize carousel rotation - start at 0 to show first card
  useEffect(() => {
    if (!carouselRef.current) return;

    const rotateY = 0;
    prevSlideIndexRef.current = 0;

    if (carouselRef.current) {
      carouselRef.current.style.transform = `rotateY(${rotateY}deg)`;
      carouselRef.current.style.transformStyle = 'preserve-3d';
    }
  }, []);

  // Track total rotation to continue in same direction
  const totalRotationRef = useRef(0);

  // Update carousel rotation when slide index changes
  useEffect(() => {
    if (!carouselRef.current) return;

    // If single card, keep rotation at 0 and stop rotation
    if (isSingleCard) {
      totalRotationRef.current = 0;
      if (carouselRef.current) {
        carouselRef.current.style.transition = 'transform 1s cubic-bezier(0.645, 0.045, 0.355, 1)';
        carouselRef.current.style.transform = `rotateY(0deg)`;
      }
      return;
    }

    const prevSlide = prevSlideIndexRef.current;
    const currentSlide = activeSlideIndex;

    // Always continue in forward direction (when going from last to first)
    if (prevSlide === cardCount - 1 && currentSlide === 0) {
      // Continue forward rotation
      totalRotationRef.current -= angle;
    }
    // Going backward (from first to last via prev button)
    else if (prevSlide === 0 && currentSlide === cardCount - 1) {
      // Go backward
      totalRotationRef.current += angle;
    }
    // Normal forward movement
    else if (currentSlide > prevSlide) {
      totalRotationRef.current -= angle;
    }
    // Normal backward movement
    else if (currentSlide < prevSlide) {
      totalRotationRef.current += angle;
    }

    prevSlideIndexRef.current = currentSlide;

    if (carouselRef.current) {
      carouselRef.current.style.transition = 'transform 1s cubic-bezier(0.645, 0.045, 0.355, 1)';
      carouselRef.current.style.transform = `rotateY(${totalRotationRef.current}deg)`;
    }
  }, [activeSlideIndex, angle, cardCount, isSingleCard]);

  // Keep refs in sync with state
  useEffect(() => {
    slideIndexRef.current = activeSlideIndex;
  }, [activeSlideIndex]);

  useEffect(() => {
    tagIndexRef.current = activeTagIndex;
  }, [activeTagIndex]);

  // Function to start/restart the tag cycling timer
  const startTagTimer = useCallback(() => {
    // Clear existing interval if any
    if (tagIntervalRef.current) {
      clearInterval(tagIntervalRef.current);
    }

    // Start new interval
    tagIntervalRef.current = setInterval(() => {
      const currentTag = tagIndexRef.current;
      const currentSlide = slideIndexRef.current;
      const maxTagIndex = cardData[currentSlide]?.tags?.length - 1 || 0;

      if (currentTag < maxTagIndex) {
        setActiveTagIndex(currentTag + 1);
      } else {
        // Only rotate to next slide if there are multiple cards
        if (!isSingleCard && cardCount > 1) {
          const nextSlide = (currentSlide + 1) % cardCount;
          setActiveSlideIndex(nextSlide);
          setActiveTagIndex(0);
        } else {
          // For single card, just loop back to first tag
          setActiveTagIndex(0);
        }
      }
    }, tagInterval);
  }, [cardCount, tagInterval, cardData, isSingleCard]);

  // Manual navigation
  const rotate = (direction: "next" | "prev") => {
    // Don't allow rotation if there's only one card
    if (isSingleCard) {
      return;
    }
    
    setActiveSlideIndex((prev) => {
      if (direction === "next") {
        return (prev + 1) % cardCount;
      } else {
        return (prev - 1 + cardCount) % cardCount;
      }
    });
    setActiveTagIndex(0);
    // Restart the timer when manually navigating
    startTagTimer();
  };

  // Tag cycling timer
  useEffect(() => {
    startTagTimer();

    return () => {
      if (tagIntervalRef.current) {
        clearInterval(tagIntervalRef.current);
      }
    };
  }, [startTagTimer]);

  // Convert hex color to RGB for gradient
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 218, g: 54, b: 67 };
  };

  const primaryRgb = hexToRgb(primaryColor);
  const primaryColorRgba = `rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.9)`;

  return (
    <section
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 md:px-20 py-8 md:py-12"
      style={{ backgroundColor }}
    >
      <p
        className="relative z-20 bg-[linear-gradient(131deg,rgba(109,117,133,0.9)_0%,var(--primary-color)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] font-semibold text-2xl md:text-4xl text-center tracking-[0] leading-[normal]"
        style={
          {
            "--primary-color": primaryColorRgba,
          } as React.CSSProperties
        }
      >
        {title}
      </p>
      {description && (
        <p className="text-white text-center text-sm md:text-base leading-relaxed mb-6 md:mb-[71px] mt-4">
          {description}
        </p>
      )}

      <div className="w-full h-[600px] sm:h-[700px] md:h-full flex items-center justify-center">
        <div className="relative w-full max-w-[1400px] perspective-[1400px]">
          <div
            ref={carouselRef}
            className="relative w-full h-[600px] sm:h-[700px] md:h-[clamp(520px,65vh,720px)] [transform-style:preserve-3d] z-10 pointer-events-none"
          >
            {cardData.map((card, i) => {
              // For single card, center it with no rotation
              const cardDeg = isSingleCard ? 0 : i * angle;
              const isActive = i === activeSlideIndex;
              // Single card should always be at full scale
              const scale = isSingleCard ? 1 : (isActive ? 1 : inactiveScale);

              return (
                <div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transform: isSingleCard 
                      ? `rotateY(0deg) translateZ(0) scale(1)` 
                      : `rotateY(${cardDeg}deg) translateZ(${mobileRadius}vw) scale(${scale})`,
                    transition: 'transform 1s cubic-bezier(0.645, 0.045, 0.355, 1)',
                    pointerEvents: isActive ? "auto" : "none",
                    zIndex: isActive ? 10 : 1,
                  }}
                >
                  <div className="w-[90%] md:w-[80%] h-[560px] sm:max-h-[650px] md:h-full bg-[#212121] backdrop-blur border border-white/10 rounded-2xl md:rounded-[70%/10%] shadow-[0_40px_100px_rgba(0,0,0,0.7)] flex md:flex-row flex-col items-center md:justify-between gap-3 sm:gap-4 md:gap-8 p-4 md:p-8 overflow-y-auto md:overflow-visible">
                    <div className="hidden md:flex flex-shrink-0 w-[40%] 2xl:w-[38%]">
                      <img
                        src={card.image}
                        alt={card.heading}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    <div className="md:hidden flex-shrink-0 w-[280px]">
                      <img
                        src={windowWidth < 768 && card.imageMobile ? card.imageMobile : card.image}
                        alt={card.heading}
                        className="w-full h-auto object-contain"
                      />
                    </div>

                    <div className="w-full max-w-xl text-white space-y-2 sm:space-y-3 md:space-y-6">
                      <div className="text-[10px] sm:text-xs md:text-sm text-gray-400">
                        {card.heading}
                      </div>

                      <h2 className="text-lg sm:text-xl md:text-3xl font-semibold leading-tight">
                        {card.title}
                      </h2>

                      <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed">
                        {card.description}
                      </p>
                      <hr className="my-1 sm:my-4 md:my-6 border-white/10" />

                      <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
                        {card.tags.map((tag, tagIdx) => {
                          const isTagActive = tagIdx === activeTagIndex;
                          const isCurrentCard = i === activeSlideIndex;

                          return (
                            <span
                              key={tagIdx}
                              onClick={() => {
                                if (isCurrentCard) {
                                  // Allow clicking on any tag to jump to it
                                  if (tagIdx !== activeTagIndex) {
                                    setActiveTagIndex(tagIdx);
                                    // Restart the timer when clicking on a tag
                                    startTagTimer();
                                  }
                                }
                              }}
                              className={`px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-lg text-[10px] sm:text-xs md:text-sm border transition-all duration-300 cursor-pointer ${
                                isTagActive
                                  ? `border-[${primaryColor}] text-[${primaryColor}]`
                                  : "border-white/10 text-white hover:border-white/30"
                              }`}
                              style={
                                isTagActive
                                  ? {
                                      borderColor: primaryColor,
                                      color: primaryColor,
                                    }
                                  : undefined
                              }
                            >
                              {tag.label}
                            </span>
                          );
                        })}
                      </div>
                      {card.tags.map((tag, tagIdx) => {
                        const isTagActive = tagIdx === activeTagIndex;
                        return isTagActive ? (
                          <div key={tagIdx} className="md:min-h-28 min-h-[88px] text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed" style={{ animation: 'fadeIn 0.3s ease-in-out 0.3s forwards', opacity: 0.1 }}>
                            {Array.isArray(tag.description) ? (
                              <ul className="list-disc list-inside space-y-1.5 sm:space-y-2">
                                {tag.description.map((bullet, bulletIdx) => (
                                  <li key={bulletIdx}>{bullet}</li>
                                ))}
                              </ul>
                            ) : (
                              <p>{tag.description}</p>
                            )}
                          </div>
                        ) : null;
                      })}

                      {!hideButton && card.buttonLink && (
                        <a
                          href={card.buttonLink}
                          className="inline-flex items-center px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base rounded-lg transition mt-0"
                          style={{
                            backgroundColor: primaryColor,
                          }}
                          onMouseEnter={(e) => {
                            const rgb = hexToRgb(primaryColor);
                            e.currentTarget.style.backgroundColor = `rgb(${Math.max(0, rgb.r - 20)}, ${Math.max(0, rgb.g - 20)}, ${Math.max(0, rgb.b - 20)})`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = primaryColor;
                          }}
                        >
                          {card.buttonText || buttonText}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!isSingleCard && (
            <>
              <button
                onClick={() => rotate("prev")}
                className="absolute left-0 -bottom-[75px] md:top-1/2 -translate-y-1/2 w-12 h-12 rounded-[53px] border border-[rgba(103,103,103,0.30)] bg-[rgba(217,217,217,0.01)] shadow-[inset_0_-1px_25px_0_rgba(255,255,255,0.10),inset_10px_10px_15px_0_rgba(0,0,0,0.05)] backdrop-blur-[12.5px] flex items-center justify-center transition z-10"
              >
                <ChevronLeft className="text-white w-5 h-5 md:w-6 md:h-6" />
              </button>

              <button
                onClick={() => rotate("next")}
                className="absolute right-0 -bottom-[75px] md:top-1/2 -translate-y-1/2 w-12 h-12 rounded-[53px] border border-[rgba(103,103,103,0.30)] bg-[rgba(217,217,217,0.01)] shadow-[inset_0_-1px_25px_0_rgba(255,255,255,0.10),inset_10px_10px_15px_0_rgba(0,0,0,0.05)] backdrop-blur-[12.5px] flex items-center justify-center transition z-10"
              >
                <ChevronRight className="text-white w-5 h-5 md:w-6 md:h-6" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="relative flex gap-2 justify-center mt-6 md:mt-[71px] z-20">
        {cardData.map((card, index) => {
          const isActive = index === activeSlideIndex;
          const maxTagIndex = card.tags?.length - 1 || 0;

          return (
            <div
              key={index}
              className={`h-1 rounded-full overflow-hidden flex transition-all duration-300 ${isActive ? "w-14" : "w-14"}`}
            >
              {Array.from({ length: card.tags?.length || 0 }, (_, tagIdx) => {
                const isTagActive = isActive && tagIdx <= activeTagIndex;
                return (
                  <div
                    key={tagIdx}
                    className="flex-1 transition-all duration-300"
                    style={{
                      backgroundColor: isTagActive ? primaryColor : "#212121",
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}


---------------------------------------------
  const MICROSOFT_CONSULTING_CAROUSEL_CARDS: CarouselCard[] = [
  {
    id: 0,
    image: "/image/MSConsultingServices/BusinessValueMain.avif",
    imageMobile: "/image/MSConsultingServices/BusinessValueMain.avif",
    heading: "CASE STUDY ",
    title: "Client Context / Industry",
    description:
      "A mid-sized B2B services company with ~150 employees, operating across sales, delivery, and support teams. The organization was transitioning from fragmented tools to a structured Microsoft cloud environment.",
    tags: [
      {
        label: "The Problem",
        description: [
          "User identities and access were unmanaged across applications",
          "No role-based access or centralized identity control",
          "Manual internal processes caused delays and errors",
          "Limited visibility into security, usage, and data ownership"
        ],
        active: true,
      },
      {
        label: "What We Built / Delivered",
        description: [
          "Implemented Microsoft Entra ID with centralized user and group management",
          "Designed Azure tenant structure with basic governance controls",
          "Built Power Apps and Power Automate workflows for internal processes",
          "Set up Power BI Service workspaces with role-based access"
        ],
        active: false,
      },
      {
        label: "Impact / Result",
        description: [
          "Consistent access across Microsoft tools",
          "Reduced manual effort through automated workflows",
          "Improved security posture without operational complexity",
          "Created a scalable Microsoft cloud foundation for future growth"
        ],
        active: false,
      },
    ],
   
  },

];

----------------------------------------------------
  
const POWER_BI_CAROUSEL_CARDS: CarouselCard[] = [
  {
    id: 0,
    image: "/image/powerBi/BusinessValueMain.webp",
    imageMobile: "/image/powerBi/BusinessValueMain.webp",
    heading: "CASE STUDY ",
    title: "Client Context / Industry",
    description:
      "A B2B manufacturing company supplying components to enterprise customers. The company used an ERP system but relied on spreadsheets for management and MIS reporting.",
    tags: [
      {
        label: "The Problem",
        description: [
          "Financial and operational data were siloed",
          "Limited visibility into margins and receivables",
          "Monthly MIS reports were slow and manually prepared",
          "Frequent discrepancies during management reviews"
        ],
        active: true,
      },
      {
        label: "What We Built / Delivered",
        description: [
          "Modeled ERP and finance data in Power BI",
          "Published MIS dashboards via Power BI Service",
          "Reports covering revenue, costs, margins, and receivables",
          "Access control for finance and leadership teams"
        ],
        active: false,
      },
      {
        label: "Impact / Result",
        description: [
          "Faster and more reliable MIS reporting",
          "Clearer margin and cash flow visibility",
          "Reduced dependency on manual Excel consolidation",
          "More structured monthly reviews"
        ],
        active: false,
      },
    ],
  },
];
