"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { getToken } from "../../utils/auth";

export default function Profile() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // ----------------------- FETCH PROFILE -----------------------
  const fetchProfile = async () => {
    try {
      const token = getToken();
      const res = await api.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.user);
    } catch (err) {
      setError("Failed to load profile");
    }
  };

  // ----------------------- LOAD ON PAGE OPEN -----------------------
  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) {
        router.push("/auth/signin");
        return;
      }
      await fetchProfile();
    };

    load();
  }, []); // IMPORTANT: keep empty to avoid the React dependency error

  // ----------------------- CHANGE PASSWORD -----------------------
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = getToken();

      await api.put(
        "/auth/change-password",
        {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Password updated successfully!");
      setShowPasswordForm(false);
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  // ----------------------- LOGOUT -----------------------
  const logout = () => {
    localStorage.removeItem("accessToken");
    router.push("/auth/signin");
  };

  // ----------------------- LOADING UI -----------------------
  if (!profile && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8fffb] via-white to-[#d0fff5]">
        <p className="text-slate-600 animate-pulse text-lg">Loading Profile...</p>
      </div>
    );
  }

  // ----------------------- ERROR UI -----------------------
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  // ----------------------- MAIN UI -----------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8fffb] via-white to-[#d0fff5] p-4 md:p-8 flex justify-center">

      <div className="
        w-full max-w-2xl 
        bg-white/60 backdrop-blur-2xl 
        shadow-2xl rounded-3xl p-8 
        border border-white/40 
        animate-[fadeUp_0.6s_ease-out]
      "
      >

        {/* TOP SECTION */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="text-slate-500 text-sm mt-1">Manage your account details</p>
          </div>

          <button
            onClick={logout}
            className="
              px-5 py-2 
              rounded-xl 
              bg-gradient-to-r from-red-500 to-red-600 
              text-white shadow-md hover:scale-105 
              transition
            "
          >
            Logout
          </button>
        </div>

        {/* EMOJI AVATAR */}
        <div className="flex justify-center mb-6">
          <div className="
            w-28 h-28 
            rounded-2xl 
            bg-gradient-to-br from-teal-500 to-teal-700 
            shadow-xl flex items-center justify-center 
            text-6xl
          ">
            💸
          </div>
        </div>

        {/* USER INFO */}
        <h2 className="text-xl font-semibold mb-4 text-slate-800">User Information</h2>

        <div className="space-y-5">
          <div>
            <p className="text-slate-500 text-sm">Username</p>
            <p className="text-lg font-semibold">{profile.username}</p>
          </div>

          <div>
            <p className="text-slate-500 text-sm">Email</p>
            <p className="text-lg font-semibold">{profile.email}</p>
          </div>

          <div>
            <p className="text-slate-500 text-sm">Password</p>
            <p className="font-semibold tracking-widest">********</p>
          </div>
        </div>

        {/* CHANGE PASSWORD BUTTON */}
        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="
            mt-6 px-5 py-3 rounded-xl 
            bg-gradient-to-r from-blue-600 to-blue-700 
            text-white shadow-md 
            hover:scale-105 transition
          "
        >
          Change Password
        </button>

        {/* PASSWORD FORM */}
        {showPasswordForm && (
          <form
            onSubmit={handlePasswordChange}
            className="mt-6 space-y-4 animate-[fadeUp_0.6s_ease-out]"
          >
            <input
              type="password"
              placeholder="Old Password"
              className="
                w-full p-3 rounded-xl bg-white/70 
                border border-slate-200 
                focus:ring-2 focus:ring-teal-300 
                outline-none transition
              "
              value={passwords.oldPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, oldPassword: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="New Password"
              className="
                w-full p-3 rounded-xl bg-white/70 
                border border-slate-200 
                focus:ring-2 focus:ring-teal-300 
                outline-none transition
              "
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
            />

            <button
              type="submit"
              className="
                w-full py-3 rounded-xl 
                bg-gradient-to-r from-green-600 to-green-700 
                text-white font-semibold 
                shadow-md hover:scale-105 transition
              "
            >
              Update Password
            </button>
          </form>
        )}

      </div>

      {/* ANIMATIONS */}
      <style>
        {`
          @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(16px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

    </div>
  );
}
