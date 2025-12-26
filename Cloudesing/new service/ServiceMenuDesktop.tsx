import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronRight, ChevronDown } from "lucide-react";

const ServiceMenuDesktop = ({ servicesList }) => {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onClickHideToggle = () => {
    if (mainRef.current) {
      mainRef.current.classList.add("hidden");
      setTimeout(() => {
        mainRef.current?.classList.remove("hidden");
      }, 100);
    }
    setIsMenuOpen(false);
  };
  const [activeCategory, setActiveCategory] = useState(servicesList[0]);
  const [childPopup, setChildPopup] = useState<{ children: any[]; top: number } | null>(null);
  const hidePopupTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChildHover = (item: any, target: HTMLElement | null) => {
    if (item.children?.length > 0 && target && mainRef.current) {
      if (hidePopupTimeout.current) {
        clearTimeout(hidePopupTimeout.current);
        hidePopupTimeout.current = null;
      }
      const parentRect = target.getBoundingClientRect();
      const containerRect = mainRef.current.getBoundingClientRect();
      const top = parentRect.top - containerRect.top;
      setChildPopup({ children: item.children, top });
    } else {
      setChildPopup(null);
    }
  };

  useEffect(() => {
    const node = mainRef.current;
    const handleMouseLeave = () => setChildPopup(null);
    node?.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      node?.removeEventListener("mouseleave", handleMouseLeave);
      if (hidePopupTimeout.current) {
        clearTimeout(hidePopupTimeout.current);
      }
    };
  }, []);

  // Find first active sub-item
  const firstActiveSubItem = servicesList[0].listItems.find(item => item.isActive);
  const [highlight, setHighlight] = useState(
    firstActiveSubItem
      ? {
        title: firstActiveSubItem.title,
        desc: firstActiveSubItem.title,
        children: firstActiveSubItem.children || [],
        icon: servicesList[0].icon,
        image: servicesList[0].image,
        link: servicesList[0].link,
      }
      : null
  );

  // Track selected sub-index
  const [activeSubIndex, setActiveSubIndex] = useState(
    firstActiveSubItem ? servicesList[0].listItems.indexOf(firstActiveSubItem) : 0
  );

  const contactUsImages = [
    { link: "https://www.instagram.com/cloudesign.technology/", img: "/images/service_instagram.svg" },
    { link: "https://www.facebook.com/cloudesign.in/", img: "/images/servicefacebook.svg" },
    { link: "https://www.linkedin.com/company/cloudesign/", img: "/images/service_linkedin.svg" },
    { link: "https://twitter.com/cloudesigntech", img: "/images/service_twitter.svg" },
  ];


  return (
    <div
      className="group lg:py-2"
      onMouseEnter={() => setIsMenuOpen(true)}
      onMouseLeave={() => setIsMenuOpen(false)}
    >
      <Link href="/services" className=" h-20  lg:justify-between items-center flex px-7" onClick={onClickHideToggle}>
        <span className="group-hover:text-[#DA3643] group-hover:border-[#DA3643] group-hover:border-b-[3px] lg:justify-between items-center flex">
          Services
          <ChevronDown size={20} color={isMenuOpen ? '#da3643' : 'black'} className={`ml-1 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
        </span>
      </Link>

      {/* Services Menu Content */}
      <div
        ref={mainRef}
        className={`lg:gap-5 absolute left-0 top-[5rem] z-50 w-full bg-[url(/images/service_menu_bg.webp)] bg-[0%_50%] bg-no-repeat bg-cover bg-white px-[105px] 2xl:px-[115px] py-[25px] flex flex-col transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] service-menu-section shadow-2xl ${isMenuOpen
          ? 'opacity-100 translate-y-0 scale-100 blur-0 pointer-events-auto'
          : 'opacity-0 translate-y-[-8px] scale-[0.96] blur-[4px] pointer-events-none'
          }`}
        style={{
          maxHeight: "calc(100vh - 8rem)",
          overflowY: "auto",
          boxShadow: `inset rgba(9, 30, 66, 0.06) 0px 1px 2px -1px, rgba(9, 30, 66, 0.25) 0px 4px 8px -2px`,
        }}
      >
        <div className="relative flex flex-col lg:gap-5">
          {/* 3-Column Section */}
          <div className="menu-container flex w-full gap-10">
            {/* Side Navigation */}
            <div className="menu-items-group w-full rounded-lg text-[14px] xl:text-[16px] flex flex-col pb-6 pt-[10px] px-4 gap-[8px]">
              {servicesList.map((cat: any, i: number) => (
                <span
                  key={i}
                  onMouseEnter={() => {
                    setActiveCategory(cat);

                    // Find first active sub-item in the new category
                    const firstSub = cat.listItems.find((item) => item.isActive);
                    if (firstSub) {
                      setActiveSubIndex(cat.listItems.indexOf(firstSub));
                      setHighlight({
                        title: firstSub.title,
                        desc: firstSub.title,
                        children: firstSub.children,
                        icon: cat.icon,
                        image: cat.image,
                        link: cat.link,
                      });
                    } else {
                      setActiveSubIndex(0);
                      setHighlight(null);
                    }
                  }}
                  className={`cursor-pointer font-medium flex pb-3 justify-between items-center gap-1 transition-colors border-b border-[#e3e3e3]
              ${activeCategory.title === cat.title ? "text-[#da3643]" : "text-[#515151] hover:text-[#da3643]"}
            `}
                >
                  {cat.title}
                  {activeCategory.title === cat.title && <ChevronRight size={20} color="#da3643" className="ml-1" />}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div className="w-[4px] rounded-lg bg-[#e3e3e3]" />

            {/* Sub  middle Navigation */}
            <div key={activeCategory.title} className="w-full flex flex-col gap-[10px] pt-2 text-[14px] xl:text-[16px]">
              {activeCategory.listItems.map((item, i) =>
                item.isActive ? (
                  <div
                    key={`${activeCategory.title}-${i}`}
                    className="relative animate-modern-slide service-menu-sub-item"
                    style={{ animationDelay: `${i * 0.03}s` }}
                    onMouseEnter={(e) => {
                      setActiveSubIndex(i);
                      setHighlight({
                        title: item.title,
                        desc: item.title,
                        children: item.children,
                        icon: activeCategory.icon,
                        image: activeCategory.image,
                        link: activeCategory.link,
                      });
                      handleChildHover(item, e.currentTarget);
                    }}
                    onMouseLeave={() => {
                      hidePopupTimeout.current = setTimeout(() => {
                        setChildPopup(null);
                      }, 100);
                    }}
                  >
                    <Link
                      href={item.link || "#"} // navigate to the sub-item link
                      className={`cursor-pointer transition-colors flex items-center justify-between gap-2 ${activeSubIndex === i ? "text-[#da3643] font-semibold" : "text-[#515151] hover:text-[#da3643]"
                        }`}
                      onClick={onClickHideToggle}
                    >
                      <span>{item.title}</span>
                      {item.children?.length > 0 && <ChevronRight size={16} className="transition-transform duration-300" />}
                    </Link>
                  </div>
                ) : null
              )}
            </div>

            {childPopup && childPopup.children.length > 0 && (
              <div
                className="absolute left-[48%] p-4 z-[60] bg-white rounded-xl shadow-2xl w-[300px] flex flex-col gap-2 border border-gray-100 text-[16px]"
                style={{ top: childPopup.top }}
                onMouseEnter={() => {
                  if (hidePopupTimeout.current) {
                    clearTimeout(hidePopupTimeout.current);
                    hidePopupTimeout.current = null;
                  }
                }}
                onMouseLeave={() => {
                  setChildPopup(null);
                }}
              >
                {childPopup.children.map((child, j) => (
                  <Link
                    key={j}
                    href={child.link || "#"}
                    className="cursor-pointer transition-colors flex items-center justify-between text-[#515151] hover:text-[#da3643]"
                    onClick={onClickHideToggle}
                  >
                    <span>{child.title}</span>
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            )}

            {/* Highlight Card */}
            <div key={`highlight-${activeCategory.title}-${activeSubIndex}`} className="highlight-card-container w-full flex flex-col justify-between h-full">
              <div className="highlight-card-box bg-[#f5f7fa] rounded-md px-6 py-4 w-[400px] shrink-0 flex flex-col justify-between min-h-[300px]">
                {/* Highlight Content */}
                <div className="min-h-[40px] flex flex-col justify-center">
                  <span className="text-lg font-semibold text-[#515151]">Page Highlight</span>
                  <div className="h-[3px] w-14 bg-[#da3643] rounded mt-1 mb-3"></div>
                </div>

                {/* White Box */}
                <div className="bg-white flex justify-start items-center px-3 py-2 rounded-lg text-[14px] xl:text-[16px] h-[220px]">
                  {highlight?.image ? (
                    <div className="highlight-image-container w-full h-full flex items-center justify-center bg-white">
                      <Image
                        src={highlight.image}
                        alt={`${activeCategory.title} visual`}
                        width={400}
                        height={220}
                        className="w-full h-full object-contain rounded-md"
                      />
                    </div>
                  ) : (
                    <span className="text-lg my-auto font-medium text-[#515151]">
                      No Highlight
                    </span>
                  )}
                </div>

                {/* Button */}
                {highlight && (
                  <div className="highlight-button flex items-center gap-2 text-[#da3643] font-semibold cursor-pointer  pt-3">
                    <Link
                      href={
                        highlight?.link ||
                        activeCategory.link ||
                        activeCategory.listItems[activeSubIndex]?.link ||
                        "#"
                      }
                      onClick={onClickHideToggle}
                    >
                      Explore Now
                    </Link>
                    <ArrowRight size={20} color="#da3643" />
                  </div>
                )}
              </div>

              {/* Social Section */}
              <div className="flex items-center gap-5 h-8 mt-2">
                <p className="text-[#6C6C6C] text-sm">Follow us on</p>
                <div className="flex items-center gap-3">
                  {contactUsImages.map((El, i) => (
                    <Link
                      key={i}
                      href={El.link}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="cursor-pointer"
                    >
                      <Image src={El.img} alt="social-icon" width={22} height={22} loading="lazy" fetchPriority="low" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default ServiceMenuDesktop;
