"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLeaderboardAtmThunk } from "../libs/redux/features/leaderboardSlice";
import { themes } from "../hooks/themes"; // تأكد من المسار
import { setActiveServer } from "../libs/redux/features/themeSlice";
import { RootState } from "../libs/redux/store";
import "./leaderboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faMedal } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import LiveSearch from "../Components/LiveSearch/LiveSearch";

const servers: string[] = ["atm 10", "GTNH", "Vanilla"];

const Leaderboard = () => {
  const dispatch = useDispatch();

  const { data, isLoading }: any = useSelector(
    (state: RootState) => state.leaderboard,
  );

  // تأكد من الـ state path حسب الـ store.ts (سواء كان state.server أو state.theme)
  const activeServer = useSelector(
    (state: RootState) => state.theme.activeServer || "Vanilla",
  );

  // الثيم الحالي للسيرفر المختار
  const currentTheme = themes[activeServer] || themes["Vanilla"];
  const users = data?.result?.leaderboard || [];
  const handleServerChange = (server: string) => {
    dispatch(setActiveServer(server));
  };

const formatLastSeen = (dateString) => {
  const now = new Date();
  const lastSeen = new Date(dateString);
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

  if (isLoading)
    return (
      <div className="text-white text-center py-20 font-orbitron">
        Loading Universe Legends...
      </div>
    );

  return (
    <div className="leaderboard-container min-h-screen w-[90%] md:w-[80%] mx-auto py-20 px-4">
      <div className="py-10">
        <div className="tabs-container flex flex-col lg:flex-row justify-between items-center p-6 rounded-3xl bg-[#ffffff05] border border-[#ffffff10] gap-8">
          <div className="right ps-4">
            <h1 className="font-orbitron font-bold text-3xl md:text-4xl text-white">
              Playtime Leaderboard
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-[#ffffff60] uppercase tracking-widest text-sm">
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

            <div className="servers flex bg-[#00000040] p-1 rounded-xl border border-[#ffffff10]">
              {servers.map((serverName, index) => {
                const isActive = activeServer === serverName;

                const tabTheme = themes[serverName] || themes["Vanilla"];

                return (
                  <button
                    key={index}
                    onClick={() => handleServerChange(serverName)}
                    className={`px-4 py-2 rounded-lg font-orbitron text-xs md:text-sm uppercase transition-all duration-300 ${
                      isActive
                        ? "text-white shadow-lg"
                        : "text-[#ffffff50] hover:text-white"
                    }`}
                    style={{
                      background: isActive ? tabTheme.gradient : "transparent",
                    }}
                  >
                    {serverName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {users.map((user: any, index: number) => {
          const totalHours = user.playTime.hours;
          const d = Math.floor(totalHours / 24);
          const h = Math.floor(totalHours);

          // إذا كان لديك دقائق أيضاً في البيانات
          const m = user.playTime.minutes || 0;
          return (
            <div key={index} className="player-card relative group">
              <div
                className="inner p-[1px] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(180deg, ${currentTheme.color}40, transparent)`,
                }}
              >
                <div className="bg-[#0f0f0f] rounded-2xl p-5 flex flex-col gap-4">
                  {/* Header: Avatar + Rank */}
                  <div className="header flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Image
                        src={user.avatar}
                        alt={user.username}
                        width={50}
                        height={50}
                      />
                      <div>
                        <h3 className="text-white font-bold font-orbitron text-sm">
                          {user.username}
                        </h3>
                        <span
                          className={`text-[10px] uppercase px-2 py-0.5 rounded-full`}
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
                      className="text-white/20 font-black italic text-2xl border w-18 h-10 flex justify-center items-center rounded-2xl"
                      style={{ borderColor: currentTheme.color }}
                    >
                      {index === 0 ? (
                        <>
                          <span className="text-amber-400">
                            <FontAwesomeIcon icon={faCrown} />
                          </span>
                        </>
                      ) : index === 1 || index === 2 ? (
                        <span className="text-amber-400">
                          <FontAwesomeIcon icon={faMedal} />
                        </span>
                      ) : (
                        ""
                      )}
                      #{index + 1}
                    </span>
                  </div>

                  <div className="body flex justify-between items-end">
                    <div className="playtime">
                      <p className="text-gray-500 text-[10px] uppercase tracking-widest">
                        Total Playtime
                      </p>
                      <p className="text-white font-orbitron text-lg font-bold">
                      {d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`}
                        <span
                          className="text-xs ml-1"
                          style={{ color: currentTheme.color }}
                        >
                          HRS
                        </span>
                      </p>
                      {/* <p className="text-[#ffffff40]">Last Seen : {new Date(user.lastSeen).getHours}</p> */}
                    </div>
                    <div className="status flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${user.is_online ? "animate-pulse" : ""}`}
                        style={{
                          backgroundColor: user.is_online
                            ? "#00ff00"
                            : "#ff0000",
                        }}
                      ></span>
                      <span className="text-[10px] text-gray-400 uppercase">
                        {user.is_online ? "Online Now" : formatLastSeen(user.lastSeen)}
                      </span>
                    </div>
                  </div>
                  <div className="progressbar-container w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-1000"
                      style={{
                        width: `${Math.min((user.playTime.hours / 1500) * 100, 100)}%`,
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
    </div>
  );
};

export default Leaderboard;
