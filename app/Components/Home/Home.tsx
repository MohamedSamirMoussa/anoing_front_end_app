"use client";
import Link from "next/link";
import Image from "next/image";
import { faBoxOpen, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Redux Imports
import { useSelector, useDispatch } from "react-redux";
import "./Home.css";
import { setActiveServer } from "@/app/libs/redux/features/themeSlice";
import { themes } from "@/app/hooks/themes";
import { RootState } from "@/app/libs/redux/store";

const Home = () => {
  const dispatch = useDispatch();
  const { data } = useSelector(
    (s: RootState) => s.leaderboard,
  );
  const users = data?.result?.leaderboard;
  const activeTab = useSelector((state: RootState) => state.theme.activeServer);

  const currentTheme = themes[activeTab] || themes["Vanilla"];

  const handleTabChange = (tabName: string) => {
    dispatch(setActiveServer(tabName));
  };

  return (
    <div id="home" className="py-20 lg:py-0">
      <div className="container h-screen text-white w-[80%] mx-auto lg:flex lg:justify-center lg:items-center gap-10">
        <figure className="flex justify-center items-center relative transition-all duration-500 ease-in-out animate-floating lg:mx-5">
          <Image
            key={currentTheme.name}
            src={currentTheme.image}
            alt={`${currentTheme.name} modpack`}
            width={600}
            quality={80}
            priority
            className="drop-shadow-2xl transition-opacity duration-300"
          />
        </figure>

        <div className="description flex flex-col justify-center gap-2">
          <h1 className="font-orbitron flex flex-col justify-center">
            <span
              className="text-[5.0rem] font-extrabold"
              style={{
                backgroundImage: currentTheme?.gradient, // استخدم backgroundImage بدل background
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
                backgroundImage: currentTheme?.gradient, // استخدم backgroundImage بدل background
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
                    className={`px-4 py-2 rounded-xl transition-all duration-300`}
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
            <div className="my-2 flex justify-center items-center gap-3">
              <div className="players rounded-xl p-2 w-full flex items-center gap-2 bg-[#222] border border-[#333]">
                <span style={{ color: currentTheme.color }}>
                  <FontAwesomeIcon icon={faUsers} className="text-3xl" />
                </span>
                <p className="flex flex-col text-[20px]">
                  <span className="text-white">
                    {users?.filter((user:any) => user.is_online).length}/
                    {users?.length}
                  </span>

                  <span className="text-gray-400 text-sm">Players Online</span>
                </p>
              </div>
              <div className="mod rounded-xl p-2 w-full flex items-center gap-2 bg-[#222] border border-[#333]">
                <span style={{ color: currentTheme.color }}>
                  <FontAwesomeIcon icon={faBoxOpen} className="text-3xl" />
                </span>
                <p className="flex flex-col">
                  <span className="text-white">{currentTheme.version}</span>
                  <span className="text-gray-400 text-sm">version</span>
                </p>
              </div>
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
