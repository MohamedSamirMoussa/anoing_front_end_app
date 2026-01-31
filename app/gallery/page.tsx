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
import memories from "../../public/Memories.png";

const page = () => {
  const activeServer = useSelector(
    (state: RootState) => state.theme.activeServer || "atm 10",
  );
  const theme = themes[activeServer] || themes["atm 10"];

  const { isLogged }: IAuthState = useSelector(
    (state: RootState) => state.auth,
  );

  return (
    <div className="gallery min-h-screen pt-10 relative mb-50">
      <div className="container mx-auto">
        <div className="inners">
          <section className="join-us my-8">
            <div className="inner mx-auto">
              <div className="headers text-center relative">
                <div className="inner">
                  <h1
                    className="text-5xl md:text-8xl font-bold font-orbitron py-10 md:py-0"
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
                  <div className="group-img grid  grid-cols-7 scale-110 hover:scale-115  transition-transform duration-700 py-16">
                    <div
                      className="absolute inset-0 blur-[200px] opacity-20 rounded-full -z-10"
                      style={{ background: theme.gradient }}
                    ></div>

                    {/* Image Stack - Logic for overlapping */}
                    <div className="seven md:translate-x-30 lg:translate-x-60 transition-all duration-300">
                      <Image src={seven} alt={`img-micecraft-${seven}`} fill />
                    </div>

                    <div className="five md:translate-x-20 lg:translate-x-40  transition-all duration-300">
                      <Image src={five} alt={`img-micecraft-${five}`} fill />
                    </div>
                    <div className="two md:translate-x-10 lg:translate-x-20  transition-all duration-300">
                      <Image src={two} alt={`img-micecraft-${two}`} fill />
                    </div>

                    <div className="three z-10">
                      <Image src={three} alt={`img-micecraft-${three}`} />
                    </div>
                    <div className="one md:-translate-x-10 lg:-translate-x-20 transition-all duration-300 z-20">
                      <Image src={one} alt={`img-micecraft-${one}`} fill />
                    </div>

                    <div className="four md:-translate-x-20 lg:-translate-x-40 transition-all z-30 duration-300">
                      <Image src={four} alt={`img-micecraft-${four}`} fill />
                    </div>

                    <div className="six md:-translate-x-30 lg:-translate-x-60 transition-all duration-300 z-40">
                      <Image src={six} alt={`img-micecraft-${six}`} fill />
                    </div>
                  </div>
                </div>

                {!isLogged ? (
                  <div className="join-us-btn">
                    <Link
                      href={"/auth"}
                      style={{ background: theme.gradient }}
                      className="px-8 py-4 text-xl md:text-2xl tracking-wider rounded-2xl text-white font-bold font-orbitron uppercase"
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

      <div className="absolute top-0 right-0 -z-10 translate-x-225 -translate-y-10">
        <Image src={memories} alt="memories" />
      </div>
      <div className="absolute top-0 left-0 -z-10 -translate-x-24 translate-y-40">
        <Image src={memories} alt="memories" />
      </div>
      <div className="absolute top-0 left-0 -z-10 translate-x-30 translate-y-95">
        <Image src={memories} alt="memories" />
      </div>
      <div className="absolute top-0 left-0 -z-10 translate-x-10 translate-y-145">
        <Image src={memories} alt="memories" />
      </div>
    </div>
  );
};

export default page;
