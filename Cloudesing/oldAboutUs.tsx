import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import DirectorImg from "./asset/DirectorsImg.avif";
import MeetingImg from "./asset/MeetingImg.avif";
import LinkedIn from "./asset/LinkedIn.png";
import NishantShettyImg from "./asset/NishathShettyimage.webp";
import KetanSolankiImg from "./asset/KetanSolankiimage.webp";
import RohitJainImg from "./asset/RohitJainimage.webp";
import AbhiSinghImg from "./asset/AbhijeetSinghimage.webp";
import JoinTheTribeBg from "./asset/JoinTheTribeBg.avif";
import icon1 from "./asset/Icon1.png";
import icon2 from "./asset/Icon2.png";
import icon3 from "./asset/Icon3.png";
import icon4 from "./asset/Icon4.png";
import JoinTheTribeBgforMobile from "./asset/JoinTheTribeMobBg.avif";
const LifeAtCloudesignCarousel = dynamic(
  () => import("@/components/Carousels/LifeAtCloudesignCarousel"),
  { ssr: false }
);
const HorizontalSlider = dynamic(
  () => import("@/components/Sliders/HorizontalSlider"),
  { ssr: false }
);
const ContactForm = dynamic(
  () => import("@/components/FunctionalComponents/ContactUs/ContactForm"),
  { ssr: false }
);

export const metadata = {
  title: "About Us | Cloudesign",
  alternates: {
    canonical: "https://www.cloudesign.com/about-us/",
  },
  description:
    "Professionals who decided to grow old together with Cloudesign Born to Meet the Market’s Need for Efficiency Cloudesign Technology Service Pvt Ltd. (CTS) had its unexpected beginnings when Cloudtrack, a real-time logistics tracking solution created by Nishanth Shetty, won widespread recognition for exemplary quality and great product-market fit. The recognition drove market demand for Cloudesign’s digital...",
};

