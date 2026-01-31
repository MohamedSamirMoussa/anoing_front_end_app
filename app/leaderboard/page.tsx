"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLeaderboardAtmThunk } from "../libs/redux/features/leaderboardSlice";
import { themes } from "../hooks/themes";
import { setActiveServer } from "../libs/redux/features/themeSlice";
import { RootState } from "../libs/redux/store";
import "./leaderboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faMedal } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import LiveSearch from "../Components/LiveSearch/LiveSearch";
import Loading from "../Loading/page";
import { SyncLoader } from "react-spinners";

const Leaderboard = () => {
  const dispatch = useDispatch();

  // تأكد من وجود حالة loading في الـ Slice الخاص بك لتحسين تجربة المستخدم
  const { data, loading } = useSelector(
    (state: RootState) => state.leaderboard,
  );
  const activeServer = useSelector(
    (state: RootState) => state.theme.activeServer || "atm 10",
  );

  const currentTheme = themes[activeServer] || themes["atm 10"];
  const users = data?.result?.leaderboard || [];

  const handleServerChange = (server: string) => {
    dispatch(setActiveServer(server));
  };

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

  useEffect(() => {
    dispatch(getLeaderboardAtmThunk(activeServer) as any);
  }, [dispatch, activeServer]);

  return (
    <div className="leaderboard-container min-h-screen w-[60%] mx-auto py-20 px-4">
      <div className="py-10">
        <div className="tabs-container flex flex-col lg:flex-row justify-between items-center p-6 rounded-3xl bg-[#ffffff05] border border-[#ffffff10] gap-8 backdrop-blur-md">
          <div className="right ps-4">
            <h1 className="font-orbitron font-bold text-3xl md:text-4xl text-white">
              Playtime Leaderboard
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-[#ffffff60] uppercase tracking-widest text-sm font-medium">
                {activeServer}
              </p>
              <span
                style={{ color: currentTheme.color }}
                className="font-orbitron font-bold text-lg"
              >
                {users.length} players
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
                    onClick={() => handleServerChange(serverKey)}
                    className={`px-4 py-2 rounded-lg font-orbitron text-[10px] md:text-xs uppercase transition-all duration-300 ${
                      isActive
                        ? "text-white shadow-lg"
                        : "text-[#ffffff50] hover:text-white"
                    }`}
                    style={{
                      background: isActive ? tabTheme.gradient : "transparent",
                    }}
                  >
                    {/* الإصلاح هنا: استخدام serverKey أو tabTheme.name مباشرة */}
                    {serverKey}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className=" flex justify-center items-center">
          {" "}
          <SyncLoader color={currentTheme.color} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {users.map((user: any, index: number) => {
            const totalHours = user.playTime.hours || 0;
            const days = Math.floor(totalHours / 24);
            const hours = Math.floor(totalHours % 24);
            const minutes = user.playTime.minutes || 0;

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
                            src={user.avatar}
                            alt={user.username}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-white font-bold font-orbitron text-sm">
                            {user.username}
                          </h3>
                          <span
                            className="text-[10px] uppercase px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: `${currentTheme.color}20`,
                              color: currentTheme.color,
                            }}
                          >
                            {user.rank.name}
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
                            : formatLastSeen(user.lastSeen)}
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
};

export default Leaderboard;
