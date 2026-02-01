"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "../libs/redux/store";
import { themes } from "../hooks/themes";
import LiveSearch from "../Components/LiveSearch/LiveSearch";
import { setActiveServer } from "../libs/redux/features/themeSlice";
import { SyncLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faMedal } from "@fortawesome/free-solid-svg-icons";
import { getLeaderboardThunk } from "../libs/redux/features/leaderboardSlice";

const BE_URI= process.env.NEXT_PUBLIC_BACK_END_URI as string

interface LeaderboardUser {
  username: string;
  is_online: boolean;
  playTime: { hours: number; minutes: number; seconds: number };
  lastSeen: string | null;
  rank: { name: string };
  avatar?: string;
  id?: string;
}

// إنشاء socket مرة واحدة
const createSocket = () => io(`${BE_URI}`, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// دالة لتحديد لون الرتبة بناءً على عدد الساعات
const getRankColor = (hours: number): string => {
  if (hours < 10) return "#808080"; // رمادي - Visitor
  if (hours < 24) return "#00FF00"; // أخضر - Newcomer
  if (hours < 50) return "#0000FF"; // أزرق - Regular
  if (hours < 150) return "#00FFFF"; // سماوي - Dedicated
  if (hours < 350) return "#800080"; // بنفسجي - Trusted
  if (hours < 700) return "#FFA500"; // برتقالي - Veteran
  if (hours < 1500) return "#FFD700"; // ذهبي - Legend
  return "#FF0000"; // أحمر - Immortal
};

// دالة لتحديد اسم الرتبة بناءً على عدد الساعات
const getRankName = (hours: number): string => {
  if (hours < 10) return "Visitor";
  if (hours < 24) return "Newcomer";
  if (hours < 50) return "Regular";
  if (hours < 150) return "Dedicated";
  if (hours < 350) return "Trusted";
  if (hours < 700) return "Veteran";
  if (hours < 1500) return "Legend";
  return "Immortal";
};

export default function Leaderboard() {
  const activeServer = useSelector(
    (state: RootState) => state.theme.activeServer || "atm 10",
  );
  const currentTheme = themes[activeServer] || themes["atm 10"];
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);
  const { data, loading } = useSelector((d: RootState) => d.leaderboard);
  const dispatch = useDispatch();
  console.log(leaderboard);
  
  // useRef لحفظ الـ socket
  const socketRef = useRef<Socket | null>(null);
  
  const users = data?.result?.leaderboard || [];
  const apiOnlineCount = data?.result?.onlineCount || 0;

  // استخدم الـ Socket.IO data لو متاحة، وإلا استخدم الـ API data
  const displayUsers = leaderboard.length > 0 ? leaderboard : users;
  const displayOnlineCount = socketConnected ? onlineCount : apiOnlineCount;

  const formatLastSeen = (dateString: string | number | Date) => {
    if (!dateString) return "Unknown";
    const now = new Date().getTime();
    const lastSeen = new Date(dateString).getTime();
    if (isNaN(lastSeen)) return "Never";

    const diffInSeconds = Math.floor((now - lastSeen) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // تهيئة Socket.IO عند أول render
  useEffect(() => {
    console.log("🔌 Initializing Socket.IO...");
    
    if (!socketRef.current) {
      socketRef.current = createSocket();
      const socket = socketRef.current;
      
      socket.on("connect", () => {
        console.log("✅ Socket.IO connected, ID:", socket.id);
        setSocketConnected(true);
        
        // أرسل السيرفر المختار حالياً فور الاتصال
        socket.emit("select_server", activeServer);
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
        if (data.server.toLowerCase() === activeServer.toLowerCase()) {
          setLeaderboard(data.leaderboard);
          setOnlineCount(data.onlineCount);
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
      console.log(`🔄 Switching to server: ${activeServer}`);
      
      // أرسل للسيرفر أي سيرفر جديد مختار
      socketRef.current.emit("select_server", activeServer);
      
      // Reset البيانات القديمة
      setLeaderboard([]);
      setOnlineCount(0);
    }
    
    // Also fetch from API كـ fallback
    dispatch(getLeaderboardThunk(activeServer) as any);
    
  }, [activeServer, dispatch]);

  const handleServerChange = (server: string) => {
    dispatch(setActiveServer(server));
  };

  // تحديث الـ Socket عند تغيير السيرفر
  const handleServerButtonClick = async (serverKey: string) => {
    handleServerChange(serverKey);
    
    // أرسل للسيرفر الجديد
    if (socketRef.current?.connected) {
      socketRef.current.emit("select_server", serverKey);
    }
    
    // Also fetch from API
    await dispatch(getLeaderboardThunk(serverKey) as any);
  };

  // أضف indicator للـ Socket.IO status
  const socketStatus = socketConnected ? 
    <span className="text-xs px-2 py-1 rounded-full bg-green-900/30 text-green-400">
      ● Live
    </span> : 
    <span className="text-xs px-2 py-1 rounded-full bg-yellow-900/30 text-yellow-400">
      ● Polling
    </span>;

  return (
    <div className="leaderboard-container min-h-screen w-[60%] mx-auto py-20 px-4">
      <div className="py-10">
        <div className="tabs-container flex flex-col lg:flex-row justify-between items-center p-6 rounded-3xl bg-[#ffffff05] border border-[#ffffff10] gap-8 backdrop-blur-md">
          <div className="right ps-4">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="font-orbitron font-bold text-3xl md:text-4xl text-white">
                Playtime Leaderboard
              </h1>
              {socketStatus}
            </div>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-[#ffffff60] uppercase tracking-widest text-sm font-medium">
                {activeServer}
              </p>
              <span
                style={{ color: currentTheme.color }}
                className="font-orbitron font-bold text-lg"
              >
                {displayUsers.length} players
              </span>
              <span className="text-sm text-green-400 font-bold">
                {displayOnlineCount} online
              </span>
            </div>
          </div>

          <div className="left flex flex-col items-center gap-6">
            <LiveSearch currentTheme={currentTheme} />
            <div className="servers flex bg-[#00000040] p-1 rounded-xl border border-[#ffffff10] flex-wrap justify-center">
              {Object.keys(themes).map((serverKey) => {
                const isActive = activeServer === serverKey;
                const tabTheme = themes[serverKey];
                return (
                  <button
                    key={serverKey}
                    onClick={() => handleServerButtonClick(serverKey)}
                    className={`px-4 py-2 rounded-lg font-orbitron text-[10px] md:text-xs uppercase transition-all duration-300 ${
                      isActive
                        ? "text-white shadow-lg"
                        : "text-[#ffffff50] hover:text-white"
                    }`}
                    style={{
                      background: isActive ? tabTheme.gradient : "transparent",
                    }}
                  >
                    {serverKey}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {loading && displayUsers.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <SyncLoader color={currentTheme.color} />
        </div>
      ) : displayUsers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No players found for {activeServer}</p>
          <p className="text-gray-400 text-sm mt-2">Make sure the server is running and data is being collected</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {displayUsers.map((user: LeaderboardUser, index: number) => {
            const totalHours = user.playTime?.hours || 0;
            const days = Math.floor(totalHours / 24);
            const hours = Math.floor(totalHours % 24);
            const minutes = user.playTime?.minutes || 0;
            
            // تحديد لون واسم الرتبة بناءً على عدد الساعات
            const rankColor = getRankColor(totalHours);
            const rankName = getRankName(totalHours);

            return (
              <div
                key={user.id || index}
                className="player-card relative group"
              >
                <div
                  className="inner p-[1px] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.01]"
                  style={{
                    background: `linear-gradient(180deg, ${currentTheme.color}40, transparent)`,
                  }}
                >
                  <div className="bg-[#0f0f0f] rounded-2xl p-5 flex flex-col gap-4">
                    <div className="header flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="relative w-[50px] h-[50px] bg-white/5 rounded-lg overflow-hidden border border-white/10">
                          <Image
                            src={user.avatar || `https://mc-heads.net/avatar/${user.username}/64`}
                            alt={user.username}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://mc-heads.net/avatar/Steve/64`;
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="text-white font-bold font-orbitron text-sm">
                            {user.username}
                          </h3>
                          <span
                            className="text-[10px] uppercase px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: `${rankColor}20`,
                              color: rankColor,
                            }}
                          >
                            {rankName}
                          </span>
                        </div>
                      </div>
                      <span
                        className="text-white font-black italic text-xl border px-4 h-10 flex justify-center items-center rounded-2xl bg-white/5"
                        style={{ borderColor: `${currentTheme.color}40` }}
                      >
                        {index < 3 && (
                          <span className="text-amber-400 mr-2 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                            <FontAwesomeIcon
                              icon={index === 0 ? faCrown : faMedal}
                            />
                          </span>
                        )}
                        #{index + 1}
                      </span>
                    </div>

                    <div className="body flex justify-between items-end">
                      <div className="playtime">
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">
                          Total Playtime
                        </p>
                        <p className="text-white font-orbitron text-lg font-bold">
                          {days > 0 ? `${days}d ` : ""}
                          {hours}h {hours === 0 ? `${minutes}m` : ""}
                        </p>
                      </div>
                      <div className="status flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-white/5">
                        <span
                          className={`w-2 h-2 rounded-full ${user.is_online ? "animate-pulse shadow-[0_0_8px_#00ff00]" : ""}`}
                          style={{
                            backgroundColor: user.is_online
                              ? "#00ff00"
                              : "#ff4444",
                          }}
                        ></span>
                        <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">
                          {user.is_online
                            ? "Online Now"
                            : formatLastSeen(user.lastSeen || new Date())}
                        </span>
                      </div>
                    </div>

                    <div className="progressbar-container w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.min((totalHours / 1500) * 100, 100)}%`,
                          background: currentTheme.gradient,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}