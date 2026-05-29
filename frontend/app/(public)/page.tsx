"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

export default function HomePage() {
  useEffect(() => {
  const syncUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // console.log("USER:", user); // <-- ADD HERE

    if (!user) return;

    const response = await api.post(
      "/api/auth/sync-user",
      {
        id: user.id,
        email: user.email,
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name,
      }
    );

    console.log(response.data);
  };

  syncUser();
}, []);
  return <div>Home</div>;
}