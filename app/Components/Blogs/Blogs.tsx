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
    // @ts-ignore
    dispatch(getBlogThunk());
  }, [dispatch]);

  if (!isClient) return <div className="min-h-[400px]" />;

  return (
    <div className={`blogs mb-20 transition-opacity duration-500 ${!isLogged ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
      {/* شبكة المدونات مع ظبط الـ Offset (even:translate) */}
      <div className="inner grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16 md:gap-y-32">
        {blogs?.map((blog: any, index: number) => (
          <div
            key={blog._id || index}
            className={`group blog relative rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] 
              ${index % 2 !== 0 ? "md:translate-y-24" : ""} 
            `}
            style={{ 
              border: `1px solid ${theme.color}44`, // شفافية خفيفة للبوردر
              backgroundColor: 'rgba(15, 15, 15, 0.6)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {/* الخلفية المضيئة خلف الصورة */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 blur-[120px] opacity-20 group-hover:opacity-40 transition-all duration-700 -z-10"
              style={{ background: theme.gradient || theme.color }}
            ></div>

            {/* الحاوية العلوية للصورة */}
            <div className="p-4 pb-0">
              <figure className="relative w-full h-[350px] md:h-[450px] overflow-hidden rounded-[2rem]">
                {blog?.image?.secure_url && (
                  <Image 
                    src={blog.image.secure_url} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    quality={90}
                    alt={blog.title || 'blog-image'} 
                  />
                )}
                {/* Overlay خفيف على الصورة */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
              </figure>
            </div>

            {/* المحتوى النصي */}
            <div className="description p-8 pt-6">
              <div className="flex justify-between items-start gap-4 mb-4">
                <h3
                  className="font-orbitron capitalize text-2xl font-bold leading-tight flex-1"
                  style={{ color: theme.color }}
                >
                  {blog?.title}
                </h3>
                <span
                  className="shrink-0 border rounded-full px-4 py-1 text-xs font-orbitron tracking-widest text-white/80"
                  style={{ borderColor: `${theme.color}88` }}
                >
                  {blog?.createdAt ? new Date(blog.createdAt).getFullYear() : '2024'}
                </span>
              </div>
              
              <div className="body">
                <p className='text-gray-400 font-light leading-relaxed line-clamp-3 group-hover:text-gray-200 transition-colors duration-300'>
                  {blog?.description}
                </p>
              </div>

              {/* سهم أو تفاعل بصري إضافي */}
              <div className="mt-6 flex items-center gap-2 text-xs font-orbitron tracking-tighter opacity-50 group-hover:opacity-100 transition-all duration-300" style={{ color: theme.color }}>
                <span className="h-[1px] w-8 bg-current"></span>
                READ MORE
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;