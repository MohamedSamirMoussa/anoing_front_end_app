import { StaticImageData } from "next/image";
import one from "../../public/one.png";
import newHorizon from "../../public/new-horizon.png";
import blue from "../../public/blue.png";
interface ThemeProps {
  name: string;
  players: string;
  version: string;
  color: string;
  shadowColor: string;
  hoverColor?: string;
  primaryColor?: string;
  gradient: string;
  image: StaticImageData;
  backgroundClip?: string; 
  WebkitTextFillColor?: string;
}

export const themes: Record<string, ThemeProps> = {
  "atm 10": {
    name: "atm10",
    players: "5/20",
    version: "ATM10",
    color: "#3b82f6", // الأزرق
    shadowColor: "rgba(59, 130, 246, 0.5)",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    gradient: `linear-gradient(to top right , rgba(75, 221, 240, 1), rgba(74, 0, 224, 1))`,
    image: blue,
  },
  "AllTheMons": {
    name: "All The Mons",
    players: "3/15",
    version: "All The Mons",
    color: "#f43f5e", // الأحمر/الوردي
    shadowColor: "rgba(244, 63, 94, 0.5)",
    hoverColor: "rgba(245, 34, 45, 1);", // هيتحول لـ --hover-color
    primaryColor: "rgba(243, 83, 200, 1)", // هيتحول لـ --color-primary
    gradient: `linear-gradient(to top right , rgba(245, 34, 45, 1), rgba(243, 83, 200, 1))`, // --aniong-color
    image: newHorizon,
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  "SB4": {
    name: "SB4",
    players: "2/10",
    version: "SB4",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "#f0c14b", // الأصفر الأساسي
    shadowColor: "rgba(240, 193, 75, 0.5)",
    hoverColor: "#f0c14b", // هيتحول لـ --hover-color
    primaryColor: "#a953f3", // هيتحول لـ --color-primary
    gradient:
      "linear-gradient(to right, var(--hover-color), var(--color-primary))",
    image: one,
  },
};
