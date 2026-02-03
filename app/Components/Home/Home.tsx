"use client";
import Link from "next/link";
import Image from "next/image";
import { faBoxOpen, faCheck, faCopy, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useSelector, useDispatch } from "react-redux";
import "./Home.css";
import { setActiveServer } from "@/app/libs/redux/features/themeSlice";
import { themes } from "@/app/hooks/themes";
import { RootState } from "@/app/libs/redux/store";
import { useEffect, useRef, useState } from "react";
import { getLeaderboardThunk } from "@/app/libs/redux/features/leaderboardSlice";
import { io, Socket } from "socket.io-client";

export const createSocket = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return io(process.env.NEXT_PUBLIC_BACK_END_URI || "http://localhost:5000/", {
    transports: isProduction ? ["polling"] : ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    timeout: 20000,
    forceNew: isProduction,
    path: "/socket.io/",
  });
};

interface LeaderboardUser {
  username: string;
  is_online: boolean;
  playTime: { hours: number; minutes: number; seconds: number };
  lastSeen: string | null;
  rank: { name: string };
  avatar?: string;
  id?: string;
}

const Home = () => {
  const ipAddress = "cf2.anoing.com:25566";
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);
  const [connected, setConnected] = useState(false)
  const activeTab = useSelector((state: RootState) => state.theme.activeServer) || "atm 10";
  const currentTheme = themes[activeTab] || themes["atm 10"];
  const socketRef = useRef<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
 const [onlineCount, setOnlineCount] = useState(0);
  const { data } = useSelector((state: RootState) => state.leaderboard);
const [totalPlayers, setTotalPlayers] = useState(0);
  const [loading, setLoading] = useState(true);

  // -------------------- Socket.IO Setup --------------------
  useEffect(() => {
    if (socketRef.current) return;

    const socket = createSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("select_server", {
        serverName: activeTab
      });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("leaderboard_updates", (data) => {
      if (data.serverName !== activeTab.toLowerCase()) return;


      setOnlineCount(data.onlineCount);
       setTotalPlayers(data.pagination.totalPlayers);
      setLoading(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  /* -------------------- Server Change -------------------- */

  useEffect(() => {
    setLoading(true);

    if (socketRef.current?.connected) {
      socketRef.current.emit("select_server", {
        serverName: activeTab,
      });
    }

    // API fallback
    dispatch(getLeaderboardThunk(activeTab) as any);
  }, [activeTab]);


  const handleTabChange = (tabName: string) => {
    dispatch(setActiveServer(tabName));
    if (socketRef.current?.connected) {
      socketRef.current.emit("select_server", tabName);
    }
    dispatch(getLeaderboardThunk(tabName) as any);
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

  // -------------------- Render --------------------
  return (
    <div id="home" className="mt-40 md:mt-0 lg:mt-0">
      <div className="container h-screen text-white lg:w-[60%] md:w-[90%] mx-auto flex flex-col gap-10 md:flex-row justify-center items-center pt-40 md:pt-0 lg:pt-0">
        <figure className="flex md:w-1/2 w-[80%] justify-center items-center relative transition-all duration-500 ease-in-out animate-floating lg:mx-5">
          <Image
            key={currentTheme.name}
            src={currentTheme.image}
            alt={`${currentTheme.name} modpack`}
            width={500}
            height={500}
            quality={80}
            priority
            className="drop-shadow-2xl transition-opacity duration-300 lg:w-auto w-full"
          />
        </figure>

        <div className="description md:w-1/2 flex flex-col justify-center gap-2">
          <h1 className="font-orbitron flex flex-col justify-center">
            <span
              className="lg:text-8xl text-7xl py-2 font-extrabold"
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
              className="close transition-colors duration-300 translate-x-29 translate-y-17.5 lg:translate-x-49 lg:translate-y-23.5"
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

          <p style={{ color: currentTheme.color }}>Your Ultimate Minecraft Adventure Awaits!</p>

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
                      background: activeTab === serverName ? tabTheme.gradient : "transparent",
                      color: "#fff",
                    }}
                  >
                    {serverName}
                  </button>
                );
              })}
            </div>

            {/* Server Info: Online / Total */}
            <div className="my-3 flex justify-center items-center gap-2">
              <div className="players rounded-xl p-2 w-full flex items-center gap-2 bg-[#222] border border-[#333]">
                <span style={{ color: currentTheme.color }}>
                  <FontAwesomeIcon icon={faUsers} className="text-3xl" />
                </span>
                <p className="flex flex-col">
                  <span className="text-white">
                    {onlineCount}/{totalPlayers}
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



            {/* Copy IP */}
            <div className="my-3 relative group">
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
              {copied && (
                <span className="absolute -top-8 right-0 text-xs font-bold text-green-500 animate-bounce">
                  Copied!
                </span>
              )}
            </div>

            {/* Discover More */}
            <div className="discover my-3 flex justify-center items-center">
              <Link
                href={"#about"}
                className="rounded-3xl font-orbitron tracking-widest uppercase font-semibold w-full text-center py-3 shadow-lg transition-all duration-300 hover:brightness-110"
                style={{
                  backgroundImage: currentTheme?.gradient,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  boxShadow: `0 0 20px ${currentTheme.shadowColor}`,
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
