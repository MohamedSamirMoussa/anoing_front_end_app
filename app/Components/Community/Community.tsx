"use client";
import { themes } from "@/app/hooks/themes";
import { useSelector } from "react-redux";
import "./Community.css";
import { faCaretRight, faCoffee } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RootState } from "@/app/libs/redux/store";

const Community = () => {
  const activeTab = useSelector(
    (state: RootState) => state.theme.activeServer || "atm 10",
  );
  const theme = themes[activeTab] || themes["atm 10"];

  const STEPS = [
    {
      id: 1,
      title: "Get a Launcher",
      description: (
        <>
          Download and install a modded Minecraft launcher. We recommend Prism
          or MultiMC.
          <ul>
            <li className=" my-2">
              <FontAwesomeIcon
                icon={faCaretRight}
                style={{ color: theme.color }}
              />
              Prism Launcher - Modern and fast
            </li>
            <li className=" my-2">
              <FontAwesomeIcon
                icon={faCaretRight}
                style={{ color: theme.color }}
              />
              CurseForge - Official modpack source
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 2,
      title: "Find Modpack",
      description: (
        <>
          Open your launcher and search for modpack{" "}
          <span
            className="uppercase font-semibold font-orbitron py-0.5 px-0.5 rounded-xs"
            style={{ color: theme.color, backgroundColor: "#A953F31F" }}
          >
            All The Mods 10
          </span>
        </>
      ),
    },
    {
      id: 3,
      title: "Install Modpack",
      description: (
        <>
          Select your modpack and click "Install". This may take time, so grab a{" "}
          <FontAwesomeIcon
            icon={faCoffee}
            style={{ color: theme.color }}
            className="animate-pulse"
          />
        </>
      ),
    },
    {
      id: 4,
      title: "Allocate RAM",
      description: (
        <>
          ATM10 is hefty! Allocate at least{" "}
          <span className="font-bold">8-10GB RAM</span> to Minecraft via your
          launcher's profile/instance settings for smooth play,
        </>
      ),
    },
    {
      id: 5,
      title: "Launch & Add Server",
      description: (
        <>
          Launch Minecraft with your modpack profile. From the main menu:
          <ul>
            <li className=" my-2">
              <FontAwesomeIcon
                icon={faCaretRight}
                style={{ color: theme.color }}
              />
              Go to "Multiplayer"
            </li>
            <li className=" my-2">
              <FontAwesomeIcon
                icon={faCaretRight}
                style={{ color: theme.color }}
              />
              Click "Add Server"
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 6,
      title: "Enter Server Details",
      description: (
        <>
          Fill in the server information:
          <ul>
            <li className=" my-2">
              <FontAwesomeIcon
                icon={faCaretRight}
                style={{ color: theme.color }}
              />
              Server Name:{" "}
              <span
                className="uppercase p-1 rounded-lg"
                style={{ color: theme.color, backgroundColor: "#A953F31F" }}
              >
                 Anoing ${activeTab}
              </span>
            </li>
            <li className=" my-2">
              <FontAwesomeIcon
                icon={faCaretRight}
                style={{ color: theme.color }}
              />
              Server IP: :{" "}
              <span
                className="uppercase p-1 rounded-lg"
                style={{ color: theme.color, backgroundColor: "#A953F31F" }}
              >
                 Anoing ${activeTab}
              </span>
            </li>
            <li className=" my-2">Click "Done" and prepare for adventure!</li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <div
      id="community"
      className="w-[95%] md:w-[80%] lg:w-[70%] mx-auto min-h-screen flex items-center justify-center py-20"
    >
      <div className="desc w-full flex justify-center flex-col items-center gap-5">
        <h1
          className="text-3xl md:text-4xl hover:scale-105 transition-all duration-300 lg:text-5xl font-orbitron font-semibold text-center flex flex-col justify-center items-center"
          style={{
            backgroundImage: theme?.gradient,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            WebkitBackgroundClip: "text",
            color: "transparent",
            position: "relative",
          }}
        >
          How to Join Our Server
          <span
            className="my-2 w-1/3 transition-all duration-300"
            style={{
              height: "2px",
              background: theme.gradient,
            }}
          ></span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-6xl mx-auto py-10 px-2 md:px-4">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="htj group p-5 md:p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex gap-4 items-center mb-4">
                {/* الدائرة الرقمية */}
                <span
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-white font-black text-lg md:text-xl shadow-lg shrink-0"
                  style={{ backgroundImage: theme.gradient }}
                >
                  {step.id}
                </span>

                <h3
                  className="text-lg md:text-xl font-orbitron font-bold tracking-tight"
                  style={{ color: theme.color }}
                >
                  {step.title}
                </h3>
              </div>

              <span className="text-gray-400 font-roboto leading-relaxed text-xs md:text-sm group-hover:text-white transition-colors">
                {step.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
