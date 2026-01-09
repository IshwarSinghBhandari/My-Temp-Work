"use client";

import React, { useState } from "react";

interface AdvisorData {
  name: string;
  title: string;
  image: string;
  description?: string;
}

interface OurAdvisorsProps {
  advisorsData: AdvisorData[];
}

export default function OurAdvisors({ advisorsData }: OurAdvisorsProps) {
  const [activeIndex, setActiveIndex] = useState(0); // first open by default

  return (
    <section className="bg-[#101010] md:py-[100px] py-6 px-6 lg:px-[105px] overflow-hidden">
      <div className="mx-auto flex justify-between gap-12 w-full">
        {/* LEFT CONTENT */}
        <div className="w-full md:w-[30%] pt-[90px] shrink-0 text-center md:text-start">
          <h2 className=" text-4xl red-hat-display font-semibold bg-[linear-gradient(100deg,rgba(109,117,133,0.90)_26.8%,rgba(218,54,67,0.90)_76.45%)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
            Our Advisors
          </h2>
          <p className="mt-4 font-inter font-normal text-[#cccccc] text-lg leading-[26px]">
            We don&apos;t just deliver prototypes; we deliver AI development
            solutions built for scale.
          </p>
        </div>

        {/* CARDS */}
        <div className="hidden md:flex h-[526px] w-[60%]">
          {advisorsData.slice(0, 3).map((advisor, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={index}
                onMouseEnter={() => setActiveIndex(index)}
                className={`
                  relative transition-all duration-300 ease-in-out
                 
                  ${isActive ? "w-[410px]" : "w-[240px]"}
                  overflow-hidden
                  ${index !== 0 ? "border-l border-[#2a2a2a]" : ""}
                `}
              >
                {/* IMAGE */}
                <img
                  src={advisor.image}
                  alt={advisor.name}
                  className={`
                    absolute left-1/2 -translate-x-1/2 object-cover transition-all duration-300
                    ${
                      isActive ? "top-[30px] h-[340px]" : "top-[30px] h-[340px]"
                    }
                  `}
                />

                {/* GRADIENT OVERLAY AT BOTTOM OF IMAGE */}
                <div
                  className="absolute bottom-[110px] left-0 w-full h-[70%] pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(16, 16, 16, 0.00) 8.3%, rgba(16, 16, 16, 0.58) 68.77%, #101010 86.47%)",
                  }}
                />

                {/* ALWAYS VISIBLE BOTTOM SHADOW */}
                <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-[#101010] via-[#101010]/70 to-transparent pointer-events-none" />

                {/* TEXT (ALWAYS VISIBLE, DESCRIPTION ONLY ON ACTIVE) */}
                <div
                  className={`absolute transition-all duration-300 ${
                    isActive
                      ? "bottom-0 w-full p-4"
                      : "left-[26px] -bottom-[20px] -rotate-90 origin-top-left w-[260px]"
                  }`}
                >
                  <h3 className="text-white text-[22px] font-medium red-hat-display">
                    {advisor.name}
                  </h3>

                  <p className="text-[#d1d5db] text-[14px] font-light mt-1 font-inter">
                    {advisor.title}
                  </p>

                  {isActive && (
                    <>
                      <div className="w-[45px] h-[2px] bg-[#DA3643] my-3" />
                      {advisor.description && (
                        <p className="text-[#e5e7eb] text-[14px] leading-[20px] font-inter font-light">
                          {advisor.description}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE (STACKED, CLEAN) */}
      <div className="md:hidden mt-12 space-y-6">
        {advisorsData.map((advisor, index) => (
          <div key={index} className="bg-[#151515] rounded-lg overflow-hidden">
            <img
              src={advisor.image}
              alt={advisor.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-white text-lg font-semibold red-hat-display">
                {advisor.name}
              </h3>
              <p className="text-[#cccccc] text-sm font-inter font-light">
                {advisor.title}
              </p>
              {advisor.description && (
                <p className="mt-2 text-[#d1d5db] text-sm font-inter font-light">
                  {advisor.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
