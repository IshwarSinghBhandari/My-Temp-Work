"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Logo from "../../../public/images/Cloudesign-Logo.svg";
import WhiteLogo from "../../../public/images/white-logo.svg";
import { usePathname } from "next/navigation";
import MenuIcon from "../../../public/images/menuIcon.svg";
import MenuDarkIcon from "../../../public/images/MenuDarkIcn.png";
import ServiceMenuMobile from "../FunctionalComponents/ServiceMenuMobile/ServiceMenuMobile";
import CrossIcon from "./assets/cross-menu-icon.svg";
import ServiceMenuDesktop from "../FunctionalComponents/ServiceMenuDesktop/ServiceMenuDesktop";
import ProductMenuMobile from "../FunctionalComponents/ProductMenuMobile/ProductMenuMobile";
import ProductMenuDesktop from "../FunctionalComponents/ProductMenuDesktop/ProductMenuDesktop";
import RunningTextNavbar from "./RunningTextNavbar";
import Breadcrumbs from "./Breadcrumbs";

const Navbar = () => {
  const pathname = usePathname();
  const pathNames = ["/"];

  const servicesList = [
    {
      title: "Development & Maintenance",
      icon: "/images/DevIcon.svg",
      listItems: [
        {
          isActive: true,
          link: "/agile-software-company",
          title: "Agile",
        },
        {
          isActive: true,
          link: "/software-product-development-services/",
          title: "Product Development",
        },
        {
          isActive: true,
          link: "/application-modernization-services",
          title: "Application Modernization",
        },
        {
          isActive: true,
          link: "/offshore-development-services/",
          title: "Offshore Software Development",
        },
        // {
        //   isActive: true,
        //   link: "/site-reliability-engineering",
        //   title: "Site Reliability Engineering",
        // },
        {
          isActive: true,
          link: "/software-testing-services",
          title: "Quality Assurance & Testing",
        },
        {
          isActive: true,
          link: "/it-staff-augmentation-services",
          title: "Staff Augmentation",
        },
      ],
    },
    {
      title: "Emerging Technology",
      icon: "/images/EmergingIcon.svg",
      listItems: [
        {
          isActive: true,
          link: "/ai-data-services",
          title: "AI & ML Automation",
        },
        {
          isActive: true,
          link: "/blockchain-development-services",
          title: "Blockchain",
        },
        // {
        //   isActive: true,
        //   link: "/web3-development-services",
        //   title: "Web 3.0",
        // },
        {
          isActive: true,
          link: "/iot-development-company",
          title: "IoT Platform Engineering",
        },
        {
          isActive: true,
          link: "/business-intelligence-services",
          title: "Business Intelligence Services",
        },
        {
          isActive: true,
          link: "/data-warehousing-services",
          title: "Data Warehousing Services",
        },
      ],
    },
    {
      title: "Enterprise Software",
      icon: "/images/EnterpriseIcon.svg",
      listItems: [
        {
          isActive: true,
          link: "/robotic-process-automation",
          title: "UiPath",
        },
        {
          isActive: true,
          link: "/power-apps-development",
          title: "Power Apps",
        },
        {
          isActive: true,
          link: "/microsoft-consulting-services",
          title: "Microsoft Consulting Services",
        },
        {
          isActive: true,
          link: "/powerbi-services",
          title: "Power BI",
        },
        { isActive: true, link: "/erp-services", title: "ERP" },
        {
          isActive: true,
          link: "/digital-content-management",
          title: "Digital Content Management",
        },
      ],
    },
    {
      title: "Digital Marketing",
      icon: "/images/DigitalIcon.svg",
      listItems: [
        {
          isActive: true,
          link: "/sem-marketing-and-ppc-services",
          title: "SEM & PPC",
        },
        { isActive: true, link: "/seo-services", title: "SEO" },
        {
          isActive: true,
          link: "/content-writing-Services",
          title: "Content Writing",
        },
        {
          isActive: true,
          link: "/web-development-service",
          title: "Website Development",
        },
        {
          isActive: true,
          link: "/native-and-hybrid-app-development",
          title: "Mobile App Development",
        },
      ],
    },
    {
      title: "Cloud & DevOps",
      icon: "/images/cloudIcon.svg",
      listItems: [
        {
          isActive: true,
          link: "/cloud-devops-services",
          title: "DevOps & Security",
        },
        {
          isActive: true,
          link: "/aws-development-services",
          title: "AWS Consultancy",
        },
        {
          isActive: true,
          link: "/azure-development-services",
          title: "Azure Consultancy",
        },
        {
          isActive: true,
          link: "/cloud-migration-services",
          title: "Cloud Migration",
        },
      ],
    },
    {
      title: "Digital",
      icon: "/images/DevIcon.svg",
      listItems: [
        {
          isActive: true,
          link: "/ui-ux-design-services",
          title: "UI & UX Experience",
        },
        {
          isActive: true,
          link: "/data-analytics-services",
          title: "Data & Analytics",
        },
        {
          isActive: false,
          link: "",
          title: "",
        },
        {
          isActive: true,
          link: "/hr-services/",
          title: "HR Services",
        },
      ],
    },
  ];

  const staffingList = [
    {
      title: "Staffing Solutions",
      icon: "/images/StaffingIcon.svg",
      listItems: [
        // {
        //   isActive: true,
        //   link: "/it-staff-augmentation-services",
        //   title: "IT Staff Augmentation Services",
        // },
        // {
        //   isActive: true,
        //   link: "/hire-java-developers",
        //   title: "Hire Java Developers",
        // },
        // {
        //   isActive: true,
        //   link: "/hire-dotnet-developers",
        //   title: "Hire .Net Developers",
        // },
        // {
        //   isActive: true,
        //   link: "/hire-reactjs-developers",
        //   title: "Hire ReactJs Developers",
        // },
        // {
        //   isActive: true,
        //   link: "/hire-nodejs-developers",
        //   title: "Hire NodeJs Developers",
        // },
        // {
        //   isActive: true,
        //   link: "/technology/angularjs/",
        //   title: "Hire Angular Developers",
        // },
        // {
        //   isActive: true,
        //   link: "/technology/python/",
        //   title: "Hire Python Developers",
        // },
        // {
        //   isActive: true,
        //   link: "/technology/sql/",
        //   title: "Hire SQL Developers",
        // },
        // {
        //   isActive: true,
        //   link: "/technology/blue-prism/",
        //   title: "Hire Blue Prism Developers",
        // },
        // {
        //   isActive: true,
        //   link: "/technology/automation-anywhere/",
        //   title: "Hire Automation Anywhere Developers",
        // },
      ],
    },
  ];
  const productList = [
    {
      isActive: true,
      link: "/product/duedel-ai-risk-assessment-tool",
      title: "DueDel",
    },
  ];

  const [isClicked, setIsClicked] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    // Check initial scroll position on mount (handles refresh at scrolled position)
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const contactUsImages = [
    {
      link: "https://www.instagram.com/cloudesign.technology/",
      img: "/images/service_instagram.svg",
    },
    {
      link: "https://www.facebook.com/cloudesign.in/",
      img: "/images/servicefacebook.svg",
    },
    {
      link: "https://www.linkedin.com/company/cloudesign/",
      img: "/images/service_linkedin.svg",
    },
    {
      link: "https://twitter.com/cloudesigntech",
      img: "/images/service_twitter.svg",
    },
  ];

  const [isHovered, setIsHovered] = useState(false);

  return (
    // <div className="4xl:max-w-[1600px] mx-auto">
    <div className="w-full mx-auto">
      <RunningTextNavbar isSticky={isSticky} />

      <div
        className={`fixed left-0 w-full z-50 border-none 
    ${isSticky
            ? "top-[50px] translate-y-0 bg-white text-black shadow-sm"
            : pathname === "/"
              ? isHovered
                ? "top-[50px] translate-y-0 bg-white text-black shadow-sm"
                : "top-[50px] translate-y-0 bg-transparent text-white"
              : "top-[50px] translate-y-0 bg-white text-black shadow-sm"
          }
     transition-all duration-200 ease-out
     max-lg:text-black
    text-lg max-lg:px-5 px-[5%] 4xl:max-w-[1600px] lg:flex lg:justify-between`}
      >

        <div className="flex relative justify-between items-center">
          <Link href="/">
            <Image
              src={
                pathNames.includes(pathname) && !isSticky && !isHovered
                  ? WhiteLogo
                  : Logo
              }
              alt="Logo"
              priority
            />
          </Link>

          <div
            className="cursor-pointer absolute right-0 max-md:block md:hidden"
            onClick={() => {
              setIsClicked(!isClicked);
            }}
          >
            {isClicked ? (
              <Image src={CrossIcon} alt="Close Menu" />
            ) : pathNames.includes(pathname) ? (
              <Image src={MenuIcon} alt="Menu" />
            ) : (
              <Image src={MenuDarkIcon} alt="Menu" />
            )}
          </div>

          {/* for Mobile */}
          <div
            className={`fixed inset-0 h-[100vh] bg-white text-black z-50 transform ${isClicked ? "translate-x-0" : "translate-x-full"
              } transition-transform duration-500 ease-in-out md:hidden`}
          >
            <div className="flex flex-col items-start justify-start h-full p-5 overflow-auto">
              <div className="flex w-full justify-between items-center mb-8">
                <Link href="/">
                  <Image
                    src={
                      pathNames.includes(pathname) && !isSticky ? Logo : Logo
                    }
                    alt="Logo"
                    priority
                  />
                </Link>
                <button
                  onClick={() => setIsClicked(false)}
                  className="text-3xl text-black"
                >
                  <Image src={CrossIcon} alt="Close Menu" />
                </button>
              </div>

              <ul className="flex flex-col space-y-4 text-lg">
                <li>
                  <Link href="/" onClick={() => setIsClicked(false)}>
                    Home
                  </Link>
                </li>
                <li>
                  <ServiceMenuMobile servicesList={servicesList} />
                </li>
                <li>
                  <Link href="/about-us" onClick={() => setIsClicked(false)}>
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/case-studies"
                    onClick={() => setIsClicked(false)}
                  >
                    Our Work
                  </Link>
                </li>
                <li>
                  {/* <ProductMenuMobile productList={productList} /> */}
                </li>

                <li>
                  <Link href="/blogs" onClick={() => setIsClicked(false)}>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us">
                    <button className="px-4 py-2 bg-red-600 text-white rounded">
                      Let’s Collaborate
                    </button>
                  </Link>
                </li>
              </ul>
              <div className="w-full my-5 border-2 border-[#B9B9B9]"></div>
              <div className="flex justify-between gap-[25px]">
                <p className="text-[#6C6C6C] text-[14px] font-normal">Follow</p>
                <div className="flex items-center gap-3">
                  {contactUsImages.map((El: any, i) => {
                    return (
                      <Link
                        key={i}
                        href={El.link}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="w-full cursor-pointer"
                      >
                        <img src={El.img} alt="social-icon" loading="lazy" decoding="async" fetchPriority="low" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* for desktop */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="hidden h-20  lg:flex  items-center"
        >
          <Link
            className="hover:text-[#DA3643] hover:border-[#DA3643] hover:border-b-[3px] mr-4"
            href="/"
          >
            Home
          </Link>

          <ServiceMenuDesktop servicesList={servicesList} isSticky={isSticky} />

          <Link
            className="hover:text-[#DA3643] hover:border-[#DA3643] hover:border-b-[3px] mx-4"
            href="/about-us"
          >
            About
          </Link>
          <Link
            className="hover:text-[#DA3643] hover:border-[#DA3643] hover:border-b-[3px] mx-7"
            href="/case-studies"
          >
            Our Work
          </Link>
          {/* <ProductMenuDesktop productList={productList} /> */}

          <Link
            className="hover:text-[#DA3643] hover:border-[#DA3643] hover:border-b-[3px] ml-4"
            href="/blogs"
          >
            Blog
          </Link>
          {/* <Link href="/contact-us">
            <button className="px-4 py-2 bg-red-600 text-white rounded-[8px]">
              Let’s Collaborate
            </button>
          </Link> */}
        </div>

      </div>
      <div
        className={
          pathname === "/"
            ? isSticky
              ? "mt-[132px]"
              : "mt-0"
            : isSticky
              ? "mt-[132px]"
              : "mt-[50px] md:mt-[80px]"
        }
      >
        <Breadcrumbs />
      </div>

    </div >
  );
};

export default Navbar;
