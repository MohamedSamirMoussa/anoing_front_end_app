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
    <div id="about">
      <div className="container w-[80%] m-auto flex justify-center items-center h-screen ">
        <div className="about-description flex flex-col justify-center items-center gap-4 py-3">
          <h2
            className="lg:text-6xl text-center text-5xl font-semibold relative py-3 flex flex-col justify-center items-center"
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
            className="my-2"
            style={{
              bottom:"0",
              right:"0",
              width:"30%",
              height:"2px",
              background:theme.gradient,
            }}></span>
          </h2>
          <p className="text-white text-center">
            Dive into the definitive modded experience on Mirinda with All The
            Mods 10! Explore an incredible array of mods, traverse breathtaking
            dimensions, master complex magic, build technological marvels, and
            conquer epic bosses. Our server runs on optimized hardware (Ryzen 7
            7800X3D | 64GB DDR5) for a seamless, lag-free ATM 10 odyssey!
          </p>
          <Link
            href={"#community"}
            className="rounded-4xl my-2 font-orbitron font-semibold"
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
