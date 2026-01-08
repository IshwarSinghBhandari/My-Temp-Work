"use client";

import Image from "next/image";
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";

export interface ServiceItem {
  title: string;
  description: string;
}

interface ImageText2ColSection {
  title: string;
  description: string;
  imageUrl: any[];
  mobImageUrl?: any[];
  reverse?: boolean;
  showBackgroundBlur?: boolean;
  serviceItems?: ServiceItem[];
}

const ImageText2ColSection: React.FC<ImageText2ColSection> = ({
  title,
  description,
  imageUrl = [],
  mobImageUrl = [],
  reverse = false,
  showBackgroundBlur = false,
  serviceItems = [],
}) => {
  /* ------------------------------ IMAGE STATE ------------------------------ */
  const [isMobile, setIsMobile] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  /* ---------------------------- SERVICE STATE ------------------------------ */
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(true);

  const imageIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const serviceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /* ------------------------- SCREEN SIZE DETECTION -------------------------- */
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 600px)");
    const handleResize = () => setIsMobile(mediaQuery.matches);

    handleResize();
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  /* --------------------------- IMAGE SELECTION ------------------------------ */
  const imagesToRender = useMemo(
    () => (isMobile && mobImageUrl.length > 0 ? mobImageUrl : imageUrl),
    [isMobile, mobImageUrl, imageUrl]
  );

  /* -------------------------- IMAGE AUTO SLIDER ----------------------------- */
  useEffect(() => {
    setCurrentImageIndex(0);

    if (imageIntervalRef.current) {
      clearInterval(imageIntervalRef.current);
      imageIntervalRef.current = null;
    }

    if (imagesToRender.length > 1) {
      imageIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % imagesToRender.length);
      }, 3000);
    }

    return () => {
      if (imageIntervalRef.current) {
        clearInterval(imageIntervalRef.current);
        imageIntervalRef.current = null;
      }
    };
  }, [imagesToRender]);

  /* ----------------------- SERVICE AUTO ROTATION ---------------------------- */
  useEffect(() => {
    if (serviceItems.length === 0) return;

    setActiveServiceIndex(0);
    setShowDescription(true);

    serviceIntervalRef.current = setInterval(() => {
      setShowDescription(false);
      setTimeout(() => {
        setActiveServiceIndex((prev) => (prev + 1) % serviceItems.length);
        setTimeout(() => setShowDescription(true), 100);
      }, 300);
    }, 4000);

    return () => {
      if (serviceIntervalRef.current) {
        clearInterval(serviceIntervalRef.current);
        serviceIntervalRef.current = null;
      }
    };
  }, [serviceItems]);

  /* --------------------------- SERVICE CLICK ------------------------------- */
  const handleServiceItemClick = useCallback((index: number) => {
    if (serviceIntervalRef.current) {
      clearInterval(serviceIntervalRef.current);
      serviceIntervalRef.current = null;
    }

    setShowDescription(false);
    setTimeout(() => {
      setActiveServiceIndex(index);
      setTimeout(() => setShowDescription(true), 100);
    }, 300);
  }, []);

  /* ---------------------------------- JSX ---------------------------------- */
  return (
    <div className="relative max-lg:px-[26px]">
      {showBackgroundBlur && (
        <div className="absolute w-[440px] h-[440px] rounded-full opacity-20 blur-[20px] bg-[radial-gradient(50%_50%_at_50%_50%,#F05B67_0%,rgba(226,98,108,0.25)_61.82%,rgba(0,0,0,0)_100%)] top-[62%] lg:top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      )}

      <div
        className={`lg:px-[105px] flex flex-col max-lg:grid max-lg:grid-cols-1 text-white gap-[55px] lg:gap-[100px] ${
          reverse ? "lg:flex-row-reverse" : "lg:flex-row"
        }`}
      >
        {/* IMAGE */}
        <div className="flex-1 flex justify-center items-center relative sm:h-[550px] h-[232px] max-lg:order-last overflow-hidden">
          {imagesToRender.map((url, index) => (
            <div key={index} className="absolute inset-0">
              <Image
                src={typeof url === "string" ? url : url.src}
                alt={`${title} - image ${index + 1}`}
                fill
                priority={index === 0}
                className={`object-contain transition-opacity duration-1000 ${
                  index === currentImageIndex
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0"
                }`}
              />
            </div>
          ))}
        </div>

        {/* TEXT + SERVICES */}
        <div className="flex-1 my-auto flex flex-col justify-center gap-4">
          <h3 className="text-[#F9FBFD] md:text-[28px] text-[22px] font-medium red-hat-display">
            {title}
          </h3>
          <p className="text-[#CCC] md:text-[18px] text-[16px] leading-[26px] font-inter font-light">
            {description}
          </p>

          {serviceItems.length > 0 && (
            <div className="flex flex-col gap-6 mt-4 min-h-[220px]">
              {serviceItems.map((item, index) => {
                const isActive = index === activeServiceIndex;
                return (
                  <div
                    key={index}
                    onClick={() => handleServiceItemClick(index)}
                    className={`cursor-pointer border-l-4 p-3 transition-opacity ${
                      isActive
                        ? "opacity-100 border-[#aa2d2d]"
                        : "opacity-80 border-[#242424] hover:opacity-100"
                    }`}
                  >
                    <p className="font-bold text-lg">{item.title}</p>
                    <div
                      className={`transition-all duration-300 overflow-hidden ${
                        isActive && showDescription
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-[#ccc] pt-1">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageText2ColSection;
