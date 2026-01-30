"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBlogThunk } from '@/app/libs/redux/features/blogSlice';
import { RootState } from '@/app/libs/redux/store';

interface BlogsProps {
  theme: any;
  isLogged: boolean;
}

const Blogs = ({ theme, isLogged }: BlogsProps) => {
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState<boolean>(false);
  const blogs = useSelector((s: RootState) => s.blogs.blog);
    
  useEffect(() => {
    setIsClient(true);
    // @ts-ignore (Or use AppDispatch type for better TS support)
    dispatch(getBlogThunk());
  }, [dispatch]);

  if (!isClient) return <div className="min-h-[200px]" />;
  return (
    <div className={`${!isLogged ? "disabled: opacity-30" : "opacity-100"} "blogs mb-20"`}>
      <div className="inner grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
        {blogs?.map((blog: any, index: number) => (
          <div
            key={blog._id || index}
            className="group blog rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
            style={{ 
              borderWidth: "1px", 
              borderColor: theme.color,
              backgroundColor: 'rgba(0,0,0,0.2)' 
            }}
          >
            <div className="header flex flex-col justify-center items-center p-6">
              <figure className="relative w-full h-[600px]">
                <div
                  className="absolute inset-0 blur-[100px] opacity-10 group-hover:opacity-30 transition-all duration-500 rounded-full -z-10"
                  style={{ background: theme.gradient }}
                ></div>
                {blog?.image?.secure_url && (
                  <Image 
                    src={blog.image.secure_url} 
                    fill 
                    className="object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    quality={85}
                    alt={blog.title || 'blog-image'} 
                  />
                )}
              </figure>
            </div>

            <div className="description pb-8 px-6">
              <div className="head flex justify-between items-center mb-4">
                <h3
                  className="font-orbitron capitalize text-xl md:text-2xl font-extrabold"
                  style={{ color: theme.color }}
                >
                  {blog?.title}
                </h3>
                <span
                  className="text-white border rounded-2xl px-3 py-1 text-sm font-orbitron"
                  style={{ borderColor: theme.color }}
                >
                  {blog?.createdAt ? new Date(blog.createdAt).getFullYear() : '2024'}
                </span>
              </div>
              <div className="body">
                <p className='text-gray-300 font-medium leading-relaxed line-clamp-3'>
                  {blog?.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;