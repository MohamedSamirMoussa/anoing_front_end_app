"use client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../libs/redux/store";
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
  const blogs = useSelector((s: RootState) => s.blogs.blog);
  console.log(blogs);

  return (
    <div className="gallery min-h-screen pt-10 relative mb-50 overflow-hidden">
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
                  <div className="group group-img hidden lg:grid lg:grid-cols-7 scale-110 hover:scale-115 transition-transform duration-700 py-24 relative">
                    {/* Glow Background */}
                    <div
                      className="absolute inset-0 blur-[200px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full -z-10"
                      style={{ background: theme.gradient }}
                    ></div>

                    <div className="relative h-64 md:translate-x-30 lg:translate-x-60 transition-all duration-300 rotate-[12deg] group-hover:rotate-[-10deg]">
                      <Image
                        src={blogs[0]?.image?.secure_url || seven}
                        alt="img-7"
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* Five: Hover -10 */}
                    <div className="relative h-64 md:translate-x-20 lg:translate-x-40 transition-all duration-300 group-hover:rotate-[-10deg]">
                      <Image
                        src={blogs[1]?.image?.secure_url || five}
                        alt="img-5"
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* Two: Hover -10 */}
                    <div className="relative h-64 md:translate-x-10 lg:translate-x-20 transition-all duration-300 group-hover:rotate-[-10deg]">
                      <Image
                        src={blogs[2]?.image?.secure_url || two}
                        alt="img-2"
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* Three: Center (Stable) */}
                    <div className="relative h-64 z-10 transition-transform duration-300 scale-125">
                      <Image
                        src={blogs[3]?.image?.secure_url || three}
                        alt="img-3"
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* One: Hover 8 */}
                    <div className="relative h-64 md:-translate-x-10 lg:-translate-x-20 z-20 transition-all duration-300 group-hover:rotate-[8deg]">
                      <Image
                        src={blogs[4]?.image?.secure_url || one}
                        alt="img-1"
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* Four: Hover 8 */}
                    <div className="relative h-64 md:-translate-x-20 lg:-translate-x-40 z-30 transition-all duration-300 group-hover:rotate-[8deg]">
                      <Image
                        src={blogs[5]?.image?.secure_url || four}
                        alt="img-4"
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* Six: Init rotate -12 -> Hover 8 */}
                    <div className="relative h-64 md:-translate-x-30 lg:-translate-x-60 z-40 transition-all duration-300 rotate-[-12deg] group-hover:rotate-[8deg]">
                      <Image
                        src={blogs[6]?.image?.secure_url || six}
                        alt="img-6"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* زرار الـ Join Us */}
                <div className="mt-10">
                  {!isLogged ? (
                    <div className="join-us-btn mt-8">
                      <Link
                        href="/auth"
                        style={{ background: theme.gradient }}
                        className="
      px-8 py-4 
      text-xl md:text-2xl 
      tracking-wider rounded-2xl 
      text-white font-bold font-orbitron uppercase 
      transition-all duration-300
      inline-block
      hover:brightness-110 
      hover:scale-105 
      hover:shadow-[0_0_30px_-5px] hover:shadow-[var(--shadow-color)]
      active:scale-95
    "
                        onMouseEnter={(e) =>
                          e.currentTarget.style.setProperty(
                            "--shadow-color",
                            "rgba(255,255,255,0.4)",
                          )
                        }
                      >
                        Join us
                      </Link>
                    </div>
                  ) : (
                    <CreateBlog theme={theme} isLogged={isLogged} />
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Blogs Section */}
          <section className="mt-20">
            <Blogs theme={theme} isLogged={isLogged} blogs={blogs} />
          </section>
        </div>
      </div>

      {/* Background Fixed Images */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-10">
          <Image src={memories} alt="memories" />
        </div>
        <div className="absolute top-40 left-0 -translate-x-24">
          <Image src={memories} alt="memories" />
        </div>
        <div className="absolute top-96 left-30">
          <Image src={memories} alt="memories" />
        </div>
        <div className="absolute top-[500px] left-100">
          <Image src={memories} alt="memories" />
        </div>
      </div>
    </div>
  );
};

export default page;
