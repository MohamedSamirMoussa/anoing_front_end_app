"use client";
import { themes } from "@/app/hooks/themes";
import { RootState } from "@/app/libs/redux/store";
import React from "react";
import { useSelector } from "react-redux";

const DiscordChannel = () => {
  const activeTab = useSelector(
    (state: RootState) => state.theme.activeServer || "atm 10",
  );
  const theme = themes[activeTab] || themes["atm 10"];

  return (
    <div className="py-15 text-center">
      <div className="container w-[80%] mx-auto flex flex-col justify-center items-center gap-5">
        <h1
          className="text-5xl hover:scale-105 transition-all duration-300 font-orbitron flex flex-col justify-center items-center py-5 font-semibold"
          style={{
            backgroundImage: theme.gradient,
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Join Our Amazing Community
          <span
            className="my-3 w-1/3 transition-all duration-300"
            style={{
              height: "2px",
              background: theme.gradient,
            }}
          ></span>
        </h1>

        <p className="text-white">
          Connect with fellow adventurers, share your epic builds, find
          teammates, or get help. Our Discord is the heart of Anoing!
        </p>

        <h2
          className="lg:text-8xl md:text-5xl text-5xl font-orbitron flex flex-col justify-center items-center font-bold uppercase my-5"
          style={{
            backgroundImage: theme.gradient,
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Coming Soon...
        </h2>
      </div>
    </div>
  );
};

export default DiscordChannel;
