"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { RootState } from "../libs/redux/store";
import { themes } from "../hooks/themes";
import LiveSearch from "../Components/LiveSearch/LiveSearch";
import { setActiveServer } from "../libs/redux/features/themeSlice";
import { SyncLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faCircleDot,
  faCrown,
  faGem,
  faHeart,
  faInfo,
  faMedal,
  faSeedling,
  faShield,
  faStar,
  faTrophy,
  faUserCheck,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { getLeaderboardThunk } from "../libs/redux/features/leaderboardSlice";
import { createSocket } from "../Components/Home/Home";

export interface LeaderboardUser {
  username: string;
  is_online: boolean;
  playTime: { hours: number; minutes: number; seconds: number };
  lastSeen: string | null;
  avatar?: string;
  id?: string;
  isSupported?: { name: string };
}

/* -------------------- Helpers -------------------- */

const getRankIcon = (hours: number) => {
  if (hours < 10) return faCircleDot; // Visitor
  if (hours < 24) return faSeedling; // Newcomer
  if (hours < 50) return faUserCheck; // Regular
  if (hours < 150) return faStar; // Dedicated
  if (hours < 350) return faGem; // Trusted
  if (hours < 700) return faShield; // Veteran
  if (hours < 1500) return faTrophy; // Legend
  return faCrown; // Immortal
};

const getRankColor = (hours: number): string => {
  if (hours < 10) return "#808080";
  if (hours < 24) return "#00FF00";
  if (hours < 50) return "#0000FF";
  if (hours < 150) return "#00FFFF";
  if (hours < 350) return "#800080";
  if (hours < 700) return "#FFA500";
  if (hours < 1500) return "#FFD700";
  return "#FF0000";
};

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

const formatPlayTime = (totalHours: number, minutes: number): string => {
  const days = Math.floor(totalHours / 24);
  const hours = Math.floor(totalHours % 24);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
};

const formatLastSeen = (dateStr: string | Date): string => {
  const now = new Date();
  const lastSeen = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  const diffMs = now.getTime() - lastSeen.getTime(); // الفرق بالميلي ثانية

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);

  let result = "";
  if (diffDays > 0) result += `${diffDays}d `;
  if (diffHours > 0) result += `${diffHours}h `;
  result += `${diffMinutes}m`;

  return result + " ago";
};

/* -------------------- Component -------------------- */

