"use server";

import dotenv from "dotenv";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "./server";

dotenv.config();

export async function Login(formData: FormData) {
  const supabase = createClient();

  // Sign in with OAuth - Google
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.DOMAIN}/auth/callback`,
    },
  });

  if (error) {
    redirect("/error");
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut(formData: FormData) {
  const supabase = createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}
