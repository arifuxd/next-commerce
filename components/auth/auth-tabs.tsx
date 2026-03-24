"use client";

import { useState } from "react";
import { signInAction, signUpAction } from "@/app/login/actions";

type AuthTab = "login" | "signup";

interface AuthTabsProps {
  allowSignUp: boolean;
  defaultTab: AuthTab;
  nextPath: string;
  error?: string;
  message?: string;
}

function AuthInput({
  id,
  name,
  type,
  label,
  placeholder,
  required,
  minLength,
}: {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-100">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-orange-300/70 focus:bg-white/10"
      />
    </div>
  );
}

export function AuthTabs({ allowSignUp, defaultTab, nextPath, error, message }: AuthTabsProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>(allowSignUp ? defaultTab : "login");

  return (
    <div className="mx-auto max-w-xl">
      <section className="market-card rounded-[2rem] p-5 shadow-[0_26px_70px_rgba(8,15,35,0.26)] sm:p-6">
        {allowSignUp ? (
          <div className="relative mb-6 grid grid-cols-2 rounded-full border border-white/10 bg-white/5 p-1">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-full bg-gradient-to-r from-[#ff7a18] to-[#ffb347] shadow-[0_10px_25px_rgba(255,122,24,0.3)] transition-[left] duration-300 ease-out ${
                activeTab === "signup" ? "left-[calc(50%_-_0.25rem)]" : "left-1"
              }`}
            />
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`relative z-10 rounded-full px-4 py-3 text-sm font-bold transition ${
                activeTab === "login" ? "text-slate-950" : "text-slate-200"
              }`}
            >
              লগইন
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("signup")}
              className={`relative z-10 rounded-full px-4 py-3 text-sm font-bold transition ${
                activeTab === "signup" ? "text-slate-950" : "text-slate-200"
              }`}
            >
              সাইন আপ
            </button>
          </div>
        ) : (
          <div className="mb-6 rounded-[1.4rem] border border-orange-300/30 bg-orange-400/10 px-4 py-3">
            <p className="text-sm font-semibold text-white">অ্যাডমিন লগইন প্রয়োজন</p>
            <p className="mt-1 text-sm text-slate-300">`/admin` চালিয়ে যেতে বিদ্যমান অ্যাডমিন অ্যাকাউন্ট দিয়ে লগইন করুন।</p>
          </div>
        )}

        <div className="relative overflow-hidden">
          <div
            className={`grid transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              allowSignUp ? "grid-cols-2" : "grid-cols-1"
            }`}
            style={{
              width: allowSignUp ? "200%" : "100%",
              transform: allowSignUp && activeTab === "signup" ? "translateX(-50%)" : "translateX(0%)",
            }}
          >
            <div className="w-full px-1">
              <div className="min-h-[27.5rem] p-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">আবার স্বাগতম</p>
                <h2 className="mt-3 text-3xl font-black text-white">লগইন</h2>
                <p className="mt-2 text-sm text-slate-300">প্রোফাইল, কেনাকাটা ও ডাউনলোড চালিয়ে যেতে লগইন করুন।</p>

                <form action={signInAction} className="mt-8 space-y-4">
                  <input type="hidden" name="next" value={nextPath} />
                  <AuthInput
                    id="signin-email"
                    name="email"
                    type="email"
                    label="ইমেইল"
                    placeholder="you@example.com"
                    required
                  />
                  <AuthInput
                    id="signin-password"
                    name="password"
                    type="password"
                    label="পাসওয়ার্ড"
                    placeholder="আপনার পাসওয়ার্ড লিখুন"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-gradient-to-r from-[#ff7a18] to-[#ffb347] px-4 py-3 text-sm font-black text-slate-950 transition hover:shadow-[0_18px_35px_rgba(255,122,24,0.28)]"
                  >
                    লগইন
                  </button>
                </form>
              </div>
            </div>

            {allowSignUp ? (
              <div className="w-full px-1">
                <div className="min-h-[27.5rem] p-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">অ্যাকাউন্ট তৈরি করুন</p>
                  <h2 className="mt-3 text-3xl font-black text-white">সাইন আপ</h2>
                  <p className="mt-2 text-sm text-slate-300">দ্রুত চেকআউট ও অর্ডার ট্র্যাকিংয়ের জন্য আপনার অ্যাকাউন্ট তৈরি করুন।</p>

                  <form action={signUpAction} className="mt-8 space-y-4">
                    <input type="hidden" name="next" value={nextPath} />
                    <AuthInput
                      id="signup-name"
                      name="fullName"
                      type="text"
                      label="পূর্ণ নাম"
                      placeholder="আপনার পূর্ণ নাম"
                    />
                    <AuthInput
                      id="signup-email"
                      name="email"
                      type="email"
                      label="ইমেইল"
                      placeholder="you@example.com"
                      required
                    />
                    <AuthInput
                      id="signup-password"
                      name="password"
                      type="password"
                      label="পাসওয়ার্ড"
                      placeholder="অন্তত ৬ অক্ষর"
                      required
                      minLength={6}
                    />
                    <button
                      type="submit"
                      className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:border-orange-300/60 hover:bg-white/14"
                    >
                      সাইন আপ
                    </button>
                  </form>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {error ? (
          <p className="mt-5 rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="mt-4 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            {message}
          </p>
        ) : null}
      </section>
    </div>
  );
}
