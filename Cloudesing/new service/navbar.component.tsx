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
// import ProductMenuMobile from "../FunctionalComponents/ProductMenuMobile/ProductMenuMobile";
// import ProductMenuDesktop from "../FunctionalComponents/ProductMenuDesktop/ProductMenuDesktop";
import Breadcrumbs from "./Breadcrumbs";
import RunningTextNavbar from "./RunningTextNavbar";

const Navbar = () => {
  const pathname = usePathname();
  const pathNames = ["/"];

  const servicesList = [
    {
      title: "AI & Data Science",
      link: "/ai-development-services",
      image: "/images/AI-Development-Company.webp",
      listItems: [
        { isActive: true, link: "/generative-ai-and-llm-solutions", title: "Generative AI & LLM Solutions " },
        // { isActive: true, link: "#", title: "Machine Learning & MLOps" },
        { isActive: true, link: "#", title: "Data Science & Predictive Insights" },
        { isActive: true, link: "#", title: "Custom AI Application Development" },
        // { isActive: false, link: "/ai-data-services", title: "AI & ML Automation" },
        // { isActive: false, link: "/blockchain-development-services/", title: "Block Chain" },
      ],
    },
    {
      title: "Product Engineering",
      link: "/case-studies/ltts-avertle/",
      image: "/images/LandTCasebg.webp",
      listItems: [
        { isActive: true, link: "#", title: "Custom Software Development" },
        { isActive: true, link: "/software-product-development-services/", title: "SaaS & Product Development" },
        { isActive: true, link: "/ui-ux-design-services", title: "UI/UX Design" },
        { isActive: true, link: "/software-testing-services", title: "QA Engineering" },
        { isActive: true, link: "/application-modernization-services", title: "Legacy Application Modernization" },
        { isActive: true, link: "/iot-development-company/", title: "IoT & Embedded Systems" },
        { isActive: true, link: "/native-and-hybrid-app-development", title: "Mobile App Development" },
        // { isActive: false, link: "/agile-software-company", title: "Agile" },
        // { isActive: false, link: "/offshore-development-services/", title: "Offshore Software Development" },
      ],
    },
    {
      title: "Enterprise Application Development",
      link: "/case-studies/edelweiss-from-manual-to-digital-clarity/",
      icon: "/image/navbar/microsoft-logo.avif",
      image: "/images/edelweiss-from-manual-to-digital-clarity.webp",
      listItems: [
        {
          isActive: true, link: "#", title: "Microsoft Technologies",
          children: [
            { isActive: false, link: "/", title: " SharePoint" },
            { isActive: false, link: "/", title: "Microsoft Dynamics 365" },
            { isActive: false, link: "/", title: ".NET Development" },
            // { isActive: false, link: "/", title: "SQL Server" },
            // { isActive: false, link: "/", title: "Azure Services" },
          ],
        },
        {
          isActive: true,
          link: "#",
          title: "Power Platform",
          children: [
            { isActive: false, link: "/power-apps-development", title: "Power Apps" },
            { isActive: false, link: "/powerbi-services", title: "Power BI" },
            { isActive: false, link: "/", title: "Power Automate" },
          ],
        },
        { isActive: true, link: "#", title: "Salesforce" },
        { isActive: true, link: "/robotic-process-automation", title: "UiPath" }, // Corrected redundant UiPath entry
        { isActive: true, link: "/erp-services", title: "ERP" },
        // { isActive: false, link: "/microsoft-consulting-services", title: "Microsoft Consulting Services" },
        // { isActive: false, link: "/digital-content-management", title: "Digital Content Management" },
        // { isActive: false, link: "/power-apps-development", title: "Power Apps" },
        // { isActive: false, link: "/powerbi-services", title: "Power BI" },
      ],
    },
    {
      title: "Cloud & DevOps",
      link: "/case-studies/stickmancyber-sticksecure/",
      image: "/images/StikMainImg.webp",
      listItems: [
        { isActive: true, link: "#", title: "Cloud Architecture Advisory" },
        { isActive: true, link: "/cloud-migration-services", title: "Cloud Migration & Modernisation" },
        { isActive: true, link: "#", title: "DevOps Automation & SRE" },
        {
          isActive: true, link: "#", title: "Managed Cloud Services", children: [
            { isActive: false, link: "/aws-development-services", title: "AWS Consultancy Services" },
            { isActive: false, link: "/azure-development-services", title: "Azure Consultancy Services" },
            { isActive: false, link: "#", title: "Google Cloud Computing Services" },
          ]
        },
        { isActive: true, link: "#", title: "Cloud Governance" },
        { isActive: true, link: "/cloud-devops-services", title: "DevOps & Security" },
        // { isActive: false, link: "/aws-development-services", title: "AWS Consultancy" },
        // { isActive: false, link: "/azure-development-services", title: "Azure Consultancy" },
      ],
    },
    {
      title: "Data Engineering",
      link: "/data-analytics-services",
      image: "/images/datawarehousingservicesimg.webp",
      listItems: [
        { isActive: true, link: "/big-data-architecture-data-lakes", title: "Big Data Architecture & Data Lakes" },
        { isActive: true, link: "#", title: "Data Integration (ETL/ELT)" },
        { isActive: true, link: "#", title: "Data Platform Modernization" },
        { isActive: true, link: "#", title: "Real-Time Analytics" },
        { isActive: true, link: "#", title: "Data Visualization" },
        { isActive: true, link: "#", title: "DataOps" },
        // { isActive: false, link: "/data-warehousing-services", title: "Data Warehousing Services" },
        // { isActive: false, link: "/data-analytics-services", title: "Data & Analytics" },
      ],
    },
    {
      title: "Digital Marketing",
      link: "/seo-services",
      image: "/images/Comprehensive-SEO.webp",
      listItems: [
        { isActive: true, link: "/seo-services", title: "SEO & Content Strategy" },
        { isActive: true, link: "/sem-marketing-and-ppc-services", title: "Paid Ads (PPC)" },
        { isActive: true, link: "/web-development-service", title: "Website Development" },
        // { isActive: false, link: "#", title: "Social Media Management" },
        // { isActive: false, link: "/content-writing-Services", title: "Content Writing" },
      ],
    },
    {
      title: "Talent Solutions",
      link: "/it-staff-augmentation-services",
      image: "/images/staffaugmentationservicesimg.webp",
      listItems: [
        // { isActive: true, link: "#", title: "Contract Resourcing" },
        { isActive: true, link: "#", title: "Full-Time Hiring" },
        { isActive: true, link: "#", title: "Contract-to-Hire" },
        { isActive: true, link: "#", title: "Interview as a Service" },
        { isActive: true, link: "/it-staff-augmentation-services", title: "Staff Augmentation" },
        // { isActive: false, link: "/hr-services/", title: "HR Services" },
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

          <ServiceMenuDesktop servicesList={servicesList} />

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
