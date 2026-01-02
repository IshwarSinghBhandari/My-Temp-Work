import dynamic from "next/dynamic";
import { GoogleTagManager } from "@next/third-parties/google";
import { BusinessValue, ValueCard } from "@/components/common/BusinessValue";
import RollingSliderCarousel_2, { CarouselCard } from "../Carousels/rolling/RollingSliderCarousel_2";
import BusinessValueIcon1 from "../../../public/image/powerBi/BusinessValueIcon1.avif";
import BusinessValueIcon2 from "../../../public/image/powerBi/BusinessValueIcon2.avif";
import BusinessValueIcon3 from "../../../public/image/powerBi/BusinessValueIcon3.avif";
import BusinessValueIcon4 from "../../../public/image/powerBi/BusinessValueIcon4.avif";
import BusinessValueMain from "../../../public/image/powerBi/BusinessValueMain.webp";
import BusinessValueMainBG from "../../../public/image/powerApp/BusinessValueMainBG.avif";
import powerCardIcon1 from "../../../public/image/powerApp/powerCardIcon1.webp";
import powerCardIcon2 from "../../../public/image/powerBi/powerCardIcon2.webp";
import powerCardIcon3 from "../../../public/image/Icon/powerCardIcon3.webp";
import powerCardIcon4 from "../../../public/image/Icon/powerCardIcon4.webp";
import powerCardIcon5 from "../../../public/image/powerBi/powerCardIcon4.webp";
import powerCardIcon6 from "../../../public/image/powerBi/powerCardIcon6.webp";
// import { AchivementNumbers } from "@/components/common/AchivementNumbers";
import FAQSection from "@/components/FrequentlyAskedQuestions";
import { ServiceSection, ServicesWeOffer } from "./ServicesWeOffer";
import Link from "next/link";
import CommonButton from "../Buttons/button";
// const WhatCustomerSay2 = dynamic(() => import("../FunctionalComponents/WhatCustomerSay/WhatCustomerSay2"));
const RecentBlogs = dynamic(() => import("../FunctionalComponents/RecentBlogs/RecentBlogs"));
const ContactForm = dynamic(() => import("../FunctionalComponents/ContactUs/ContactForm"));
const TwoColumnSection = dynamic(() => import("../common/TwoColumnSection"));
const PowerBiServiceCapability = dynamic(() => import("./PowerBiServiceCapability"));
const WhyChooseCloudesign = dynamic(() => import("@/components/PowerAppBi/WhyChooseCloudesign"));

interface ServicesComponentProps {
  content: {
    MainSection: {

      title: string;
      heading: string;
    };
    section2: {
      heading: string;
      paragraph: string;
      paragraph1?: string;
      paragraph2?: string;
    };
    section8: {
      category: string;
    };
  };
}

const BUSINESS_VALUE_DATA = {
  heading: "Strategic Benefits of Power BI Solutions",
  description:
    "Choosing Cloudesign as your Power BI consulting services partner means gaining more than just dashboards and reports; it means unlocking business growth. Our Power BI solutions empower organizations to",
  mainImage: BusinessValueMain,
  backgroundImage: BusinessValueMainBG,
  cards: [
    { text: "Increase efficiency by reducing time spent on manual data processing", icon: BusinessValueIcon1 },
    { text: "Improve accuracy with centralized data models and automated reporting", icon: BusinessValueIcon2 },
    { text: "Enhance collaboration through interactive Power BI reports and shared insights", icon: BusinessValueIcon3 },
    { text: "Maximize ROI by connecting Power BI with Microsoft 365, Azure, and other tools", icon: BusinessValueIcon4 },
  ] as ValueCard[],
  footerText:
    "With our proven expertise, your business can transform data into a strategic advantage, driving productivity, customer satisfaction, and long-term growth",
};

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