export default function Leaderboard() {
  const dispatch = useDispatch();

  const activeServer = useSelector(
    (state: RootState) => state.theme.activeServer || "atm 10",
  );
  const currentTheme = themes[activeServer] || themes["atm 10"];
  const socketRef = useRef<Socket | null>(null);

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalPlayers, setTotalPlayers] = useState(0);
  // pagination
  const [page, setPage] = useState(1);
  const limit = 8;
  const [totalPages, setTotalPages] = useState(1);

  /* -------------------- Socket Init -------------------- */

  useEffect(() => {
    if (socketRef.current) return;

    const socket = createSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("select_server", {
        serverName: activeServer,
        page,
        limit,
      });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("leaderboard_updates", (data) => {
      if (data.serverName !== activeServer.toLowerCase()) return;

      setLeaderboard(data.leaderboard);
      setOnlineCount(data.onlineCount);
      setTotalPages(data.pagination.totalPages);
      setTotalPlayers(data.pagination.totalPlayers);
      setLoading(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [activeServer, page]);

  /* -------------------- Server Change -------------------- */

  useEffect(() => {
    setLoading(true);

    if (socketRef.current?.connected) {
      socketRef.current.emit("select_server", {
        serverName: activeServer,
        page,
        limit,
      });
    }

    // API fallback
    dispatch(getLeaderboardThunk(activeServer) as any);
  }, [activeServer, page]);

  /* -------------------- Page Change -------------------- */

  useEffect(() => {
    if (!socketRef.current?.connected) return;

    socketRef.current.emit("select_server", {
      serverName: activeServer,
      page,
      limit,
    });
  }, [activeServer, page]);

  /* -------------------- Handlers -------------------- */

  const handleServerButtonClick = (serverKey: string) => {
    dispatch(setActiveServer(serverKey));
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="leaderboard-container min-h-screen md:w-[70%] xl:w-[60%] mx-auto py-20 px-4">
      {/* Tabs + header */}
      <div className="py-10">
        <div className="tabs-container flex flex-col lg:flex-row  items-center p-6 rounded-3xl bg-[#ffffff05] border border-[#ffffff10] gap-8 backdrop-blur-md">
          <div className="right lg:w-1/2">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="font-orbitron font-bold text-3xl md:text-4xl text-white">
                Playtime Leaderboard
              </h1>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-[#ffffff60] uppercase tracking-widest text-sm font-medium">
                {activeServer}
              </p>
              <span
                style={{ color: currentTheme.color }}
                className="font-orbitron font-bold text-lg"
              >
                {totalPlayers} players
              </span>
              <span className="text-sm text-green-400 font-bold">
                {onlineCount} online
              </span>
            </div>
          </div>

          <div className="left flex flex-col items-center gap-6 z-50 lg:w-1/2">
            <LiveSearch currentTheme={currentTheme} />

            <div className="servers flex bg-[#00000040] p-1 rounded-xl border border-[#ffffff10] flex-wrap justify-center w-full">
              {Object.keys(themes).map((serverKey) => {
                const isActive = activeServer === serverKey;
                const tabTheme = themes[serverKey];
                return (
                  <button
                    key={serverKey}
                    onClick={() => handleServerButtonClick(serverKey)}
                    className={`px-4 py-2 rounded-lg font-orbitron text-[10px] md:text-xs uppercase transition-all duration-300 xl:w-1/3  ${
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

      {/* Loading / Empty */}
      {loading && leaderboard.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <SyncLoader color={currentTheme.color} />
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            No players found for {activeServer}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Make sure the server is running and data is being collected
          </p>
        </div>
      ) : (
        <>
          {/* Leaderboard grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-15">
            {leaderboard.map((user: LeaderboardUser, index: number) => {
              const totalHours = user.playTime?.hours || 0;
              const minutes = user.playTime?.minutes || 0;
              const rankColor = getRankColor(totalHours);
              const rankName = getRankName(totalHours);

              return (
                <div
                  key={user.id || index}
                  className={`player-card relative group`}
                >
                  <div
                    className={`
  ${index === 0 && page === 1 ? "hover:shadow-[0_0_10px_rgba(255,215,0,0.4)]" : ""} 
  inner p-[1px] rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01]
`}
                    style={{
                      background:
                        index === 0 && page === 1
                          ? `linear-gradient(180deg, #ffd70036, transparent)`
                          : `linear-gradient(180deg, ${currentTheme.color}40, transparent)`,
                    }}
                  >
                    <div className="bg-[#0f0f0f] rounded-2xl p-5 flex flex-col gap-4">
                      {/* Header */}
                      <div className="header flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="relative bg-white/5 rounded-lg overflow-hidden border border-white/10">
                            <Image
                              src={
                                user.avatar ||
                                `https://mc-heads.net/avatar/${user.username}/64`
                              }
                              alt={user.username}
                              width={50}
                              height={50}
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
                              <FontAwesomeIcon
                                icon={getRankIcon(totalHours)}
                                className="mr-1"
                              />
                              {rankName}
                            </span>
                            {user.isSupported && (
                              <span className="text-[10px] font-bold text-white shadow-[#ffffff30] shadow-lg uppercase px-2 py-0.5 rounded-full bg-rose-700 mx-2">
                                <FontAwesomeIcon
                                  icon={faHeart}
                                  className="me-1 text-[14px]"
                                />
                                {user.isSupported?.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          className="text-white text-lg font-black italic border px-4 h-10 flex justify-center items-center rounded-2xl bg-white/5"
                          style={{
                            borderColor:
                              index === 0 && page === 1
                                ? "#ffd70036"
                                : `${currentTheme.color}40`,
                          }}
                        >
                          {index === 0 && page === 1 ? (
                            <FontAwesomeIcon
                              icon={faCrown}
                              className="text-amber-300"
                            />
                          ) : (index === 1 && page === 1) ||
                            (index === 2 && page === 1) ? (
                            <FontAwesomeIcon
                              icon={faMedal}
                              className="text-amber-300"
                            />
                          ) : (
                            ""
                          )}
                          #{index + 1 + (page - 1) * limit}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="body flex justify-between items-end">
                        <div className="playtime">
                          <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">
                            Total Playtime
                          </p>
                          <p className="text-white font-orbitron text-lg font-bold">
                            {formatPlayTime(totalHours, minutes)}
                          </p>
                        </div>
                        <div className="status flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-white/5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              user.is_online
                                ? "animate-pulse shadow-[0_0_8px_#00ff00]"
                                : ""
                            }`}
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

                      {/* Progress bar */}
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

          {/* Pagination */}
          <div className="flex justify-center items-center gap-6 mt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-white/10 rounded-lg text-white disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-white text-sm">
              Page {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-white/10 rounded-lg text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>

          <div className="leaderboard-footer my-5 py-8 px-6 rounded-2xl flex items-center gap-5 bg-[##111119] z-50 border-2 border-white/5">
            <div className="desc flex items-center gap-3 w-2/3 bg-[#00000033] p-3 rounded-2xl border border-white/5 hover:-translate-y-2 transition-all duration-300 hover:shadow shadow-white/5">
              <span
                className="w-8 h-8 rounded-full flex justify-center items-center"
                style={{ background: currentTheme.gradient }}
              >
                <FontAwesomeIcon icon={faInfo} />
              </span>
              <h3 className="text-white text-xl">
                Playtime is tracked automatically. Play more to climb the ranks!
              </h3>
            </div>
            <div
              className="all-players flex flex-col py-3 text-2xl w-1/3 bg-[#00000033] p-3 rounded-2xl border border-white/5 hover:-translate-y-2 transition-all duration-300 hover:shadow shadow-white/5"
              style={{ color: currentTheme.color }}
            >
              <FontAwesomeIcon icon={faUsers} />
              <span>
                {totalPlayers} <span>Players</span>
              </span>
            </div>
            <div
              className="showing text-2xl flex flex-col py-2 w-1/3 bg-[#00000033] p-3 rounded-2xl border border-white/5 hover:-translate-y-2 transition-all duration-300 hover:shadow shadow-white/5"
              style={{ color: currentTheme.color }}
            >
              <div>
                <FontAwesomeIcon icon={faChartLine} />
                {onlineCount}
              </div>
              <span>Online</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
