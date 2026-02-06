"use client";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { searchbarThunk } from "@/app/libs/redux/features/leaderboardSlice";
import Image from "next/image";

const LiveSearch = ({ currentTheme }: { currentTheme: any }) => {
  const dispatch = useDispatch();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { searchResults, searchLoading } = useSelector(
    (state: any) => state.leaderboard,
  );
  const formik = useFormik({
    initialValues: { search: "" },
    onSubmit: () => {},
  });  

  useEffect(() => {
    const query = formik.values.search.trim();

    if (query.length > 0) {
      setIsOpen(true);
      const delay = setTimeout(() => {
        dispatch(searchbarThunk({ username: query }) as any);
      }, 500);
      return () => clearTimeout(delay);
    } else {
      setIsOpen(false);
    }
  }, [formik.values.search, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-md">
      <div className="relative z-10">
        <input
          name="search"
          type="text"
          autoComplete="off"
          placeholder="Search players..."
          className="bg-[#1a1a1a] border border-[#ffffff20] rounded-xl px-4 py-2.5 text-white outline-none focus:border-white transition-all w-full pr-10"
          style={{
            borderColor: formik.values.search
              ? currentTheme.color
              : "#ffffff20",
          }}
          onChange={formik.handleChange}
          value={formik.values.search}
        />
        {searchLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="open absolute top-full left-0 w-full mt-2 bg-[#121212] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <div className="max-h-[300px] z-[500]">
            {searchLoading ? (
              <div className="p-5 text-center text-white/40 text-sm">
                Searching players...
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((player: any) => {
                return (
                  <div
                    key={player._id || player.username}
                    className="flex items-center gap-3 p-3 z-40 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-none"
                    onClick={() => {
                      setIsOpen(false);
                      formik.setFieldValue("search", player.username);
                    }}
                  >
                    <Image
                      src={player.avatar}
                      alt={`${player.avatar}`}
                      width={30}
                      height={30}
                    />
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-bold">
                        {player.username}
                      </span>
                      <span className="text-[10px] text-white/40 uppercase">
                        {player.rank?.name || "Player"}
                      </span>
                    </div>
                    <div className="ml-auto flex flex-col items-end">
                      <span className="text-[11px] text-white/60">
                        {player.playTime.hours || 0}h
                      </span>
                      <div
                        className={`w-2 h-2 rounded-full ${player.is_online ? "bg-green-500 shadow-[0_0_5px_green]" : "bg-red-500"}`}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-5 text-center text-white/20 text-sm italic">
                No players found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSearch;
