import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

const ServiceMenuDesktop = ({ servicesList, isSticky }) => {
  const pathname = usePathname();
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
          <ChevronDown
            size={20}
            color={isMenuOpen ? '#da3643' : pathname === '/' && !isSticky ? 'white' : 'black'}
            className={`ml-1 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </span>
      </Link>

      <div
        ref={mainRef}
        className="invisible lg:gap-5 absolute left-0 top-[5rem] z-50 w-full bg-[url(/images/service_menu_bg.webp)] bg-white shadow-xl px-[105px] py-[40px] flex flex-col group-hover:!visible service-menu-section"
        style={{ maxHeight: "calc(100vh - 6rem)", overflowY: "auto" }}
      >
        <div className="grid grid-cols-3 gap-y-[50px] gap-x-[120px]">
          {servicesList.map((el: any, i: number) => (
            <div key={i} className="flex flex-col gap-3">
              <h2 className="text-[#050029] text-[18px] font-bold ">{el.title}</h2>
              <hr className="border border-[#DA3643] w-[54px]" />
              <div className="flex flex-col gap-4">
                {el.listItems.map((item: any, j: number) => (
                  <Link
                    key={j}
                    href={item.link}
                    onClick={onClickHideToggle}
                    className="flex gap-3 hover-container relative text-[#585858] hover:text-[#282828] text-[16px] font-semibold leading-normal"
                  >

                    {item.title}
                    {item.isActive && (
                      <Image
                        src="/images/service-arrow-right.svg"
                        alt="arrow-icon"
                        width={24}
                        height={24}
                        loading="lazy"
                        fetchPriority="low"
                        className="hover-image"
                      />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full border border-[#B9B9B9]" />

        <div className="flex justify-between ">
          <div className="flex items-center gap-[25px]">
            <p className="text-[#6C6C6C] text-[14px]">Follow</p>
            <div className="flex items-center gap-3">
              {contactUsImages.map((El: any, i: number) => (
                <Link
                  key={i}
                  href={El.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="cursor-pointer"
                >
                  <Image
                    src={El.img}
                    alt="social-icon"
                    width={24}
                    height={24}
                    loading="lazy"
                    fetchPriority="low"
                  />
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/services/"
            onClick={onClickHideToggle}
            className="flex items-center gap-3 hover-container relative text-[#585858] hover:text-[#282828]"
          >
            Explore All Services
            <Image
              src="/images/service-arrow-right.svg"
              alt="arrow-icon"
              width={24}
              height={24}
              loading="lazy"
              fetchPriority="low"
              className="hover-image"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceMenuDesktop;
