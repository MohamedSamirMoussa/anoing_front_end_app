"use client"
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshAuthThunk } from "./libs/redux/features/authSlice";
const Home = React.lazy(() => import("./Components/Home/Home"));
const About = React.lazy(() => import("./Components/About/About"));
const OptionalMods = React.lazy(
  () => import("./Components/OptionalMods/OptionalMods"),
);
const Community = React.lazy(() => import("./Components/Community/Community"));
const DiscordChannel = React.lazy(
  () => import("./Components/DiscordChannel/DiscordChannel"),
);
const Main = () => {
  const dispatch = useDispatch()

useEffect(() => {
  // محاولة استعادة الجلسة عند فتح الموقع
  dispatch(refreshAuthThunk() as any);
}, [dispatch]);

  return (
    <React.Suspense fallback={null}>
      <Home />
      <About />
      <OptionalMods />
      <Community />
      <DiscordChannel />
    </React.Suspense>
  );
};

export default Main;
