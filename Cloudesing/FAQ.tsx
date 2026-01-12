"use client";

import { Minus, Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import marketresearchmatrix from "../../public/image/dueDiligent/marketresearchmatrix.svg";

interface FAQ {
  question: string;
  answer?: string;
  points?: string[]; // Optional points list
}

interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
}

export default function FAQSection({ faqs, title }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    const matchButtonHeights = () => {
      // Reset all button heights to auto
      buttonRefs.current.forEach((btn) => {
        if (btn) {
          btn.style.height = "auto";
        }
      });

      // Get grid container
      const gridContainer = buttonRefs.current[0]?.closest(".grid");
      if (!gridContainer) return;

      // Get column count from computed styles
      const gridStyles = window.getComputedStyle(gridContainer);
      const columnTemplate = gridStyles.gridTemplateColumns;
      const columnCount =
        columnTemplate
          .split(" ")
          .filter((col) => col !== "none" && col.trim() !== "").length || 1;

      // Group buttons by row
      const rows: HTMLButtonElement[][] = [];
      const buttons = buttonRefs.current.filter(
        (btn): btn is HTMLButtonElement => btn !== null
      );

      buttons.forEach((btn, index) => {
        const rowIndex = Math.floor(index / columnCount);
        if (!rows[rowIndex]) {
          rows[rowIndex] = [];
        }
        rows[rowIndex].push(btn);
      });

      // Match button heights within each row
      rows.forEach((row) => {
        if (row.length === 0) return;
        // Use scrollHeight to get the natural height including padding
        const heights = row.map((btn) => btn.scrollHeight);
        const maxHeight = Math.max(...heights);
        row.forEach((btn) => {
          btn.style.height = `${maxHeight}px`;
        });
      });
    };

    // Run on mount and when accordion state changes
    const timeoutId = setTimeout(matchButtonHeights, 100);
    window.addEventListener("resize", matchButtonHeights);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", matchButtonHeights);
    };
  }, [openIndex, faqs]);

  return (
    <section className="relative bg-[#131414] py-20  px-6 lg:px-[105px]">
      {/* Background image */}
      <div
        className="absolute inset-0 top-[-85px] flex justify-center items-start opacity-40 bg-no-repeat bg-contain bg-top pointer-events-none"
        style={{
          backgroundImage: `url(${marketresearchmatrix.src})`,
        }}
      ></div>

      <div className=" mx-auto relative z-10">
        {/* Header */}
        <h2 className="bg-gradient-to-r text-center text-4xl font-semibold from-[#666666] mb-12 to-[#DA3643] bg-clip-text text-transparent">
          {title || "Frequently Asked Questions"}
        </h2>

        {/* FAQ Accordion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 items-start">
          {faqs?.map((faq, index) => (
            <div
              key={index}
              className="flex flex-col rounded-[10px] border overflow-hidden transition-all duration-300 ease-in-out shadow-[inset_0_0_40px_#FFFFFF1A] border-gray-700"
            >
              <button
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                className="flex justify-between items-center w-full min-h-[80px] p-6 text-left focus:outline-none text-white font-[500] text-[20px] transition-colors duration-200  flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAccordion(index);
                }}
                type="button"
              >
                <span className="pr-4 flex-1 font-inter ">{faq.question}</span>
                <span className="flex-shrink-0">
                  {openIndex === index ? (
                    <Minus size={20} />
                  ) : (
                    <Plus size={20} />
                  )}
                </span>
              </button>

              {/* Accordion content */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
                style={{ overflow: "hidden" }}
              >
                <div className="px-6 pb-6 text-[#ABABAB] leading-relaxed text-base">
                  {/*  Show answer (if any) first, then optional points list */}
                  {faq.answer && <p className="mb-3">{faq.answer}</p>}

                  {faq.points && (
                    <ul className="list-disc pl-5 space-y-2 font-inter font-light">
                      {faq.points.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
