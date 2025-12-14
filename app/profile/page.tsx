"use client";

import { Camera, Mail } from "lucide-react";
import useSWR from "swr";
import { getFetcher } from "@/utils/request/fetcher";

// 背景组件
const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute top-40 -right-20 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl" />
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/40 rounded-full" />
    </div>
  );
};

// 个人资料表单
const ProfileSection = ({ data }: { data: UserProfile }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Profile Settings</h2>
        <p className="text-slate-500 text-sm mt-1">
          Manage your personal information.
        </p>
      </div>
      <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
        Edit Details
      </button>
    </div>

    <form className="space-y-6">
      <div className="flex items-center gap-6 pb-6 border-b border-slate-50">
        <div className="relative group cursor-pointer">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
            alt="Avatar"
            className="w-16 h-16 rounded-full bg-slate-100 ring-4 ring-white shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
            <Camera size={12} />
          </div>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Display Name
              </label>
              <input
                type="text"
                defaultValue={data.username}
                className="w-full text-sm font-medium text-slate-900 bg-transparent border-b border-slate-200 focus:border-blue-500 focus:outline-none py-1 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Email
              </label>
              <div className="flex items-center">
                <Mail size={14} className="text-slate-400 mr-2" />
                <input
                  type="email"
                  //   defaultValue="alex@example.com"
                  className="w-full text-sm font-medium text-slate-900 bg-transparent border-b border-slate-200 focus:border-blue-500 focus:outline-none py-1 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
          Bio
        </label>
        <textarea
          rows="2"
          //   defaultValue="Blockchain enthusiast and digital asset collector."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 text-sm resize-none"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="px-5 py-2 rounded-full text-sm font-bold text-white bg-slate-900 shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all"
        >
          Save Changes
        </button>
      </div>
    </form>
  </div>
);

export default function ProfilePage() {
  const { data } = useSWR("/users/me", getFetcher<UserProfile>);
  console.log(data);

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 relative selection:bg-blue-100 selection:text-blue-900 pb-20">
      <ParticleBackground />

      {data && (
        <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="animate-fadeIn">
            <ProfileSection data={data} />
          </div>
        </main>
      )}
    </div>
  );
}
