"use client";
import React, { useEffect } from "react";
 // Recommended: typed hooks
import { refreshAuthThunk } from "./libs/redux/features/authSlice";
import { useDispatch } from "react-redux";

// Components
const Home = React.lazy(() => import("./Components/Home/Home"));
const About = React.lazy(() => import("./Components/About/About"));
const OptionalMods = React.lazy(() => import("./Components/OptionalMods/OptionalMods"));
const Community = React.lazy(() => import("./Components/Community/Community"));
const DiscordChannel = React.lazy(() => import("./Components/DiscordChannel/DiscordChannel"));

const Main = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Attempt to restore session on mount
    dispatch(refreshAuthThunk() as any);
  }, [dispatch]);

  return (
    /* Consider adding a loading spinner or skeleton in fallback */
    <React.Suspense fallback={<div className="loading-screen" />}>
      <Home />
      <About />
      <OptionalMods />
      <Community />
      <DiscordChannel />
    </React.Suspense>
  );
};

export default Main;