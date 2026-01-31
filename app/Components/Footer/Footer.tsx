"use client";
import "./Footer.css";
import { themes } from "@/app/hooks/themes";
import { RootState } from "@/app/libs/redux/store";
import { faCode, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
const Footer = () => {
  const activeTab = useSelector(
    (state: RootState) => state.theme.activeServer || "Vanilla",
  );
  const theme = themes[activeTab] || themes["Vanilla"];

  return (
    <div
      style={{
        background: "linear-gradient(to right, #0A0A14, #08080F)",
      }}
      className="py-15"
    >
      <div
        className="w-[90%] mx-auto flex flex-col justify-center items-center  py-5
    "
      >
        <h3
          className="font-bold text-5xl font-orbitron hover:scale-105 transition-all duration-300 flex flex-col justify-center items-center"
          style={{
            backgroundImage: theme.gradient,
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Anoing
          <span
            className="my-2 relative w-[30%] transition-all duration-300"
            style={{
              bottom: "0",
              right: "0",
              background:
                "linear-gradient(to right , #8B5CF600 , #8B5CF633 , #EC48994D , #4BDDF033 , #4BDDF000)",
              height: "2px",
            }}
          ></span>
        </h3>
        <p className="opacity-30 text-white py-5">
          Legendary Adventures Begin Here
        </p>
        <p className="text-[14px] md:text-lg text-white ">
          © 2026 Anoing • Crafted with{" "}
          <span className="mx-2">
            <FontAwesomeIcon
              icon={faHeart}
              style={{
                color: theme.color,
              }}
            />
          </span>
          And
          <span className="mx-2">
            <FontAwesomeIcon icon={faCode} className="text-[#4A00E0]" />
          </span>
        </p>
      </div>
    </div>
  );
};

export default Footer;
