"use client";
import { themes } from "@/app/hooks/themes";
import { RootState } from "@/app/libs/redux/store";
import {
  faDownload,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useSelector } from "react-redux";



const OptionalMods = () => {
  const activeTab = useSelector(
    (state: RootState) => state.theme.activeServer || "Vanilla",
  );  const theme = themes[activeTab] || themes["Vanilla"];

  return (
    <div
      className="w-[95%] md:w-[85%] lg:w-[80%] mx-auto min-h-screen py-10 flex flex-col justify-center"
      id="op"
    >
      <div className="description text-center mb-8">
        <h1
          className="font-orbitron text-3xl hover:scale-105 transition-all duration-300 md:text-4xl lg:text-5xl font-semibold my-2 flex flex-col justify-center items-center"
          style={{
            backgroundImage: theme?.gradient,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            WebkitBackgroundClip: "text",
            color: "transparent",
            position: "relative",
          }}
        >
          Recommended Client-Side Mods
          <span
            className="my-2 w-1/5 transition-all duration-300"
            style={{
              height: "2px",
              background: theme.gradient,
            }}
          ></span>
        </h1>
        <p className="text-white my-3 text-sm md:text-base max-w-2xl mx-auto">
          Enhance your Nimera experience with these optional client-side mods!
          They are not required to join, but can improve immersion and gameplay.
        </p>
      </div>

      {/* التعديل هنا: flex-col للموبايل و flex-row للشاشات الكبيرة */}
      <div className="btns flex flex-col md:flex-row justify-center items-stretch gap-6 md:gap-10">
        
        {/* Mod 1 */}
        <div className="curse-forge w-full md:w-1/2 flex flex-col justify-between p-4 border border-[#ffffff10] rounded-2xl bg-[#ffffff05]">
          <div>
            <h2
              className="text-2xl md:text-3xl font-orbitron font-semibold my-3"
              style={{ color: theme.color }}
            >
              <FontAwesomeIcon icon={faMicrophone} className="mr-2" /> Simple Voice Chat
            </h2>
            <p className="text-white my-3 text-sm md:text-base">
              Adds proximity voice chat to Minecraft. Communicate with nearby
              players easily and immersively!
            </p>
          </div>
          <Link
            href="https://www.curseforge.com/minecraft/mc-mods/voice-chat"
            target="_blank"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-[1.02] shadow-lg mt-auto"
            style={{ backgroundImage: theme.gradient }}
          >
            <FontAwesomeIcon icon={faDownload} className="text-xl" />
            <span>Download from CurseForge</span>
          </Link>
        </div>

        {/* Mod 2 */}
        <div className="curse-forge w-full md:w-1/2 flex flex-col justify-between p-4 border border-[#ffffff10] rounded-2xl bg-[#ffffff05]">
          <div>
            <h2
              className="text-2xl md:text-3xl font-orbitron font-semibold my-3"
              style={{ color: theme.color }}
            >
              <FontAwesomeIcon icon={faMicrophone} className="mr-2" /> Sound Physics Remastered
            </h2>
            <p className="text-white my-3 text-sm md:text-base">
              Overhauls Minecraft's sound engine with reverb, sound occlusion, and
              more realistic audio physics.
            </p>
          </div>
          <Link
            href="https://www.curseforge.com/minecraft/mc-mods/sound-physics-remastered"
            target="_blank"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-[1.02] shadow-lg mt-auto"
            style={{ backgroundImage: theme.gradient }}
          >
            <FontAwesomeIcon icon={faDownload} className="text-xl" />
            <span>Download from CurseForge</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OptionalMods;