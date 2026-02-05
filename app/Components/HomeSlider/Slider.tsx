"use client";
import Image from "next/image";
import React from "react";
import Slider  from 'react-slick';

// نستخدم واجهة بيانات مرنة
interface HomeSliderProps {
  leaderboard: any[];
}

function HomeSlider({ leaderboard }: HomeSliderProps) {
  // إعدادات السلايدر
  const settings = {
    className: "center",
    infinite: leaderboard?.length > 3,
    slidesToShow: Math.min(leaderboard?.length || 1, 4),
    swipeToSlide: true,
    autoplay: true,
    speed: 2000,
    arrows: false,
    dots: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } }
    ]
  };

  if (!leaderboard || leaderboard.length === 0) return null;

  return (
    <div className="slider-container w-full max-w-[550px] mx-auto  text-white">
      <Slider {...settings}>
        {leaderboard.map((user) => (
          <div key={user._id || user.username} className="px-1">
            <div className="flex p-1 gap-2 justify-center items-center bg-[#ffffff05] border border-white/5 rounded-2xl hover:scale-102 transition-all duration-300 brightness-50 hover:brightness-105 ">
              <div className="relative flex justify-center items-center w-8 h-8 rounded-2xl border border-white/5">
                <Image 
                  src={user.avatar || `https://mc-heads.net/avatar/${user.username}/64`} 
                  fill 
                  alt={user.username} 
                  className="object-cover"
                />
              </div>
              <span className="text-[10px] font-orbitron  w-full">
                {user.username}
              </span>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default HomeSlider;