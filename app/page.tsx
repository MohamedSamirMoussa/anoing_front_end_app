"use client";
import React, { useEffect } from "react";
 // Recommended: typed hooks
import { refreshAuthThunk } from "./libs/redux/features/authSlice";
import { useDispatch } from "react-redux";
import Loading from "./Components/Loading/Loading";

// Components
const Home = React.lazy(() => import("./Components/Home/Home"));
const About = React.lazy(() => import("./Components/About/About"));
const OptionalMods = React.lazy(() => import("./Components/OptionalMods/OptionalMods"));
const Community = React.lazy(() => import("./Components/Community/Community"));
const DiscordChannel = React.lazy(() => import("./Components/DiscordChannel/DiscordChannel"));

const Main = () => {
  const dispatch = useDispatch();
const initialized = React.useRef(false)
  useEffect(() => {
    if (!initialized.current) {
      dispatch(refreshAuthThunk() as any);
      initialized.current = true; 
    }
  }, [dispatch]);

  return (
    /* Consider adding a loading spinner or skeleton in fallback */
    <React.Suspense fallback={<Loading />}>
      <Home />
      <About />
      <OptionalMods />
      <Community />
      <DiscordChannel />
    </React.Suspense>
  );
};

export default Main;