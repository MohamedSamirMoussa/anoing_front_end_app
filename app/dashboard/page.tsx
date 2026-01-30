"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/libs/redux/store";
import { themes } from "../hooks/themes";
// import { fetchUsers, deleteUser, toggleAdminRole } from "@/app/libs/redux/features/dashboardSlice";

const page = ({ theme }: any) => {
  // const dispatch = useDispatch<AppDispatch>();
// const activeServer = useSelector((state: RootState) => state.theme.activeServer || "Vanilla");
  // const theme = themes[activeServer] || themes["Vanilla"];


//   const { users, loading } = useSelector((state: RootState) => state.dashboard);
  // const currentUser = useSelector((state: RootState) => state.auth.user); // للتأكد هل هو SuperAdmin
  // const [activeTab, setActiveTab] = useState("users");

  // useEffect(() => {
  //   // dispatch(fetchUsers());
  // }, [dispatch]);

  return (
    <div className="min-h-screen bg-black/90 p-6 pt-24 text-white font-orbitron">
      <div className="container mx-auto">
        <h1 className="text-4xl mb-10" style={{ color: theme.color }}>Admin Control Center</h1>

        {/* Tabs للتنقل */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2 rounded-lg transition ${activeTab === "users" ? "bg-white text-black" : "border border-gray-700"}`}
          >
            Users Management
          </button>
          <button 
            onClick={() => setActiveTab("posts")}
            className={`px-6 py-2 rounded-lg transition ${activeTab === "posts" ? "bg-white text-black" : "border border-gray-700"}`}
          >
            Posts Management
          </button>
        </div>

        {activeTab === "users" ? (
          <div className="overflow-x-auto bg-gray-900/50 rounded-3xl border border-gray-800 p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>

              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-gray-800 text-gray-500">
            Posts Management Coming Soon...
          </div>
        )}
      </div>
    </div>
  );
};

export default page;