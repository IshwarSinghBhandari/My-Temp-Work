"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Carousel3D() {
  const carouselRef = useRef(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeTagIndex, setActiveTagIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const slideIndexRef = useRef(0);
  const tagIndexRef = useRef(0);
  const prevSlideIndexRef = useRef(0);

  // Track window width for responsive radius
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cardData = [
    {
      id: 0,
      image: "/image/3dslider/rollingSliderImg_1.webp",
      imageMobile: "/image/3dslider/rollingSliderImgMobile_1.webp",
      heading: "AI SERVICE",
      title: "Intelligent Systems. Smarter Outcomes.",
      description:
        "Our AI Services cover the complete lifecycle, traditional AI data annotation, dataset creation, Gen AI model tuning and deployment, and custom AI application development enabling enterprises to build accurate, safe, and scalable AI solutions.",
      tags: [
        {
          label: "Traditional AI",
          description: "From precise data annotation to custom dataset creation and a scalable annotation platform, we deliver the full Traditional AI stack.",
          active: true
        },
        {
          label: "Gen AI",
          description: "We deliver end-to-end Generative AI solutions from model fine-tuning and safety evaluation to enterprise deployment powered by high-quality datasets and scalable AI platforms.",
          active: false
        },
        {
          label: "Custom AI Application",
          description: "Develop custom AI applications with domain-trained models, workflow automation, intelligent agents, and end-to-end integration across enterprise systems.",
          active: false
        },
      ],
      buttonLink: "/ai-data-services/",
    },
    {
      image: "/image/3dslider/rollingSliderImg_2.webp",
      imageMobile: "/image/3dslider/rollingSliderImgMobile_2.webp",
      heading: "PRODUCT ENGINEERING",
      title: "From Vision to Velocity.",
      description:
        "End-to-end product engineering that transforms bold ideas into scalable, enterprise-grade software solutions built for lasting impact.",
      tags: [
        {
          label: "SaaS & Product Development",
          description: "From idea and architecture design to full development, migration, and maintenance, we help you create cloud-native, enterprise-ready SaaS applications and software products that deliver value at every stage.",
          active: true
        },
        {
          label: "Mobile Application Development",
          description: "Deliver seamless mobile experiences with apps that are secure, intuitive, and built to scale as your business grows.",
          active: false
        },
        {
          label: "UX/UI",
          description: " Deliver meaningful user experiences with UX/UI design that boosts engagement, reduces friction, and drives measurable business results.",
          active: false
        },
      ],
      buttonLink: "/software-product-development-services/",
    },
    {
      image: "/image/3dslider/rollingSliderImg_3.webp",
      imageMobile: "/image/3dslider/rollingSliderImgMobile_3.webp",
      heading: "TALENT SOLUTIONS",
      title: "Your Team. Amplified.",
      description:
        "Strategic talent solutions that seamlessly integrate pre-vetted engineering experts into your projects scaling your capabilities without the overhead.",
      tags: [
        {
          label: "Staff Augmentation",
          description: "Augment your team with specialist engineers on-demand. Let's scale together with speed and quality.",
          active: true
        },
        {
          label: "Direct Placement",
          description: "We deliver full-time IT experts tailored to your company's mission and culture, using a direct placement model that prioritizes quality, longevity, and strategic growth.",
          active: false
        },
        {
          label: "Interview as a Service",
          description: "Reduce hiring errors with our interview service that provides unbiased evaluations backed by industry-standard testing.",
          active: false
        },
      ],
      buttonLink: "/it-staff-augmentation-services/",
    },
  ];

  const cardCount = cardData.length;
  const angle = 360 / cardCount;
  const radius = 22;
  const mobileRadius = radius;

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
  }, [activeSlideIndex, angle, cardCount]);

  // Keep refs in sync with state
  useEffect(() => {
    slideIndexRef.current = activeSlideIndex;
  }, [activeSlideIndex]);

  useEffect(() => {
    tagIndexRef.current = activeTagIndex;
  }, [activeTagIndex]);

  // Manual navigation
  const rotate = (direction) => {
    setActiveSlideIndex((prev) => {
      if (direction === "next") {
        return (prev + 1) % cardCount;
      } else {
        return (prev - 1 + cardCount) % cardCount;
      }
    });
    setActiveTagIndex(0);
  };

  // Tag cycling timer
  useEffect(() => {
    const tagInterval = setInterval(() => {
      const currentTag = tagIndexRef.current;
      const currentSlide = slideIndexRef.current;

      if (currentTag < 2) {
        setActiveTagIndex(currentTag + 1);
      } else {
        const nextSlide = (currentSlide + 1) % cardCount;
        setActiveSlideIndex(nextSlide);
        setActiveTagIndex(0);
      }
    }, 4000);

    return () => clearInterval(tagInterval);
  }, [cardCount]);

  return (
    <section className="relative w-full min-h-screen bg-[#101010] flex flex-col items-center justify-center overflow-hidden px-4 md:px-20 py-8 md:py-12">
      <p className="relative z-20 bg-[linear-gradient(131deg,rgba(109,117,133,0.9)_0%,rgba(218,54,67,0.9)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] font-semibold text-2xl md:text-4xl text-center tracking-[0] leading-[normal] mb-6 md:mb-[71px]">
        Our Areas of Expertise
      </p>

      <div className="w-full h-[600px] sm:h-[700px] md:h-full flex items-center justify-center">
        <div className="relative w-full max-w-[1400px] perspective-[1400px]">
          <div
            ref={carouselRef}
            className="relative w-full h-[600px] sm:h-[700px] md:h-[clamp(520px,65vh,720px)] [transform-style:preserve-3d] z-10"
          >
            {cardData.map((card, i) => {
              const cardDeg = i * angle;

              return (
                <div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transform: `rotateY(${cardDeg}deg) translateZ(${mobileRadius}vw)`,
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
                        src={windowWidth < 768 ? card.imageMobile : card.image}
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
                                  // If clicking on a tag that's not active yet
                                  if (tagIdx > activeTagIndex) {
                                    setActiveTagIndex(tagIdx);
                                  }
                                  // If last tag, move to next slide
                                  else if (tagIdx === activeTagIndex && tagIdx === 2) {
                                    const nextSlide = (activeSlideIndex + 1) % cardCount;
                                    setActiveSlideIndex(nextSlide);
                                    setActiveTagIndex(0);
                                  }
                                }
                              }}
                              className={`px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-lg text-[10px] sm:text-xs md:text-sm border transition-all duration-300 cursor-pointer ${isTagActive ? "border-[#da3643] text-[#da3643]" : "border-white/10 text-white hover:border-white/30"}`}
                            >
                              {tag.label}
                            </span>
                          );
                        })}
                      </div>
                      {card.tags.map((tag, tagIdx) => {
                        const isTagActive = tagIdx === activeTagIndex;
                        return isTagActive ? (
                          <p key={tagIdx} className="md:min-h-28 min-h-[88px] text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed" style={{ animation: 'fadeIn 0.3s ease-in-out 0.3s forwards', opacity: 0.1 }}>
                            {tag.description}
                          </p>
                        ) : null;
                      })}

                      <a href={card.buttonLink} className="inline-flex items-center px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base bg-[#da3643] rounded-lg hover:bg-[#c02e3a] transition mt-0">
                        Get in touch
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

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
        </div>
      </div>

      <div className="relative flex gap-2 justify-center mt-6 md:mt-[71px] z-20">
        {cardData.map((_, index) => {
          const isActive = index === activeSlideIndex;

          return (
            <div
              key={index}
              className={`h-1 rounded-full overflow-hidden flex transition-all duration-300 ${isActive ? "w-14" : "w-14"}`}
            >
              {[0, 1, 2].map((tagIdx) => {
                const isTagActive = isActive && tagIdx <= activeTagIndex;
                return (
                  <div
                    key={tagIdx}
                    className={`flex-1 transition-all duration-300 ${isTagActive ? "bg-[#da3643]" : "bg-[#212121]"}`}
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
