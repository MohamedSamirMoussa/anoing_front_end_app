"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import { themes } from "@/app/hooks/themes";
import { RootState } from "@/app/libs/redux/store";
const About = () => {
  const activeTab = useSelector(
    (state: RootState) => state.theme.activeServer || "atm 10",
  );
  const theme = themes[activeTab] || themes["atm 10"];
  return (
    <div id="about" className="my-40 py-30 md:my-0 md:py-0">
      <div className="container w-[80%] m-auto flex justify-center items-center md:mt-10 md:pt-10">
        <div className="about-description flex flex-col justify-center items-center gap-4 py-3">
          <h1
            className="lg:text-6xl hover:scale-105 transition-all duration-300 text-center text-5xl font-semibold relative py-3 flex flex-col justify-center items-center"
            style={{
              backgroundImage: theme?.gradient,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Welcome to Anoing
            <span 
            className="my-2 w-[30%] h-[1px] transition-all duration-300"
            style={{
              background:theme.gradient,
            }}></span>
          </h1>
          <p className="text-white text-center">
            Dive into the definitive modded experience on Mirinda with All The
            Mods 10! Explore an incredible array of mods, traverse breathtaking
            dimensions, master complex magic, build technological marvels, and
            conquer epic bosses. Our server runs on optimized hardware (Ryzen 7
            7800X3D | 64GB DDR5) for a seamless, lag-free ATM 10 odyssey!
          </p>
          <Link
            href={"#community"}
            className="rounded-4xl my-2 font-orbitron font-semibold hover:scale-105 hover:shadow-lg shadow-[#ffffff30] transition-all duration-300"
            style={{
              backgroundImage: theme.gradient
            }}
          >
            How To join
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
