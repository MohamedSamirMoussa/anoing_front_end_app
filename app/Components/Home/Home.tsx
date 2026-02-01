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
import { useEffect, useRef, useState } from "react";
import { getLeaderboardThunk } from "@/app/libs/redux/features/leaderboardSlice";
import { io, Socket } from "socket.io-client";

// export const createSocket = () => io(
//   "http://localhost:5000/", 
//   {
//     transports: ["websocket"],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 1000,
// });



export const createSocket = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return io(
    process.env.NEXT_PUBLIC_BACK_END_URI || "http://localhost:5000/",
    {
      transports: isProduction ? ['polling'] : ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: isProduction,
      path: '/socket.io/',
    }
  );
}


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
  
  const activeTab = useSelector((state: RootState) => state.theme.activeServer) || "atm 10";
  const currentTheme = themes[activeTab] || themes["atm 10"];
  const socketRef = useRef<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  
  // استخدام بيانات الـ leaderboard من Redux store
  const { data, loading } = useSelector((state: RootState) => state.leaderboard);
  const users = data?.result?.leaderboard || [];
  const totalPlayers = users.length;
  const onlinePlayers = users.filter((user: LeaderboardUser) => user.is_online).length;
  
  // الحالة المحلية لبيانات السوكيت
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [socketOnlineCount, setSocketOnlineCount] = useState<number>(0);

  // استخدام بيانات السوكيت إذا كانت متاحة، وإلا استخدام بيانات API
  const displayUsers = socketConnected && leaderboard.length > 0 ? leaderboard : users;
  const displayTotalPlayers = displayUsers.length;
  const displayOnlinePlayers = socketConnected ? socketOnlineCount : onlinePlayers;

  useEffect(() => {
    console.log("🔌 Initializing Socket.IO...");
    
    if (!socketRef.current) {
      socketRef.current = createSocket();
      const socket = socketRef.current;
      
      socket.on("connect", () => {
        console.log("✅ Socket.IO connected, ID:", socket.id);
        setSocketConnected(true);
        
        // أرسل السيرفر المختار حالياً فور الاتصال
        socket.emit("select_server", activeTab);
      });
      
      socket.on("connect_error", (error) => {
        console.error("❌ Socket.IO connection error:", error);
        setSocketConnected(false);
      });
      
      socket.on("disconnect", () => {
        console.log("❌ Socket.IO disconnected");
        setSocketConnected(false);
      });

      const handleLeaderboard = (data: {
        server: string;
        leaderboard: LeaderboardUser[];
        onlineCount: number;
      }) => {
        console.log(`📦 Received data for server ${data.server}:`, data.leaderboard.length, "players");
        
        // تحديث فقط إذا كان نفس السيرفر النشط
        if (data.server.toLowerCase() === activeTab.toLowerCase()) {
          setLeaderboard(data.leaderboard);
          setSocketOnlineCount(data.onlineCount);
        }
      };

      socket.on("leaderboard_update", handleLeaderboard);
      
      return () => {
        console.log("🧹 Cleaning up Socket.IO");
        socket.off("leaderboard_update", handleLeaderboard);
        socket.off("connect");
        socket.off("connect_error");
        socket.off("disconnect");
        socket.disconnect();
        socketRef.current = null;
      };
    }
  }, []);

  // عندما يتغير السيرفر النشط
  useEffect(() => {
    if (socketRef.current?.connected) {
      console.log(`🔄 Switching to server: ${activeTab}`);
      
      // أرسل للسيرفر أي سيرفر جديد مختار
      socketRef.current.emit("select_server", activeTab);
      
      // Reset البيانات القديمة
      setLeaderboard([]);
      setSocketOnlineCount(0);
    }
    
    // Also fetch from API كـ fallback
    dispatch(getLeaderboardThunk(activeTab) as any);
    
  }, [activeTab, dispatch]);

  const handleTabChange = (tabName: string) => {
    dispatch(setActiveServer(tabName));
    
    // أرسل للسيرفر الجديد
    if (socketRef.current?.connected) {
      socketRef.current.emit("select_server", tabName);
    }
    
    // Also fetch from API
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

  return (
    <div id="home" className="">
      <div className="container h-screen text-white w-[90%] mx-auto flex flex-col md:flex-row justify-center items-center">
        <figure className="flex md:w-1/2 justify-center items-center relative transition-all duration-500 ease-in-out animate-floating lg:mx-5 xl:odd:translate-y-12">
          <Image
            key={currentTheme.name}
            src={currentTheme.image}
            alt={`${currentTheme.name} modpack`}
            width={600}
            quality={80}
            priority
            className="drop-shadow-2xl transition-opacity duration-300 lg:w-auto w-full"
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
                    {displayOnlinePlayers}/{displayTotalPlayers}
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
            
            {/* Connection Status Indicator */}
            <div className="my-2 flex justify-center">
              <div className="text-xs px-2 py-1 rounded-full bg-[#ffffff10] text-gray-400 flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${socketConnected ? "animate-pulse bg-green-500" : "bg-yellow-500"}`}></span>
                {socketConnected ? "Live Connection" : "Polling Data"}
              </div>
            </div>
            
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