const sections: ServiceSection[] = [
  {
    id: "development",
    title: "Power BI Development Services",
    description:
      "Our Power BI developers design custom solutions to help you connect, visualize, and analyze data from multiple sources.",
    subsection: [
      { id: 1, text: "Build interactive Power BI reports and dashboards" },
      { id: 2, text: "Integrate Power BI Desktop with your existing applications" },
      { id: 3, text: "Enable AI-driven insights for real-time decision making" },
      { id: 4, text: "Optimize data models and enhance report performance for faster analytics" },
      { id: 5, text: "From data collection to Power BI application deployment, we deliver end-to-end development support" },
    ],
  },
  {
    id: "consulting",
    title: "Power BI Consulting Services",
    description:
      "Leverage our Power BI consulting services to resolve technical challenges and maximize ROI from your BI investment.",
    subsection: [
      { id: 6, text: "Identify the right Power BI software setup for your business" },
      { id: 7, text: "Optimize performance and scalability of Power BI reports" },
      { id: 8, text: "Design best-fit BI architecture for long-term growth" },
      { id: 9, text: "Align insights with business goals and KPIs" },
    ],
  },
  {
    id: "organizational-strategy",
    title: "Power BI Organizational Strategy",
    description:
      "Transform into a data-driven enterprise with a tailored Power BI organizational strategy.",
    subsection: [
      { id: 11, text: "Assess current data maturity" },
      { id: 12, text: "Benchmark against industry best practices" },
      { id: 13, text: "Create a roadmap for BI adoption" },
      { id: 14, text: "Drive data culture across teams" },
    ],
  },
  {
    id: "managed-services",
    title: "Power BI Managed Services",
    description:
      "Reduce overhead and focus on growth while we manage your Power BI solution end to end.",
    subsection: [
      { id: 16, text: "Monitor system performance and usage" },
      { id: 17, text: "Provide ongoing updates and upgrades" },
      { id: 18, text: "Optimize data pipelines and refresh cycles" },
      { id: 19, text: "Deliver 24/7 support for Power BI desktop and cloud environments" },
    ],
  },
];

const POWER_APP_BI_CARDS = [
  {
    img: powerCardIcon1,
    title: "Microsoft Professionals",
    desc: "Certified Power BI and Microsoft technology experts with deep data analytics and visualization experience.",
  },
  {
    img: powerCardIcon2,
    title: "Power Platform Expertise",
    desc: "Skilled in Power BI, Power Apps, and Power Automate to deliver integrated, data-driven business solutions.",
  },
  {
    img: powerCardIcon3,
    title: "Proven Data & AI Success",
    desc: "Delivered impactful dashboards, analytics, and AI-powered insights to drive smarter, faster decisions.",
  },
  {
    img: powerCardIcon5,
    title: "Flexible Engagement Models",
    desc: "Choose from Development, Consulting, Strategy, or Managed Services tailored to your goals and scale.",
  },
  {
    img: powerCardIcon4,
    title: "Enterprise-Grade Implementation",
    desc: "Secure, scalable, and compliant Power BI architectures designed for high performance and reliability.",
  },
  {
    img: powerCardIcon6, // Reuse or replace with another icon if available
    title: "Seamless Integration",
    desc: "Effortless connectivity with Microsoft 365, Dynamics 365, Azure, and your existing enterprise systems.",
  },
];

const metrics = [
  {
    value: "500+",
    title: "Successful Transformations",
    description:
      "ROI-generating digital solutions delivered to Industry leaders across 10+ sectors",

  },
  {
    value: "150+",
    title: "Expert Engineers",
    description:
      "Cross-functional experts across AI, ML, IoT & more collaborating for excellent Client experience",
  },
  {
    value: "9+",
    title: "Years Of Excellence",
    description:
      "Unparalleled IT execution that’s forged lasting customer relationships",
  },
];

