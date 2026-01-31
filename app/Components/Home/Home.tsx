"use client";
import Link from "next/link";
import Image from "next/image";
import {
  faBoxOpen,
  faCheck,
  faCopy,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Redux Imports
import { useSelector, useDispatch } from "react-redux";
import "./Home.css";
import { setActiveServer } from "@/app/libs/redux/features/themeSlice";
import { themes } from "@/app/hooks/themes";
import { RootState } from "@/app/libs/redux/store";
import { useState } from "react";

const Home = () => {
  const ipAddress = "cf2.anoing.com:25566";
  const dispatch = useDispatch();
  const { data  } = useSelector((s: RootState) => s.leaderboard);
  const [copied, setCopied] = useState(false);
  const users = data?.result?.leaderboard;
  const activeTab =
    useSelector((state: RootState) => state.theme.activeServer) || "atm 10";
  const currentTheme = themes[activeTab] || themes["atm 10"];

  const handleTabChange = (tabName: string) => {
    dispatch(setActiveServer(tabName));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ipAddress);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div id="home" className="md:py-0 md:mt-0 py-20 mt-20 lg:mt-10">
      <div className="container h-screen text-white w-[90%] mx-auto flex flex-col md:flex-row justify-center items-center pt-20 mt-20 md:pt-0 md:mt-0 gap-5 md:gap-2">
        <figure className="flex md:w-1/2 justify-center items-center relative transition-all duration-500 ease-in-out animate-floating lg:mx-5 xl:odd:translate-y-12">
          <Image
            key={currentTheme.name}
            src={currentTheme.image}
            alt={`${currentTheme.name} modpack`}
            width={500}
            quality={80}
            priority
            className="drop-shadow-2xl transition-opacity duration-300 lg:w-600 w-full"
          />
        </figure>

        <div className="description md:w-1/2 flex flex-col justify-center gap-2">
          <h1 className="font-orbitron flex flex-col justify-center">
            <span
              className="text-[5.0rem] font-extrabold"
              style={{
                backgroundImage: currentTheme?.gradient,  
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Anoing
            </span>

            <span
              className="close transition-colors duration-300"
              style={{
                backgroundImage: currentTheme?.gradient, 
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              close friends
            </span>
          </h1>
          <p style={{ color: currentTheme.color }}>
            Your Ultimate Minecraft Adventure Awaits!
          </p>

          <div className="servers my-3">
            {/* Tabs */}
            <div className="tabs p-3 rounded-2xl font-orbitron font-bold flex flex-col lg:flex-row justify-center items-center">
              {Object.keys(themes).map((serverName) => {
                const tabTheme = themes[serverName];
                return (
                  <button
                    key={serverName}
                    onClick={() => handleTabChange(serverName)}
                    className={`px-4 py-2 rounded-xl transition-all duration-300 w-full`}
                    style={{
                      background:
                        activeTab === serverName
                          ? tabTheme.gradient
                          : "transparent",
                      color: "#fff",
                    }}
                  >
                    {serverName}
                  </button>
                );
              })}
            </div>

            {/* Server Info */}
            <div className="my-3 flex justify-center items-center gap-2">
              <div className="players rounded-xl p-2 w-full flex items-center gap-2 bg-[#222] border border-[#333]">
                <span style={{ color: currentTheme.color }}>
                  <FontAwesomeIcon icon={faUsers} className="text-3xl" />
                </span>
                <p className="flex flex-col">
                  <span className="text-white">
                    {users?.filter((user: any) => user.is_online).length}/
                    {users?.length}
                  </span>

                  <span className="text-gray-400 text-[12px]">Online Players</span>
                </p>
              </div>
              <div className="mod rounded-xl p-2 w-full flex items-center gap-2 bg-[#222] border border-[#333]">
                <span style={{ color: currentTheme.color }}>
                  <FontAwesomeIcon icon={faBoxOpen} className="text-3xl" />
                </span>
                <p className="flex flex-col">
                  <span className="text-gray-400 text-sm">version:</span>
                  <span className="text-white text-[12px]">{currentTheme.version}</span>
                </p>
              </div>
            </div>
            <div className="my-3  relative group">
              <input
                type="text"
                value={ipAddress}
                readOnly
                disabled
                className="w-full p-3 ip border rounded-xl cursor-default text-gray-300 font-mono text-sm transition-all duration-300"
                style={{ borderLeft: `4px solid ${currentTheme.color}` }}     
              />
              <button
                onClick={handleCopy}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-[#333] rounded-lg transition-all duration-300 text-gray-400 hover:text-white"
                title="Copy IP Address"
              >
                {copied ? (
                  <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                ) : (
                  <FontAwesomeIcon icon={faCopy} />
                )}
              </button>
              {/* تنبيه صغير عند النسخ */}
              {copied && (
                <span className="absolute -top-8 right-0 text-xs font-bold text-green-500 animate-bounce">
                  Copied!
                </span>
              )}
            </div>
            {/* Discover More Button */}
            <div className="discover my-3 flex justify-center items-center">
              <Link
                href={"#about"}
                className="rounded-3xl font-orbitron tracking-widest uppercase font-semibold w-full text-center py-3 shadow-lg transition-all duration-300 hover:brightness-110"
                style={{
                  backgroundImage: currentTheme?.gradient, // استخدم backgroundImage بدل background
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  boxShadow: `0 0 20px ${currentTheme.shadowColor}`, // توهج بنفس لون الثيم
                }}
              >
                Discover more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
