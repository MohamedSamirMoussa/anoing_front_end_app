"use client"
import { usePathname } from "next/navigation";
import SnowBackground from "./SnowBackground";

const SnowWrapper = () => {
    const pathname = usePathname()
  return (
    <>
      <SnowBackground key={pathname} />
    </>
  );
};

export default SnowWrapper;