const faqs = [
  {
    question: "1. What is the Power BI service?",
    answer:
      "The Power BI service is a cloud-based business analytics platform by Microsoft that enables users to visualize data, share insights, and make data-driven decisions. It allows businesses to create dashboards, reports, and interactive analytics accessible from anywhere.",
  },
  {
    question: "2. What are the different types of Power BI services?",
    answer: "Power BI offers multiple services, including:",
    points: [
      "Power BI Desktop – for report creation and data modeling.",
      "Power BI Service (Cloud) – for collaboration, dashboards, and online report publishing.",
      "Power BI Mobile – for accessing reports on mobile devices.",
      "Power BI Report Server – for on-premises report hosting and management.",
    ],
  },
  {
    question: "3. What are the 4 roles in Power BI service?",
    answer: "Power BI service defines four main roles to manage access and permissions:",
    points: [
      "Admin – Manages workspace and security settings.",
      "Member – Can edit and publish content.",
      "Contributor – Can create and update content but cannot manage workspace settings.",
      "Viewer – Can only view reports and dashboards.",
    ],
  },
  {
    question: "4. Is Power BI a CRM or ERP?",
    answer:
      "No. Power BI is neither a CRM nor an ERP system. It is a business intelligence and analytics platform that integrates data from CRMs, ERPs, databases, and other sources to provide insights and visualizations.",
  },
  {
    question: "5. What is the difference between Power BI Desktop and Power BI Server?",
    answer: "Here’s how they differ:",
    points: [
      "Power BI Desktop – Installed locally, used for creating reports, dashboards, and data models.",
      "Power BI Report Server – On-premises server for publishing, managing, and sharing reports securely within an organization.",
    ],
  },
  {
    question: "6. Where is Power BI service hosted?",
    answer:
      "Power BI service is hosted on Microsoft Azure Cloud, ensuring scalability, security, and global accessibility. Users can access dashboards and reports from anywhere using a web browser or mobile app.",
  },
  {
    question: "7. How does Power BI integrate with other business tools?",
    answer:
      "Power BI integrates seamlessly with Microsoft 365, Dynamics 365, SQL Server, Azure, Excel, Salesforce, and other databases. This allows organizations to consolidate data from multiple sources into interactive dashboards and analytics.",
  },
  {
    question: "8. What are the benefits of using Power BI for businesses?",
    answer:
      "Power BI helps businesses visualize data, monitor KPIs, identify trends, and make data-driven decisions. It improves collaboration, reduces reporting time, and enables real-time analytics across departments.",
  },
  {
    question: "9. Can Power BI create real-time dashboards?",
    answer:
      "Yes. Power BI supports real-time data streaming from sources like IoT devices, APIs, and databases. This allows businesses to monitor live metrics and respond quickly to changing business conditions.",
  },
  {
    question: "10. How can my business implement Power BI services?",
    answer:
      "Partner with a Power BI consulting service to deploy, customize, and integrate Power BI with your existing systems. Expert consultants provide data modeling, dashboard design, and analytics strategy to help your organization become data-driven.",
  },
];


function PowerBiServiceComponent(data: ServicesComponentProps) {
  return (
    <>
      <GoogleTagManager gtmId="GTM-MGJX3SH" />
      <section
        className="relative w-full md:h-[750px] h-[550px] overflow-hidden flex flex-col  bg-[url(/image/powerBi/bannerBg.avif)] bg-cover bg-[right_-305px_top_359px] sm:bg-center md:bg-right"
      >
        <div className="flex flex-col justify-center h-full gap-[18px] px-[10px] md:px-0 w-full sm:pl-[40px] md:pl-[60px] lg:pl-[107px] lg:w-[50%] text-center md:text-start">
          <h1 className="text-white/90 font-[700] text-[36px] leading-tight sm:text-[42px] md:text-[52px]  ">
            {data.content.MainSection.title}
          </h1>
          <p className="text-[#fefefe] font-normal text-base leading-normal tracking-[0.5px] sm:text-lg sm:tracking-[0.8px] md:text-xl lg:text-2xl lg:tracking-[1.44px]">
            {data.content.MainSection.heading}
          </p>

          <Link href="/contact-us" className="mt-8 block" >
            <CommonButton content={"Let’s Connect"} type="Submit" />
          </Link>
        </div>
      </section>
      {/* section2 */}
      <TwoColumnSection
        data={data}
      />

      <section className="lg:px-[105px] bg-[#101010] lg:pt-[102px] max-lg:px-[26px] max-lg:py-[24px] lg:pb-[52px] relative ">
        <ServicesWeOffer
          heading="Our Power BI Service Offerings"
          subheading="Empower your business with data-driven insights through our comprehensive Power BI solutions, from development and consulting to strategy and managed services."
          sections={sections}
        />
      </section>

      {/* section 5 */}
      {/* <BusinessValue {...BUSINESS_VALUE_DATA} /> */}
      <RollingSliderCarousel_2
        cards={POWER_BI_CAROUSEL_CARDS}
        title="Strategic Solutions and Measurable Impact"
        description="A comprehensive review of the insights and professional expertise leveraged to deliver significant results and exceed project benchmarks."
      />

      {/* section6 */}
      <PowerBiServiceCapability />

      {/* section7 */}
      <WhyChooseCloudesign title="Why Choose Cloudesign?" powerAppBiCards={POWER_APP_BI_CARDS} BusinessValueMainBG={BusinessValueMainBG} />

      {/* section8 */}
      {/* <section className="max-lg:px-5">
        <WhatCustomerSay2 />
      </section>

      <AchivementNumbers cards={metrics} /> */}

      <section>
        <RecentBlogs serviceCategoryProps={data?.content?.section8?.category} />
      </section>

      {/* section11 */}
      <FAQSection faqs={faqs} />

      <section>
        <ContactForm />
      </section>
    </>
  );
}

export default PowerBiServiceComponent;



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
