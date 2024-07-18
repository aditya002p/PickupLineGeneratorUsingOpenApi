// server/auth.js

import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { action } = req.body;

    if (action === "login") {
      try {
        // Sign in with OAuth - Google
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL!}/auth/callback`,
          },
        });

        if (error) {
          console.error("Login error:", error);
          return res.status(500).json({ error: "Login failed" }); // Handle login error gracefully
        }

        if (data) {
          // Handle successful login (optional):
          // - Redirect to protected route
          // - Set an authentication cookie
          // ...

          return res.status(200).json({ message: "Login successful" });
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ error: "An unexpected error occurred" }); // Handle generic error gracefully
      }
    } else if (action === "logout") {
      try {
        await supabase.auth.signOut();

        // Clear any authentication cookies or state
        // ...

        revalidatePath("/", "layout"); // Revalidate the layout on signout
        return res.status(200).json({ message: "Logged out successfully" });
      } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ error: "Logout failed" }); // Handle logout error gracefully
      }
    } else {
      return res.status(400).json({ error: "Invalid action" }); // Handle invalid action
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" }); // Handle invalid HTTP method
  }
}
