"use client";
import Snowfall from "react-snowfall";
import { useSelector } from "react-redux";
import { themes } from "@/app/hooks/themes";

const SnowBackground = () => {
  const activeServer = useSelector((state: any) => state.theme.activeServer || "Vanilla");
  const theme = themes[activeServer] || themes["Vanilla"];

  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10" 
      aria-hidden="true"
    >
      <Snowfall
        snowflakeCount={200}
        color={`${theme.color}22`} 
        radius={[0.5, 2.0]}
        speed={[0.5, 3.0]}
        wind={[-0.5, 2.0]}
        enable3DRotation={true}
      />
    </div>
  );
};

export default SnowBackground;