export default function AboutUs() {
  const bornToMeetPara = [
    {
      id: 0,
      content:
        "Cloudesign Technology Service Pvt Ltd. (CTS) had its unexpected beginnings when Cloudtrack, a real-time logistics tracking solution created by Nishanth Shetty, won widespread recognition for exemplary quality and great product-market fit.",
    },
    {
      id: 1,
      content:
        "The recognition drove market demand for Cloudesign’s digital solutions and paved the way to path-breaking partnerships across fintech, e-commerce, and healthcare. Effectively meeting this demand was made possible by the onboarding of other co-founders and diligent team expansion.",
    },
    {
      id: 2,
      content:
        "Cloudesign was thus born to fulfill the market’s demand for quality enterprise software solutions. A commitment to excellence drove consistent growth, and the rest, as they say, is history.",
    },
  ];

  const onMission = [
    {
      id: 0,
      heading: "On a Mission",
      content:
        "To be the world’s leading digital transformation and IT services provider",
      smallContent:
        "by delivering customized cutting-edge enterprise solutions",
    },
    {
      id: 1,
      heading: "Driven by the Vision",
      content:
        "Of bridging the digital divide between enterprises of every scale",
      smallContent: "by enabling equal access to technology and innovations",
    },
  ];

  const directorsInfo = [
    {
      id: 0,
      image: NishantShettyImg,
      name: "Nishanth Shetty",
      role: "Co-founder | CEO",
      linkedIn: "https://in.linkedin.com/in/nishanth-shetty",
      work: "Responsible for strategic direction, revenue generation, and building exceptional customer relationships.",
    },
    {
      id: 1,
      image: KetanSolankiImg,
      name: "Ketan Solanki",
      role: "Co-founder | Operations Head | CHRO",
      linkedIn: "https://in.linkedin.com/in/ketan-solanki-a6494b36",
      work: "Owns operational and process efficiency. Ensures all-round employee well-being.",
    },
    {
      id: 2,
      image: RohitJainImg,
      name: "Rohit Jain",
      role: "Co-founder | CTO",
      linkedIn: "https://www.linkedin.com/in/rohit-jain-1907/",
      work: "In charge of driving end-to-end product delivery and fostering a high-performance culture.",
    },
    {
      id: 3,
      image: AbhiSinghImg,
      name: "Abhijeet Singh",
      role: "Co-founder | CTO",
      linkedIn: "https://www.linkedin.com/in/abhijeet-singh-23076888/",
      work: "Heads innovation and technology adoption. Designing futuristic Fortune 500 solutions is his forte.",
    },
  ];

  const journeyDetails = [
    {
      id: 0,
      image: "/images/twenty-fifteen.svg",
      icon: icon1,
    },
    {
      id: 1,
      image: "/images/twenty-sixteen.svg",
      icon: icon2,
    },
    {
      id: 2,
      image: "/images/twenty-seventeen.svg",
      icon: icon3,
    },
    {
      id: 3,
      image: "/images/twenty-twenty.svg",
      icon: icon2,
    },
    {
      id: 4,
      image: "/images/twenty-one-first.svg",
      icon: icon4,
    },
    {
      id: 5,
      image: "/images/twenty-three-first.svg",
      icon: icon1,
    },
    {
      id: 6,
      image: "/images/twenty-three-second.svg",
      icon: icon2,
    },
  ];

  return (
    <>
      {/* Heading Content */}
      <section className="pl-[105px] max-lg:px-4 grid grid-cols-2 max-md:grid-cols-1 max-md:gap-[18px] w-full mx-auto">
        <div className="flex items-center max-w-[602px] max-md:pt-[36px]">
          <h1 className="font-bold text-[46px] leading-[56px] text-[#353435]">
            Professionals who decided to grow old together with{" "}
            <span className="text-[#DA3643]">Cloudesign</span>
          </h1>
        </div>
        <Image
          src={DirectorImg}
          className=" w-full"
          alt="DirectorImg"
          priority
        />
      </section>

      {/* Born to meet */}
      <section className="w-full mx-auto max-md:py-10 lg:py-16 px-4 lg:px-12 flex flex-col lg:flex-row items-start lg:items-center gap-8">
        {/* Left Heading */}
        <h2 className="font-bold text-[28px] leading-[42px] text-[#353435] w-full lg:w-[40%]">
          Born to Meet the Market’s <br /> Need for Efficiency
        </h2>

        {/* Right Paragraphs */}
        <div className="w-full lg:w-[60%] flex flex-col gap-4 text-[#353435] font-[400] text-[18px] leading-[27px] max-md:text-[16px]">
          {bornToMeetPara?.map((para) => (
            <p key={para.id}>{para.content}</p>
          ))}
        </div>
      </section>

      {/* Journey Details Slider */}
      <section className="max-md:h-[950px] lg:px-[105px] max-md:pt-[38px] lg:py-24 max-lg:px-4 bg-[#F6F8FF] w-full mx-auto">
        <div className="flex flex-col gap-[12px]">
          <h2 className="max-md:text-[24px] max-md:leading-[36px] max-w-[1020px] font-bold text-[32px] leading-[48px] text-center mx-auto text-[#353435]">
            A Journey Defined by Ground-breaking Innovations, Stellar Executions
            and Fulfilling Customer Relationships
          </h2>
          <hr className="w-[57px] mx-auto max-md:mb-[24px] text-[#DA3643] border-2 border-[#DA3643] " />
        </div>
        <HorizontalSlider content={journeyDetails} />
      </section>

      {/* onmission Target */}
      <section className="lg:py-[51px] lg:px-[105px] max-md:mt-0 max-md:h-[432px] max-md:pl-[15px]  max-md:flex max-md:flex-col max-md:flex-wrap lg:flex lg:flex-row justify-center w-full mx-auto gap-4">
        {onMission &&
          onMission.map((onMission, i) => (
            <div
              key={i}
              className="max-md:w-full max-md:h-[174px] max-md:gap-[12px]"
            >
              <h2 className="max-md:w-[376px] max-md:h-[36px] max-md:text-[24px] max-md:leading-[36px] w-[602px] h-[42px] leading-[42px] text-[#353435] font-[700] text-[28px] max-md:mb-3">
                {onMission.heading}
              </h2>
              <hr className="w-[57px] my-1 text-[#DA3643] border-2 border-[#DA3643] max-md:mb-3 " />
              <p className="max-md:w-[376px] max-md:h-[54px] max-md:text-[18px] max-md:leading-[27px] w-[602px] h-[72px] text-[#DA3643] font-[500] text-[24px] leading-[36px] max-md:mb-3">
                {onMission.content}
              </p>
              <p className="max-md:w-[376px] max-md:h-[48px] max-md:text-[16px] max-md:leading-[24px] w-[602px] h-[27px] font-[300] text=[18px] leading-[27px] text-[#353435] max-md:mb-3">
                {onMission.smallContent}
              </p>
            </div>
          ))}
      </section>

      {/* Meet our makers */}
      <section className="max-md:h-[2830px] relative h-[753px] w-full mx-auto">
        <Image src={MeetingImg} className="h-full w-full" alt="meeting-Img" />
        <div className="font-bold text-white max-md:bg-[#474747de] bg-[#5858589E] absolute top-0 h-full w-full">
          <div className="max-md:w-[376px] max-md:h-[204px] max-md:gap-[12px] w-[1230px] mx-auto mt-[51px] mb-[51px] h-[651px]">
            <h2 className="max-md:w-[376px] max-md:h-[36px] max-md:text-[24px] max-md:leading-[36px] max-md:text-center font-[700] text-[#ffff] text-[32px] leading-[48px] text-center">
              Meet Our Makers
            </h2>
            <hr className="w-[54.5px] mx-auto my-2 text-[#DA3643] border-2 border-[#DA3643] " />
            <p className="max-md:w-[376px] max-md:h-[144px] max-md:text-[16px] max-md:leading-[24px] max-md:text-center w-full h-[61px] font-[300] text-[16px] leading-[24px] text-center ">
              From a product-focused company to an all-around enterprise
              solutions provider, Cloudesign has transformed and diversified
              significantly over the years. Here are the minds that guided this
              journey and steered us to success.
            </p>
            <div className="mt-9 lg:grid lg:grid-cols-2 lg:gap-[26px]">
              {directorsInfo &&
                directorsInfo.map((directorsInfoDetails, i) => (
                  <div
                    key={i}
                    className="max-md:my-8 max-md:w-[376px] max-md:h-[602px] w-[602px] h-[229px] max-md:flex max-md:flex-col flex flex-row"
                  >
                    <div className="max-md:w-[376px] max-md:h-[400px] w-[209px] h-full ">
                      <Image
                        src={directorsInfoDetails.image}
                        className="max-md:w-full max-md:h-full"
                        alt={`Image of ${directorsInfoDetails.name}`}
                      />
                    </div>
                    <div className="bg-[#231F20] max-md:w-[376px] max-md:h-[202px] max-md:p-[28px] max-md:gap-[12px] w-[393px] p-10">
                      <div className="w-[345px] gap-[12px]">
                        <div className="flex">
                          <h2 className="w-[291px] h-[27px] text-[#FFFFFF] font-[700] text-[18px] leading-[27px] ">
                            {directorsInfoDetails.name}
                          </h2>
                          <Link
                            href={directorsInfoDetails.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                          >
                            <Image
                              src={LinkedIn}
                              className="w-[28px] h-[28px]"
                              alt="LinkedIn icon"
                            />
                          </Link>
                        </div>
                        <p className="w-[291px] h-[23px] font-[300] text-[#FFFFFF] text-[14px] leading-[23px] max-md:mb-3">
                          {directorsInfoDetails.role}
                        </p>
                        <hr className="w-[54.5px] mt-2 mb-4 text-[#DA3643] border-2 border-[#DA3643] max-md:mb-3" />
                      </div>
                      <p className="w-[345px] h-[81px] text-[#FFFFFF] font-[300] text-[18px] leading-[27px] max-md:mb-3">
                        {directorsInfoDetails.work}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-md:h-[576px] max-md:gap-[30px] max-md:flex max-md:justify-center h-[699px] gap-[45px] pt-[51px] pb-[51px] w-full mx-auto">
        <div className="max-md:w-[376px] max-md:h-full max-md:justify-center max-md:mx-auto max-md:gap-[24px] ">
          <div className="lg:w-[1230px] lg:mx-auto">
            <h2 className="max-md:w-[376px] max-md:h-[36px] max-md:text-[24px] max-md:leading-[36px] font-[700] text-[#353435] text-[32px] h-[48px] leading-[48px] text-center">
              Life at Cloudesign
            </h2>
            <hr className="w-[57px] mx-auto my-3 text-[#DA3643] border-2 border-[#DA3643] " />
            <p className="max-md:w-[376px] max-md:h-[168px] max-md:text-[16px] max-md:leading-[24px] max-md:mb-4 font-[300] text-[16px] lg:mb-10 text-[#353435] text-center leading-[24px]">
              As go-getters and pathbreakers in a fast-paced industry, every day
              at Cloudesign is an exciting challenge and a chance to make the
              digital world a better place. Our connecting threads are a knack
              for innovation, unending infectious energy, and a boundless
              passion for digital solutions.
            </p>
          </div>
          <LifeAtCloudesignCarousel />
        </div>
      </section>

      <section className="max-md-w[428px] max-md:mx-auto max-md:mt-10 max-md:h-[332px] max-md:flex max-md:justify-center lg:w-[1230px] lg:mx-auto max-md:mb-0 mb-20 relative">
        <Image
          src={JoinTheTribeBg}
          className="max-md:hidden block"
          alt="Jointhetribebg"
        />
        <Image
          src={JoinTheTribeBgforMobile}
          className="max-md:block hidden "
          alt="JointhetribebgMobile"
        />
        <div className="absolute max-md:w-[376px] max-md:h-[284px] top-0 w-[519px] h-[303px] max-md:pl-[26px] max-md:pr-[26px] max-md:py-[30px]  pl-[26px] pr-[26px] py-[30px]">
          <h2 className="max-md:w-[166px] max-md:h-[36px] max-md:text-[24px] max-md:leading-[36px] w-[467px] h-[48px] font-[700] text-[32px] leading-[48px] text-[#FFFFFF]">
            Join the Tribe
          </h2>
          <hr className="w-[54.5px] mt-2 mb-4 border-2 border-[#FFFFFF] " />
          <p className="max-md:w-[219px] max-md:h-[100px] max-md:text-[16px] max-md:leading-[25px] w-[467px] h-[56px] font-[400] text-[18px] leading-[25px] text-[#FFFFFF]">
            Become a part of our big family to inspire and get inspired by
            professional experts.
          </p>
          <Link
            className="block max-md:w-[224px] max-md:h-[48px] max-md:text-[16px] max-md:leading-[24px] bg-[#353435] mt-10 w-[248px] h-[51px] px-[16px] py-[12px] text-[#FFFFFF] font-[400] text-[18px] leading-[27px]"
            href={"/careers/"}
          >
            Explore our Career Page
          </Link>
        </div>
      </section>
      <section className="w-full mx-auto">
        <ContactForm />
      </section>
    </>
  );
}
