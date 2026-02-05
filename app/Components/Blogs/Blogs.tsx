"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBlogThunk } from '@/app/libs/redux/features/blogSlice';
import { RootState } from '@/app/libs/redux/store';

interface BlogsProps {
  theme: any;
  isLogged: boolean;
  blogs:any
}

const Blogs = ({ theme, isLogged , blogs }: BlogsProps) => {
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    // @ts-ignore
    dispatch(getBlogThunk());
  }, [dispatch]);

  if (!isClient) return <div className="min-h-[400px]" />;

  return (
<div
  className={`blogs mb-20 transition-opacity duration-500 ${
    !isLogged ? "opacity-30 pointer-events-none" : "opacity-100"
  }`}
>
  <div className="inner grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 md:gap-y-20">
    {blogs?.map((blog: any, index: number) => (
      <div
        key={blog._id || index}
        className={`group blog relative rounded-[2.2rem] overflow-hidden transition-all duration-500
          hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]
          ${index % 2 !== 0 ? "md:translate-y-12" : ""}
        `}
        style={{
          border: `1px solid ${theme.color}44`,
          backgroundColor: "rgba(15,15,15,0.6)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 blur-[120px] opacity-20
          group-hover:opacity-40 transition-all duration-700 -z-10"
          style={{ background: theme.gradient || theme.color }}
        />

        {/* Image */}
        <div className="p-3 pb-0">
          <figure className="relative aspect-[16/9] overflow-hidden rounded-[1.8rem]">
            {blog?.image?.secure_url && (
              <Image
                src={blog.image.secure_url}
                fill
                className="object-contain transition-transform duration-700 group-hover:scale-105"
                quality={85}
                alt={blog.title || "blog-image"}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </figure>
        </div>

        {/* Content */}
        <div className="description p-6 pt-4">
          <div className="flex justify-between items-start gap-4 mb-3">
            <h3
              className="font-orbitron capitalize text-lg md:text-xl font-bold leading-tight flex-1"
              style={{ color: theme.color }}
            >
              {blog?.title}
            </h3>

            <span
              className="shrink-0 border rounded-full px-3 py-1 text-[10px]
              font-orbitron tracking-widest text-white/80"
              style={{ borderColor: `${theme.color}88` }}
            >
              {blog?.createdAt
                ? new Date(blog.createdAt).getFullYear()
                : "2024"}
            </span>
          </div>

          <p
            className="text-gray-400 text-sm font-light leading-relaxed
            line-clamp-2 group-hover:text-gray-200 transition-colors duration-300"
          >
            {blog?.description}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default Blogs;