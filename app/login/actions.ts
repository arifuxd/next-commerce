"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function buildRedirect(pathname: string, params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  return `${pathname}?${searchParams.toString()}`;
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const next = String(formData.get("next") ?? "/dashboard");
  const tab = "login";

  if (!email || !password) {
    redirect(
      buildRedirect("/login", {
        error: "ইমেইল এবং পাসওয়ার্ড আবশ্যক।",
        next,
        tab,
      }),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(
      buildRedirect("/login", {
        error: error.message,
        next,
        tab,
      }),
    );
  }

  redirect(next);
}

export async function signUpAction(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const next = String(formData.get("next") ?? "/dashboard");
  const tab = "signup";

  if (!email || !password) {
    redirect(
      buildRedirect("/login", {
        error: "ইমেইল এবং পাসওয়ার্ড আবশ্যক।",
        next,
        tab,
      }),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    redirect(
      buildRedirect("/login", {
        error: error.message,
        next,
        tab,
      }),
    );
  }

  redirect(
    buildRedirect("/login", {
      message: "অ্যাকাউন্ট তৈরি হয়েছে। অনুগ্রহ করে লগইন করুন।",
      next,
      tab: "login",
    }),
  );
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(
    buildRedirect("/login", {
      message: "আপনি সফলভাবে সাইন আউট হয়েছেন।",
    }),
  );
}
