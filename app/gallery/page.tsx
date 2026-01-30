"use client";
import { useSelector } from "react-redux";
import { RootState } from "../libs/redux/store";
import { themes } from "../hooks/themes";
import Link from "next/link";
import Image from "next/image";
import one from "../../public/1.png";
import two from "../../public/2.png";
import three from "../../public/3.png";
import four from "../../public/5.png";
import five from "../../public/6.png";
import six from "../../public/7.png";
import seven from "../../public/8.png";
import "./gallery.css";
import { IAuthState } from "../libs/redux/features/authSlice";
import Blogs from "../Components/Blogs/Blogs";
import CreateBlog from "../Components/CreateBlog/CreateBlog";

const page = () => {
  const activeServer = useSelector(
    (state: RootState) => state.theme.activeServer || "Vanilla",
  );
  const theme = themes[activeServer] || themes["Vanilla"];

  const { isLogged }: IAuthState = useSelector(
    (state: RootState) => state.auth,
  );

  return (
    <div className="gallery min-h-screen pt-10">
      <div className="container w-[80%] mx-auto">
        <div className="inners">
          <section className="join-us my-8">
            <div className="inner">
              <div className="headers text-center">
                <h1
                  className="text-5xl md:text-8xl font-bold font-orbitron py-10 md:py-20"
                  style={{
                    backgroundImage: theme.gradient,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  A place to share your memories
                </h1>

                {/* Stacked Images Animation Container */}
                <div className="group-img hidden md:flex justify-center items-center hover:scale-110 transition-transform duration-700 relative py-16 w-full h-[400px]">
                  <div
                    className="absolute inset-0 blur-[120px] opacity-20 rounded-full -z-10"
                    style={{ background: theme.gradient }}
                  ></div>

                  {/* Image Stack - Logic for overlapping */}
                  <div className="seven  translate-x-60 transition-all duration-300">
                    <Image src={seven} alt={`img-micecraft-${seven}`} />
                  </div>

                  <div className="five translate-x-40 transition-all duration-300">
                    <Image src={five} alt={`img-micecraft-${five}`} />
                  </div>
                  <div className="two translate-x-20 transition-all duration-300">
                    <Image src={two} alt={`img-micecraft-${two}`} />
                  </div>

                  <div className="three z-10">
                    <Image src={three} alt={`img-micecraft-${three}`} />
                  </div>
                  <div className="one -translate-x-20 transition-all duration-300 z-20">
                    <Image src={one} alt={`img-micecraft-${one}`} />
                  </div>

                  <div className="four -translate-x-40 transition-all duration-300">
                    <Image src={four} alt={`img-micecraft-${four}`} />
                  </div>

                  <div className="six -translate-x-60 transition-all duration-300">
                    <Image src={six} alt={`img-micecraft-${six}`} />
                  </div>
                </div>

                {!isLogged ? (
                  <div className="join-us-btn mt-10">
                    <Link
                      href={"/auth"}
                      style={{ background: theme.gradient }}
                      className="px-8 py-4 text-xl md:text-2xl tracking-wider rounded-2xl text-white font-bold font-orbitron uppercase transition-opacity hover:opacity-90"
                    >
                      Join us
                    </Link>
                  </div>
                ) : (
                  <CreateBlog theme={theme} />
                )}
              </div>
            </div>
          </section>

          {/* Blogs Section */}
          <section className="mt-20">
            <Blogs theme={theme} isLogged={isLogged} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default page;
